import express from 'express';
import * as ReviewController from '../controllers/reviewControllers';
import { authenticateToken } from '../middleware/tokens';

const router = express.Router();

router.post('/', authenticateToken, ReviewController.createReview);
router.put('/:id', authenticateToken, ReviewController.editReview);

export default router;
