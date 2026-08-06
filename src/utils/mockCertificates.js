export const initialCertificates = [
  {
    id: 'cert-1',
    title: 'Certificate of Excellence in Web Development & AI',
    eventName: 'CMR HackFest 2026 36-Hour Hackathon',
    issueDate: 'September 07, 2026',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    studentRoll: '237R1A05BA',
    studentName: 'Student Member',
    status: 'verified',
    verifiedBy: 'Dr. Suresh Kumar (Faculty Coordinator)',
    credentialId: 'CMRTC-2026-CODE-091',
    description: 'Awarded for securing 1st Runner Up position and demonstrating outstanding full-stack AI model integration.'
  },
  {
    id: 'cert-2',
    title: 'Model United Nations Best Delegate Certification',
    eventName: 'Word-Smith Parliamentary Debate & MUN',
    issueDate: 'August 30, 2026',
    clubId: 'lexis',
    clubName: 'The Lexis Club',
    studentRoll: '237R1A05BA',
    studentName: 'Student Member',
    status: 'verified',
    verifiedBy: 'Prof. Anitha Rao (Faculty Coordinator)',
    credentialId: 'CMRTC-2026-LEX-044',
    description: 'Awarded for exemplary diplomatic advocacy and persuasive keynote oratory at CMRTC Model UN.'
  },
  {
    id: 'cert-3',
    title: 'Pegasus 2025 Cultural Fest Performance Honor',
    eventName: 'Pegasus Annual Cultural & Arts Gala',
    issueDate: 'December 15, 2025',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    studentRoll: '237R1A05BA',
    studentName: 'Student Member',
    status: 'verified',
    verifiedBy: 'Dr. Ramesh Chandra (Cultural HOD)',
    credentialId: 'CMRTC-2025-AKR-112',
    description: 'Awarded for winning 1st Prize in Inter-College Group Dance Showcase.'
  },
  {
    id: 'cert-4',
    title: 'National Service Scheme Volunteer Certificate',
    eventName: 'Swachh Bharat & Mega Blood Donation Drive',
    issueDate: 'July 28, 2026',
    clubId: 'nss',
    clubName: 'NSS Unit CMRTC',
    studentRoll: '237R1A05BA',
    studentName: 'Student Member',
    status: 'verified',
    verifiedBy: 'Red Cross Society & NSS Officer',
    credentialId: 'CMRTC-2026-NSS-208',
    description: 'Recognized for logging 8 voluntary service hours and community health drive organization.'
  },
  {
    id: 'cert-5',
    title: 'Insta-Walk Street Photography Award',
    eventName: 'F9 Film & Photo Contest 2026',
    issueDate: 'June 10, 2026',
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    studentRoll: '237R1A0512',
    studentName: 'Rahul Sharma',
    status: 'pending_verification',
    verifiedBy: 'Pending Faculty Oversight',
    credentialId: 'CMRTC-2026-PH-304',
    description: 'Awarded for capturing top-voted candidate portraiture during the campus photowalk.'
  },
  {
    id: 'cert-6',
    title: 'NCC Annual Training Camp Honor Certificate',
    eventName: 'Republic Day Parade Drills & Rifle Training',
    issueDate: 'May 20, 2026',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps CMRTC',
    studentRoll: '217R1A0577',
    studentName: 'Aditya Teja',
    status: 'verified',
    verifiedBy: 'Col. K. V. Sharma (Unit Commander)',
    credentialId: 'CMRTC-2026-NCC-007',
    description: 'Awarded for discipline, drill leadership, and top physical endurance scores.'
  }
];

export const getStoredCertificates = () => {
  if (typeof window === 'undefined') return initialCertificates;
  const stored = localStorage.getItem('cmrtc_certificates_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialCertificates;
    }
  }
  return initialCertificates;
};

export const saveCertificate = (newCert) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCertificates();
  const updated = [newCert, ...current];
  localStorage.setItem('cmrtc_certificates_data', JSON.stringify(updated));
  return updated;
};

export const verifyCertificate = (id, facultyName = 'Faculty Coordinator') => {
  if (typeof window === 'undefined') return;
  const current = getStoredCertificates();
  const updated = current.map(c => 
    c.id === id ? { ...c, status: 'verified', verifiedBy: facultyName } : c
  );
  localStorage.setItem('cmrtc_certificates_data', JSON.stringify(updated));
  return updated;
};

export const revokeCertificate = (id) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCertificates();
  const updated = current.map(c => 
    c.id === id ? { ...c, status: 'revoked' } : c
  );
  localStorage.setItem('cmrtc_certificates_data', JSON.stringify(updated));
  return updated;
};

export const getStudentCertificates = (rollNoOrEmail) => {
  const all = getStoredCertificates();
  if (!rollNoOrEmail) return all;
  const search = rollNoOrEmail.trim().toLowerCase();
  return all.filter(c => 
    c.studentRoll.toLowerCase() === search || 
    c.studentRoll === 'ALL' || 
    c.studentRoll === '237R1A05BA' ||
    (c.email && c.email.toLowerCase() === search)
  );
};
