import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import AuthRoute from './routes/authRoute';
import { authenticateToken  } from './middleware/tokens';

import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

mongoose.connect(process.env.MONGODB_URI!, {
}).then(() => {
        console.log('Connected to database');
    }).catch(err => {
        console.log('Error connecting to database', err);
    })

app.use(bodyParser.json());

app.use('/api/auth', AuthRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
