import express from 'express';
import * as AuthController from '../controllers/authController';

const router = express.Router();

router.post('/register', AuthController.register);

export default router;
