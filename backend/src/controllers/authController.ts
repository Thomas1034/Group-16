import { Request, Response } from 'express';
import User from '../models/User';

export const register = async(req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        const user = new User({
            username,
            email,
            password // note that this is hashed
        })

        await user.save();
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({error: "Internal server error registering user"});
    }
};

export const login = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findByCredentials(email, password);

        if (!user) {
            res.status(401).json({error: "Invalid login credentials"});
            return;
        }

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error: "Internal server error logging in user"});
    }
}

