import { mockClubs, isClubAtMaxCapacity } from './mockClubs';

export const initialRequests = [
  { 
    id: 'req-lexis-1', 
    name: 'Student 237R1A05BA', 
    rollNo: '237R1A05BA', 
    branch: 'CSE 2nd Yr', 
    clubId: 'lexis',
    clubName: 'Lexis Club',
    talent: 'Debating & Public Speaking', 
    email: '237r1a05ba@cmr.edu.in',
    status: 'pending',
    date: 'Today'
  },
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
  // Avoid duplicate rollNo for same club
  const exists = current.some(
    r => r.rollNo.toUpperCase() === newRequest.rollNo.toUpperCase() && r.clubId === newRequest.clubId
  );
  let updated;
  if (exists) {
    updated = current.map(r => 
      (r.rollNo.toUpperCase() === newRequest.rollNo.toUpperCase() && r.clubId === newRequest.clubId) 
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
  if (typeof window === 'undefined') return ['akriti'];
  const all = getStoredRequests();
  if (!rollNoOrEmail) return ['akriti'];
  const searchStr = rollNoOrEmail.trim().toLowerCase();
  const approvedFromRequests = all
    .filter(r => 
      r.status === 'approved' && (
        r.rollNo.toLowerCase() === searchStr || 
        (r.email && r.email.toLowerCase() === searchStr)
      )
    )
    .map(r => r.clubId);

  return Array.from(new Set(['akriti', ...approvedFromRequests]));
};
