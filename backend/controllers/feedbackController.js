import { getCollection, insertOne, find } from '../config/db.js';

// @desc Submit event feedback
// @route POST /api/feedback
export const submitFeedback = (req, res) => {
  try {
    const { eventId, eventTitle, clubId, rating, comment } = req.body;

    if (!rating || !eventTitle) {
      return res.status(400).json({ success: false, error: 'Rating and eventTitle are required.' });
    }

    const newFeedback = insertOne('feedbacks', {
      eventId: eventId || 'general',
      eventTitle,
      clubId: clubId || 'general',
      rating: Number(rating),
      comment: comment || '',
      studentRoll: req.user?.rollNumber || 'ANONYMOUS',
      submittedAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! ⭐',
      data: newFeedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to submit feedback.' });
  }
};

// @desc Get feedback for a club (Core Team / Faculty)
// @route GET /api/feedback/club/:clubId
export const getClubFeedback = (req, res) => {
  try {
    const { clubId } = req.params;
    let feedbacks = getCollection('feedbacks');

    if (clubId && clubId !== 'all') {
      feedbacks = feedbacks.filter((f) => f.clubId === clubId);
    }

    const totalRatings = feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 5), 0);
    const avgRating = feedbacks.length > 0 ? (totalRatings / feedbacks.length).toFixed(1) : '5.0';

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      averageRating: Number(avgRating),
      data: feedbacks
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch feedback.' });
  }
};
