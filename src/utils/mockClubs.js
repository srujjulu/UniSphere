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
    membersCount: 142
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
    membersCount: 98
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
    membersCount: 115
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
    membersCount: 210
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
    membersCount: 350
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
    membersCount: 180
  }
];

export const getStoredClubs = () => {
  if (typeof window === 'undefined') return mockClubs;
  const stored = localStorage.getItem('cmrtc_clubs_views');
  if (stored) {
    try {
      const parsedViews = JSON.parse(stored);
      return mockClubs.map((club) => ({
        ...club,
        views: parsedViews[club.id] !== undefined ? parsedViews[club.id] : club.views,
      }));
    } catch (e) {
      return mockClubs;
    }
  }
  return mockClubs;
};

export const incrementClubViews = (clubId) => {
  if (typeof window === 'undefined') return 0;

  // Check if this user/device has already viewed/joined this club
  let viewedList = [];
  try {
    const viewedStored = localStorage.getItem('cmrtc_user_viewed_clubs');
    if (viewedStored) viewedList = JSON.parse(viewedStored);
  } catch (e) {}

  const currentClub = mockClubs.find((c) => c.id === clubId);
  const storedViews = localStorage.getItem('cmrtc_clubs_views');
  let viewsObj = {};
  if (storedViews) {
    try { viewsObj = JSON.parse(storedViews); } catch (e) {}
  }

  const baseViews = currentClub ? currentClub.views : 0;
  const currentViews = viewsObj[clubId] !== undefined ? viewsObj[clubId] : baseViews;

  // If user already viewed this club, don't increment again
  if (viewedList.includes(clubId)) {
    return currentViews;
  }

  // Unique new visitor for this club!
  const newViews = currentViews + 1;
  viewsObj[clubId] = newViews;
  localStorage.setItem('cmrtc_clubs_views', JSON.stringify(viewsObj));

  // Mark this club as viewed by current user
  viewedList.push(clubId);
  localStorage.setItem('cmrtc_user_viewed_clubs', JSON.stringify(viewedList));

  if (currentClub) {
    currentClub.views = newViews;
  }
  return newViews;
};
