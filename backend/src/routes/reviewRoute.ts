import express from 'express';
import * as ReviewController from '../controllers/reviewControllers';
import { authenticateToken } from '../middleware/tokens';

const router = express.Router();

router.post('/createReview', authenticateToken, ReviewController.createReview);

export default router;
