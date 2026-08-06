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
    id: 'req-lexis-2', 
    name: 'Vikram Singh', 
    rollNo: '227R1A0589', 
    branch: 'CSE 4th Yr', 
    clubId: 'lexis',
    clubName: 'Lexis Club',
    talent: 'Model UN (MUN) & Anchor', 
    email: 'vikram.v@cmr.edu.in',
    status: 'pending',
    date: '3 days ago'
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

export const saveRequest = (newRequest) => {
  if (typeof window === 'undefined') return;
  const current = getStoredRequests();
  // Avoid duplicate rollNo for same club
  const exists = current.some(
    r => r.rollNo.toUpperCase() === newRequest.rollNo.toUpperCase() && r.clubId === newRequest.clubId
  );
  let updated;
  if (exists) {
    updated = current.map(r => 
      (r.rollNo.toUpperCase() === newRequest.rollNo.toUpperCase() && r.clubId === newRequest.clubId) 
        ? { ...r, ...newRequest } 
        : r
    );
  } else {
    updated = [newRequest, ...current];
  }
  localStorage.setItem('cmrtc_club_member_requests', JSON.stringify(updated));
  return updated;
};

export const updateRequestStatus = (id, newStatus) => {
  if (typeof window === 'undefined') return;
  const current = getStoredRequests();
  const updated = current.map(r => r.id === id ? { ...r, status: newStatus } : r);
  localStorage.setItem('cmrtc_club_member_requests', JSON.stringify(updated));
  return updated;
};
