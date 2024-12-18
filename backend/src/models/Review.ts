import mongoose from "mongoose";
import ObjectId = mongoose.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
    },
    contactManagerId: ObjectId,
    rating: Number,
    body: String,
});

export default mongoose.model("Review", reviewSchema);
