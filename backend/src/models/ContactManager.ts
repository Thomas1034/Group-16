import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const contactManagerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    },
    { 
        statics: {
            // Find contact manager w/ average rating
            async findAllManagersWithAvgRating() {
                const contactManagers = await this.aggregate([
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "_id",
                            foreignField: "contactManagerId",
                            as: "reviews",
                        },
                    },
                    {
                        $addFields: {
                            avgRating: {
                                $avg: "$reviews.rating",
                            },
                            totalReviews: { 
                                $size: '$reviews'
                            },
                        },
                    },
                    {
                        $unset: "reviews", // Exclude the reviews array
                    },
                ]);
                return contactManagers;
            },
            async findManagerWithRating(id: ObjectId) {
                const contactManager = await this.aggregate([
                    {
                        $match: {
                            'name': id
                        }
                    },
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "_id",
                            foreignField: "contactManagerId",
                            as: "reviews",
                        },
                    },
                    {
                        $addFields: {
                            avgRating: {
                                $avg: "$reviews.rating",
                            },
                            totalReviews: { 
                                $size: '$reviews'
                            },
                        },
                    },
                    {
                        $unset: "reviews", // Exclude the reviews array
                    },
                ]);
                return contactManager;
            },
        }
    }
);

export default mongoose.model("ContactManager", contactManagerSchema);
