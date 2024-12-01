import mongoose from "mongoose";

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
