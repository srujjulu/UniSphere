import express from 'express';
import { getAllCertificates, verifyCertificateByCredentialId, issueCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public tamper-proof verification route (accessible without auth)
router.get('/verify/:credentialId', verifyCertificateByCredentialId);

// Protected routes
router.get('/', getAllCertificates);
router.post('/issue', requireAuth, requireRole('core', 'faculty', 'admin'), issueCertificate);
router.put('/:id/verify', requireAuth, requireRole('faculty', 'admin'), verifyCertificate);

export default router;
