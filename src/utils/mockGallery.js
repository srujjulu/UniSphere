export const clubMasterDrives = {
  akriti: {
    id: 'akriti',
    clubName: 'AKRITI Cultural Club',
    shortName: 'AKRITI Cultural',
    category: 'CULTURAL',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_MasterDrive_CMRTC',
    totalAlbums: 4,
    color: 'from-pink-600 to-rose-600',
    tagBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  },
  codeholics: {
    id: 'codeholics',
    clubName: 'Codeholics Tech Club',
    shortName: 'Codeholics Tech',
    category: 'TECHNICAL',
    driveUrl: 'https://drive.google.com/drive/folders/1Codeholics_MasterDrive_CMRTC',
    totalAlbums: 2,
    color: 'from-blue-600 to-indigo-600',
    tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  photography: {
    id: 'photography',
    clubName: 'Film & Photography Club (FAP)',
    shortName: 'Film & Photo (FAP)',
    category: 'PHOTOGRAPHY',
    driveUrl: 'https://drive.google.com/drive/folders/1FAP_MasterDrive_CMRTC',
    totalAlbums: 3,
    color: 'from-purple-600 to-violet-600',
    tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  lexis: {
    id: 'lexis',
    clubName: 'The Lexis Literary Club',
    shortName: 'The Lexis Club',
    category: 'LITERARY',
    driveUrl: 'https://drive.google.com/drive/folders/1Lexis_MasterDrive_CMRTC',
    totalAlbums: 3,
    color: 'from-emerald-600 to-teal-600',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  ncc: {
    id: 'ncc',
    clubName: 'NCC Cadet Corps',
    shortName: 'NCC Cadet Corps',
    category: 'DEFENCE',
    driveUrl: 'https://drive.google.com/drive/folders/1NCC_MasterDrive_CMRTC',
    totalAlbums: 3,
    color: 'from-amber-600 to-orange-600',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  nss: {
    id: 'nss',
    clubName: 'NSS Service Scheme',
    shortName: 'NSS Service Unit',
    category: 'SERVICE',
    driveUrl: 'https://drive.google.com/drive/folders/1NSS_MasterDrive_CMRTC',
    totalAlbums: 2,
    color: 'from-red-600 to-pink-600',
    tagBg: 'bg-red-500/20 text-red-300 border-red-500/40'
  }
};

export const initialAlbums = [
  {
    id: 'album-akriti-1',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    eventName: 'Pegasus 2026 Mega Cultural Concert',
    eventDate: 'December 15, 2025',
    coverImage: '/images/akriti/akriti-live-concert-stage.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_Pegasus2026_CMRTC',
    uploadedBy: 'AKRITI Coordinator',
    createdAt: '2025-12-16',
    photoCount: 380
  },
  {
    id: 'album-akriti-2',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    eventName: 'Flashmob 2K25 Campus Dance Showcase',
    eventDate: 'January 10, 2025',
    coverImage: '/images/akriti/akriti-flashmob-2k25.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_Flashmob2K25_CMRTC',
    uploadedBy: 'AKRITI Dance Lead',
    createdAt: '2025-01-11',
    photoCount: 195
  },
  {
    id: 'album-akriti-3',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    eventName: 'Grand Raag Musical Night & Fireworks',
    eventDate: 'February 22, 2025',
    coverImage: '/images/akriti/akriti-grand-raag-concert.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_GrandRaag_CMRTC',
    uploadedBy: 'AKRITI Music Wing',
    createdAt: '2025-02-23',
    photoCount: 260
  },
  {
    id: 'album-akriti-4',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    eventName: 'Traditional Cultural Fest & Bathukamma Celebrations',
    eventDate: 'October 18, 2025',
    coverImage: '/images/akriti/akriti-traditional-fest.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1AKRITI_TraditionalFest_CMRTC',
    uploadedBy: 'AKRITI Cultural Secretary',
    createdAt: '2025-10-19',
    photoCount: 310
  },
  {
    id: 'album-codeholics-1',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    eventName: 'CMR HackFest 2026 - Hack The Verse National Hackathon',
    eventDate: 'September 05, 2026',
    coverImage: '/images/codeholics/codeholics-hack-the-verse.png',
    driveUrl: 'https://drive.google.com/drive/folders/1Codeholics_HackTheVerse_CMRTC',
    uploadedBy: 'Codeholics Lead',
    createdAt: '2026-09-06',
    photoCount: 340
  },
  {
    id: 'album-photography-1',
    clubId: 'photography',
    clubName: 'Film & Photography Club (FAP)',
    eventName: 'Graduation Ceremony 2K26 Stage & Class of 2026',
    eventDate: 'May 12, 2026',
    coverImage: '/images/fap/fap-graduation-ceremony-stage.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1FAP_Graduation2026_CMRTC',
    uploadedBy: 'FAP Lead Photographer',
    createdAt: '2026-05-13',
    photoCount: 450
  },
  {
    id: 'album-photography-2',
    clubId: 'photography',
    clubName: 'Film & Photography Club (FAP)',
    eventName: 'Graduation Ceremony 2K26 Degree & Medal Awards',
    eventDate: 'May 12, 2026',
    coverImage: '/images/fap/fap-graduation-ceremony-awards.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1FAP_GraduationAwards2026_CMRTC',
    uploadedBy: 'FAP Media Team',
    createdAt: '2026-05-13',
    photoCount: 320
  },
  {
    id: 'album-photography-3',
    clubId: 'photography',
    clubName: 'Film & Photography Club (FAP)',
    eventName: 'Campus Fest Stage Anchoring & Live Media Shoot',
    eventDate: 'February 15, 2026',
    coverImage: '/images/fap/fap-anchors-stage-event.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1FAP_LiveMediaShoot_CMRTC',
    uploadedBy: 'FAP Cinematographer',
    createdAt: '2026-02-16',
    photoCount: 210
  },
  {
    id: 'album-ncc-1',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps',
    eventName: 'Annual Training Camp (ATC-V) Trophy Ceremony',
    eventDate: 'January 20, 2026',
    coverImage: '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1NCC_ATCTrophy2026_CMRTC',
    uploadedBy: 'NCC SUO',
    createdAt: '2026-01-21',
    photoCount: 220
  },
  {
    id: 'album-ncc-2',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps',
    eventName: 'Candlelight Tribute Vigil at Campus Entrance',
    eventDate: 'April 22, 2025',
    coverImage: '/images/ncc/ncc-candlelight-vigil-entrance.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1NCC_TributeVigil_CMRTC',
    uploadedBy: 'NCC Cadets Wing',
    createdAt: '2025-04-23',
    photoCount: 160
  },
  {
    id: 'album-ncc-3',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps',
    eventName: 'Night Candlelight Memorial March',
    eventDate: 'April 22, 2025',
    coverImage: '/images/ncc/ncc-night-memorial-march.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1NCC_MemorialMarch_CMRTC',
    uploadedBy: 'NCC Sergeant',
    createdAt: '2025-04-23',
    photoCount: 140
  },
  {
    id: 'album-nss-1',
    clubId: 'nss',
    clubName: 'NSS Service Scheme',
    eventName: 'Sustainable Campus Impact Summit & Awards 2026',
    eventDate: 'March 15, 2026',
    coverImage: '/images/nss/nss-sustainable-campus-awards.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1NSS_SustainabilitySummit2026_CMRTC',
    uploadedBy: 'NSS Lead Coordinator',
    createdAt: '2026-03-16',
    photoCount: 310
  },
  {
    id: 'album-nss-2',
    clubId: 'nss',
    clubName: 'NSS Service Scheme',
    eventName: 'Campus Clubs Inauguration & MOU Ceremony',
    eventDate: 'July 10, 2025',
    coverImage: '/images/nss/nss-campus-club-inauguration.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1NSS_ClubInauguration_CMRTC',
    uploadedBy: 'NSS Lead',
    createdAt: '2025-07-11',
    photoCount: 185
  },
  {
    id: 'album-lexis-1',
    clubId: 'lexis',
    clubName: 'The Lexis Literary Club',
    eventName: 'Esperanza 2K26 - Mr & Ms Freshers Grand Stage',
    eventDate: 'February 10, 2026',
    coverImage: '/images/lexis/lexis-esperanza-freshers-winners.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1Lexis_Esperanza2026_CMRTC',
    uploadedBy: 'Lexis President',
    createdAt: '2026-02-11',
    photoCount: 290
  },
  {
    id: 'album-lexis-2',
    clubId: 'lexis',
    clubName: 'The Lexis Literary Club',
    eventName: 'Esperanza 2K26 Rampwalk & Cultural Showcase',
    eventDate: 'February 10, 2026',
    coverImage: '/images/lexis/lexis-esperanza-rampwalk.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1Lexis_Rampwalk2026_CMRTC',
    uploadedBy: 'Lexis Media Lead',
    createdAt: '2026-02-11',
    photoCount: 175
  },
  {
    id: 'album-lexis-3',
    clubId: 'lexis',
    clubName: 'The Lexis Literary Club',
    eventName: 'Esperanza 2K26 Faculty & Dignitaries Felicitation',
    eventDate: 'February 10, 2026',
    coverImage: '/images/lexis/lexis-esperanza-faculty-stage.jpg',
    driveUrl: 'https://drive.google.com/drive/folders/1Lexis_Felicitation2026_CMRTC',
    uploadedBy: 'Lexis Secretary',
    createdAt: '2026-02-11',
    photoCount: 210
  }
];

export const getStoredAlbums = () => {
  if (typeof window === 'undefined') return initialAlbums;
  
  // Check versioned storage
  const stored = localStorage.getItem('cmrtc_event_albums_gdrive_v3');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // Auto-migrate legacy storage
  const legacyStored = localStorage.getItem('cmrtc_event_albums_gdrive');
  if (legacyStored) {
    try {
      const parsed = JSON.parse(legacyStored);
      if (Array.isArray(parsed)) {
        // Upgrade any unsplash or old images to the official ones
        const updated = parsed.map((album) => {
          if (album.id === 'album-codeholics-1' || album.eventName?.toLowerCase().includes('hackfest') || album.eventName?.toLowerCase().includes('verse')) {
            return {
              ...album,
              eventName: 'CMR HackFest 2026 - Hack The Verse National Hackathon',
              coverImage: '/images/codeholics/codeholics-hack-the-verse.png'
            };
          }
          if (album.id === 'album-akriti-1' && album.coverImage?.includes('unsplash')) {
            return { ...album, coverImage: '/images/akriti/akriti-live-concert-stage.jpg' };
          }
          if (album.id === 'album-photography-1' && album.coverImage?.includes('unsplash')) {
            return { ...album, coverImage: '/images/fap/fap-graduation-ceremony-stage.jpg' };
          }
          if (album.id === 'album-ncc-1' && album.coverImage?.includes('unsplash')) {
            return { ...album, coverImage: '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg' };
          }
          if (album.id === 'album-nss-1' && album.coverImage?.includes('unsplash')) {
            return { ...album, coverImage: '/images/nss/nss-sustainable-campus-awards.jpg' };
          }
          if (album.id === 'album-lexis-1' && album.coverImage?.includes('unsplash')) {
            return { ...album, coverImage: '/images/lexis/lexis-esperanza-freshers-winners.jpg' };
          }
          return album;
        });

        // Ensure full list has all rich albums
        const existingIds = new Set(updated.map((a) => a.id));
        const merged = [...updated, ...initialAlbums.filter((a) => !existingIds.has(a.id))];

        localStorage.setItem('cmrtc_event_albums_gdrive_v3', JSON.stringify(merged));
        localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(merged));
        return merged;
      }
    } catch {
      // fallback to initial
    }
  }

  localStorage.setItem('cmrtc_event_albums_gdrive_v3', JSON.stringify(initialAlbums));
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(initialAlbums));
  return initialAlbums;
};

export const saveNewAlbum = (newAlbum) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlbums();
  const updated = [newAlbum, ...current];
  localStorage.setItem('cmrtc_event_albums_gdrive_v3', JSON.stringify(updated));
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
  localStorage.setItem('cmrtc_event_albums_gdrive_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(updated));
  return updated;
};

export const deleteAlbum = (albumId) => {
  if (typeof window === 'undefined') return;
  const current = getStoredAlbums();
  const updated = current.filter((album) => album.id !== albumId);
  localStorage.setItem('cmrtc_event_albums_gdrive_v3', JSON.stringify(updated));
  localStorage.setItem('cmrtc_event_albums_gdrive', JSON.stringify(updated));
  return updated;
};
