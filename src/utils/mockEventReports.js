/**
 * UniSphere Campus Portal - Event Report Collection & Management Data Layer
 * Handles structured official event reports, documents, media attachments, and approval workflows.
 */

export const REPORT_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  VERIFIED: 'Verified / Approved',
  CHANGES_REQUESTED: 'Changes Requested'
};

export const statusBadges = {
  'Draft': {
    label: 'Draft',
    icon: '⏳',
    badge: 'bg-amber-500/10 text-amber-600 border border-amber-500/30',
    dot: 'bg-amber-500'
  },
  'Submitted': {
    label: 'Submitted',
    icon: '🟠',
    badge: 'bg-orange-500/10 text-orange-600 border border-orange-500/30',
    dot: 'bg-orange-500'
  },
  'Under Review': {
    label: 'Under Review',
    icon: '🔵',
    badge: 'bg-blue-500/10 text-blue-600 border border-blue-500/30',
    dot: 'bg-blue-500'
  },
  'Verified / Approved': {
    label: 'Verified / Approved',
    icon: '🟢',
    badge: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30',
    dot: 'bg-emerald-500'
  },
  'Changes Requested': {
    label: 'Changes Requested',
    icon: '🔴',
    badge: 'bg-rose-500/10 text-rose-600 border border-rose-500/30',
    dot: 'bg-rose-500'
  }
};

export const initialEventReports = [
  {
    id: 'rep-1',
    reportId: 'CMRTC-ER-2026-001',
    eventId: 'cal-4',
    eventTitle: 'CMR HackFest 2026 - Hack The Verse 36-Hour National Hackathon',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Hackathons',
    academicYear: '2025-2026',
    eventDate: '2026-08-25',
    startTime: '09:00 AM',
    endTime: '09:00 PM (Next Day)',
    venue: 'Room No: 21, Block B (Tech Innovation Center & CS Labs)',
    mode: 'Offline',
    objective: 'To foster problem-solving, rapid software engineering, open-source contribution, and AI agent innovation across 300+ inter-collegiate engineering students.',
    summary: 'CMR HackFest 2026 witnessed 68 teams building live solutions in AI Healthcare, Smart City IoT, FinTech, and Web3 infrastructure with 12 industry mentors from Google and AWS.',
    activities: '1. 36-Hour Non-stop coding sprint\n2. Midnight mentor rounds & architectural code reviews\n3. Keynote on "Next-Gen AI Agents on Cloud" by Google DevRel\n4. Top 10 Grand Final Pitch & Live Demonstrations\n5. Prize Distribution & Placement fast-track offers.',
    chiefGuest: 'Mr. Arvind Swaminathan (Staff AI Architect @ Google Cloud) & Dr. M. J. Sharma (Principal CMRTC)',
    facultyCoordinator: 'Dr. K. Venkat Rao (HOD CSE-AI/ML)',
    participantCount: 280,
    volunteerCount: 32,
    outcome: '18 functional startup MVPs developed. 3 teams received direct seed-stage incubation offers at CMR TBI and ₹1,00,000 cash prizes distributed.',
    highlights: '• 100% cloud credit uptime sponsored by Google Cloud Campus.\n• 4 GitHub open-source repositories trending in regional tech circles.\n• Zero latency high-bandwidth gigabit network sustained across CS Labs 1-4.',
    achievements: 'Winner: Team ByteCrafters (CMRTC CSE) - ₹50,000\nRunner Up: Team Synapse (VNR VJIET) - ₹30,000\nBest Freshers Team: Team AlgoRookies - ₹20,000',
    challenges: 'High demand for specialized GPU instances in the final 6 hours required rapid cloud quota scaling.',
    suggestions: 'Pre-allocate dedicated cloud workstation images with pre-installed Docker containers for the 2027 edition.',
    status: 'Verified / Approved',
    facultyComments: 'Outstanding technical execution and impeccable student coordination. Financial vouchers and attendance sheets verified and approved for NAAC record.',
    submittedBy: 'Varun Reddy (217R1A0588 • Lead Organizer)',
    submittedAt: '2026-08-27T11:30:00Z',
    reviewedBy: 'Dr. K. Venkat Rao',
    reviewedAt: '2026-08-28T14:15:00Z',
    files: [
      { id: 'f-1', category: 'official_report', name: 'Official_Event_Report_CMR_HackFest_2026.pdf', type: 'application/pdf', size: '2.4 MB', uploadedAt: '2026-08-27' },
      { id: 'f-2', category: 'brochure_poster', name: 'HackFest_2026_Official_Brochure.png', type: 'image/png', size: '3.8 MB', url: '/images/codeholics/codeholics-hack-the-verse.png', uploadedAt: '2026-08-27' },
      { id: 'f-3', category: 'attendance_sheet', name: 'Verified_Participant_Attendance_List.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '184 KB', uploadedAt: '2026-08-27' },
      { id: 'f-4', category: 'event_photos', name: 'Hackathon_Opening_Keynote.jpg', type: 'image/jpeg', size: '1.9 MB', url: '/images/codeholics/codeholics-hack-the-verse.png', uploadedAt: '2026-08-27' },
      { id: 'f-5', category: 'permission_letter', name: 'Principal_Permission_Order_HackFest.pdf', type: 'application/pdf', size: '420 KB', uploadedAt: '2026-08-27' },
      { id: 'f-6', category: 'budget_expense', name: 'Consolidated_Audit_Expenditure_Report.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '92 KB', uploadedAt: '2026-08-27' }
    ]
  },
  {
    id: 'rep-2',
    reportId: 'CMRTC-ER-2026-002',
    eventId: 'cal-akriti-2',
    eventTitle: 'Raag 2K26 Battle of Campus Bands & Live Music Night',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    category: 'Competitions',
    academicYear: '2025-2026',
    eventDate: '2026-09-26',
    startTime: '05:00 PM',
    endTime: '10:00 PM',
    venue: 'Open Air Theatre (OAT), Central Quadrangle Block',
    mode: 'Offline',
    objective: 'To provide a mega stage platform for college music artists, instrumentalists, and western/classical fusion bands to compete and perform.',
    summary: 'Over 12 college bands across Hyderabad participated in acoustic, fusion, and hard-rock categories before an enthusiastic audience of 1,200+ students.',
    activities: '1. Classical & semi-classical vocal inaugurals\n2. Solo instrumental battle (Guitar, Drums, Keyboard)\n3. Battle of Bands championship rounds\n4. Celebrity alumni band guest set\n5. Trophy & certificate ceremony.',
    chiefGuest: 'Mr. Vivek Sagar (Renowned Music Director & Composer)',
    facultyCoordinator: 'Dr. Suresh Kumar (Dean Student Affairs)',
    participantCount: 420,
    volunteerCount: 45,
    outcome: 'Promoted cultural talent and campus vibrancy. 4 vocalists scouted for regional studio backing projects.',
    highlights: '• Stunning sound engineering and stadium LED backdrop.\n• Strict discipline and crowd safety managed seamlessly by NCC & student volunteers.',
    achievements: 'Championship Trophy: "The Octaves" Band (CMRTC)\nBest Drummer: Karthik N. (ECE 3rd Year)\nBest Vocalist: Sneha K. (IT 2nd Year)',
    challenges: 'Sound check transitions between 8-piece bands required disciplined backstage stagehand rotation.',
    suggestions: 'Introduce a separate acoustic unplugged stage next year to avoid stage turnover delay.',
    status: 'Verified / Approved',
    facultyComments: 'Phenomenal student turnout with pristine security and strict financial adherence. Approved for Institutional Cultural Archive.',
    submittedBy: 'Pooja Hegde (217R1A05A4 • Cultural Secretary)',
    submittedAt: '2026-09-28T09:20:00Z',
    reviewedBy: 'Dr. Suresh Kumar',
    reviewedAt: '2026-09-29T16:00:00Z',
    files: [
      { id: 'f-21', category: 'official_report', name: 'AKRITI_Raag_2026_Event_Report.pdf', type: 'application/pdf', size: '3.1 MB', uploadedAt: '2026-09-28' },
      { id: 'f-22', category: 'brochure_poster', name: 'Raag_2K26_Stage_Poster.jpg', type: 'image/jpeg', size: '2.5 MB', url: '/images/akriti/akriti-grand-raag-concert.jpg', uploadedAt: '2026-09-28' },
      { id: 'f-23', category: 'attendance_sheet', name: 'Raag_Audience_Pass_Registry.csv', type: 'text/csv', size: '98 KB', uploadedAt: '2026-09-28' },
      { id: 'f-24', category: 'event_photos', name: 'Live_Band_Performance_Stage.jpg', type: 'image/jpeg', size: '2.1 MB', url: '/images/akriti/akriti-grand-raag-concert.jpg', uploadedAt: '2026-09-28' },
      { id: 'f-25', category: 'permission_letter', name: 'Police_and_College_Permission.pdf', type: 'application/pdf', size: '512 KB', uploadedAt: '2026-09-28' },
      { id: 'f-26', category: 'budget_expense', name: 'Sound_Lighting_Sponsorship_Balance.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '115 KB', uploadedAt: '2026-09-28' }
    ]
  },
  {
    id: 'rep-3',
    reportId: 'CMRTC-ER-2026-003',
    eventId: 'cal-3',
    eventTitle: 'Word-Smith Parliamentary Debate & MUN',
    clubId: 'lexis',
    clubName: 'The Lexis Club',
    category: 'Competitions',
    academicYear: '2025-2026',
    eventDate: '2026-08-30',
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    venue: 'Room No: 305, Block B (Main Conference Hall)',
    mode: 'Offline',
    objective: 'To hone diplomatic negotiation, public policy analysis, and persuasive parliamentary speech among undergraduate debaters.',
    summary: 'A 2-day simulation of the UN Security Council and Lok Sabha debating geopolitical security, AI ethics regulation, and economic reforms.',
    activities: '1. Model UN General Assembly sessions\n2. Unmoderated caucuses & draft resolution debates\n3. Crisis committee simulations\n4. Parliamentary zero-hour cross-examinations.',
    chiefGuest: 'Adv. Harish Narayana (Senior Advocate, High Court of Telangana)',
    facultyCoordinator: 'Prof. Meenakshi Sundaram (Senior Professor H&S)',
    participantCount: 110,
    volunteerCount: 14,
    outcome: 'Enhanced critical thinking, resolution drafting prowess, and oratorical confidence for 110 delegates.',
    highlights: '• 8 distinct working papers submitted and voted upon.\n• Engaging cross-examination in the Lok Sabha committee.',
    achievements: 'Best Delegate (UNSC): Rahul Mehrotra\nBest Speaker (Lok Sabha): Shruti Sen\nHigh Commendation: Team Vasavi College',
    challenges: 'Strict timekeeping required multiple concurrent committee chambers.',
    suggestions: 'Provide live digital voting clickers inside the conference hall for speedier caucus voting.',
    status: 'Under Review',
    facultyComments: 'Report looks solid. Verifying delegate registration fees against institutional bank reconciliation.',
    submittedBy: 'Ananya Sharma (227R1A05A1 • Literary Secretary)',
    submittedAt: '2026-08-31T14:45:00Z',
    reviewedBy: 'Prof. Meenakshi Sundaram',
    reviewedAt: null,
    files: [
      { id: 'f-31', category: 'official_report', name: 'Lexis_MUN_2026_Comprehensive_Report.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '1.8 MB', uploadedAt: '2026-08-31' },
      { id: 'f-32', category: 'brochure_poster', name: 'MUN_2026_Delegation_Handbook.pdf', type: 'application/pdf', size: '1.2 MB', url: '/images/lexis/lexis-esperanza-freshers-winners.jpg', uploadedAt: '2026-08-31' },
      { id: 'f-33', category: 'attendance_sheet', name: 'Delegates_Roll_Attendance.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '64 KB', uploadedAt: '2026-08-31' },
      { id: 'f-34', category: 'event_photos', name: 'UNSC_Chamber_Debate_Session.jpg', type: 'image/jpeg', size: '1.4 MB', url: '/images/lexis/lexis-esperanza-freshers-winners.jpg', uploadedAt: '2026-08-31' }
    ]
  },
  {
    id: 'rep-4',
    reportId: 'CMRTC-ER-2026-004',
    eventId: 'cal-6',
    eventTitle: 'Studio Lighting & DSLR Masterclass',
    clubId: 'photography',
    clubName: 'Film & Photography Club',
    category: 'Workshops',
    academicYear: '2025-2026',
    eventDate: '2026-09-18',
    startTime: '10:30 AM',
    endTime: '03:30 PM',
    venue: 'Room No: 102, Block B (Media & Photography Studio Lab)',
    mode: 'Offline',
    objective: 'To provide hands-on training on 3-point studio lighting, high-speed sync flash, and cinematic RAW colour grading.',
    summary: '45 student photographers practiced with softboxes, beauty dishes, rim hair lights, and color calibrated Lightroom workflow.',
    activities: '1. Lighting ratios and modifiers breakdown\n2. Live portrait studio shoots with models\n3. High-speed sync action photography\n4. Lightroom Classic & DaVinci Resolve color workshop.',
    chiefGuest: 'Mr. Naveen Kalyan (Lead Cinematographer, Telugu Film Industry)',
    facultyCoordinator: 'Dr. Rajesh Sharma (Associate Professor ECE)',
    participantCount: 45,
    volunteerCount: 8,
    outcome: 'Every participant created a 5-photo edited portfolio showcasing key studio lighting archetypes.',
    highlights: '• 100% hands-on equipment access for every participant.\n• Portfolio critique by celebrity cinematographer.',
    achievements: 'Best Studio Portrait Award: Sai Pranav (CSE 2nd Year)\nBest Creative Lighting: Deepthi Rao (ECE 3rd Year)',
    challenges: 'High studio heat from continuous tungsten modeling lamps required intermittent cooling pauses.',
    suggestions: 'Upgrade studio modeling fixtures to high-CRI continuous LED panels.',
    status: 'Submitted',
    facultyComments: 'Awaiting faculty review queue.',
    submittedBy: 'Karthik Rao (217R1A0412 • Head of Media)',
    submittedAt: '2026-09-20T10:15:00Z',
    reviewedBy: null,
    reviewedAt: null,
    files: [
      { id: 'f-41', category: 'official_report', name: 'Studio_Lighting_Masterclass_Report.pdf', type: 'application/pdf', size: '1.6 MB', uploadedAt: '2026-09-20' },
      { id: 'f-42', category: 'brochure_poster', name: 'Masterclass_Flyer.png', type: 'image/png', size: '1.1 MB', url: '/images/fap/fap-graduation-ceremony-stage.jpg', uploadedAt: '2026-09-20' },
      { id: 'f-43', category: 'event_photos', name: 'Studio_Lighting_HandsOn.jpg', type: 'image/jpeg', size: '2.3 MB', url: '/images/fap/fap-graduation-ceremony-stage.jpg', uploadedAt: '2026-09-20' }
    ]
  },
  {
    id: 'rep-5',
    reportId: 'CMRTC-ER-2026-005',
    eventId: 'cal-ncc-1',
    eventTitle: 'Annual ATC Obstacle Course & Drill Bootcamp',
    clubId: 'ncc',
    clubName: 'NCC Cadet Corps CMRTC',
    category: 'Workshops',
    academicYear: '2025-2026',
    eventDate: '2026-08-26',
    startTime: '06:30 AM',
    endTime: '12:30 PM',
    venue: 'Parade Grounds & Obstacle Track, Block D',
    mode: 'Offline',
    objective: 'To drill rigorous physical stamina, standard military obstacle clearing, weapon stripping, and guard-of-honour discipline.',
    summary: '75 Senior Division and Senior Wing NCC Cadets completed physical endurance obstacle courses and synchronized squad drills.',
    activities: '1. 5km cross-country march with field pack\n2. 10 standard obstacle navigations (High Wall, Ditch, Ramp)\n3. 0.22 Rifle disassembly/assembly time trials\n4. Flag drill rehearsal.',
    chiefGuest: 'Col. Ranjit Verma (Commanding Officer, 1(T) Bn NCC)',
    facultyCoordinator: 'Major B. Satyanarayana (Associate NCC Officer)',
    participantCount: 75,
    volunteerCount: 10,
    outcome: 'Cadets shortlisted for the upcoming Republic Day Camp (RDC) state trials.',
    highlights: '• Record obstacle clearance time of 3 mins 12 secs by Cadet Sergeant Arvind.',
    achievements: 'Best Cadet Award: Sgt. Arvind Reddy\nBest Drill Contingent: Alpha Squad',
    challenges: 'Rain caused slippery conditions on the high wall ramp, requiring safety sandbags.',
    suggestions: 'Install non-slip rubber grip coating on wooden obstacle beams before monsoon drills.',
    status: 'Changes Requested',
    facultyComments: 'Please attach the Battalion Officer medical clearance logs and certified ammunition tally sheet before final approval.',
    submittedBy: 'Sgt. Arvind Reddy (227R1A0315 • Senior Under Officer)',
    submittedAt: '2026-08-28T16:00:00Z',
    reviewedBy: 'Major B. Satyanarayana',
    reviewedAt: '2026-08-30T11:00:00Z',
    files: [
      { id: 'f-51', category: 'official_report', name: 'NCC_ATC_Drill_Report_Draft.pdf', type: 'application/pdf', size: '2.1 MB', uploadedAt: '2026-08-28' },
      { id: 'f-52', category: 'event_photos', name: 'Cadets_Obstacle_Drill.jpg', type: 'image/jpeg', size: '1.8 MB', url: '/images/ncc/ncc-atc-camp-trophy-ceremony.jpg', uploadedAt: '2026-08-28' },
      { id: 'f-53', category: 'permission_letter', name: 'Battalion_Drill_Sanction_Order.pdf', type: 'application/pdf', size: '380 KB', uploadedAt: '2026-08-28' }
    ]
  },
  {
    id: 'rep-6',
    reportId: 'CMRTC-ER-2026-006',
    eventId: 'cal-nss-2',
    eventTitle: 'Mega Campus Blood Donation & Medical Camp 2026',
    clubId: 'nss',
    clubName: 'NSS Unit CMRTC',
    category: 'Competitions',
    academicYear: '2025-2026',
    eventDate: '2026-09-22',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    venue: 'Room No: 01, Sports Complex (Gymnasium Hall)',
    mode: 'Offline',
    objective: 'To collect voluntary blood units for Red Cross Society and provide comprehensive free vitals health checkups for campus staff.',
    summary: 'A record-breaking 350 units of blood collected in partnership with Red Cross Society & Gandhi Hospital Blood Bank with 100% sterile safety.',
    activities: '1. Donor health screening & hemoglobin testing\n2. Safe phlebotomy and blood unit preservation\n3. Post-donation refreshment & emergency monitoring station\n4. Digital Donor Card issuing & Red Cross recognition.',
    chiefGuest: 'Dr. K. Srinivas (Chief Medical Officer, Red Cross Hyderabad)',
    facultyCoordinator: 'Dr. P. Anitha (NSS Program Officer)',
    participantCount: 350,
    volunteerCount: 50,
    outcome: '350 units preserved for thalassemia and emergency trauma patients. 150+ staff availed eye & vitals checkups.',
    highlights: '• Red Cross Institutional Excellence Trophy conferred to CMRTC.\n• Highest single-day student donor turnout in college history.',
    achievements: 'Certificate of Appreciation from Red Cross State Governor Council.',
    challenges: 'High donor queue between 11 AM - 1 PM required adding 4 extra donor beds.',
    suggestions: 'Implement hourly slot tokens via the UniSphere app for 2027 to spread donor arrivals.',
    status: 'Verified / Approved',
    facultyComments: 'Invaluable humanitarian service. Complete medical certificates and blood bank receipts verified.',
    submittedBy: 'Rohan Verma (217R1A04B2 • NSS Student Lead)',
    submittedAt: '2026-09-24T12:00:00Z',
    reviewedBy: 'Dr. P. Anitha',
    reviewedAt: '2026-09-25T15:30:00Z',
    files: [
      { id: 'f-61', category: 'official_report', name: 'NSS_Blood_Camp_2026_Final_Report.pdf', type: 'application/pdf', size: '2.8 MB', uploadedAt: '2026-09-24' },
      { id: 'f-62', category: 'brochure_poster', name: 'Blood_Donation_Awareness_Poster.jpg', type: 'image/jpeg', size: '1.4 MB', url: '/images/nss/nss-campus-club-inauguration.jpg', uploadedAt: '2026-09-24' },
      { id: 'f-63', category: 'attendance_sheet', name: 'Red_Cross_Blood_Donor_Registry.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '142 KB', uploadedAt: '2026-09-24' },
      { id: 'f-64', category: 'event_photos', name: 'Blood_Donation_Camp_Hall.jpg', type: 'image/jpeg', size: '2.0 MB', url: '/images/nss/nss-sustainable-campus-awards.jpg', uploadedAt: '2026-09-24' },
      { id: 'f-65', category: 'permission_letter', name: 'Red_Cross_MoU_Sanction.pdf', type: 'application/pdf', size: '610 KB', uploadedAt: '2026-09-24' }
    ]
  },
  {
    id: 'rep-7',
    reportId: 'CMRTC-ER-2026-007',
    eventId: 'cal-hack-2',
    eventTitle: 'Code-Crafters Generative AI & Agent Hackathon 2026',
    clubId: 'codeholics',
    clubName: 'Codeholics Tech Club',
    category: 'Hackathons',
    academicYear: '2025-2026',
    eventDate: '2026-09-08',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    venue: 'Room No: 301, Block B (AI Research Studio Lab)',
    mode: 'Offline',
    objective: 'To build production-ready AI agents using LangChain, Gemini API, and React 19 in an intense single-day sprint.',
    summary: 'Draft report in progress by Dev Lead.',
    activities: '1. API Setup & Agent Architecture Walkthrough\n2. 6-Hour Sprint\n3. Rapid demo evaluation.',
    chiefGuest: 'Mr. Arvind Rao (AI Research Engineer)',
    facultyCoordinator: 'Dr. K. Venkat Rao',
    participantCount: 90,
    volunteerCount: 12,
    outcome: 'Draft outcome text pending final tally.',
    highlights: 'Multi-agent orchestration workflows built.',
    achievements: 'Pending winner declaration.',
    challenges: 'Draft challenges.',
    suggestions: 'Draft suggestions.',
    status: 'Draft',
    facultyComments: '',
    submittedBy: 'Naveen Kumar (227R1A0534 • Dev Lead)',
    submittedAt: '2026-09-09T18:00:00Z',
    reviewedBy: null,
    reviewedAt: null,
    files: []
  },
  {
    id: 'rep-8',
    reportId: 'CMRTC-ER-2026-008',
    eventId: 'cal-5',
    eventTitle: 'Choreography & Hip-Hop Dance Bootcamp',
    clubId: 'akriti',
    clubName: 'AKRITI Cultural Club',
    category: 'Workshops',
    academicYear: '2025-2026',
    eventDate: '2026-09-12',
    startTime: '02:00 PM',
    endTime: '06:00 PM',
    venue: 'Room No: 204, Block A (Dance & Cultural Studio)',
    mode: 'Offline',
    objective: 'To train dancers in synchronized urban hip-hop routines and contemporary stage poise.',
    summary: '85 student dancers mastered a 4-minute complex choreography routine.',
    activities: '1. Warm-ups and rhythmic isolations\n2. Urban footwork drill\n3. Group synchrony and stage blocking.',
    chiefGuest: 'Ms. Ritu Roy (Celebrity Choreographer, Mumbai)',
    facultyCoordinator: 'Dr. Suresh Kumar',
    participantCount: 85,
    volunteerCount: 10,
    outcome: 'Shortlisted core cultural dance squad for inter-university competitions.',
    highlights: '• Final synchronized routine recorded in 4K.',
    achievements: 'Best Performer: Sahil Verma (CSE 1st Year)',
    challenges: 'Studio space was tight with 85 simultaneous dancers.',
    suggestions: 'Split the session into two batches (Beginner / Advanced).',
    status: 'Submitted',
    facultyComments: 'Queued for Dean Student Affairs review.',
    submittedBy: 'Pooja Hegde (217R1A05A4)',
    submittedAt: '2026-09-14T11:00:00Z',
    reviewedBy: null,
    reviewedAt: null,
    files: [
      { id: 'f-81', category: 'official_report', name: 'Dance_Bootcamp_Summary_Report.pdf', type: 'application/pdf', size: '1.2 MB', uploadedAt: '2026-09-14' },
      { id: 'f-82', category: 'event_photos', name: 'HipHop_Dance_Group_Routine.jpg', type: 'image/jpeg', size: '1.7 MB', url: '/images/akriti/akriti-live-concert-stage.jpg', uploadedAt: '2026-09-14' }
    ]
  }
];

const STORAGE_KEY = 'unisphere_event_reports_v1';

export const getStoredEventReports = () => {
  if (typeof window === 'undefined') return initialEventReports;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge any new default reports that might be missing
        const existingIds = new Set(parsed.map(p => p.id));
        const missing = initialEventReports.filter(init => !existingIds.has(init.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch {
      return initialEventReports;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEventReports));
  return initialEventReports;
};

export const saveEventReport = (reportData) => {
  if (typeof window === 'undefined') return reportData;
  const current = getStoredEventReports();
  const reportId = reportData.id || `rep-${Date.now()}`;
  const reportCode = reportData.reportId || `CMRTC-ER-2026-${String(current.length + 1).padStart(3, '0')}`;

  const newReport = {
    id: reportId,
    reportId: reportCode,
    academicYear: reportData.academicYear || '2025-2026',
    submittedAt: reportData.submittedAt || new Date().toISOString(),
    status: reportData.status || REPORT_STATUSES.SUBMITTED,
    files: reportData.files || [],
    ...reportData
  };

  const existingIndex = current.findIndex(r => r.id === reportId);
  let updated;
  if (existingIndex >= 0) {
    updated = current.map(r => r.id === reportId ? { ...r, ...newReport, updatedAt: new Date().toISOString() } : r);
  } else {
    updated = [newReport, ...current];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newReport;
};

export const reviewEventReport = (reportId, newStatus, comments, reviewerName = 'Faculty Coordinator') => {
  if (typeof window === 'undefined') return null;
  const current = getStoredEventReports();
  let updatedReport = null;

  const updated = current.map(rep => {
    if (rep.id === reportId) {
      updatedReport = {
        ...rep,
        status: newStatus,
        facultyComments: comments,
        reviewedBy: reviewerName,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return updatedReport;
    }
    return rep;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedReport;
};

export const deleteEventReport = (reportId) => {
  if (typeof window === 'undefined') return;
  const current = getStoredEventReports();
  const filtered = current.filter(r => r.id !== reportId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export const getEventReportById = (reportId) => {
  const current = getStoredEventReports();
  return current.find(r => r.id === reportId || r.reportId === reportId);
};
