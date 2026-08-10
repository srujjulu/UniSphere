import { getCollection, insertOne, find } from '../config/db.js';

// @desc Log volunteer hours for a student (NSS / NCC / Event Core)
// @route POST /api/volunteer-hours
export const logVolunteerHours = (req, res) => {
  try {
    const { studentRoll, studentName, clubId, hours, activity, date } = req.body;

    if (!studentRoll || !hours || !activity) {
      return res.status(400).json({ success: false, error: 'studentRoll, hours, and activity are required.' });
    }

    const newLog = insertOne('volunteerLogs', {
      studentRoll: studentRoll.trim().toUpperCase(),
      studentName: studentName || 'Student Volunteer',
      clubId: clubId || 'nss',
      hours: Number(hours),
      activity: activity.trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      verifiedBy: req.user?.name || 'Program Officer'
    });

    return res.status(201).json({
      success: true,
      message: `Credited ${hours} volunteer hours to ${studentRoll}! 🎖️`,
      data: newLog
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to record volunteer hours.' });
  }
};

// @desc Get volunteer hours for a student
// @route GET /api/volunteer-hours/:rollNo
export const getStudentVolunteerHours = (req, res) => {
  try {
    const { rollNo } = req.params;
    const logs = find('volunteerLogs', (l) => l.studentRoll.toUpperCase() === rollNo.toUpperCase());
    const totalHours = logs.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);

    return res.status(200).json({
      success: true,
      studentRoll: rollNo.toUpperCase(),
      totalHours,
      data: logs
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve volunteer records.' });
  }
};
