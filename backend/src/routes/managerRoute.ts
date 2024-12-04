import express from 'express';
import * as ManagerController from '../controllers/managerController';
import { authenticateToken } from '../middleware/tokens';
import upload from '../middleware/upload';

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), ManagerController.create);
router.get('/', ManagerController.getAll);
router.get('/:id', ManagerController.get);
router.delete('/:id', authenticateToken, ManagerController.deleteManager);

export default router;
