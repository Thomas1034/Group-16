import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import AuthRoute from './routes/authRoute';
import ManagerRoute from './routes/managerRoute';
import ReviewRoute from './routes/reviewRoute';
import { authenticateToken  } from './middleware/tokens';

import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';

mongoose.connect(process.env.MONGODB_URI!, {
}).then(() => {
        console.log('Connected to database');
    }).catch(err => {
        console.log('Error connecting to database', err);
    })

app.use(bodyParser.json());

// Serve static files in development.
// In production, Nginx will serve the static files. 
if(env === 'development') {
    const upload_dir = process.env.UPLOAD_FOLDER || 'uploads';
    app.use('/uploads', express.static(upload_dir));
}

app.use('/api/auth', AuthRoute);
app.use('/api/contact-managers', ManagerRoute);
app.use('/api/reviews', ReviewRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
