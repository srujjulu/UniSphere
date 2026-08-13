import { getCollection, find, insertOne, updateById, findById } from '../config/db.js';

// @desc Submit application to join a club
// @route POST /api/requests/apply
export const applyToClub = (req, res) => {
  try {
    const { clubId, talent, experience, studentName, studentRoll, studentEmail, name: reqName, rollNo: reqRoll, branch } = req.body;

    if (!clubId) {
      return res.status(400).json({ success: false, error: 'clubId is required.' });
    }

    const club = findById('clubs', clubId);
    if (!club) {
      return res.status(404).json({ success: false, error: 'Target club not found.' });
    }

    const rollNo = req.user?.rollNumber || studentRoll || reqRoll || (req.user?.email ? req.user.email.split('@')[0].toUpperCase() : 'STUDENT');
    const name = req.user?.name || studentName || reqName || 'Student Member';
    const email = req.user?.email || studentEmail || `${rollNo.toLowerCase()}@cmr.edu.in`;

    // Check if already applied
    const existing = find('requests', (r) => 
      r.clubId === clubId && 
      ((r.studentRoll && r.studentRoll.toUpperCase() === rollNo.toUpperCase()) || 
       (r.rollNo && r.rollNo.toUpperCase() === rollNo.toUpperCase()) ||
       (r.studentEmail && r.studentEmail.toLowerCase() === email.toLowerCase()) ||
       (r.email && r.email.toLowerCase() === email.toLowerCase()))
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

    // Check if club is already at maximum capacity of 50 members
    if ((club.membersCount || 0) >= 50) {
      return res.status(400).json({
        success: false,
        error: `Registration Closed: ${club.name} has reached its maximum capacity of 50 members.`
      });
    }

    const newRequest = insertOne('requests', {
      id: `req-${Date.now()}`,
      name: name,
      studentName: name,
      rollNo: rollNo,
      studentRoll: rollNo,
      email: email,
      studentEmail: email,
      branch: branch || 'CMR Student',
      clubId,
      clubName: club.name,
      talent: talent || 'General Member',
      experience: experience || 'Applicant',
      status: 'pending',
      date: 'Just now',
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

    // Ensure all requests have normalized fields
    const normalized = requests.map(r => ({
      id: r.id,
      name: r.name || r.studentName || 'Student Member',
      studentName: r.name || r.studentName || 'Student Member',
      rollNo: r.rollNo || r.studentRoll || 'STUDENT',
      studentRoll: r.rollNo || r.studentRoll || 'STUDENT',
      email: r.email || r.studentEmail || '',
      studentEmail: r.email || r.studentEmail || '',
      branch: r.branch || 'CMR Student',
      clubId: r.clubId,
      clubName: r.clubName || 'Club',
      talent: r.talent || 'General Member',
      experience: r.experience || '',
      status: r.status || 'pending',
      date: r.date || 'Recently',
      appliedAt: r.appliedAt || new Date().toISOString()
    }));

    return res.status(200).json({ success: true, count: normalized.length, data: normalized });
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

    const existingReq = findById('requests', id);
    if (!existingReq) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    if (status === 'approved') {
      const club = findById('clubs', existingReq.clubId);
      if (club && (club.membersCount || 0) >= 50) {
        return res.status(400).json({
          success: false,
          error: `Cannot approve application: ${club.name} has already reached the maximum limit of 50 members.`
        });
      }
      if (club) {
        updateById('clubs', club.id, { membersCount: Math.min(50, (club.membersCount || 0) + 1) });
      }
    }

    const updated = updateById('requests', id, {
      status,
      decidedBy: `${req.user?.name || 'Coordinator'} (${req.user?.role || 'core'})`,
      decidedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Request for ${updated.studentName} has been ${status}! ✅`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update request status.' });
  }
};
