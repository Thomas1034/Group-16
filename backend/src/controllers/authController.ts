import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../middleware/tokens';

export const register = async(req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        if(!email || !username || !password) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({username: username.toLowerCase()});

        if (existingUser) {
            res.status(400).json({error: "User already exists"});
            return;
        }

        const user = new User({
            username,
            email: email.toLowerCase(),
            password // note that this is hashed
        });

        await user.save();

        // Send back token
        const token = generateToken(user.id);
        res.status(201).json({token: token, id: user._id});

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
};

export const login = async(req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        const user = await User.findByCredentials(username, password);

        if (!user) {
            res.status(401).json({error: "Invalid login credentials"});
            return;
        }

        // Successful login (credentials match)
        const token = generateToken(user.id);
        res.status(200).json({token: token, id: user._id});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error."});
    }
}

