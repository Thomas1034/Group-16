import { Express } from 'express-serve-static-core';
import { ObjectId } from 'mongoose';

declare global {
    namespace Express { 
        interface Request {
            user_id?: ObjectId;
        }
    }
}
