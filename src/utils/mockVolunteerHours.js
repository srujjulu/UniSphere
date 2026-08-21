export const initialVolunteerData = {
  '237R1A05BA': {
    studentRoll: '237R1A05BA',
    studentName: 'Srujanya Maringanti',
    department: 'Computer Science & Engineering',
    totalHours: 32,
    history: [
      {
        id: 'vol-1',
        eventTitle: 'Swachh Bharat Cleanliness & Greenery Drive',
        clubName: 'NSS Unit CMRTC',
        hours: 8,
        date: 'July 28, 2026',
        assignedBy: 'Dr. Suresh Kumar (NSS Officer)'
      },
      {
        id: 'vol-2',
        eventTitle: 'Republic Day Parade & Rifle Drill Training',
        clubName: 'NCC Cadet Corps CMRTC',
        hours: 12,
        date: 'May 20, 2026',
        assignedBy: 'Col. K. V. Sharma (Unit Commander)'
      },
      {
        id: 'vol-3',
        eventTitle: 'Mega Blood Donation & Health Screening Camp',
        clubName: 'NSS Unit & Red Cross',
        hours: 12,
        date: 'March 14, 2026',
        assignedBy: 'Prof. Anitha Rao (Faculty Lead)'
      }
    ]
  },
  '237R1A0501': {
    studentRoll: '237R1A0501',
    studentName: 'Ananya Sharma',
    department: 'CSE',
    totalHours: 58,
    history: [
      {
        id: 'vol-4',
        eventTitle: 'National Literacy & Orphanage Digital Drive',
        clubName: 'NSS Unit CMRTC',
        hours: 24,
        date: 'June 10, 2026',
        assignedBy: 'Dr. Suresh Kumar (NSS Officer)'
      },
      {
        id: 'vol-5',
        eventTitle: 'CMRTC Eco-Green Plantation Drive',
        clubName: 'NSS Unit CMRTC',
        hours: 34,
        date: 'April 05, 2026',
        assignedBy: 'Prof. Anitha Rao (Faculty Lead)'
      }
    ]
  },
  '217R1A0577': {
    studentRoll: '217R1A0577',
    studentName: 'Aditya Teja',
    department: 'ECE',
    totalHours: 110,
    history: [
      {
        id: 'vol-6',
        eventTitle: 'NCC Annual Training Camp (ATC 2026)',
        clubName: 'NCC Cadet Corps CMRTC',
        hours: 110,
        date: 'Jan 15, 2026',
        assignedBy: 'Col. K. V. Sharma'
      }
    ]
  }
};

export const milestoneThresholds = [
  { level: 'Bronze', hours: 10, badge: '🥉', title: 'Bronze Volunteer', desc: 'Completed 10+ voluntary community service hours.' },
  { level: 'Silver', hours: 25, badge: '🥈', title: 'Silver Volunteer', desc: 'Completed 25+ voluntary service hours across NSS & NCC drives.' },
  { level: 'Gold', hours: 50, badge: '🥇', title: 'Gold Community Leader', desc: 'Completed 50+ hours demonstrating outstanding civic leadership.' },
  { level: 'Diamond', hours: 100, badge: '💎', title: 'Diamond Service Honor', desc: 'Reached 100+ volunteer hours with top distinction at CMRTC.' }
];

export const getStoredVolunteerRecords = () => {
  if (typeof window === 'undefined') return initialVolunteerData;
  const stored = localStorage.getItem('cmrtc_volunteer_hours_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialVolunteerData;
    }
  }
  return initialVolunteerData;
};

export const getStudentVolunteerRecord = (studentRoll = '237R1A05BA', studentName = 'Student Member', department = 'Computer Science & Engineering (CSE)') => {
  const all = getStoredVolunteerRecords();
  const rollUpper = studentRoll.toUpperCase();
  if (all[rollUpper]) {
    return all[rollUpper];
  }

  // Generate dynamic initial volunteer record for this student
  const defaultRecord = {
    studentRoll: rollUpper,
    studentName: studentName || 'Student Member',
    department: department || 'Computer Science & Engineering',
    totalHours: 32,
    history: [
      {
        id: `vol-${rollUpper}-1`,
        eventTitle: 'Swachh Bharat Cleanliness & Greenery Drive',
        clubName: 'NSS Unit CMRTC',
        hours: 8,
        date: 'July 28, 2026',
        assignedBy: 'Dr. Suresh Kumar (NSS Officer)'
      },
      {
        id: `vol-${rollUpper}-2`,
        eventTitle: 'Republic Day Parade & Rifle Drill Training',
        clubName: 'NCC Cadet Corps CMRTC',
        hours: 12,
        date: 'May 20, 2026',
        assignedBy: 'Col. K. V. Sharma (Unit Commander)'
      },
      {
        id: `vol-${rollUpper}-3`,
        eventTitle: 'Mega Blood Donation & Health Screening Camp',
        clubName: 'NSS Unit & Red Cross',
        hours: 12,
        date: 'March 14, 2026',
        assignedBy: 'Prof. Anitha Rao (Faculty Lead)'
      }
    ]
  };

  const updatedAll = {
    ...all,
    [rollUpper]: defaultRecord
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cmrtc_volunteer_hours_data', JSON.stringify(updatedAll));
    } catch {}
  }

  return defaultRecord;
};

export const assignVolunteerHours = ({ studentRoll = '237R1A05BA', studentName = 'Student Member', eventTitle, clubName = 'NSS Unit CMRTC', hours = 8, assignedBy = 'Faculty Coordinator' }) => {
  if (typeof window === 'undefined') return;

  const all = getStoredVolunteerRecords();
  const rollUpper = studentRoll.toUpperCase();
  const studentRec = all[rollUpper] || {
    studentRoll: rollUpper,
    studentName,
    department: 'CMRTC Student',
    totalHours: 0,
    history: []
  };

  const hoursToAdd = Number(hours);
  const newEntry = {
    id: `vol-${Date.now()}`,
    eventTitle: eventTitle || 'Campus NSS/NCC Event',
    clubName,
    hours: hoursToAdd,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    assignedBy
  };

  const updatedRec = {
    ...studentRec,
    totalHours: studentRec.totalHours + hoursToAdd,
    history: [newEntry, ...(studentRec.history || [])]
  };

  const updatedAll = {
    ...all,
    [rollUpper]: updatedRec
  };

  localStorage.setItem('cmrtc_volunteer_hours_data', JSON.stringify(updatedAll));
  return updatedRec;
};

export const editStudentVolunteerHours = (studentRoll, newTotalHours, reason = 'Admin Adjustment') => {
  if (typeof window === 'undefined') return;

  const all = getStoredVolunteerRecords();
  const rollUpper = studentRoll.toUpperCase();
  const studentRec = all[rollUpper] || {
    studentRoll: rollUpper,
    studentName: 'Student Member',
    department: 'CMRTC Student',
    totalHours: 0,
    history: []
  };

  const updatedRec = {
    ...studentRec,
    totalHours: Number(newTotalHours),
    history: [
      {
        id: `vol-${Date.now()}`,
        eventTitle: `Admin Adjustment: ${reason}`,
        clubName: 'CMRTC Administration',
        hours: Number(newTotalHours) - studentRec.totalHours,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        assignedBy: 'System Administrator'
      },
      ...studentRec.history
    ]
  };

  const updatedAll = {
    ...all,
    [rollUpper]: updatedRec
  };

  localStorage.setItem('cmrtc_volunteer_hours_data', JSON.stringify(updatedAll));
  return updatedRec;
};

export const getStudentMilestones = (totalHours) => {
  return milestoneThresholds.map(m => ({
    ...m,
    unlocked: totalHours >= m.hours
  }));
};
