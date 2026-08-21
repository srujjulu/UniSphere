export const getStudentNameByRoll = (rollNo) => {
  if (!rollNo || typeof window === 'undefined') return '';
  const searchRoll = rollNo.trim().toUpperCase();
  
  // 1. Check registered users list
  try {
    const regUsers = JSON.parse(localStorage.getItem('cmrtc_registered_users') || '[]');
    const match = regUsers.find(u => u.rollNo?.toUpperCase() === searchRoll || (u.email && u.email.toUpperCase().startsWith(searchRoll)));
    if (match?.name) return match.name;
  } catch {}

  // 2. Check current logged-in user
  try {
    const authUser = JSON.parse(localStorage.getItem('cmrtc_auth_user') || '{}');
    if (authUser?.rollNo?.toUpperCase() === searchRoll || (authUser?.email && authUser.email.toUpperCase().startsWith(searchRoll))) {
      if (authUser.name) return authUser.name;
    }
  } catch {}

  // 3. Check membership requests
  try {
    const reqs = JSON.parse(localStorage.getItem('cmrtc_club_member_requests') || '[]');
    const matchReq = reqs.find(r => r.rollNo?.toUpperCase() === searchRoll);
    if (matchReq?.name) return matchReq.name;
  } catch {}

  // 4. Check volunteer records
  try {
    const vols = JSON.parse(localStorage.getItem('cmrtc_volunteer_hours_data') || '{}');
    if (vols[searchRoll]?.studentName) return vols[searchRoll].studentName;
  } catch {}

  // 5. Pre-mapped standard demo students
  const demoRoster = {
    '237R1A05BA': 'Srujanya Maringanti',
    '237R1A0512': 'Rahul Sharma',
    '237R1A0445': 'Sneha Reddy',
    '217R1A0577': 'Aditya Teja',
    '227R1A1208': 'Priyanka Rao',
    '237R1A0501': 'Ananya Sharma',
    '227R1A05A1': 'Kavya Verma',
    '217R1A04B2': 'Rohan Teja'
  };
  if (demoRoster[searchRoll]) return demoRoster[searchRoll];

  return '';
};
