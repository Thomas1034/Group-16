import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        }
    },
    {
        statics: {
            // Method to find user by username & password
            async findByCredentials(username: string, password: string) {
                const user = await this.findOne({ username });

                if (!user) {
                    console.log("User not found");
                    return null;
                } 
                const isMatch = await bcrypt.compare(password, user.password);

                // only return user on match
                return isMatch ? user: null;

            }
        }
    }
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

export default mongoose.model("User", userSchema);
