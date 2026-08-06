import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Trophy, 
  Users, 
  Music, 
  Crown, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  Settings, 
  Mail, 
  LogOut, 
  Sparkles, 
  Code,
  Camera,
  BookOpen,
  Shield,
  Heart,
  MapPin,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import { mockClubs } from '../utils/mockClubs';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

const clubSocialLinks = {
  akriti: {
    instagram: 'https://instagram.com/akriti_cultural_cmrtc',
    youtube: 'https://youtube.com/@AkritiCulturalCMRTC'
  },
  codeholics: {
    instagram: 'https://instagram.com/codeholics_cmrtc',
    youtube: 'https://youtube.com/@CodeholicsCMRTC'
  },
  ncc: {
    instagram: 'https://instagram.com/ncc_unit_cmrtc',
    youtube: 'https://youtube.com/@NccCadetsCMRTC'
  },
  photography: {
    instagram: 'https://instagram.com/film_photo_cmrtc',
    youtube: 'https://youtube.com/@FilmPhotoCMRTC'
  },
  lexis: {
    instagram: 'https://instagram.com/lexis_club_cmrtc',
    youtube: 'https://youtube.com/@LexisLiteraryCMRTC'
  },
  nss: {
    instagram: 'https://instagram.com/nss_unit_cmrtc',
    youtube: 'https://youtube.com/@NssServiceCMRTC'
  }
};
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../utils/clubLogos';
import Toast from '../components/ui/Toast';
import MoviePromotionsModal from '../components/dashboard/MoviePromotionsModal';
import CoreMembersModal from '../components/dashboard/CoreMembersModal';
import SponsorsModal from '../components/dashboard/SponsorsModal';
import HackathonsModal from '../components/dashboard/HackathonsModal';
import PhotoWalksModal from '../components/dashboard/PhotoWalksModal';
import MunDebatesModal from '../components/dashboard/MunDebatesModal';
import BloodDrivesModal from '../components/dashboard/BloodDrivesModal';
import ParadeDrillsModal from '../components/dashboard/ParadeDrillsModal';
import ExploreEventsModal from '../components/dashboard/ExploreEventsModal';

import { useAuth } from '../context/AuthContext';
import { getStudentClubStatus, getApprovedClubsForStudent } from '../utils/mockRequests';

// Club Member Dashboard Themes & Data Config
const dashboardClubConfigs = {
  akriti: {
    name: 'AKRITI Club',
    bannerGradient: 'bg-gradient-to-r from-[#ED1C24] via-[#E11D48] to-[#FF5E62]',
    primaryColor: '#ED1C24',
    accentBorder: 'border-red-200',
    accentBg: 'bg-red-50',
    accentText: 'text-[#ED1C24]',
    tagBg: 'bg-red-500/10 text-[#ED1C24]',
    subtitle: "Ready to showcase your talent? Explore upcoming events, connect with fellow artists, and be part of AKRITI's vibrant cultural community.",
    talentLabel: 'Dance & Cultural Arts',
    talentIcon: Music,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Movie Promotions', icon: Sparkles },
      { id: 'p3', label: 'Core Members', icon: Users },
      { id: 'p4', label: 'Our Sponsors', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'Pegasus 2026', date: 'December 15-17, 2026 • 09:30 AM', venue: 'CMRTC Main Auditorium', tag: 'Inter-College Fest', desc: 'The flagship annual cultural fest of CMRTC featuring dance battles, fashion shows, and musical nights.', seats: '420/500 Registered', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' },
      { id: 'e2', title: 'Choreography & Dance Workshop', date: 'December 10, 2026 • 02:00 PM', venue: 'Dance Studio (Room 204)', tag: 'Training Session', desc: 'Master contemporary and hip-hop dance routines with celebrity choreographers.', seats: '85/100 Registered', status: 'Confirmed', statusColor: 'bg-[#ED1C24] text-white hover:bg-red-700' },
      { id: 'e3', title: 'Efflorescence Annual Day', date: 'January 20, 2027 • 05:00 PM', venue: 'CMR Open Air Theatre', tag: 'Annual Gala', desc: 'A spectacular evening showcasing theater, instrumental ensembles, and cultural awards.', seats: '310/400 Registered', status: 'Coming Soon', statusColor: 'bg-rose-700 text-white hover:bg-rose-800' },
      { id: 'e4', title: 'Nukkad Natak Street Play', date: 'September 20, 2026 • 11:00 AM', venue: 'Central Campus Quadrangle', tag: 'Street Theater', desc: 'High-energy street theatrical performances highlighting social awareness themes.', seats: '150/150 Registered', status: 'Confirmed', statusColor: 'bg-[#ED1C24] text-white hover:bg-red-700' },
      { id: 'e5', title: 'Canvas Fine Arts Battle', date: 'October 05, 2026 • 10:00 AM', venue: 'Art Gallery Studio', tag: 'Art Contest', desc: 'Live painting and sketching contest on themes of modern canvas storytelling.', seats: '60/80 Registered', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' }
    ],
    activities: [
      { id: 'a1', text: 'Registered for Pegasus 2026', time: '2 hours ago' },
      { id: 'a2', text: 'Completed profile setup', time: '1 day ago' },
      { id: 'a3', text: 'Joined AKRITI Club', time: '1 day ago' }
    ]
  },
  codeholics: {
    name: 'Codeholics Club',
    bannerGradient: 'bg-gradient-to-r from-[#B91C1C] via-[#991B1B] to-[#EF4444]',
    primaryColor: '#EF4444',
    accentBorder: 'border-red-900/30',
    accentBg: 'bg-red-950/20',
    accentText: 'text-[#EF4444]',
    tagBg: 'bg-red-500/10 text-[#EF4444]',
    subtitle: "Ready to build futuristic tech? Explore upcoming hackathons, solve coding challenges, and collaborate on high-impact software projects.",
    talentLabel: 'Web Dev & AI/ML',
    talentIcon: Code,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Hackathons', icon: Code },
      { id: 'p3', label: 'Core Developers', icon: Users },
      { id: 'p4', label: 'Tech Sponsors', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'CMR HackFest 2026', date: 'September 05-07, 2026 • 09:00 AM', venue: 'Tech Lab 4 & Innovation Hub', tag: '36-Hour Hackathon', desc: '36-hour non-stop hackathon with prizes, mentorship, and cloud credits.', seats: '280/300 Registered', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' },
      { id: 'e2', title: 'React v19 & Next.js Masterclass', date: 'October 01, 2026 • 02:00 PM', venue: 'Seminar Hall 2', tag: 'Hands-on Bootcamp', desc: 'Deep dive into React 19 Server Components, Actions, and high-performance Web apps.', seats: '140/150 Registered', status: 'Confirmed', statusColor: 'bg-[#EF4444] text-white hover:bg-red-700' },
      { id: 'e3', title: 'CodeWar Speed Sprints 2026', date: 'November 15, 2026 • 04:00 PM', venue: 'Computer Center A', tag: 'Coding Contest', desc: 'Timed algorithmic problem solving sprint with live leaderboard scoring.', seats: '195/200 Registered', status: 'Coming Soon', statusColor: 'bg-red-700 text-white hover:bg-red-800' },
      { id: 'e4', title: 'AI/ML & LLM Agents Workshop', date: 'December 05, 2026 • 10:00 AM', venue: 'AI Center of Excellence', tag: 'Tech Workshop', desc: 'Build RAG pipelines, fine-tune models, and deploy AI assistants using Python.', seats: '110/120 Registered', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' },
      { id: 'e5', title: 'Web3 & Cybersecurity Sprints', date: 'January 10, 2027 • 11:30 AM', venue: 'Cyber Lab 102', tag: 'CTF Challenge', desc: 'Ethical hacking Capture-The-Flag (CTF) tournament and smart contract security.', seats: '90/100 Registered', status: 'Confirmed', statusColor: 'bg-[#EF4444] text-white hover:bg-red-700' }
    ],
    activities: [
      { id: 'a1', text: 'Submitted project to CMR HackFest', time: '1 hour ago' },
      { id: 'a2', text: 'Earned 100 Coding Points', time: '5 hours ago' },
      { id: 'a3', text: 'Joined Codeholics Club', time: '1 day ago' }
    ]
  },
  ncc: {
    name: 'NCC Cadets Unit',
    bannerGradient: 'bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#0284C7]',
    primaryColor: '#1D4ED8',
    accentBorder: 'border-blue-200',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1D4ED8]',
    tagBg: 'bg-blue-500/10 text-[#1D4ED8]',
    subtitle: "Ready to serve with discipline and honor? Participate in parade drills, national camps, weapons training, and physical fitness tests.",
    talentLabel: 'Parade Drill & Leadership',
    talentIcon: Shield,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Parade Drills', icon: Shield },
      { id: 'p3', label: 'Core Cadets', icon: Users },
      { id: 'p4', label: 'Army Sponsors', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'Independence Day Parade Drill', date: 'August 15, 2026 • 07:00 AM', venue: 'Main Parade Ground', tag: 'National Parade', desc: 'Ceremonial parade drill, flag hoisting, and guard of honor for national celebration.', seats: '210/210 Cadets', status: 'Registration Open', statusColor: 'bg-blue-600 text-white hover:bg-blue-700' },
      { id: 'e2', title: 'Annual Trekking Expedition', date: 'October 10, 2026 • 06:00 AM', venue: 'Ananthagiri Hills Base', tag: 'Adventure Camp', desc: '25km endurance trek, map reading exercises, and outdoor survival skills camp.', seats: '150/160 Registered', status: 'Confirmed', statusColor: 'bg-blue-700 text-white hover:bg-blue-800' },
      { id: 'e3', title: 'Cadet Captain Selection Drill', date: 'November 05, 2026 • 08:00 AM', venue: 'NCC Unit Office Field', tag: 'Selection Drill', desc: 'Leadership assessment, physical efficiency tests, and viva interview for leadership posts.', seats: '45/50 Registered', status: 'Coming Soon', statusColor: 'bg-indigo-700 text-white hover:bg-indigo-800' },
      { id: 'e4', title: 'Republic Day Camp (RDC) Selection', date: 'December 01, 2026 • 07:30 AM', venue: 'Battalion Headquarters', tag: 'State Selection', desc: 'Rigorous drill and cultural selection trials for the prestigious New Delhi RDC Parade.', seats: '30/40 Cadets', status: 'Registration Open', statusColor: 'bg-blue-600 text-white hover:bg-blue-700' }
    ],
    activities: [
      { id: 'a1', text: 'Passed Physical Fitness Test', time: '3 hours ago' },
      { id: 'a2', text: 'Enrolled in Republic Day Camp selection', time: '1 day ago' },
      { id: 'a3', text: 'Joined NCC Cadets Unit', time: '2 days ago' }
    ]
  },
  photography: {
    name: 'Film & Photography Club',
    bannerGradient: 'bg-gradient-to-r from-[#6B21A8] via-[#581C87] to-[#C084FC]',
    primaryColor: '#9333EA',
    accentBorder: 'border-purple-200',
    accentBg: 'bg-purple-50',
    accentText: 'text-[#9333EA]',
    tagBg: 'bg-purple-500/10 text-[#9333EA]',
    subtitle: "Ready to frame the world? Discover photowalks, short film screenings, lighting masterclasses, and video editing workshops.",
    talentLabel: 'DSLR & Cinematography',
    talentIcon: Camera,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Photo Walks', icon: Camera },
      { id: 'p3', label: 'Core Crew', icon: Users },
      { id: 'p4', label: 'Media Partners', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'Short Film Gala 2026', date: 'September 12, 2026 • 05:00 PM', venue: 'Auditorium Hall B', tag: 'Screening Festival', desc: 'Premiere of student short films, documentary showcases, and jury awards night.', seats: '220/250 Registered', status: 'Registration Open', statusColor: 'bg-purple-600 text-white hover:bg-purple-700' },
      { id: 'e2', title: 'Insta-Walk Photo Contest', date: 'November 10, 2026 • 07:00 AM', venue: 'Botanical Gardens & Old City', tag: 'Outdoor Photowalk', desc: 'Guided street photography walk capturing urban life, architecture, and candid moments.', seats: '95/100 Registered', status: 'Confirmed', statusColor: 'bg-purple-700 text-white hover:bg-purple-800' },
      { id: 'e3', title: 'Darkroom & Lightroom Workshop', date: 'December 02, 2026 • 02:00 PM', venue: 'Media Lab B', tag: 'Post-Production', desc: 'Master RAW color grading, portrait retouching, and cinematic preset design.', seats: '60/60 Registered', status: 'Coming Soon', statusColor: 'bg-purple-800 text-white hover:bg-purple-900' },
      { id: 'e4', title: 'Studio Lighting Masterclass', date: 'January 18, 2027 • 10:30 AM', venue: 'Photography Studio 102', tag: 'Hands-on Lab', desc: 'Hands-on practice with softboxes, rim lights, and high-speed sync flash rigs.', seats: '40/45 Registered', status: 'Registration Open', statusColor: 'bg-purple-600 text-white hover:bg-purple-700' }
    ],
    activities: [
      { id: 'a1', text: 'Submitted photo entry to Insta-Walk', time: '4 hours ago' },
      { id: 'a2', text: 'Attended Lighting Masterclass', time: '1 day ago' },
      { id: 'a3', text: 'Joined Film & Photography Club', time: '2 days ago' }
    ]
  },
  lexis: {
    name: 'The Lexis Club',
    bannerGradient: 'bg-gradient-to-r from-[#047857] via-[#065F46] to-[#34D399]',
    primaryColor: '#059669',
    accentBorder: 'border-emerald-200',
    accentBg: 'bg-emerald-50',
    accentText: 'text-[#059669]',
    tagBg: 'bg-emerald-500/10 text-[#059669]',
    subtitle: "Ready to raise your voice? Master public speaking, compete in inter-college debates, Model UN (MUN), and poetry slams.",
    talentLabel: 'Debating & Public Speaking',
    talentIcon: BookOpen,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'MUN Debates', icon: BookOpen },
      { id: 'p3', label: 'Executive Board', icon: Users },
      { id: 'p4', label: 'Literary Partners', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'Inter-College Debate Championship', date: 'August 30, 2026 • 10:00 AM', venue: 'Main Conference Hall', tag: 'Championship', desc: 'Parliamentary debate tournament with topics spanning global policy, tech ethics, and economics.', seats: '110/120 Registered', status: 'Registration Open', statusColor: 'bg-emerald-600 text-white hover:bg-emerald-700' },
      { id: 'e2', title: 'Word-Smith Poetry Slam', date: 'October 05, 2026 • 05:30 PM', venue: 'Student Ampitheatre', tag: 'Open Mic Night', desc: 'A night of original spoken word poetry, acoustic tunes, and storytelling performances.', seats: '80/90 Registered', status: 'Confirmed', statusColor: 'bg-emerald-700 text-white hover:bg-emerald-800' },
      { id: 'e3', title: 'CMRTC Model UN (MUN) 2026', date: 'November 20-22, 2026 • 09:00 AM', venue: 'Academic Block 3', tag: 'Diplomatic Summit', desc: '3-day simulation of UN General Assembly committees discussing international security.', seats: '180/200 Registered', status: 'Coming Soon', statusColor: 'bg-teal-700 text-white hover:bg-teal-800' },
      { id: 'e4', title: 'Public Speaking & Oratory Seminar', date: 'December 12, 2026 • 02:00 PM', venue: 'Seminar Hall 3', tag: 'Skill Workshop', desc: 'Overcome stage fear, master body language, and deliver persuasive keynote speeches.', seats: '75/80 Registered', status: 'Registration Open', statusColor: 'bg-emerald-600 text-white hover:bg-emerald-700' }
    ],
    activities: [
      { id: 'a1', text: 'Registered for Inter-College Debate', time: '2 hours ago' },
      { id: 'a2', text: 'Submitted poem to Word-Smith Slam', time: '1 day ago' },
      { id: 'a3', text: 'Joined The Lexis Club', time: '3 days ago' }
    ]
  },
  nss: {
    name: 'NSS Service Unit',
    bannerGradient: 'bg-gradient-to-r from-[#D32F2F] via-[#B71C1C] to-[#EF5350]',
    primaryColor: '#DC2626',
    accentBorder: 'border-red-200',
    accentBg: 'bg-red-50',
    accentText: 'text-[#DC2626]',
    tagBg: 'bg-red-500/10 text-[#DC2626]',
    subtitle: "Ready to make a real community impact? Volunteer in blood donation drives, village adoption, Swachh Bharat, and youth leadership camps.",
    talentLabel: 'Community Service & Volunteering',
    talentIcon: Heart,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Blood Drives', icon: Heart },
      { id: 'p3', label: 'Core Volunteers', icon: Users },
      { id: 'p4', label: 'NGO Partners', icon: Award }
    ],
    events: [
      { id: 'e1', title: 'Swachh Bharat Campus Drive', date: 'August 20, 2026 • 08:00 AM', venue: 'CMRTC Campus Grounds', tag: 'Cleanliness Drive', desc: 'Campus-wide eco-cleanliness drive, waste segregation awareness, and plastic audit.', seats: '180/200 Volunteers', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' },
      { id: 'e2', title: 'Mega Blood Donation Camp', date: 'October 12, 2026 • 09:00 AM', venue: 'College Health Center', tag: 'Health Drive', desc: 'Organized in partnership with Red Cross Society with donor certificates and health checkups.', seats: '250 Donor Pledges', status: 'Confirmed', statusColor: 'bg-red-700 text-white hover:bg-red-800' },
      { id: 'e3', title: 'Annual Village Adoption Camp', date: 'December 15-21, 2026 • 7 Days', venue: 'Medchal Rural Mandal', tag: 'Special Camp', desc: '7-day residential camp focusing on rural literacy, health surveys, and solar lamp distribution.', seats: '50 Selected Volunteers', status: 'Coming Soon', statusColor: 'bg-rose-800 text-white hover:bg-rose-900' },
      { id: 'e4', title: 'Haritha Haram Tree Plantation', date: 'September 25, 2026 • 09:30 AM', venue: 'Campus Eco Park', tag: 'Green Initiative', desc: 'Planting 500 saplings across campus with geotagging for long-term growth monitoring.', seats: '120 Volunteers', status: 'Registration Open', statusColor: 'bg-red-600 text-white hover:bg-red-700' }
    ],
    activities: [
      { id: 'a1', text: 'Volunteered for Swachh Bharat Drive', time: '3 hours ago' },
      { id: 'a2', text: 'Pledged blood donation for health drive', time: '1 day ago' },
      { id: 'a3', text: 'Joined NSS Service Unit', time: '2 days ago' }
    ]
  }
};

const getClubLogoSvg = (clubId) => {
  switch (clubId) {
    case 'akriti':
      return <AkritiLogo />;
    case 'codeholics':
      return <CodeClubLogo />;
    case 'photography':
      return <PhotoClubLogo />;
    case 'lexis':
      return <EcoClubLogo />;
    case 'ncc':
      return <DesignClubLogo />;
    case 'nss':
      return <NssLogo />;
    default:
      return <CodeClubLogo />;
  }
};

const ClubMemberDashboardPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const clubData = mockClubs.find((c) => c.id === clubId) || mockClubs[0];
  const rawConfig = dashboardClubConfigs[clubId];
  const config = rawConfig || {
    name: `${clubData.name} Club`,
    bannerGradient: 'bg-gradient-to-r from-[#ED1C24] via-[#E11D48] to-[#FF5E62]',
    primaryColor: '#ED1C24',
    accentBorder: 'border-red-200',
    accentBg: 'bg-red-50',
    accentText: 'text-[#ED1C24]',
    tagBg: 'bg-red-500/10 text-[#ED1C24]',
    subtitle: `Ready to showcase your talent? Explore upcoming events, connect with fellow members, and be part of ${clubData.name}'s vibrant community.`,
    talentLabel: clubData.subtitle || 'Student Member',
    talentIcon: Music,
    actionPills: [
      { id: 'p1', label: 'Explore Events', icon: Sparkles },
      { id: 'p2', label: 'Club Activities', icon: Sparkles },
      { id: 'p3', label: 'Core Members', icon: Users },
      { id: 'p4', label: 'Our Sponsors', icon: Award }
    ],
    events: (clubData.events && clubData.events.length > 0)
      ? clubData.events.map((e, idx) => ({
          id: e.id || `e${idx}`,
          title: e.title,
          date: e.date,
          tag: 'Campus Event',
          status: idx === 0 ? 'Registration Open' : idx === 1 ? 'Confirmed' : 'Coming Soon',
          statusColor: 'bg-[#ED1C24] text-white hover:bg-red-700'
        }))
      : [
          { id: 'e1', title: `${clubData.name} Annual Meet`, date: 'December 15, 2026', tag: 'Annual Event', status: 'Registration Open', statusColor: 'bg-[#ED1C24] text-white' },
          { id: 'e2', title: 'Interactive Workshop', date: 'December 10, 2026', tag: 'Training Session', status: 'Confirmed', statusColor: 'bg-[#ED1C24] text-white' },
          { id: 'e3', title: 'Community Showcase', date: 'January 20, 2027', tag: 'Celebration', status: 'Coming Soon', statusColor: 'bg-rose-700 text-white' }
        ],
    activities: [
      { id: 'a1', text: `Registered for ${clubData.name} events`, time: '2 hours ago' },
      { id: 'a2', text: 'Completed profile setup', time: '1 day ago' },
      { id: 'a3', text: `Joined ${clubData.name} Club`, time: '1 day ago' }
    ]
  };
  const TalentIcon = config.talentIcon || Music;

  const clubSocials = clubSocialLinks[clubId] || {
    instagram: `https://instagram.com/${clubId}_cmrtc`,
    youtube: `https://youtube.com/@${clubData.name.replace(/\s+/g, '')}CMRTC`
  };

  const { user, isCoordinator } = useAuth();
  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';
  const studentName = user?.name || 'Student Member';

  const memberStatus = getStudentClubStatus(studentRoll, clubData.id);
  const isApprovedMember = memberStatus === 'approved' || clubData.id === 'akriti';

  const [activeTab, setActiveTab] = useState('Overview');
  const [isExploreEventsOpen, setIsExploreEventsOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isMoviePromotionsOpen, setIsMoviePromotionsOpen] = useState(false);
  const [isCoreMembersOpen, setIsCoreMembersOpen] = useState(false);
  const [isSponsorsOpen, setIsSponsorsOpen] = useState(false);
  const [isHackathonsOpen, setIsHackathonsOpen] = useState(false);
  const [isPhotoWalksOpen, setIsPhotoWalksOpen] = useState(false);
  const [isMunDebatesOpen, setIsMunDebatesOpen] = useState(false);
  const [isBloodDrivesOpen, setIsBloodDrivesOpen] = useState(false);
  const [isParadeDrillsOpen, setIsParadeDrillsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleEventRegister = (evt, forceStatus) => {
    const isReg = forceStatus !== undefined ? forceStatus : !registeredEvents.includes(evt.id);
    if (isReg) {
      if (!registeredEvents.includes(evt.id)) {
        setRegisteredEvents((prev) => [...prev, evt.id]);
      }
      addToast(`🎉 Successfully registered for ${evt.title}!`, 'success');
    } else {
      setRegisteredEvents((prev) => prev.filter((id) => id !== evt.id));
      addToast(`Cancelled registration for ${evt.title}`, 'info');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans select-none pb-12">
      <Toast toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Header Navbar */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        {/* Left Logo & Portal Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/club/${clubData.id}`)}>
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5">
            {getClubLogoSvg(clubData.id)}
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              {config.name}
            </h1>
            <p className="text-[11px] font-semibold text-[#ED1C24] mt-0.5 flex items-center gap-1">
              <span>UniSphere Member Dashboard</span>
            </p>
          </div>
        </div>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-slate-400">
            <button 
              onClick={() => addToast(`${config.name} Member Portal Settings`, 'info')}
              className="hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => addToast(`Contact Mailbox: ${clubId}@cmr.edu.in`, 'info')}
              className="hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Mailbox"
            >
              <Mail size={18} />
            </button>

            
            {/* Active Instagram Link */}
            <a
              href={clubSocials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-center"
              title={`Visit Official ${config.name} Instagram Page`}
              onClick={() => addToast(`Opening Official ${config.name} Instagram... 📸`, 'info')}
            >
              <InstagramIcon size={18} />
            </a>

            {/* Active YouTube Link */}
            <a
              href={clubSocials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-center"
              title={`Visit Official ${config.name} YouTube Channel`}
              onClick={() => addToast(`Opening Official ${config.name} YouTube Channel... 🎥`, 'info')}
            >
              <YoutubeIcon size={18} />
            </a>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3 py-1">
            <div className={`w-8 h-8 rounded-full ${config.bannerGradient} text-white font-black text-sm flex items-center justify-center shadow-sm`}>
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left leading-none">
              <p className="text-xs font-bold text-slate-900">{studentName}</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{studentRoll}</p>
            </div>
            <button
              onClick={() => {
                addToast('Signed out of member portal', 'info');
                navigate(`/club/${clubData.id}/signin`);
              }}
              className="ml-1 text-slate-400 hover:text-red-600 cursor-pointer transition-colors p-1"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex-1 flex flex-col gap-6">

        {/* 1. Red / Club Themed Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${config.bannerGradient} rounded-[28px] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden`}
        >
          <div className="max-w-2xl space-y-2 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs tracking-wider uppercase backdrop-blur-md border border-white/30 flex items-center gap-1.5">
                {isApprovedMember ? 'Verified Active Member ✔' : memberStatus === 'pending' ? 'Application Pending Approval ⏳' : 'Student Member'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>Welcome back, {studentName}!</span> 👋
            </h2>
            <p className="text-sm sm:text-base font-medium opacity-95 leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* 4 Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            {config.actionPills.map((pill) => {
              const IconComp = pill.icon;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    const lbl = pill.label.toLowerCase();
                    if (lbl.includes('parade') || lbl.includes('drill')) {
                      setIsParadeDrillsOpen(true);
                    } else if (lbl.includes('blood') || lbl.includes('drive')) {
                      setIsBloodDrivesOpen(true);
                    } else if (lbl.includes('mun') || lbl.includes('debate')) {
                      setIsMunDebatesOpen(true);
                    } else if (lbl.includes('walk') || lbl.includes('photo')) {
                      setIsPhotoWalksOpen(true);
                    } else if (lbl.includes('hackathon') || lbl.includes('sprint') || lbl.includes('code')) {
                      setIsHackathonsOpen(true);
                    } else if (lbl.includes('movie') || lbl.includes('promotion')) {
                      setIsMoviePromotionsOpen(true);
                    } else if (lbl.includes('sponsor') || lbl.includes('partner')) {
                      setIsSponsorsOpen(true);
                    } else if (lbl.includes('core') || lbl.includes('member') || lbl.includes('cadet') || lbl.includes('volunteer') || lbl.includes('crew') || lbl.includes('developer') || lbl.includes('board')) {
                      setIsCoreMembersOpen(true);
                    } else if (lbl.includes('event')) {
                      setIsExploreEventsOpen(true);
                      setActiveTab('Events');
                    } else {
                      setIsParadeDrillsOpen(true);
                    }
                  }}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <IconComp size={15} />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 2. 4 Stat Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Upcoming Events */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{config.events.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Calendar size={22} />
            </div>
          </div>

          {/* Card 2: Events Attended */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Events Attended</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{registeredEvents.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Trophy size={22} />
            </div>
          </div>

          {/* Card 3: Community Members */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Community Members</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{clubData.membersCount || 500}+</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={22} />
            </div>
          </div>

          {/* Card 4: Your Talent */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Talent</p>
              <p className="text-base font-bold text-slate-900 mt-1 truncate max-w-[110px]">{config.talentLabel.split('&')[0]}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <TalentIcon size={22} />
            </div>
          </div>
        </div>

        {/* 3. Gold Pro Membership Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-2xl p-5 text-slate-900 shadow-md flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center text-slate-900 font-bold shadow-inner">
              <Crown size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Unlock Pro Membership</h3>
              <p className="text-xs font-semibold text-slate-900/80 mt-0.5">
                Get exclusive benefits, early event access, and premium features
              </p>
            </div>
          </div>
          <button
            onClick={() => addToast('Pro Membership Plans coming soon!', 'info')}
            className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
          >
            👑 View Plans
          </button>
        </div>

        {/* 4. Tabs Navigation (Overview, Events, Profile) */}
        <div className="bg-slate-200/60 p-1 rounded-2xl flex items-center gap-2 max-w-md">
          {['Overview', 'Events', 'Profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 5. 2-Column Content Grid */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Upcoming Events List (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar size={18} className={config.accentText} />
                    <span>Upcoming Events</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Events you can participate in</p>
                </div>
              </div>

              {/* Event Cards Stack */}
              <div className="space-y-3">
                {config.events.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">{evt.title}</h4>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {evt.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px]">
                          {evt.tag}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEventRegister(evt)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 ${
                        registeredEvents.includes(evt.id)
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : evt.statusColor || 'bg-red-600 text-white'
                      }`}
                    >
                      {registeredEvents.includes(evt.id) ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Registered ✔</span>
                        </>
                      ) : (
                        <span>{evt.status}</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* View All Events Button */}
              <button
                onClick={() => setActiveTab('Events')}
                className="w-full py-3 rounded-xl bg-white border border-red-500/80 text-[#ED1C24] font-extrabold text-xs hover:bg-red-50 cursor-pointer transition-all active:scale-95"
              >
                View All Events
              </button>
            </div>

            {/* Right Column: Recent Activity Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 h-fit">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock size={18} className={config.accentText} />
                  <span>Recent Activity</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Your latest actions</p>
              </div>

              {/* Activity items */}
              <div className="space-y-4 pt-2">
                {config.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-slate-800 font-semibold">{act.text}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'Events' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Calendar size={22} className={config.accentText} />
                  <span>All {config.name} Events</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Explore and register for upcoming hackathons, workshops, fests, and cultural showcases.
                </p>
              </div>

              <button
                onClick={() => setIsExploreEventsOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Sparkles size={16} className="text-amber-400" />
                <span>Launch Interactive Explorer</span>
              </button>
            </div>

            {/* Events Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.events.map((evt) => {
                const isReg = registeredEvents.includes(evt.id);
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                          {evt.tag}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin size={13} className="text-red-500" />
                          {evt.venue || 'CMRTC Main Campus'}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-slate-900 leading-snug">
                        {evt.title}
                      </h4>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {evt.desc || `Join the official event hosted by ${config.name}.`}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-700">
                        <Clock size={14} className="text-amber-500" />
                        {evt.date}
                      </span>

                      <button
                        onClick={() => handleEventRegister(evt)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 ${
                          isReg
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : evt.statusColor || 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {isReg ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Registered ✔</span>
                          </>
                        ) : (
                          <>
                            <Ticket size={14} />
                            <span>{evt.status || 'Register Now'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto w-full">
            <div className={`w-20 h-20 rounded-full ${config.bannerGradient} text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg`}>
              D
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Demo User</h3>
            <p className="text-xs text-slate-500">CMRTC Student Member • {config.talentLabel}</p>
          </div>
        )}

        {/* 6. Your Achievements Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Your Achievements</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Milestones you've unlocked</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Milestone 1 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center shadow-sm">
                <Star size={24} />
              </div>
              <p className="text-xs font-bold text-slate-800">New Member</p>
            </div>

            {/* Milestone 2 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center shadow-sm">
                <Calendar size={24} />
              </div>
              <p className="text-xs font-bold text-slate-800">First Event</p>
            </div>

            {/* Milestone 3 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center shadow-sm">
                <TrendingUp size={24} />
              </div>
              <p className="text-xs font-bold text-slate-800">Rising Star</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs font-medium text-slate-400 space-y-1 mt-8 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} {config.name} • UniSphere Portal, CMRTC. All rights reserved.</p>
      </footer>

      {/* Movie Promotions Seat Booking Modal */}
      <MoviePromotionsModal
        isOpen={isMoviePromotionsOpen}
        onClose={() => setIsMoviePromotionsOpen(false)}
        clubName={config.name}
        onBookSuccess={(seats, movie) => {
          addToast(`Successfully booked ${seats.length} seat(s) (${seats.join(', ')}) for ${movie}! 🎟️`, 'success');
        }}
      />

      {/* Core Team Members Modal */}
      <CoreMembersModal
        isOpen={isCoreMembersOpen}
        onClose={() => setIsCoreMembersOpen(false)}
        clubName={config.name}
      />

      {/* Our Valued Sponsors Modal */}
      <SponsorsModal
        isOpen={isSponsorsOpen}
        onClose={() => setIsSponsorsOpen(false)}
        clubName={config.name}
        clubId={clubData.id}
      />

      {/* Hackathons & Tech Sprints Modal */}
      <HackathonsModal
        isOpen={isHackathonsOpen}
        onClose={() => setIsHackathonsOpen(false)}
        clubName={config.name}
      />

      {/* Photo Walks & Gala Modal */}
      <PhotoWalksModal
        isOpen={isPhotoWalksOpen}
        onClose={() => setIsPhotoWalksOpen(false)}
        clubName={config.name}
      />

      {/* MUN Debates & Public Speaking Modal */}
      <MunDebatesModal
        isOpen={isMunDebatesOpen}
        onClose={() => setIsMunDebatesOpen(false)}
        clubName={config.name}
      />

      {/* Blood Donation Drives & Health Camps Modal */}
      <BloodDrivesModal
        isOpen={isBloodDrivesOpen}
        onClose={() => setIsBloodDrivesOpen(false)}
        clubName={config.name}
      />

      {/* NCC Parade Drills & Training Camps Modal */}
      <ParadeDrillsModal
        isOpen={isParadeDrillsOpen}
        onClose={() => setIsParadeDrillsOpen(false)}
        clubName={config.name}
      />

      {/* Explore Events Interactive Modal */}
      <ExploreEventsModal
        isOpen={isExploreEventsOpen}
        onClose={() => setIsExploreEventsOpen(false)}
        clubName={config.name}
        events={config.events}
        onRegister={handleEventRegister}
      />


    </div>
  );
};

export default ClubMemberDashboardPage;
