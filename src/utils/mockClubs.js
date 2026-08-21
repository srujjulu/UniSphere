export const CLUB_MAX_MEMBERS = 50;

export const mockClubs = [
  {
    id: 'akriti',
    name: 'Akriti',
    subtitle: 'Visual Arts and Drama',
    category: 'Cultural', // Accent: Red
    views: 892,
    established: 2018,
    facultyCoordinator: 'Dr. K. Srinivasa Rao',
    studentLead: 'Aryan Sharma',
    description: 'The creative soul of CMR, Akriti brings together students interested in fine arts, sketching, painting, and theater. We organize annual galleries, set up theatrical productions, and design campus murals.',
    events: [
      { id: 'e1', title: 'Annual Art Exhibition', date: 'Aug 15, 2026' },
      { id: 'e2', title: 'Nukkad Natak Street Play', date: 'Sep 20, 2026' }
    ],
    membersCount: 48,
    maxMembers: 50
  },
  {
    id: 'lexis',
    name: 'The Lexis Club',
    subtitle: 'Language & Literary Club',
    category: 'Literary', // Accent: Green
    views: 654,
    established: 2019,
    facultyCoordinator: 'Mrs. G. Sree Devi',
    studentLead: 'Nikita Iyer',
    description: 'A hub for debaters, writers, poets, and public speakers. Lexis fosters creative expression and verbal excellence through speech contests, Model United Nations (MUN), and poetry slams.',
    events: [
      { id: 'e3', title: 'Inter-College Debate Championship', date: 'Aug 30, 2026' },
      { id: 'e4', title: 'Word-Smith Poetry Slam', date: 'Oct 05, 2026' }
    ],
    membersCount: 42,
    maxMembers: 50
  },
  {
    id: 'photography',
    name: 'Film & Photography',
    subtitle: 'Visual Arts Club',
    category: 'Photography', // Accent: Purple
    views: 732,
    established: 2020,
    facultyCoordinator: 'Mr. P. Ravindra',
    studentLead: 'Varun Reddy',
    description: 'A community of visual storytellers. Whether you capture with a DSLR or a smartphone, our workshops in lighting, cinematography, and post-processing will help you capture life through a beautiful lens.',
    events: [
      { id: 'e5', title: 'Short Film Screening Gala', date: 'Sep 12, 2026' },
      { id: 'e6', title: 'Insta-Walk Photowalk Contest', date: 'Nov 10, 2026' }
    ],
    membersCount: 46,
    maxMembers: 50
  },
  {
    id: 'ncc',
    name: 'NCC',
    subtitle: 'National Cadet Corps',
    category: 'Defence', // Accent: Blue
    views: 1104,
    established: 2017,
    facultyCoordinator: 'Lt. Dr. B. Suresh Kumar',
    studentLead: 'Cadet Captain Rohit Sen',
    description: 'Fostering discipline, leadership, and patriotism. NCC cadets participate in national camps (RDC, TSC), daily parade drills, weapons training, trekking expeditions, and community service drives.',
    events: [
      { id: 'e7', title: 'Independence Day Parade Drill', date: 'Aug 15, 2026' },
      { id: 'e8', title: 'Mega Blood Donation Drive', date: 'Oct 12, 2026' }
    ],
    membersCount: 50,
    maxMembers: 50
  },
  {
    id: 'codeholics',
    name: 'Codeholics',
    subtitle: 'Coding & Tech Club',
    category: 'Technical', // Accent: Orange
    views: 1540,
    established: 2016,
    facultyCoordinator: 'Dr. V. Naresh',
    studentLead: 'Sreya Gupta',
    description: 'The premier coding society of CMR Campus. We host massive hackathons, competitive programming sprints, and hands-on developer bootcamps in Web Dev, AI/ML, and Cybersecurity.',
    events: [
      { id: 'e9', title: 'CMR HackFest 2026', date: 'Sep 05-07, 2026' },
      { id: 'e10', title: 'Advanced React v19 Masterclass', date: 'Oct 01, 2026' }
    ],
    membersCount: 47,
    maxMembers: 50
  },
  {
    id: 'nss',
    name: 'NSS',
    subtitle: 'National Service Scheme',
    category: 'Service', // Accent: Deep Blue / Red
    views: 978,
    established: 2017,
    facultyCoordinator: 'Dr. M. Ramesh Babu',
    studentLead: 'Priya Venkatesh',
    description: 'The National Service Scheme (NSS) unit at CMRTC develops students through community service. NSS volunteers engage in blood donation camps, Swachh Bharat drives, village adoption programs, tree plantation campaigns, and disaster relief awareness.',
    events: [
      { id: 'e11', title: 'Swachh Bharat Campus Drive', date: 'Aug 20, 2026' },
      { id: 'e12', title: 'NSS Annual Special Camp', date: 'Dec 15-21, 2026' }
    ],
    membersCount: 44,
    maxMembers: 50
  }
];

export const isClubAtMaxCapacity = (clubId) => {
  const club = mockClubs.find((c) => c.id === clubId);
  return (club?.membersCount || 0) >= CLUB_MAX_MEMBERS;
};

export const getClubSettings = (clubId) => {
  const defaultClub = mockClubs.find((c) => c.id === clubId);
  const fallback = {
    name: defaultClub?.name || 'Club',
    subtitle: defaultClub?.subtitle || 'Official Campus Student Club',
    recruitment: 'open'
  };

  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(`cmrtc_club_settings_${clubId}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        name: parsed.name || defaultClub?.name || 'Club',
        subtitle: parsed.subtitle || defaultClub?.subtitle || 'Official Campus Student Club',
        recruitment: parsed.recruitment || 'open'
      };
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const saveClubSettings = (clubId, settings) => {
  if (typeof window === 'undefined') return;
  const current = getClubSettings(clubId);
  const updated = {
    ...current,
    ...settings,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(`cmrtc_club_settings_${clubId}`, JSON.stringify(updated));
  return updated;
};

export const isClubRecruitmentOpen = (clubId) => {
  const settings = getClubSettings(clubId);
  return settings.recruitment === 'open';
};

export const getStoredClubs = () => {
  if (typeof window === 'undefined') return mockClubs;
  const stored = localStorage.getItem('cmrtc_clubs_views');
  let parsedViews = {};
  if (stored) {
    try {
      parsedViews = JSON.parse(stored);
    } catch {}
  }

  return mockClubs.map((club) => {
    const customConfig = getClubSettings(club.id);
    return {
      ...club,
      name: customConfig.name || club.name,
      subtitle: customConfig.subtitle || club.subtitle,
      recruitment: customConfig.recruitment || 'open',
      views: parsedViews[club.id] !== undefined ? parsedViews[club.id] : club.views,
    };
  });
};

export const incrementClubViews = (clubId) => {
  if (typeof window === 'undefined') return 0;

  let viewedList = [];
  try {
    const viewedStored = localStorage.getItem('cmrtc_user_viewed_clubs');
    if (viewedStored) viewedList = JSON.parse(viewedStored);
  } catch {}

  const currentClub = mockClubs.find((c) => c.id === clubId);
  const storedViews = localStorage.getItem('cmrtc_clubs_views');
  let viewsObj = {};
  if (storedViews) {
    try { viewsObj = JSON.parse(storedViews); } catch {}
  }

  const baseViews = currentClub ? currentClub.views : 0;
  const currentViews = viewsObj[clubId] !== undefined ? viewsObj[clubId] : baseViews;

  if (viewedList.includes(clubId)) {
    return currentViews;
  }

  const newViews = currentViews + 1;
  viewsObj[clubId] = newViews;
  localStorage.setItem('cmrtc_clubs_views', JSON.stringify(viewsObj));

  viewedList.push(clubId);
  localStorage.setItem('cmrtc_user_viewed_clubs', JSON.stringify(viewedList));

  if (currentClub) {
    currentClub.views = newViews;
  }
  return newViews;
};

export const DEFAULT_SYSTEM_CONFIG = {
  portalName: 'UniSphere - CMRTC Official Student Clubs Portal',
  emailDomain: '@cmr.edu.in',
  academicYear: '2026-2027',
  recruitmentStatus: 'open',
  maintenanceMode: 'live',
  maxUploadLimit: '15'
};

export const getGlobalSystemConfig = () => {
  if (typeof window === 'undefined') return DEFAULT_SYSTEM_CONFIG;
  try {
    const stored = localStorage.getItem('cmrtc_global_system_config');
    if (stored) return { ...DEFAULT_SYSTEM_CONFIG, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SYSTEM_CONFIG;
};

export const saveGlobalSystemConfig = (config) => {
  if (typeof window === 'undefined') return DEFAULT_SYSTEM_CONFIG;
  const current = getGlobalSystemConfig();
  const updated = { ...current, ...config, savedAt: new Date().toISOString() };
  localStorage.setItem('cmrtc_global_system_config', JSON.stringify(updated));

  // If recruitmentStatus changed, update recruitment on all clubs
  if (config.recruitmentStatus) {
    mockClubs.forEach(club => {
      saveClubSettings(club.id, { recruitment: config.recruitmentStatus });
    });
  }

  window.dispatchEvent(new Event('storage'));
  return updated;
};


