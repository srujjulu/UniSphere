import express from 'express';
import { applyToClub, getClubRequests, getMyRequests, updateRequestStatus } from '../controllers/requestController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', requireAuth, applyToClub);
router.get('/my', requireAuth, getMyRequests);
router.get('/club/:clubId', requireAuth, requireRole('core', 'faculty', 'admin'), getClubRequests);
router.put('/:id/status', requireAuth, requireRole('core', 'faculty', 'admin'), updateRequestStatus);

export default router;
