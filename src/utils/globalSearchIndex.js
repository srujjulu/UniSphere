import { mockClubs } from './mockClubs';
import { getStoredCalendarEvents } from './mockCalendarEvents';
import { getStoredCertificates } from './mockCertificates';
import { getStoredRequests } from './mockRequests';
import { getStoredVolunteerRecords } from './mockVolunteerHours';

export const mockAnnouncementsList = [
  { id: 'ann-1', title: 'Pegasus 2026 Annual Cultural Fest Registrations Open!', date: 'August 03, 2026', clubName: 'AKRITI Cultural Club', urgency: 'High', type: 'announcement' },
  { id: 'ann-2', title: 'CMR HackFest 2026 36-Hour Hackathon Announced', date: 'August 02, 2026', clubName: 'Codeholics Tech Club', urgency: 'Urgent', type: 'announcement' },
  { id: 'ann-3', title: 'Swachh Bharat Cleanliness Drive at Medchal Mandal', date: 'July 28, 2026', clubName: 'NSS Unit CMRTC', urgency: 'Normal', type: 'announcement' }
];

export const mockGalleryItems = [
  { id: 'gal-1', title: 'Pegasus Dance Auditions 2025 Photo Album', clubName: 'AKRITI Cultural Club', type: 'gallery' },
  { id: 'gal-2', title: 'CMR HackFest Winner Awards Photo Album', clubName: 'Codeholics Tech Club', type: 'gallery' },
  { id: 'gal-3', title: 'NCC Independence Day Parade Drills Album', clubName: 'NCC Cadet Corps', type: 'gallery' },
  { id: 'gal-4', title: 'Blood Donation Camp 2025 Photos', clubName: 'NSS Unit CMRTC', type: 'gallery' }
];

export const queryGlobalSearch = (term = '') => {
  const query = term.trim().toLowerCase();
  if (!query) {
    return {
      clubs: [],
      events: [],
      students: [],
      certificates: [],
      announcements: [],
      gallery: [],
      memberships: []
    };
  }

  // 1. Search Clubs
  const clubs = mockClubs.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.id.toLowerCase().includes(query) ||
    c.subtitle?.toLowerCase().includes(query) ||
    c.category?.toLowerCase().includes(query)
  ).map(c => ({
    id: c.id,
    title: c.name,
    subtitle: c.subtitle || `${c.category} Club`,
    type: 'club',
    link: `/club/${c.id}`
  }));

  // 2. Search Events
  const events = getStoredCalendarEvents().filter(e => 
    e.title.toLowerCase().includes(query) ||
    e.clubName.toLowerCase().includes(query) ||
    e.venue?.toLowerCase().includes(query) ||
    e.category?.toLowerCase().includes(query)
  ).map(e => ({
    id: e.id,
    title: e.title,
    subtitle: `${e.clubName} • ${e.date} (${e.venue})`,
    type: 'event',
    link: '/dashboard'
  }));

  // 3. Search Certificates
  const certificates = getStoredCertificates().filter(c => 
    c.title.toLowerCase().includes(query) ||
    c.eventName.toLowerCase().includes(query) ||
    c.studentRoll.toLowerCase().includes(query) ||
    c.credentialId.toLowerCase().includes(query)
  ).map(c => ({
    id: c.id,
    title: c.title,
    subtitle: `Issued to ${c.studentRoll} (${c.studentName}) • ${c.clubName}`,
    type: 'certificate',
    link: '/dashboard'
  }));

  // 4. Search Students & Volunteer Records
  const volunteerRecords = getStoredVolunteerRecords();
  const students = Object.values(volunteerRecords).filter(s => 
    s.studentName.toLowerCase().includes(query) ||
    s.studentRoll.toLowerCase().includes(query) ||
    s.department?.toLowerCase().includes(query)
  ).map(s => ({
    id: s.studentRoll,
    title: `${s.studentName} (${s.studentRoll})`,
    subtitle: `${s.department} • ${s.totalHours} Volunteer Hours`,
    type: 'student',
    link: '/dashboard'
  }));

  // 5. Search Announcements
  const announcements = mockAnnouncementsList.filter(a => 
    a.title.toLowerCase().includes(query) ||
    a.clubName.toLowerCase().includes(query)
  ).map(a => ({
    id: a.id,
    title: a.title,
    subtitle: `${a.clubName} • ${a.date}`,
    type: 'announcement',
    link: '/dashboard'
  }));

  // 6. Search Gallery
  const gallery = mockGalleryItems.filter(g => 
    g.title.toLowerCase().includes(query) ||
    g.clubName.toLowerCase().includes(query)
  ).map(g => ({
    id: g.id,
    title: g.title,
    subtitle: g.clubName,
    type: 'gallery',
    link: '/dashboard'
  }));

  // 7. Search Memberships & Requests
  const memberships = getStoredRequests().filter(r => 
    r.name.toLowerCase().includes(query) ||
    r.rollNo.toLowerCase().includes(query) ||
    r.clubId.toLowerCase().includes(query) ||
    r.status.toLowerCase().includes(query)
  ).map(r => ({
    id: r.id,
    title: `Membership: ${r.name} (${r.rollNo})`,
    subtitle: `Club: ${r.clubName || r.clubId} • Status: ${r.status.toUpperCase()}`,
    type: 'membership',
    link: '/dashboard'
  }));

  return {
    clubs,
    events,
    certificates,
    students,
    announcements,
    gallery,
    memberships
  };
};
