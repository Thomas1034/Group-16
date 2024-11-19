import { Request, Response } from 'express';
import ContactManager from '../models/ContactManager';
import { generateToken } from '../middleware/tokens';

interface StringBearer {
    page: string;
}

export const create = async(req: Request, res: Response) => {
    try {
        const { name, image, url } = req.body;
				const author = req.user_id;
				
        if(!name || !image || !url || !author) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        const contactManager = new ContactManager({
            name,
            image,
            url,
            author
        });

        await contactManager.save();
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};


export const getAll = async(req: Request<{}, {}, {}, StringBearer>, res: Response) => {
    try {
        const { query } = req;
				const page = query.page;

        if(!page) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }
				
				
				var allManagers = await ContactManager.find({}).then(function (dataArray) {
					return dataArray;
				});
				
        res.status(201).json(allManagers);
    } catch (error) {
				console.log("managerController.ts encountered an unexpected error:\n" + error);
        res.status(500).json({error: "Internal server error."});
    }
};

