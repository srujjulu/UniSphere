import { getCollection, findById, insertOne, updateById, deleteById } from '../config/db.js';

// @desc Get all photo albums
// @route GET /api/gallery
export const getAllAlbums = (req, res) => {
  try {
    const { clubId } = req.query;
    let albums = getCollection('albums');

    if (clubId && clubId !== 'all') {
      albums = albums.filter((a) => a.clubId === clubId);
    }

    return res.status(200).json({ success: true, count: albums.length, data: albums });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch gallery albums.' });
  }
};

// @desc Create a new album
// @route POST /api/gallery
export const createAlbum = (req, res) => {
  try {
    const { clubId, eventName, eventDate, coverImage, driveUrl, photoCount } = req.body;

    if (!eventName || !driveUrl) {
      return res.status(400).json({ success: false, error: 'Event name and Google Drive URL are required.' });
    }

    const club = findById('clubs', clubId || 'akriti');
    const newAlbum = insertOne('albums', {
      clubId: clubId || 'akriti',
      clubName: club?.name || 'CMRTC Club',
      eventName: eventName.trim(),
      eventDate: eventDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      coverImage: coverImage || '/images/akriti/akriti-live-concert-stage.jpg',
      driveUrl: driveUrl.trim(),
      uploadedBy: req.user?.name || 'Club Lead',
      photoCount: Number(photoCount) || 150
    });

    return res.status(201).json({
      success: true,
      message: `Album "${newAlbum.eventName}" added to gallery! 📸`,
      data: newAlbum
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create photo album.' });
  }
};

// @desc Update Google Drive link or cover photo
// @route PUT /api/gallery/:id
export const updateAlbum = (req, res) => {
  try {
    const { driveUrl, coverImage } = req.body;
    const updated = updateById('albums', req.params.id, {
      ...(driveUrl ? { driveUrl: driveUrl.trim() } : {}),
      ...(coverImage ? { coverImage: coverImage.trim() } : {})
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Album not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Album links updated successfully! 💾',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update album.' });
  }
};

// @desc Delete an album
// @route DELETE /api/gallery/:id
export const deleteAlbum = (req, res) => {
  try {
    const remaining = deleteById('albums', req.params.id);
    return res.status(200).json({ success: true, message: 'Album deleted.', data: remaining });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete album.' });
  }
};
