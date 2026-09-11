import express from 'express';
import { 
  getAllEventReports, 
  getEventReportById, 
  createEventReport, 
  updateEventReport, 
  reviewEventReport, 
  deleteEventReport 
} from '../controllers/eventReportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public / Authenticated read
router.get('/', getAllEventReports);
router.get('/:id', getEventReportById);

// Submit report (Core / Faculty / Admin)
router.post('/', requireAuth, requireRole('core', 'faculty', 'admin'), createEventReport);

// Update report
router.put('/:id', requireAuth, requireRole('core', 'faculty', 'admin'), updateEventReport);

// Review report (Faculty / Admin only)
router.patch('/:id/review', requireAuth, requireRole('faculty', 'admin'), reviewEventReport);

// Delete report (Admin only)
router.delete('/:id', requireAuth, requireRole('admin'), deleteEventReport);

export default router;
