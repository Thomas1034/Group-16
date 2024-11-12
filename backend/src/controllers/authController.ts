import { Request, Response } from 'express';
import User from '../models/User';

export const register = async(req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        const user = new User({
            username,
            email,
            password // TODO(Joey): hashing
        })

        await user.save();
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({error: "Internal server error registering user"});
    }
};

