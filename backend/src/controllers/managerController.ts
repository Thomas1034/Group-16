import { Request, Response } from 'express';
import ContactManager from '../models/ContactManager';
import Review from '../models/Review';
import mongoose from 'mongoose';

interface ManagerQuery {
    page?: string;
    search?: string;
}

interface IdHolder {
    id?: string;
}

export const create = async(req: Request, res: Response) => {
    try {
        const { name, url, description } = req.body;
        const author = req.user_id;

        if(!name || !url || !author || !description) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        const contactManager = new ContactManager({
            name,
            url,
            author,
            description,
        });

        // Handle image upload
        if (req.file) {
            contactManager.image = req.file.filename;
        }

        await contactManager.save();
        res.status(201).json({id: contactManager._id});
    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};


export const getAll = async(req: Request<{}, {}, {}, ManagerQuery>, res: Response) => {
    try {
        const { query } = req;
        const { page, search } = query;

        if(!page) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        // Search is optional, this will return all managers if not provided
        var allManagers = await ContactManager.findAllManagersWithAvgRating(search);
        allManagers = await ContactManager.populate(allManagers, {path: "author", select: "username"});

        res.status(201).json(allManagers);
    } catch (error) {
        console.log("managerController.ts encountered an unexpected error:\n" + error);
        res.status(500).json({error: "Internal server error."});
    }
};


export const get = async(req: Request<IdHolder, {}, {}, {}>, res: Response) => {
    try {
        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({error: "Invalid ID"});
            return;
        }

        const objectId = new mongoose.Types.ObjectId(id); 
        var manager = await ContactManager.findManagerWithRating(objectId);
        manager = await ContactManager.populate(manager, {path: "author", select: "username"});


        if(manager === null) {
            res.status(404).json({error: "Manager not found"});
            return;
        }

        res.status(201).json(manager);

    } catch (error) {
        console.log("managerController.ts encountered an unexpected error:\n" + error);
        res.status(500).json({error: "Internal server error."});
    }
};

export const deleteManager = async(req: Request<IdHolder, {}, {}, {}>, res: Response) => {
    try {
        const id = req.params.id;
        const author = req.user_id;

        // Check if the ID is a valid ObjectId
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({error: "Invalid ID"});
            return;
        }

        const managerObjId = new mongoose.Types.ObjectId(id); 
        var manager = await ContactManager.findById(managerObjId);

        if(manager === null) {
            res.status(404).json({error: "Manager not found"});
            return;
        }

        // Check if the author of the manager is the same as the user
        if(manager.author != author) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        // Delete all ratings associated with the manager
        await Review.deleteMany({contactManagerId: managerObjId});

        await manager.deleteOne();

        // We are leaving the image (if any) on the server, for now...


        res.sendStatus(204);
    } catch (error) {
        console.log("managerController.ts encountered an unexpected error:\n" + error);
        res.status(500).json({error: "Internal server error."});
    }
};
