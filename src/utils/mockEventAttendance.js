import { getStoredEventReports } from './mockEventReports';
import { getStoredCalendarEvents } from './mockCalendarEvents';

const ATTENDANCE_STORAGE_KEY = 'unisphere_event_attendance_records_v1';

// Standard CMRTC Branches
export const CMRTC_BRANCHES = [
  'CSE',
  'CSE-AIML',
  'CSE-DS',
  'IT',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL'
];

// Branch-wise student seed bank for realistic generated & verified attendance
const branchStudentBank = {
  'CSE': [
    { name: 'Rohan Sharma', roll: '237R1A05BA', section: 'A' },
    { name: 'Ananya Verma', roll: '237R1A0512', section: 'A' },
    { name: 'Aditya Reddy', roll: '237R1A0544', section: 'B' },
    { name: 'Pooja Hegde', roll: '237R1A0589', section: 'B' },
    { name: 'Karthik Rao', roll: '227R1A0501', section: 'C' },
    { name: 'Deepika Sen', roll: '227R1A0533', section: 'C' },
    { name: 'Siddharth Jain', roll: '237R1A0567', section: 'D' },
    { name: 'Sneha Kulkarni', roll: '247R1A0521', section: 'A' },
    { name: 'Vikram Joshi', roll: '247R1A0599', section: 'B' },
    { name: 'Megha Nair', roll: '227R1A0588', section: 'D' }
  ],
  'CSE-AIML': [
    { name: 'Arjun Das', roll: '237R1A6601', section: 'A' },
    { name: 'Tanvi Agarwal', roll: '237R1A6615', section: 'A' },
    { name: 'Nikhil Teja', roll: '237R1A6632', section: 'B' },
    { name: 'Swati Pillai', roll: '227R1A6609', section: 'A' },
    { name: 'Harish Varma', roll: '247R1A6624', section: 'A' },
    { name: 'Divya Sri', roll: '237R1A6648', section: 'B' }
  ],
  'CSE-DS': [
    { name: 'Sai Krishna', roll: '237R1A6704', section: 'A' },
    { name: 'Kavya Sree', roll: '237R1A6719', section: 'A' },
    { name: 'Pranav Kumar', roll: '227R1A6708', section: 'A' },
    { name: 'Bhavana Roy', roll: '247R1A6722', section: 'A' },
    { name: 'Ritesh Pandey', roll: '237R1A6735', section: 'B' }
  ],
  'IT': [
    { name: 'Manish Goud', roll: '237R1A1203', section: 'A' },
    { name: 'Harini Reddy', roll: '237R1A1218', section: 'A' },
    { name: 'Sanjay Dutt', roll: '227R1A1227', section: 'A' },
    { name: 'Priyanka Ghosh', roll: '247R1A1209', section: 'A' },
    { name: 'Varun Tej', roll: '237R1A1245', section: 'B' }
  ],
  'ECE': [
    { name: 'Rahul Bose', roll: '237R1A0402', section: 'A' },
    { name: 'Aakanksha Roy', roll: '237R1A0419', section: 'A' },
    { name: 'Naveen Kumar', roll: '227R1A0431', section: 'B' },
    { name: 'Shreya Mittal', roll: '247R1A0411', section: 'A' },
    { name: 'Tarun Varma', roll: '237R1A0449', section: 'B' }
  ],
  'EEE': [
    { name: 'Gautam Prasad', roll: '237R1A0201', section: 'A' },
    { name: 'Anusha Rao', roll: '237R1A0214', section: 'A' },
    { name: 'Santosh Kumar', roll: '227R1A0223', section: 'A' },
    { name: 'Lavanya S', roll: '247R1A0208', section: 'A' }
  ],
  'MECH': [
    { name: 'Abhishek Singh', roll: '237R1A0305', section: 'A' },
    { name: 'Rohit Sharma', roll: '227R1A0318', section: 'A' },
    { name: 'Surya Kiran', roll: '247R1A0302', section: 'A' }
  ],
  'CIVIL': [
    { name: 'Manoj Reddy', roll: '237R1A0104', section: 'A' },
    { name: 'Keerthi Priya', roll: '227R1A0112', section: 'A' },
    { name: 'Srikanth N', roll: '247R1A0109', section: 'A' }
  ]
};

// Generate deterministic realistic student attendance list for any event
export const generateEventAttendanceList = (eventId, eventTitle, clubName, eventDate, participantCount = 100) => {
  const records = [];
  const count = Math.max(Number(participantCount) || 50, 30);

  // Distribution weights across branches
  const branchWeights = [
    { branch: 'CSE', weight: 0.35 },
    { branch: 'CSE-AIML', weight: 0.20 },
    { branch: 'CSE-DS', weight: 0.15 },
    { branch: 'IT', weight: 0.10 },
    { branch: 'ECE', weight: 0.10 },
    { branch: 'EEE', weight: 0.04 },
    { branch: 'MECH', weight: 0.03 },
    { branch: 'CIVIL', weight: 0.03 }
  ];

  let idCounter = 1;
  const baseTime = '09:15:00 AM';

  branchWeights.forEach(({ branch, weight }) => {
    const branchTarget = Math.max(1, Math.round(count * weight));
    const bank = branchStudentBank[branch] || [];

    for (let i = 0; i < branchTarget; i++) {
      const studentTemplate = bank[i % bank.length];
      const rollSuffix = String((i + 1) * 3).padStart(2, '0');
      const studentRoll = studentTemplate 
        ? (i >= bank.length ? `${studentTemplate.roll.slice(0, 8)}${rollSuffix}` : studentTemplate.roll)
        : `237R1A05${rollSuffix}`;
      const studentName = studentTemplate 
        ? (i >= bank.length ? `${studentTemplate.name} ${i + 1}` : studentTemplate.name)
        : `Student ${idCounter}`;
      const section = studentTemplate?.section || (i % 2 === 0 ? 'A' : 'B');

      // Stagger check-in minutes
      const min = String(10 + (idCounter % 45)).padStart(2, '0');
      const sec = String((idCounter * 7) % 60).padStart(2, '0');
      const checkInTime = `09:${min}:${sec} AM`;

      records.push({
        id: `att-${eventId || 'evt'}-${idCounter}`,
        eventId: eventId || 'evt-1',
        eventTitle: eventTitle || 'CMR Campus Event',
        clubName: clubName || 'Student Club',
        eventDate: eventDate || '2026-08-25',
        studentName,
        rollNumber: studentRoll,
        branch,
        section,
        checkInTime,
        status: 'Present / Verified (QR Check-in)',
        verifiedBy: 'Faculty Coordinator (CMRTC)'
      });

      idCounter++;
    }
  });

  return records;
};

// Retrieve or generate stored attendance for any event
export const getAttendanceForEvent = (eventId, eventData = {}) => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};

    if (store[eventId] && Array.isArray(store[eventId]) && store[eventId].length > 0) {
      return store[eventId];
    }

    // Generate and save deterministic attendance records
    const generated = generateEventAttendanceList(
      eventId,
      eventData.title || eventData.eventTitle || 'Campus Flagship Event',
      eventData.clubName || 'CMRTC Club',
      eventData.date || eventData.eventDate || '2026-08-25',
      eventData.participants || eventData.participantCount || 120
    );

    store[eventId] = generated;
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(store));
    return generated;
  } catch (err) {
    console.error('Error fetching event attendance:', err);
    return generateEventAttendanceList(eventId, eventData.title, eventData.clubName, eventData.date, eventData.participantCount || 100);
  }
};

// Calculate branch-wise summary table for an event
export const getBranchWiseAttendanceSummary = (eventId, eventData = {}) => {
  const records = getAttendanceForEvent(eventId, eventData);

  const summary = {};
  CMRTC_BRANCHES.forEach(b => {
    summary[b] = 0;
  });

  records.forEach(r => {
    if (summary[r.branch] !== undefined) {
      summary[r.branch]++;
    } else {
      summary[r.branch] = 1;
    }
  });

  const branchList = Object.keys(summary).map(branch => ({
    branch,
    count: summary[branch],
    percentage: records.length > 0 ? ((summary[branch] / records.length) * 100).toFixed(1) : 0
  }));

  return {
    totalStudents: records.length,
    branchBreakdown: branchList,
    records
  };
};

// Get combined events list with report status & attendance stats
export const getAllCampusEventsWithReportsAndAttendance = () => {
  const calendarEvents = getStoredCalendarEvents();
  const reports = getStoredEventReports();

  const reportMap = new Map();
  reports.forEach(r => {
    if (r.eventId) reportMap.set(r.eventId, r);
    reportMap.set(r.eventTitle?.toLowerCase().trim(), r);
  });

  return calendarEvents.map(evt => {
    const matchedReport = reportMap.get(evt.id) || reportMap.get(evt.title?.toLowerCase().trim());
    const attendanceSummary = getBranchWiseAttendanceSummary(evt.id, {
      title: evt.title,
      clubName: evt.clubName,
      date: evt.date,
      participants: matchedReport?.participantCount || evt.registeredCount || 120
    });

    const branchesWithAttendance = attendanceSummary.branchBreakdown
      .filter(b => b.count > 0)
      .map(b => b.branch);

    return {
      ...evt,
      report: matchedReport || null,
      hasReport: !!matchedReport,
      reportStatus: matchedReport ? matchedReport.status : 'Pending Report Submission',
      totalAttendance: attendanceSummary.totalStudents,
      branchBreakdown: attendanceSummary.branchBreakdown,
      availableBranches: branchesWithAttendance.length > 0 ? branchesWithAttendance : CMRTC_BRANCHES.slice(0, 5),
      documentsCount: matchedReport?.files?.length || 4,
      photosCount: matchedReport?.files?.filter(f => f.category === 'event_photos').length || 12,
      driveLink: matchedReport?.driveLink || 'https://drive.google.com/drive/folders/cmrtc-official-club-archive-2026'
    };
  });
};
