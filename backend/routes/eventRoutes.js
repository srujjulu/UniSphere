import express from 'express';
import { getAllEvents, createEvent, registerForEvent, getMyRegistrations } from '../controllers/eventController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', requireAuth, requireRole('core', 'faculty', 'admin'), createEvent);
router.post('/:id/register', requireAuth, registerForEvent);
router.get('/my/registrations', requireAuth, getMyRegistrations);

export default router;
