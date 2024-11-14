import mongoose from "mongoose";
import ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    userId: ObjectId,
    contactManagerId: ObjectId,
    rating: Number,
    body: String,
});

export default mongoose.model("Review", reviewSchema);
