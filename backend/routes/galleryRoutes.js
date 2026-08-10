import express from 'express';
import { getAllAlbums, createAlbum, updateAlbum, deleteAlbum } from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.post('/', requireAuth, requireRole('core', 'faculty', 'admin'), createAlbum);
router.put('/:id', requireAuth, requireRole('core', 'faculty', 'admin'), updateAlbum);
router.delete('/:id', requireAuth, requireRole('core', 'faculty', 'admin'), deleteAlbum);

export default router;
