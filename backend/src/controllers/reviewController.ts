import { Request, Response } from 'express';
import Review from '../models/Review';
import mongoose from 'mongoose';

interface IdHolder {
    id?: string;
}

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
        console.log(error);
    }
};

export const openReview = async(req: Request<IdHolder, {}, {}, {}>, res: Response) => {
  try {
    const id = req.params.id;

    // Check if the ID is a valid ObjectId
    if(!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({error: "Invalid request ID"});
      return;
    }

    var reviews = await Review.find({contactManagerId: id})
    res.status(200).json(reviews);

  } catch (error) {
    console.log("reviewController.ts encountered an unexpected error:\n" + error);
    res.status(500).json({error: "Internal server error."});
  }
};

export const editReview = async(req: Request, res: Response) => {
    try {
        const { rating, body } = req.body;
        const review_id = req.params.id;

        if(!rating || !body) {
            res.status(401).json({error: "Missing required fields"});
            return;
        }

        const review = await Review.findById(review_id);

        if (!review) {
            res.status(404).json({error: "Review not found"});
            return;
        }

        review.rating = rating;
        review.body = body;

        await review.save();
        res.sendStatus(201);

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};

export const deleteReview = async(req: Request, res: Response) => {
    try {
        const review_id = req.params.id;
        const author = req.user_id;

        await Review.findByIdAndDelete(review_id);
        res.sendStatus(201);

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};
