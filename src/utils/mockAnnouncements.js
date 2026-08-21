export const initialAnnouncements = [
  {
    id: 'ann-1',
    clubId: 'akriti',
    club: 'AKRITI Cultural Club',
    title: 'Auditions Open for Pegasus 2026 Annual Cultural Concert!',
    message: 'Dance, Music, and Theatrics auditions will be conducted at Central Quadrangle. Register before Sept 10.',
    details: 'Dance, Music, and Theatrics auditions will be conducted at Central Quadrangle. Register before Sept 10.',
    publisherName: 'Cultural Coordinator (AKRITI)',
    date: 'August 03, 2026 • 11:30 AM',
    urgency: 'High Priority',
    timestamp: Date.now() - 86400000 * 3
  },
  {
    id: 'ann-2',
    clubId: 'codeholics',
    club: 'Codeholics Tech Club',
    title: 'CMR HackFest 2026 36-Hour Hackathon Registrations Open',
    message: 'Gear up for 36 hours of non-stop coding, mentors from top tech giants, and prizes worth ₹1,00,000.',
    details: 'Gear up for 36 hours of non-stop coding, mentors from top tech giants, and prizes worth ₹1,00,000.',
    publisherName: 'Tech Lead (Codeholics)',
    date: 'August 02, 2026 • 02:15 PM',
    urgency: 'Urgent',
    timestamp: Date.now() - 86400000 * 2
  },
  {
    id: 'ann-3',
    clubId: 'nss',
    club: 'NSS Unit CMRTC',
    title: 'Swachh Bharat Cleanliness & Sapling Plantation Drive',
    message: 'Volunteers will earn 8 accredited service credits. Bus departs from Campus Gate 1 at 08:30 AM.',
    details: 'Volunteers will earn 8 accredited service credits. Bus departs from Campus Gate 1 at 08:30 AM.',
    publisherName: 'NSS Faculty Lead',
    date: 'July 28, 2026 • 09:00 AM',
    urgency: 'Normal',
    timestamp: Date.now() - 86400000 * 5
  }
];

export const getStoredAnnouncements = () => {
  if (typeof window === 'undefined') return initialAnnouncements;
  const stored = localStorage.getItem('cmrtc_club_announcements');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Sort newest first
      return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch {
      return initialAnnouncements;
    }
  }
  return initialAnnouncements;
};

export const saveAnnouncement = (newAnn) => {
  if (typeof window === 'undefined') return [];
  const current = getStoredAnnouncements();
  const annWithMeta = {
    ...newAnn,
    id: newAnn.id || `ann-${Date.now()}`,
    timestamp: newAnn.timestamp || Date.now(),
    message: newAnn.message || newAnn.details || '',
    details: newAnn.message || newAnn.details || '',
    publisherName: newAnn.publisherName || newAnn.author || 'Campus Coordinator'
  };
  const updated = [annWithMeta, ...current];
  localStorage.setItem('cmrtc_club_announcements', JSON.stringify(updated));
  return updated;
};

export const deleteAnnouncement = (annId) => {
  if (typeof window === 'undefined') return [];
  const current = getStoredAnnouncements();
  const updated = current.filter(a => a.id !== annId);
  localStorage.setItem('cmrtc_club_announcements', JSON.stringify(updated));
  return updated;
};
