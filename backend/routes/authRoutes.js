import express from 'express';
import { registerUser, loginUser, getMe, loginDemo } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo', loginDemo);
router.get('/me', requireAuth, getMe);

export default router;
