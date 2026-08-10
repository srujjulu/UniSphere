import express from 'express';
import { getAllClubs, getClubById, updateClubBudget } from '../controllers/clubController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.put('/:id/budget', requireAuth, requireRole('faculty', 'admin'), updateClubBudget);

export default router;
