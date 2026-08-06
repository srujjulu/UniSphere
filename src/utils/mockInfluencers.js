export const initialInfluencers = [
  {
    id: 'inf-1',
    name: 'Ananya Sharma',
    rollNo: '227R1A05A1',
    branch: 'CSE - 3rd Year',
    clubId: 'akriti',
    domain: 'Dance & Choreography',
    instagram: '@ananya_dances',
    instagramUrl: 'https://instagram.com/ananya_dances',
    youtube: '@AnanyaDanceVlogs',
    youtubeUrl: 'https://youtube.com/@AnanyaDanceVlogs',
    followers: '14.2K',
    subscribers: '8.5K',
    status: 'Available for Auditions',
    bio: 'Classical & Hip-Hop choreographer at CMRTC. Featured in Pegasus 2025 winner roster.'
  },
  {
    id: 'inf-2',
    name: 'Rohan Verma',
    rollNo: '217R1A04B2',
    branch: 'ECE - 4th Year',
    clubId: 'codeholics',
    domain: 'Tech Vlogging & Coding',
    instagram: '@rohan_tech_talks',
    instagramUrl: 'https://instagram.com/rohan_tech_talks',
    youtube: '@CodeWithRohan',
    youtubeUrl: 'https://youtube.com/@CodeWithRohan',
    followers: '22.8K',
    subscribers: '45.1K',
    status: 'Available for Event Promos',
    bio: 'Creates AI & Full Stack tutorials. Organizes campus tech podcasts.'
  },
  {
    id: 'inf-3',
    name: 'Kavya Reddy',
    rollNo: '237R1A0512',
    branch: 'AIML - 2nd Year',
    clubId: 'photography',
    domain: 'Cinematography & Short Films',
    instagram: '@kavya_lens_craft',
    instagramUrl: 'https://instagram.com/kavya_lens_craft',
    youtube: '@KavyaFilmsOfficial',
    youtubeUrl: 'https://youtube.com/@KavyaFilmsOfficial',
    followers: '18.9K',
    subscribers: '12.4K',
    status: 'Available for Auditions',
    bio: 'Short film director & drone operator. Award winner at Hyderabad Student Film Festival.'
  },
  {
    id: 'inf-4',
    name: 'Vikram Singh',
    rollNo: '227R1A0315',
    branch: 'MECH - 3rd Year',
    clubId: 'akriti',
    domain: 'Vocalist & Beatboxing',
    instagram: '@vikram_beats_singh',
    instagramUrl: 'https://instagram.com/vikram_beats_singh',
    youtube: '@VikramUnplugged',
    youtubeUrl: 'https://youtube.com/@VikramUnplugged',
    followers: '9.8K',
    subscribers: '5.2K',
    status: 'Available for Auditions',
    bio: 'Lead vocalist for CMR Music Band. Performs acoustic jams & live beatboxing.'
  },
  {
    id: 'inf-5',
    name: 'Sneha Kulkarni',
    rollNo: '237R1A6604',
    branch: 'CS-DS - 2nd Year',
    clubId: 'lexis',
    domain: 'Public Speaking & Podcast',
    instagram: '@sneha_speaks_out',
    instagramUrl: 'https://instagram.com/sneha_speaks_out',
    youtube: '@SnehaTalksPodcasts',
    youtubeUrl: 'https://youtube.com/@SnehaTalksPodcasts',
    followers: '11.5K',
    subscribers: '7.8K',
    status: 'Available for Hosting',
    bio: 'Model UN Best Delegate & campus event anchor. Hosts "CMR Youth Voices".'
  },
  {
    id: 'inf-6',
    name: 'Aditya Teja',
    rollNo: '217R1A0577',
    branch: 'CSE - 4th Year',
    clubId: 'ncc',
    domain: 'Fitness & Martial Arts',
    instagram: '@aditya_fit_cadet',
    instagramUrl: 'https://instagram.com/aditya_fit_cadet',
    youtube: '@FitCadetAditya',
    youtubeUrl: 'https://youtube.com/@FitCadetAditya',
    followers: '31.4K',
    subscribers: '19.2K',
    status: 'Available for Drills',
    bio: 'NCC Senior Under Officer & Taekwondo Black Belt. Fitness content creator.'
  },
  {
    id: 'inf-7',
    name: 'Priyanka Rao',
    rollNo: '227R1A1208',
    branch: 'IT - 3rd Year',
    clubId: 'nss',
    domain: 'Social Impact & Vlogs',
    instagram: '@priyanka_impact_vlogs',
    instagramUrl: 'https://instagram.com/priyanka_impact_vlogs',
    youtube: '@PriyankaCares',
    youtubeUrl: 'https://youtube.com/@PriyankaCares',
    followers: '15.6K',
    subscribers: '11.0K',
    status: 'Available for Drives',
    bio: 'NSS Lead Volunteer. Drives Swachh Bharat & blood donation awareness videos.'
  }
];

export const getStoredInfluencers = () => {
  if (typeof window === 'undefined') return initialInfluencers;
  const stored = localStorage.getItem('cmrtc_influencers_roster');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialInfluencers;
    }
  }
  return initialInfluencers;
};

export const saveInfluencer = (newInfluencer) => {
  if (typeof window === 'undefined') return;
  const current = getStoredInfluencers();
  const updated = [newInfluencer, ...current];
  localStorage.setItem('cmrtc_influencers_roster', JSON.stringify(updated));
  return updated;
};
