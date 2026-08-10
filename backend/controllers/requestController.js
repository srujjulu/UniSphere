import { getCollection, find, insertOne, updateById, findById } from '../config/db.js';

// @desc Submit application to join a club
// @route POST /api/requests/apply
export const applyToClub = (req, res) => {
  try {
    const { clubId, talent, experience, studentName, studentRoll } = req.body;

    if (!clubId) {
      return res.status(400).json({ success: false, error: 'clubId is required.' });
    }

    const club = findById('clubs', clubId);
    if (!club) {
      return res.status(404).json({ success: false, error: 'Target club not found.' });
    }

    const rollNo = req.user?.rollNumber || studentRoll || (req.user?.email ? req.user.email.split('@')[0].toUpperCase() : 'STUDENT');
    const name = req.user?.name || studentName || 'Student Member';
    const email = req.user?.email || `${rollNo.toLowerCase()}@cmr.edu.in`;

    // Check if already applied
    const existing = find('requests', (r) => 
      r.clubId === clubId && 
      (r.studentRoll === rollNo || r.studentEmail === email)
    );

    if (existing.length > 0) {
      const active = existing.find(r => r.status === 'pending' || r.status === 'approved');
      if (active) {
        return res.status(400).json({ 
          success: false, 
          error: `You already have an ${active.status} application for ${club.name}.` 
        });
      }
    }

    const newRequest = insertOne('requests', {
      studentRoll: rollNo,
      studentName: name,
      studentEmail: email,
      clubId,
      clubName: club.name,
      talent: talent || 'Enthusiastic Learner',
      experience: experience || 'General Member Applicant',
      status: 'pending',
      appliedAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: `Application submitted to ${club.name}! Core coordinators will review your profile. 🚀`,
      data: newRequest
    });
  } catch (err) {
    console.error('Apply error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit club application.' });
  }
};

// @desc Get membership requests for a club (Core / Faculty / Admin)
// @route GET /api/requests/club/:clubId
export const getClubRequests = (req, res) => {
  try {
    const { clubId } = req.params;
    let requests = getCollection('requests');

    if (clubId && clubId !== 'all') {
      requests = requests.filter((r) => r.clubId === clubId);
    }

    return res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch requests.' });
  }
};

// @desc Get current student's applications
// @route GET /api/requests/my
export const getMyRequests = (req, res) => {
  try {
    const rollNo = req.user?.rollNumber;
    const email = req.user?.email;

    const myRequests = find('requests', (r) => 
      r.studentRoll === rollNo || r.studentEmail?.toLowerCase() === email?.toLowerCase()
    );

    return res.status(200).json({ success: true, count: myRequests.length, data: myRequests });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch your applications.' });
  }
};

// @desc Approve or Reject a membership request (Core Team / Faculty)
// @route PUT /api/requests/:id/status
export const updateRequestStatus = (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be approved, rejected, or pending.' });
    }

    const updated = updateById('requests', id, {
      status,
      decidedBy: `${req.user?.name || 'Coordinator'} (${req.user?.role || 'core'})`,
      decidedAt: new Date().toISOString()
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Request for ${updated.studentName} has been ${status}! ✅`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update request status.' });
  }
};
