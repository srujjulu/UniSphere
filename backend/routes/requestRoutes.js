import express from 'express';
import { applyToClub, getClubRequests, getMyRequests, updateRequestStatus } from '../controllers/requestController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', optionalAuth, applyToClub);
router.get('/my', requireAuth, getMyRequests);
router.get('/club/:clubId', optionalAuth, getClubRequests);
router.put('/:id/status', optionalAuth, updateRequestStatus);

export default router;

