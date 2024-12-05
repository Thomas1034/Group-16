import mongoose from "mongoose";
import User from "./User";

const contactManagerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
            required: false,
        },
        url: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: User,
        },
    },
    { 
        statics: {
            // Find contact manager w/ average rating
            async findAllManagersWithAvgRating(searchQuery?: string) {
                const contactManagers = await this.aggregate([
                    // Only include a search query object if a search query is provided
                    ...(searchQuery ? [{
                        $match: {
                            name: { $regex: searchQuery, $options: "i" },
                        },
                    }]: []),
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
            async findManagerWithRating(id: mongoose.Types.ObjectId) {
                const contactManager = await this.aggregate([
                    {
                        $match: {
                            '_id': id
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
                return contactManager[0] ?? null;
            },
        }
    }
);

export default mongoose.model("ContactManager", contactManagerSchema);
