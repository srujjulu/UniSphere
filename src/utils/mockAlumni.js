export const initialAlumniList = [
  {
    id: 'alm-1',
    name: 'Vikram Aditya',
    gradYear: '2023',
    department: 'Computer Science & Engineering',
    club: 'Codeholics Tech Club',
    company: 'Microsoft',
    role: 'Senior Software Engineer',
    linkedin: 'https://linkedin.com/in/vikram-aditya-cmrtc',
    achievements: 'Former President of Codeholics • Winner of Smart India Hackathon 2022 • Published 3 IEEE Papers',
    status: 'verified',
    verifiedBy: 'Dr. Suresh Kumar (HOD CSE)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'alm-2',
    name: 'Pooja Hegde',
    gradYear: '2022',
    department: 'Electronics & Communication Engg',
    club: 'AKRITI Cultural Club',
    company: 'Adobe',
    role: 'Principal Product Designer',
    linkedin: 'https://linkedin.com/in/pooja-hegde-design',
    achievements: 'AKRITI Dance Lead 2021-22 • Gold Medalist in Inter-State Pegasus Showcase • Adobe Design Fellow',
    status: 'verified',
    verifiedBy: 'Prof. Anitha Rao',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'alm-3',
    name: 'Nikhil Varma',
    gradYear: '2024',
    department: 'Computer Science & Engineering',
    club: 'The Lexis Club',
    company: 'Google',
    role: 'AI Systems Researcher',
    linkedin: 'https://linkedin.com/in/nikhil-varma-ai',
    achievements: 'Best Delegate @ National Parliamentary MUN • Founder of CMRTC Debate Society • Google AI Scholar',
    status: 'verified',
    verifiedBy: 'Dr. Suresh Kumar (HOD CSE)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'alm-4',
    name: 'Siddharth Reddy',
    gradYear: '2021',
    department: 'Information Technology',
    club: 'NCC Cadet Corps',
    company: 'ISRO',
    role: 'Satellite Avionics Engineer',
    linkedin: 'https://linkedin.com/in/siddharth-reddy-isro',
    achievements: 'NCC Senior Cadet Captain • Republic Day Parade New Delhi 2020 Commander • ISRO Young Scientist Award',
    status: 'verified',
    verifiedBy: 'Col. K. V. Sharma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'alm-5',
    name: 'Divya Rao',
    gradYear: '2023',
    department: 'Electrical & Electronics Engg',
    club: 'NSS Unit CMRTC',
    company: 'Deloitte Digital',
    role: 'ESG & Sustainability Lead',
    linkedin: 'https://linkedin.com/in/divya-rao-esg',
    achievements: 'Logged 150+ NSS Volunteer Hours • Head Coordinator Swachh Bharat Medchal Drive',
    status: 'pending_verification',
    verifiedBy: 'Pending Faculty Oversight',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  }
];

export const getStoredAlumniList = () => {
  if (typeof window === 'undefined') return initialAlumniList;
  const stored = localStorage.getItem('cmrtc_alumni_network_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialAlumniList;
    }
  }
  return initialAlumniList;
};

export const addAlumniRecord = (newAlumni) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlumniList();
  const item = {
    id: `alm-${Date.now()}`,
    status: 'verified',
    verifiedBy: 'Verified by Admin',
    ...newAlumni
  };
  const updated = [item, ...current];
  localStorage.setItem('cmrtc_alumni_network_data', JSON.stringify(updated));
  return updated;
};

export const updateAlumniRecord = (id, updatedFields) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlumniList();
  const updated = current.map(item => item.id === id ? { ...item, ...updatedFields } : item);
  localStorage.setItem('cmrtc_alumni_network_data', JSON.stringify(updated));
  return updated;
};

export const verifyAlumniRecord = (id, facultyName = 'Faculty Board') => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlumniList();
  const updated = current.map(item => 
    item.id === id 
      ? { ...item, status: 'verified', verifiedBy: facultyName } 
      : item
  );
  localStorage.setItem('cmrtc_alumni_network_data', JSON.stringify(updated));
  return updated;
};

export const deleteAlumniRecord = (id) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlumniList();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem('cmrtc_alumni_network_data', JSON.stringify(updated));
  return updated;
};
