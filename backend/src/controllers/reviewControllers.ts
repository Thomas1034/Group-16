import { Request, Response } from 'express';
import Review from '../models/Review';
import { generateToken } from '../middleware/tokens';

export const createReview = async(req: Request, res: Response) => {
    try {
        const { contactManagerId, rating, body } = req.body;
        const userId = req.user_id;

        if(!contactManagerId || !rating || !body) {
            res.status(401).json({error: "Missing required fields"});
            return;
        }

        const review = new Review({
            userId,
            contactManagerId,
            rating,
            body
        });

        await review.save();
        res.sendStatus(201);

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};

export const openReview = async(req: Request, res: Response) => {

};

export const editReview = async(req: Request, res: Response) => {
    try {
        const { contactManagerId, rating, body } = req.body;
        const userId = req.user_id;

        if(!rating || !body) {
            res.status(401).json({error: "Missing required fields"});
            return;
        }

        const review = await Review.findByCredentials(userId, contactManagerId);

        if (!review) {
            res.status(404).json({error: "Review not found"});
            return;
        }

        const newReview = new Review({
            userId,
            contactManagerId,
            rating,
            body
        });

        await review.deleteReview();
        await newReview.save();
        res.sendStatus(201);

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};

export const deleteReview = async(req: Request, res: Response) => {

};