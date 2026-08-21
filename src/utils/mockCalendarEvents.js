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
    id: 'cal-4',
    title: 'CMR HackFest 2026 - Hack The Verse 36-Hour National Hackathon',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Hackathons',
    date: '2026-08-25',
    time: '09:00 AM (36-Hours Non-Stop Coding Sprint)',
    venue: 'Tech Innovation Center & CS Labs 1-4, Block 2',
    seats: '280/300 Hackers',
    maxCapacity: 300,
    initialRegisteredCount: 280,
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    image: '/images/codeholics/codeholics-hack-the-verse.png',
    organizer: {
      name: 'Varun Reddy • Technical Head',
      email: 'codeholics@cmr.edu.in',
      phone: '+91 98480 11223'
    },
    description: 'Flagship 36-hour non-stop national hackathon with Google mentors, AI tracks, Web3 challenges, free cloud credits, and ₹1,00,000 Cash Prize Pool + direct internship offers.'
  },
  {
    id: 'cal-hack-2',
    title: 'Code-Crafters Generative AI & Agent Hackathon 2026',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Hackathons',
    date: '2026-09-08',
    time: '10:00 AM - 06:00 PM (1-Day Sprint)',
    venue: 'AI Research Studio, Lab 301',
    seats: '90/120 Developers',
    maxCapacity: 120,
    initialRegisteredCount: 90,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/codeholics/codeholics-hack-the-verse.png',
    organizer: {
      name: 'Naveen Kumar • Dev Lead',
      email: 'codeholics@cmr.edu.in',
      phone: '+91 98480 33445'
    },
    description: 'Rapid prototyping sprint to build full-stack AI agents using LangChain, Gemini API, and React 19 with ₹25,000 cash prizes.'
  },
  {
    id: 'cal-ncc-1',
    title: 'Annual ATC Obstacle Course & Drill Bootcamp',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps CMRTC',
    category: 'Workshops',
    date: '2026-08-26',
    time: '06:30 AM - 12:30 PM',
    venue: 'CMRTC Parade Grounds & Obstacle Course',
    seats: '75/100 Cadets',
    maxCapacity: 100,
    initialRegisteredCount: 75,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg',
    organizer: {
      name: 'Major S. K. Nair • NCC Officer',
      email: 'ncc@cmr.edu.in',
      phone: '+91 94400 12345'
    },
    description: 'Physical endurance drills, military obstacle course navigation, weapon assembly basics, and team leadership camp.'
  },
  {
    id: 'cal-2',
    title: 'Swachh Bharat Cleanliness & Tree Plantation Drive',
    clubId: 'nss',
    clubName: 'NSS Unit CMRTC',
    category: 'Competitions',
    date: '2026-08-28',
    time: '09:00 AM - 01:00 PM',
    venue: 'Campus Eco Park & Surrounding Mandal',
    seats: '180/200 Volunteers',
    maxCapacity: 200,
    initialRegisteredCount: 180,
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    image: '/images/nss/nss-sustainable-campus-awards.jpg',
    organizer: {
      name: 'Rohan Verma • NSS Student Lead',
      email: 'nss@cmr.edu.in',
      phone: '+91 99881 22334'
    },
    description: 'Voluntary eco-cleanliness drive, waste segregation awareness, and sapling maintenance with active volunteer certificates.'
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
    maxCapacity: 120,
    initialRegisteredCount: 110,
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    image: '/images/lexis/lexis-esperanza-freshers-winners.jpg',
    organizer: {
      name: 'Ananya Sharma • Literary Secretary',
      email: 'lexis@cmr.edu.in',
      phone: '+91 97000 44556'
    },
    description: 'Inter-college parliamentary debate tournament with UN General Assembly simulation committees and diplomacy prize.'
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
    maxCapacity: 100,
    initialRegisteredCount: 85,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/akriti/akriti-live-concert-stage.jpg',
    organizer: {
      name: 'Pooja Hegde • Dance Wing Coordinator',
      email: 'akriti@cmr.edu.in',
      phone: '+91 91234 56789'
    },
    description: 'Master contemporary and urban hip-hop choreography routines with celebrity guest choreographers and showcase entry.'
  },
  {
    id: 'cal-lexis-2',
    title: 'Esperanza 2K26 Creative Writing & Slam Poetry',
    clubId: 'lexis',
    clubName: 'The Lexis Club',
    category: 'Competitions',
    date: '2026-09-16',
    time: '01:30 PM - 05:30 PM',
    venue: 'English Dept Amphitheatre',
    seats: '60/80 Writers',
    maxCapacity: 80,
    initialRegisteredCount: 60,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/lexis/lexis-esperanza-rampwalk.jpg',
    organizer: {
      name: 'Kavya Verma • Editorial Head',
      email: 'lexis@cmr.edu.in',
      phone: '+91 97000 77889'
    },
    description: 'Live slam poetry battle, flash fiction writing contest, and publishing opportunity in the CMRTC Annual Literary Magazine.'
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
    maxCapacity: 50,
    initialRegisteredCount: 45,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/fap/fap-graduation-ceremony-stage.jpg',
    organizer: {
      name: 'Karthik Rao • Lead Cinematographer',
      email: 'fap@cmr.edu.in',
      phone: '+91 90001 98877'
    },
    description: 'Hands-on practice with softboxes, rim lights, RAW color grading, and high-speed sync flash cameras.'
  },
  {
    id: 'cal-nss-2',
    title: 'Mega Campus Blood Donation & Medical Camp 2026',
    clubId: 'nss',
    clubName: 'NSS Unit CMRTC',
    category: 'Competitions',
    date: '2026-09-22',
    time: '09:00 AM - 04:00 PM',
    venue: 'College Gymnasium Hall',
    seats: '350/400 Donors',
    maxCapacity: 400,
    initialRegisteredCount: 350,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/nss/nss-campus-club-inauguration.jpg',
    organizer: {
      name: 'Dr. Suresh Kumar • NSS Program Officer',
      email: 'nss@cmr.edu.in',
      phone: '+91 99881 55667'
    },
    description: 'Annual Red Cross certified voluntary blood donation drive with donor gift hampers and medical certificates.'
  },
  {
    id: 'cal-akriti-2',
    title: 'Raag 2K26 Battle of Campus Bands & Live Music Night',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    category: 'Competitions',
    date: '2026-09-26',
    time: '05:00 PM - 09:30 PM',
    venue: 'CMRTC Open Air Theatre (OAT)',
    seats: '420/500 Passes',
    maxCapacity: 500,
    initialRegisteredCount: 420,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/akriti/akriti-grand-raag-concert.jpg',
    organizer: {
      name: 'Vivek Sharma • Music Lead',
      email: 'akriti@cmr.edu.in',
      phone: '+91 91234 88990'
    },
    description: 'Electrifying inter-college music competition featuring acoustic bands, rock ensembles, and celebrity guest DJ performance.'
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
    maxCapacity: 150,
    initialRegisteredCount: 140,
    status: 'Upcoming',
    registeredStudents: ['237R1A05BA'],
    image: '/images/codeholics/codeholics-hack-the-verse.png',
    organizer: {
      name: 'Naveen Kumar • Dev Coordinator',
      email: 'codeholics@cmr.edu.in',
      phone: '+91 98480 33445'
    },
    description: 'Deep dive into React 19 Server Actions, Next.js App Router, and LLM Agent API integrations with live coding.'
  },
  {
    id: 'cal-photo-2',
    title: 'Monsoon Campus PhotoWalk & Architectural Shoot',
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    category: 'Workshops',
    date: '2026-10-08',
    time: '07:00 AM - 11:30 AM',
    venue: 'Campus Green Belt & Quadrangle',
    seats: '35/40 Photographers',
    maxCapacity: 40,
    initialRegisteredCount: 35,
    status: 'Upcoming',
    registeredStudents: [],
    image: '/images/fap/fap-anchors-stage-event.jpg',
    organizer: {
      name: 'Karthik Rao • Lead Cinematographer',
      email: 'fap@cmr.edu.in',
      phone: '+91 90001 98877'
    },
    description: 'Outdoor photo-walk capturing morning lighting, architecture geometry, macro flora, and portrait storytelling.'
  }
];

export const getStoredCalendarEvents = () => {
  if (typeof window === 'undefined') return initialCalendarEvents;
  const stored = localStorage.getItem('cmrtc_calendar_events_data_v4');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing initial events so all clubs and hackathons are always populated
        const existingIds = new Set(parsed.map(p => p.id));
        const missing = initialCalendarEvents.filter(init => !existingIds.has(init.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch {
      return initialCalendarEvents;
    }
  }

  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(initialCalendarEvents));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(initialCalendarEvents));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(initialCalendarEvents));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(initialCalendarEvents));
  return initialCalendarEvents;
};

export const getEventCapacity = (event) => {
  if (!event) return { max: 100, registered: 0, available: 100, isFull: false, label: '0 / 100 Registered', seatsLeft: '100 Seats Left' };
  
  const max = event.maxCapacity || 100;
  const baseReg = event.initialRegisteredCount || 0;
  const extraReg = (event.registeredStudents?.length || 0);
  const totalReg = Math.min(max, baseReg + (extraReg > 0 ? (extraReg > 1 ? extraReg - 1 : 0) : 0));
  const available = Math.max(0, max - totalReg);
  const isFull = available <= 0;
  
  return {
    max,
    registered: totalReg,
    available,
    isFull,
    label: `${totalReg} / ${max} Registered`,
    seatsLeft: `${available} Seats Left`
  };
};

export const saveCalendarEvent = (newEvent) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCalendarEvents();
  const eventObj = {
    ...newEvent,
    image: newEvent.image || (newEvent.clubId === 'akriti' ? '/images/akriti/akriti-live-concert-stage.jpg' :
      newEvent.clubId === 'photography' ? '/images/fap/fap-graduation-ceremony-stage.jpg' :
      newEvent.clubId === 'lexis' ? '/images/lexis/lexis-esperanza-freshers-winners.jpg' :
      newEvent.clubId === 'ncc' ? '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg' :
      newEvent.clubId === 'nss' ? '/images/nss/nss-sustainable-campus-awards.jpg' :
      '/images/codeholics/codeholics-hack-the-verse.png'),
    maxCapacity: newEvent.maxCapacity || 150,
    initialRegisteredCount: newEvent.initialRegisteredCount || 20,
    organizer: newEvent.organizer || { name: 'Club Coordinator', email: 'clubs@cmr.edu.in', phone: '+91 98765 43210' }
  };
  const updated = [eventObj, ...current];
  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};

export const updateCalendarEventStatus = (eventId, newStatus) => {
  if (typeof window === 'undefined') return;
  const current = getStoredCalendarEvents();
  const updated = current.map(evt => 
    evt.id === eventId ? { ...evt, status: newStatus } : evt
  );
  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};

export const registerStudentForEvent = (eventId, studentRoll) => {
  if (typeof window === 'undefined') return;
  const cleanRoll = (studentRoll || '').trim().toUpperCase();
  const current = getStoredCalendarEvents();
  const updated = current.map(evt => {
    if (evt.id === eventId) {
      const currentList = evt.registeredStudents || [];
      const hasRoll = currentList.some(r => r.toUpperCase() === cleanRoll);
      if (!hasRoll) {
        return { 
          ...evt, 
          registeredStudents: [...currentList, cleanRoll],
          initialRegisteredCount: (evt.initialRegisteredCount || 0) + 1
        };
      }
    }
    return evt;
  });
  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};

export const cancelStudentEventRegistration = (eventId, studentRoll) => {
  if (typeof window === 'undefined') return;
  const cleanRoll = (studentRoll || '').trim().toUpperCase();
  const current = getStoredCalendarEvents();
  const updated = current.map(evt => {
    if (evt.id === eventId) {
      const currentList = evt.registeredStudents || [];
      const filtered = currentList.filter(r => r.toUpperCase() !== cleanRoll);
      return { 
        ...evt, 
        registeredStudents: filtered,
        initialRegisteredCount: Math.max(0, (evt.initialRegisteredCount || 1) - 1)
      };
    }
    return evt;
  });
  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};

export const toggleStudentEventRegistration = (eventId, studentRoll) => {
  if (typeof window === 'undefined') return;
  const cleanRoll = (studentRoll || '').trim().toUpperCase();
  const current = getStoredCalendarEvents();
  const updated = current.map(evt => {
    if (evt.id === eventId) {
      const isRegistered = evt.registeredStudents?.some(r => r.toUpperCase() === cleanRoll);
      const updatedStudents = isRegistered
        ? evt.registeredStudents.filter(r => r.toUpperCase() !== cleanRoll)
        : [...(evt.registeredStudents || []), cleanRoll];
      const newInitial = isRegistered 
        ? Math.max(0, (evt.initialRegisteredCount || 1) - 1)
        : (evt.initialRegisteredCount || 0) + 1;
      return { ...evt, registeredStudents: updatedStudents, initialRegisteredCount: newInitial };
    }
    return evt;
  });
  localStorage.setItem('cmrtc_calendar_events_data_v4', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data_v2', JSON.stringify(updated));
  localStorage.setItem('cmrtc_calendar_events_data', JSON.stringify(updated));
  return updated;
};
