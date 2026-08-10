import { getCollection, findById, updateById } from '../config/db.js';

// @desc Get all active clubs with member stats
// @route GET /api/clubs
export const getAllClubs = (req, res) => {
  try {
    const clubs = getCollection('clubs');
    return res.status(200).json({ success: true, count: clubs.length, data: clubs });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch clubs.' });
  }
};

// @desc Get single club details
// @route GET /api/clubs/:id
export const getClubById = (req, res) => {
  try {
    const club = findById('clubs', req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, error: 'Club not found.' });
    }
    return res.status(200).json({ success: true, data: club });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error retrieving club.' });
  }
};

// @desc Update club budget (Faculty / Admin only)
// @route PUT /api/clubs/:id/budget
export const updateClubBudget = (req, res) => {
  try {
    const { budget } = req.body;
    if (budget === undefined) {
      return res.status(400).json({ success: false, error: 'Budget amount is required.' });
    }

    const updated = updateById('clubs', req.params.id, { budget: Number(budget) });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Club not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Budget updated to ₹${Number(budget).toLocaleString()}!`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update club budget.' });
  }
};
