import express from 'express';
import * as ReviewController from '../controllers/reviewControllers';
import { authenticateToken } from '../middleware/tokens';

const router = express.Router();

router.post('/createReview', authenticateToken, ReviewController.createReview);
router.post('/editReview', authenticateToken, ReviewController.editReview);

export default router;
