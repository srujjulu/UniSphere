export const initialAttendanceData = {
  'cal-4': {
    eventId: 'cal-4',
    eventTitle: 'CMR HackFest 2026 36-Hour Hackathon',
    clubName: 'Codeholics Tech Club',
    qrCodePayload: 'UNISPHERE_QR_CMRTC_HACKFEST_2026_CODEHOLICS',
    attendees: [
      { rollNo: '237R1A05BA', name: 'Srujanya Maringanti', status: 'present', scannedAt: 'Sept 05, 2026 • 09:14 AM' },
      { rollNo: '237R1A0501', name: 'Ananya Sharma', status: 'present', scannedAt: 'Sept 05, 2026 • 09:05 AM' },
      { rollNo: '237R1A0512', name: 'Rahul Verma', status: 'present', scannedAt: 'Sept 05, 2026 • 09:22 AM' },
      { rollNo: '237R1A0544', name: 'Priya Reddy', status: 'absent', scannedAt: '-' },
      { rollNo: '237R1A0588', name: 'Karthik Rao', status: 'absent', scannedAt: '-' }
    ]
  },
  'cal-3': {
    eventId: 'cal-3',
    eventTitle: 'Word-Smith Parliamentary Debate & MUN',
    clubName: 'The Lexis Club',
    qrCodePayload: 'UNISPHERE_QR_CMRTC_LEXIS_MUN_2026',
    attendees: [
      { rollNo: '237R1A05BA', name: 'Srujanya Maringanti', status: 'present', scannedAt: 'Aug 30, 2026 • 10:02 AM' },
      { rollNo: '237R1A0505', name: 'Sneha Kapur', status: 'present', scannedAt: 'Aug 30, 2026 • 09:58 AM' },
      { rollNo: '237R1A0519', name: 'Vikram Singh', status: 'absent', scannedAt: '-' }
    ]
  },
  'cal-2': {
    eventId: 'cal-2',
    eventTitle: 'Swachh Bharat Cleanliness Drive',
    clubName: 'NSS Unit CMRTC',
    qrCodePayload: 'UNISPHERE_QR_CMRTC_NSS_CLEAN_2026',
    attendees: [
      { rollNo: '237R1A05BA', name: 'Srujanya Maringanti', status: 'present', scannedAt: 'July 28, 2026 • 08:45 AM' },
      { rollNo: '237R1A0530', name: 'Aditya Teja', status: 'present', scannedAt: 'July 28, 2026 • 08:50 AM' }
    ]
  }
};

export const getStoredAttendanceRecords = () => {
  if (typeof window === 'undefined') return initialAttendanceData;
  const stored = localStorage.getItem('cmrtc_qr_attendance_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialAttendanceData;
    }
  }
  return initialAttendanceData;
};

export const markStudentPresent = (eventId, studentRoll = '237R1A05BA', studentName = 'Student Member') => {
  if (typeof window === 'undefined') return;
  const allData = getStoredAttendanceRecords();
  const eventRecord = allData[eventId] || {
    eventId,
    eventTitle: 'CMRTC Campus Event',
    clubName: 'Campus Club',
    qrCodePayload: `UNISPHERE_QR_${eventId.toUpperCase()}`,
    attendees: []
  };

  const existingIdx = eventRecord.attendees.findIndex(a => a.rollNo.toUpperCase() === studentRoll.toUpperCase());
  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

  const updatedAttendees = [...eventRecord.attendees];
  if (existingIdx >= 0) {
    updatedAttendees[existingIdx] = {
      ...updatedAttendees[existingIdx],
      status: 'present',
      scannedAt: `${dateStr} • ${nowStr}`
    };
  } else {
    updatedAttendees.push({
      rollNo: studentRoll.toUpperCase(),
      name: studentName,
      status: 'present',
      scannedAt: `${dateStr} • ${nowStr}`
    });
  }

  const updatedAll = {
    ...allData,
    [eventId]: {
      ...eventRecord,
      attendees: updatedAttendees
    }
  };

  localStorage.setItem('cmrtc_qr_attendance_data', JSON.stringify(updatedAll));
  return updatedAll;
};

export const getAttendanceMetrics = (eventId) => {
  const allData = getStoredAttendanceRecords();
  const record = allData[eventId] || { attendees: [] };
  const attendees = record.attendees || [];

  const presentList = attendees.filter(a => a.status === 'present');
  const absentList = attendees.filter(a => a.status === 'absent');
  const total = attendees.length || 1;
  const percentage = Math.round((presentList.length / total) * 100);

  return {
    total,
    presentCount: presentList.length,
    absentCount: absentList.length,
    percentage,
    presentList,
    absentList,
    payload: record.qrCodePayload || `UNISPHERE_QR_${eventId}`
  };
};
