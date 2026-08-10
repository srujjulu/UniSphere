import express from 'express';
import { logVolunteerHours, getStudentVolunteerHours } from '../controllers/volunteerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('core', 'faculty', 'admin'), logVolunteerHours);
router.get('/:rollNo', requireAuth, getStudentVolunteerHours);

export default router;
