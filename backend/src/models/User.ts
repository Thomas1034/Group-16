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
            async findByCredentials(email: string, password: string) {
                const user = await this.findOne({ email });

                if (!user) return null;

                const isMatch = await bcrypt.compare(password, user.password);

                // only return user on match
                return isMatch ? user: null;

            }
        }
    }
);

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
