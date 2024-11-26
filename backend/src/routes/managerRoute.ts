import express from 'express';
import * as ManagerController from '../controllers/managerController';
import { authenticateToken } from '../middleware/tokens';


const router = express.Router();

router.post('/', authenticateToken, ManagerController.create);
router.get('/', ManagerController.getAll);

export default router;
