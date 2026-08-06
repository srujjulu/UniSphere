export const clubColors = {
  akriti: { bg: 'bg-red-500', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/30', name: 'AKRITI Cultural' },
  codeholics: { bg: 'bg-blue-600', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', name: 'Codeholics Tech' },
  lexis: { bg: 'bg-emerald-600', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', name: 'The Lexis Club' },
  photography: { bg: 'bg-purple-600', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', name: 'Film & Photo' },
  ncc: { bg: 'bg-amber-500', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', name: 'NCC Unit' },
  nss: { bg: 'bg-rose-600', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', name: 'NSS Unit' },
  holiday: { bg: 'bg-slate-700', border: 'border-slate-600', text: 'text-slate-300', badge: 'bg-slate-700 text-slate-300 border-slate-600', name: 'Campus Holiday' }
};

export const initialCalendarEvents = [
  {
    id: 'cal-1',
    title: 'Independence Day Celebrations & Parade',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps CMRTC',
    category: 'Holiday',
    date: '2026-08-15',
    time: '08:00 AM - 12:00 PM',
    venue: 'CMRTC Central Quadrangle',
    seats: 'Campus Wide • Open',
    status: 'Holiday',
    registeredStudents: ['237R1A05BA'],
    description: 'Flag hoisting ceremony, patriotic cultural performances, and senior cadet parade drills.'
  },
  {
    id: 'cal-2',
    title: 'Swachh Bharat Cleanliness Drive',
    clubId: 'nss',
    clubName: 'NSS Unit CMRTC',
    category: 'Competitions',
    date: '2026-08-20',
    time: '09:00 AM - 01:00 PM',
    venue: 'Campus Eco Park & Surrounding Mandal',
    seats: '180/200 Volunteers',
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    description: 'Voluntary eco-cleanliness drive, waste segregation awareness, and sapling maintenance.'
  },
  {
    id: 'cal-3',
    title: 'Word-Smith Parliamentary Debate & MUN',
    clubId: 'lexis',
    clubName: 'The Lexis Club',
    category: 'Competitions',
    date: '2026-08-30',
    time: '10:00 AM - 05:00 PM',
    venue: 'Main Conference Hall (Block 3)',
    seats: '110/120 Delegates',
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    description: 'Inter-college parliamentary debate tournament with UN General Assembly simulation committees.'
  },
  {
    id: 'cal-4',
    title: 'CMR HackFest 2026 36-Hour Hackathon',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Competitions',
    date: '2026-09-05',
    time: '09:00 AM (36-Hours Non-stop)',
    venue: 'Tech Lab 4 & Innovation Center',
    seats: '280/300 Hackers',
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    description: 'Non-stop 36-hour coding sprint with cloud credits, Google mentors, and prize pool of ₹1,00,000.'
  },
  {
    id: 'cal-5',
    title: 'Choreography & Hip-Hop Dance Bootcamp',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    category: 'Workshops',
    date: '2026-09-12',
    time: '02:00 PM - 06:00 PM',
    venue: 'Dance Studio Room 204',
    seats: '85/100 Dance Cadets',
    status: 'Workshops',
    registeredStudents: [],
    description: 'Master contemporary and urban hip-hop choreography routines with celebrity guest choreographers.'
  },
  {
    id: 'cal-6',
    title: 'Studio Lighting & DSLR Masterclass',
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    category: 'Workshops',
    date: '2026-09-18',
    time: '10:30 AM - 03:30 PM',
    venue: 'Media Studio 102',
    seats: '45/50 Creators',
    status: 'Workshops',
    registeredStudents: [],
    description: 'Hands-on practice with softboxes, rim lights, RAW color grading, and high-speed sync flash.'
  },
  {
    id: 'cal-7',
    title: 'Ganesh Chaturthi Campus Festival Holiday',
    clubId: 'holiday',
    clubName: 'CMRTC Campus Administration',
    category: 'Holiday',
    date: '2026-09-25',
    time: 'Full Day',
    venue: 'Campus Closed',
    seats: 'Campus Holiday',
    status: 'Holiday',
    registeredStudents: [],
    description: 'Official college holiday on account of Ganesh Chaturthi festivities.'
  },
  {
    id: 'cal-8',
    title: 'React 19 & Full-Stack AI Masterclass',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Workshops',
    date: '2026-10-01',
    time: '02:00 PM - 05:30 PM',
    venue: 'Seminar Hall 2',
    seats: '140/150 Coders',
    status: 'Workshops',
    registeredStudents: ['237R1A05BA'],
    description: 'Deep dive into React 19 Server Actions, Next.js App Router, and LLM Agent API integrations.'
  },
  {
    id: 'cal-9',
    title: 'Pegasus 2025 Annual Cultural Fest Showcase',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    category: 'Competitions',
    date: '2026-07-15',
    time: '09:30 AM - 08:00 PM',
    venue: 'CMRTC Main Open Air Theatre',
    seats: 'Completed Event',
    status: 'Completed',
    registeredStudents: ['237R1A05BA'],
    description: 'Flagship annual cultural fest featuring dance battles, fashion shows, and musical nights.'
  }
];

export const getStoredCalendarEvents = () => {
  if (typeof window === 'undefined') return initialCalendarEvents;
  const stored = localStorage.getItem('cmrtc_calendar_events_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialCalendarEvents;
    }
  }
  return initialCalendarEvents;
};

export const saveCalendarEvent = (newEvent) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCalendarEvents();
  const updated = [newEvent, ...current];
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};

export const toggleStudentEventRegistration = (eventId, studentRoll) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCalendarEvents();
  const updated = current.map(evt => {
    if (evt.id === eventId) {
      const isRegistered = evt.registeredStudents?.includes(studentRoll);
      const updatedStudents = isRegistered
        ? evt.registeredStudents.filter(r => r !== studentRoll)
        : [...(evt.registeredStudents || []), studentRoll];
      return { ...evt, registeredStudents: updatedStudents };
    }
    return evt;
  });
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};
