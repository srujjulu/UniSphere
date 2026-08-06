export const initialAlbums = [
  {
    id: 'album-akriti-1',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    eventName: 'Pegasus 2025 Dance Auditions',
    eventDate: 'December 15, 2025',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_Pegasus2025_CMRTC',
    uploadedBy: 'AKRITI Coordinator',
    createdAt: '2025-12-16',
    photoCount: 245
  },
  {
    id: 'album-codeholics-1',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    eventName: 'CMR HackFest 2026 36-Hour Hackathon',
    eventDate: 'September 05, 2026',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1Codeholics_HackFest2026_CMRTC',
    uploadedBy: 'Codeholics Lead',
    createdAt: '2026-09-06',
    photoCount: 180
  },
  {
    id: 'album-photography-1',
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    eventName: 'Campus Sunset Photo Walk 2025',
    eventDate: 'November 20, 2025',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1PhotoClub_SunsetWalk2025_CMRTC',
    uploadedBy: 'Photo Club Lead',
    createdAt: '2025-11-21',
    photoCount: 120
  },
  {
    id: 'album-ncc-1',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps',
    eventName: 'Republic Day Parade Drill 2026',
    eventDate: 'January 26, 2026',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1NCC_RepublicDay2026_CMRTC',
    uploadedBy: 'NCC SUO',
    createdAt: '2026-01-27',
    photoCount: 95
  },
  {
    id: 'album-nss-1',
    clubId: 'nss',
    clubName: 'NSS Service Scheme',
    eventName: 'Mega Blood Donation Drive 2025',
    eventDate: 'October 10, 2025',
    coverImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1NSS_BloodDrive2025_CMRTC',
    uploadedBy: 'NSS Lead',
    createdAt: '2025-10-11',
    photoCount: 110
  },
  {
    id: 'album-lexis-1',
    clubId: 'lexis',
    clubName: 'The Lexis Literary Club',
    eventName: 'CMR Model United Nations (MUN) 2025',
    eventDate: 'October 02, 2025',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    driveUrl: 'https://drive.google.com/drive/folders/1Lexis_MUN2025_CMRTC',
    uploadedBy: 'Lexis President',
    createdAt: '2025-10-03',
    photoCount: 85
  }
];

export const getStoredAlbums = () => {
  if (typeof window === 'undefined') return initialAlbums;
  const stored = localStorage.getItem('cmrtc_event_albums_gdrive');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialAlbums;
    }
  }
  return initialAlbums;
};

export const saveNewAlbum = (newAlbum) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlbums();
  const updated = [newAlbum, ...current];
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(updated));
  return updated;
};

export const updateAlbumDriveLink = (albumId, newDriveUrl, newCoverUrl) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlbums();
  const updated = current.map((album) => {
    if (album.id === albumId) {
      return { 
        ...album, 
        driveUrl: newDriveUrl || album.driveUrl,
        coverImage: newCoverUrl || album.coverImage
      };
    }
    return album;
  });
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(updated));
  return updated;
};

export const deleteAlbum = (albumId) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlbums();
  const updated = current.filter((album) => album.id !== albumId);
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(updated));
  return updated;
};
