import { mockClubs, isClubAtMaxCapacity } from './mockClubs';

export const initialRequests = [
  { 
    id: 'req-code-1', 
    name: 'Rahul Sharma', 
    rollNo: '237R1A0512', 
    branch: 'CSE 2nd Yr', 
    clubId: 'codeholics',
    clubName: 'Codeholics Club',
    talent: 'Web Dev & AI', 
    email: 'rahul.s@cmr.edu.in',
    status: 'pending',
    date: 'Yesterday'
  },
  { 
    id: 'req-akriti-1', 
    name: 'Sneha Reddy', 
    rollNo: '237R1A0445', 
    branch: 'ECE 3rd Yr', 
    clubId: 'akriti',
    clubName: 'AKRITI Club',
    talent: 'Classical Dance', 
    email: 'sneha.r@cmr.edu.in',
    status: 'pending',
    date: '2 days ago'
  },
  { 
    id: 'req-ncc-1', 
    name: 'Aditya Teja', 
    rollNo: '217R1A0577', 
    branch: 'CSE 4th Yr', 
    clubId: 'ncc',
    clubName: 'NCC Unit',
    talent: 'Drill & Parade', 
    email: 'aditya.t@cmr.edu.in',
    status: 'pending',
    date: '3 days ago'
  },
  { 
    id: 'req-photo-1', 
    name: 'Kavya Reddy', 
    rollNo: '237R1A0512', 
    branch: 'AIML 2nd Yr', 
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    talent: 'DSLR Cinematography', 
    email: 'kavya.r@cmr.edu.in',
    status: 'pending',
    date: '4 days ago'
  },
  { 
    id: 'req-nss-1', 
    name: 'Priyanka Rao', 
    rollNo: '227R1A1208', 
    branch: 'IT 3rd Yr', 
    clubId: 'nss',
    clubName: 'NSS Unit',
    talent: 'Community Service & Drives', 
    email: 'priyanka.r@cmr.edu.in',
    status: 'pending',
    date: '5 days ago'
  }
];

export const getStoredRequests = () => {
  if (typeof window === 'undefined') return initialRequests;
  const stored = localStorage.getItem('cmrtc_club_member_requests');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialRequests;
    }
  }
  return initialRequests;
};

export const CLUB_MAX_LIMIT = 50;
export const MAX_CLUBS_PER_STUDENT = 2;

export const saveRequest = (newRequest) => {
  if (typeof window === 'undefined') return { success: true };
  
  // Check if club is already at maximum capacity of 50 members
  if (isClubAtMaxCapacity(newRequest.clubId)) {
    const club = mockClubs.find(c => c.id === newRequest.clubId);
    return {
      success: false,
      error: `Registration Closed: ${club?.name || 'This club'} has reached its maximum capacity of 50 members.`
    };
  }

  const current = getStoredRequests();
  const studentRollUpper = (newRequest.rollNo || '').toUpperCase();
  const studentEmailLower = (newRequest.email || '').toLowerCase();

  // Check how many clubs this student has already joined or applied for
  const studentActiveClubs = current.filter(r => {
    const isSameStudent = 
      (r.rollNo && r.rollNo.toUpperCase() === studentRollUpper) || 
      (r.email && r.email.toLowerCase() === studentEmailLower);
    const isApprovedOrPending = r.status === 'approved' || r.status === 'pending';
    return isSameStudent && isApprovedOrPending && r.clubId !== newRequest.clubId;
  });

  if (studentActiveClubs.length >= MAX_CLUBS_PER_STUDENT) {
    return {
      success: false,
      error: `Membership Limit: You can only join a maximum of ${MAX_CLUBS_PER_STUDENT} campus clubs.`
    };
  }

  // Avoid duplicate rollNo for same club
  const exists = current.some(
    r => (r.rollNo?.toUpperCase() === studentRollUpper || (r.email && r.email.toLowerCase() === studentEmailLower)) && r.clubId === newRequest.clubId
  );
  let updated;
  if (exists) {
    updated = current.map(r => 
      ((r.rollNo?.toUpperCase() === studentRollUpper || (r.email && r.email.toLowerCase() === studentEmailLower)) && r.clubId === newRequest.clubId) 
        ? { ...r, ...newRequest, status: 'pending' } 
        : r
    );
  } else {
    updated = [newRequest, ...current];
  }
  localStorage.setItem('cmrtc_club_member_requests', JSON.stringify(updated));
  return { success: true, data: updated };
};

export const updateRequestStatus = (id, newStatus) => {
  if (typeof window === 'undefined') return;
  const current = getStoredRequests();
  const targetReq = current.find(r => r.id === id);

  if (newStatus === 'approved' && targetReq) {
    const club = mockClubs.find(c => c.id === targetReq.clubId);
    if ((club?.membersCount || 0) >= CLUB_MAX_LIMIT) {
      return {
        success: false,
        error: `Cannot approve: ${club.name} is already full with 50/50 members.`
      };
    }
    if (club) {
      club.membersCount = Math.min(CLUB_MAX_LIMIT, (club.membersCount || 0) + 1);
    }
  }

  const updated = current.map(r => r.id === id ? { ...r, status: newStatus } : r);
  localStorage.setItem('cmrtc_club_member_requests', JSON.stringify(updated));
  return { success: true, data: updated };
};

export const getStudentClubStatus = (rollNoOrEmail, clubId) => {
  if (!rollNoOrEmail) return 'none';
  const all = getStoredRequests();
  const match = all.find(
    r => (r.rollNo.toLowerCase() === rollNoOrEmail.toLowerCase() || r.email?.toLowerCase() === rollNoOrEmail.toLowerCase()) && r.clubId === clubId
  );
  return match ? match.status : 'none';
};

export const getApprovedClubsForStudent = (rollNoOrEmail) => {
  if (typeof window === 'undefined') return [];
  const all = getStoredRequests();
  if (!rollNoOrEmail) return [];
  const searchStr = rollNoOrEmail.trim().toLowerCase();
  const approvedFromRequests = all
    .filter(r => 
      r.status === 'approved' && (
        r.rollNo.toLowerCase() === searchStr || 
        (r.email && r.email.toLowerCase() === searchStr)
      )
    )
    .map(r => r.clubId);

  return Array.from(new Set(approvedFromRequests));
};

export const cancelStudentClubRequest = (clubId, rollNoOrEmail) => {
  if (typeof window === 'undefined') return { success: true };
  const current = getStoredRequests();
  const searchStr = (rollNoOrEmail || '').trim().toLowerCase();
  const updated = current.filter(r => {
    if (r.clubId !== clubId) return true;
    const matchRoll = r.rollNo && r.rollNo.toLowerCase() === searchStr;
    const matchEmail = r.email && r.email.toLowerCase() === searchStr;
    return !(matchRoll || matchEmail);
  });
  localStorage.setItem('cmrtc_club_member_requests', JSON.stringify(updated));
  return { success: true, data: updated };
};
