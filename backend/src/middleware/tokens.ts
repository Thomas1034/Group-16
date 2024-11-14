import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import type { RequestHandler } from 'express';

// Data that gets encoded into our token.
interface TokenPayload {
    user_id: ObjectId;
}

// General function that accepts a user ID from Mongo, and creates a token
export const generateToken = (user_id: ObjectId): string =>  {
    const payload: TokenPayload = { user_id };

    return jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: '1800s' });
}


// Middleware that will parse the HTTP headers, search for an Authorization header,
// and verify that the token is valid.
// Then, it will add a new field, user_id, to the Response. This can be used in any endpoints that require authentication.
export const authenticateToken: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.sendStatus(401).json({error: "Authentication headers required for this endpoint."});
        return;
    }

    try { 
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;

        req.user_id = decoded.user_id;

        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({error: "Invalid token."});
        } else if (err instanceof jwt.TokenExpiredError) {
            res.status(403).json({error: "Token expired."});
        } else {
            res.status(500).json({error: "Internal server error."});
        }
    }
};
