import mongoose from "mongoose";

const contactManagerSchema = new mongoose.Schema({
    name: String,
    image: String,
    url: String,
    author: String,
});

export default mongoose.model("ContactManager", contactManagerSchema);
