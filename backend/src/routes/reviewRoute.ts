import express from 'express';
import * as ReviewController from '../controllers/reviewController';
import { authenticateToken } from '../middleware/tokens';

const router = express.Router();

router.post('/', authenticateToken, ReviewController.createReview);
router.get('/contact-manager/:contactManagerId', authenticateToken, ReviewController.openReview);
router.put('/:id', authenticateToken, ReviewController.editReview);
router.delete('/:id', authenticateToken, ReviewController.deleteReview);

export default router;
