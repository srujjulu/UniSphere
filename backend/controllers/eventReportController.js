import { getCollection, findById, insertOne, updateById, deleteById, find } from '../config/db.js';

// @desc Get all event reports with optional filtering
// @route GET /api/event-reports
export const getAllEventReports = (req, res) => {
  try {
    const { clubId, status, academicYear } = req.query;
    let reports = getCollection('eventReports');

    if (clubId && clubId !== 'all') {
      reports = reports.filter((r) => r.clubId === clubId);
    }
    if (status && status !== 'all') {
      reports = reports.filter((r) => r.status === status);
    }
    if (academicYear && academicYear !== 'all') {
      reports = reports.filter((r) => r.academicYear === academicYear);
    }

    return res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch event reports.' });
  }
};

// @desc Get single event report by ID
// @route GET /api/event-reports/:id
export const getEventReportById = (req, res) => {
  try {
    const { id } = req.params;
    const report = findById('eventReports', id) || getCollection('eventReports').find(r => r.reportId === id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Event report not found.' });
    }

    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve event report.' });
  }
};

// @desc Create / Submit new event report
// @route POST /api/event-reports
export const createEventReport = (req, res) => {
  try {
    const reportData = req.body;

    if (!reportData.eventTitle || !reportData.clubId) {
      return res.status(400).json({ success: false, error: 'Event title and clubId are required.' });
    }

    const currentReports = getCollection('eventReports');
    const reportId = reportData.reportId || `CMRTC-ER-2026-${String(currentReports.length + 1).padStart(3, '0')}`;

    const newReport = insertOne('eventReports', {
      reportId,
      eventId: reportData.eventId || '',
      eventTitle: reportData.eventTitle.trim(),
      clubId: reportData.clubId,
      clubName: reportData.clubName || 'CMRTC Club',
      category: reportData.category || 'Competitions',
      academicYear: reportData.academicYear || '2025-2026',
      eventDate: reportData.eventDate || new Date().toISOString().split('T')[0],
      startTime: reportData.startTime || '09:00 AM',
      endTime: reportData.endTime || '05:00 PM',
      venue: reportData.venue || 'CMRTC Campus',
      mode: reportData.mode || 'Offline',
      objective: reportData.objective || '',
      summary: reportData.summary || '',
      activities: reportData.activities || '',
      chiefGuest: reportData.chiefGuest || '',
      facultyCoordinator: reportData.facultyCoordinator || 'Dr. Suresh Kumar',
      participantCount: Number(reportData.participantCount) || 0,
      volunteerCount: Number(reportData.volunteerCount) || 0,
      outcome: reportData.outcome || '',
      highlights: reportData.highlights || '',
      achievements: reportData.achievements || '',
      challenges: reportData.challenges || '',
      suggestions: reportData.suggestions || '',
      status: reportData.status || 'Submitted',
      submittedBy: req.user?.name ? `${req.user.name} (${req.user.rollNumber || 'Coordinator'})` : (reportData.submittedBy || 'Student Lead'),
      submittedAt: new Date().toISOString(),
      facultyComments: reportData.facultyComments || '',
      reviewedBy: null,
      reviewedAt: null,
      files: reportData.files || []
    });

    return res.status(201).json({
      success: true,
      message: `Event report submitted successfully: "${newReport.eventTitle}" 🎉`,
      data: newReport
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create event report.' });
  }
};

// @desc Update event report / edit draft / resubmit
// @route PUT /api/event-reports/:id
export const updateEventReport = (req, res) => {
  try {
    const { id } = req.params;
    const existing = findById('eventReports', id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Event report not found.' });
    }

    const updated = updateById('eventReports', id, req.body);

    return res.status(200).json({
      success: true,
      message: `Updated event report: "${updated.eventTitle}"`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update event report.' });
  }
};

// @desc Review event report (Faculty / Admin: Approve or Request Changes)
// @route PATCH /api/event-reports/:id/review
export const reviewEventReport = (req, res) => {
  try {
    const { id } = req.params;
    const { status, facultyComments } = req.body;

    const existing = findById('eventReports', id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Event report not found.' });
    }

    const reviewerName = req.user?.name || 'Dr. Suresh Kumar';

    const updated = updateById('eventReports', id, {
      status: status || 'Verified / Approved',
      facultyComments: facultyComments || existing.facultyComments,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Report status updated to "${updated.status}"`,
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to review event report.' });
  }
};

// @desc Delete event report
// @route DELETE /api/event-reports/:id
export const deleteEventReport = (req, res) => {
  try {
    const { id } = req.params;
    deleteById('eventReports', id);
    return res.status(200).json({ success: true, message: 'Event report deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete event report.' });
  }
};
