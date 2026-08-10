import express from 'express';
import { submitFeedback, getClubFeedback } from '../controllers/feedbackController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, submitFeedback);
router.get('/club/:clubId', requireAuth, getClubFeedback);

export default router;
