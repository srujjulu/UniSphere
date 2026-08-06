import { 
  Shield, 
  CheckSquare, 
  Users, 
  FileText, 
  Bell, 
  DollarSign, 
  Check, 
  X, 
  Sparkles, 
  Compass, 
  AlertCircle,
  Star
} from 'lucide-react';
import RoleSidebar from '../layout/RoleSidebar';
import InfluencerSheetModal from './InfluencerSheetModal';
import EventCalendar from './EventCalendar';
import AlumniNetwork from './AlumniNetwork';
import { getStoredRequests, updateRequestStatus } from '../../utils/mockRequests';
import { getStoredCertificates, verifyCertificate, revokeCertificate } from '../../utils/mockCertificates';
import { getAllFeedbackSummaries } from '../../utils/mockEventFeedback';

const pendingMajorEvents = [
  { id: 'fe1', title: 'Pegasus 2026 Annual Cultural Fest', club: 'AKRITI Club', budget: '₹1,50,000', venue: 'CMR Auditorium', status: 'pending' },
  { id: 'fe2', title: 'National Student Technical Symposium', club: 'Codeholics', budget: '₹75,000', venue: 'Seminar Hall 3', status: 'pending' }
];

const FacultyDashboard = () => {
  const [activeSection, setActiveSection] = useState('approve-events');
  const [eventApprovals, setEventApprovals] = useState(pendingMajorEvents);
  const [memberRequests, setMemberRequests] = useState(getStoredRequests);
  const [certificates, setCertificates] = useState(getStoredCertificates);
  const [facultyClubFilter, setFacultyClubFilter] = useState('all');
  const [isInfluencerOpen, setIsInfluencerOpen] = useState(false);
  const [toast, setToast] = useState('');

  const handleVerifyCert = (certId, title) => {
    verifyCertificate(certId, 'Dr. Suresh Kumar (Faculty Coordinator)');
    setCertificates(getStoredCertificates());
    triggerToast(`Verified Certificate: "${title}"! ✅ Official seal attached.`);
  };

  const handleRevokeCert = (certId, title) => {
    revokeCertificate(certId);
    setCertificates(getStoredCertificates());
    triggerToast(`Returned Certificate "${title}" for revision. ❌`);
  };

  const filteredFacultyRequests = memberRequests.filter(
    r => (facultyClubFilter === 'all' || r.clubId === facultyClubFilter) && r.status === 'pending'
  );

  const handleApproveMember = (id, name, clubName) => {
    updateRequestStatus(id, 'approved');
    setMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    triggerToast(`Approved student ${name} into ${clubName || 'Club'}! ✅`);
  };

  const handleRejectMember = (id, name) => {
    updateRequestStatus(id, 'rejected');
    setMemberRequests(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
    triggerToast(`Rejected request for ${name}. ❌`);
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = (id, title) => {
    setEventApprovals(prev => prev.filter(e => e.id !== id));
    triggerToast(`Approved Major Event: "${title}" ✅`);
  };

  const handleReject = (id, title) => {
    setEventApprovals(prev => prev.filter(e => e.id !== id));
    triggerToast(`Returned major event "${title}" with feedback. ❌`);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex font-sans select-none overflow-x-hidden">
      <RoleSidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole="faculty" />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-amber-600 text-white font-bold text-xs shadow-xl border border-amber-400 flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toast}</span>
          </motion.div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/50 via-slate-900/60 to-slate-900/80 p-6 rounded-[28px] border border-amber-500/20 backdrop-blur-xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30">
              👨‍🏫 Faculty Coordinator Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2">
              Faculty Oversight & Event Approval Portal
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Review major college club events, monitor student membership rosters, audit club budgets, and inspect compliance reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Pending Event Approvals</p>
              <p className="text-lg font-black text-amber-400">{eventApprovals.length} Events</p>
            </div>
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Monitored Clubs</p>
              <p className="text-lg font-black text-white">6 Clubs</p>
            </div>
          </div>
        </div>

        {/* Section: Event Calendar */}
        {activeSection === 'event-calendar' && (
          <EventCalendar onToast={(msg, type) => triggerToast(msg)} />
        )}

        {/* Section: Alumni Network */}
        {activeSection === 'alumni-network' && (
          <AlumniNetwork onToast={(msg, type) => triggerToast(msg)} />
        )}

        {/* Section: Major Events Approval Queue */}
        {(activeSection === 'approve-events' || activeSection === 'club-activities') && (
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <CheckSquare size={20} className="text-amber-400" />
              <span>Major Campus Event Approvals Queue</span>
            </h3>

            {eventApprovals.length === 0 ? (
              <p className="text-xs text-slate-400">All major club events have been reviewed and approved!</p>
            ) : (
              <div className="space-y-3">
                {eventApprovals.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">{item.club}</span>
                      <h4 className="text-base font-extrabold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400">Venue: <span className="text-white font-bold">{item.venue}</span> • Budget Requested: <span className="text-emerald-400 font-bold">{item.budget}</span></p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleApprove(item.id, item.title)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check size={16} />
                        <span>Approve Event</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id, item.title)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <X size={16} />
                        <span>Request Revision</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificate Verification Queue Section */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    <span>Event Certificate Verification Queue ({certificates.filter(c => c.status === 'pending_verification').length})</span>
                  </h4>
                  <p className="text-xs text-slate-400">Review certificates uploaded by club core teams and attach official digital sign-off.</p>
                </div>
              </div>

              {certificates.filter(c => c.status === 'pending_verification').length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-800/40 text-center text-xs text-slate-400">
                  All uploaded event certificates have been verified by faculty coordinators!
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.filter(c => c.status === 'pending_verification').map((cert) => (
                    <div key={cert.id} className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {cert.clubName}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400">{cert.studentRoll}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white">{cert.title}</h4>
                        <p className="text-xs text-slate-400">Event: <strong className="text-slate-200">{cert.eventName}</strong> • Recipient: <strong className="text-slate-200">{cert.studentName}</strong></p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerifyCert(cert.id, cert.title)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check size={16} />
                          <span>Verify Certificate ✅</span>
                        </button>
                        <button
                          onClick={() => handleRevokeCert(cert.id, cert.title)}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <X size={16} />
                          <span>Return ❌</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section: Monitor Members & Budgets */}
        {(activeSection === 'monitor-members' || activeSection === 'monitor-budgets') && (
          <div className="space-y-6">
            {/* All Clubs Join Requests Queue */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Users size={18} className="text-amber-400" />
                    <span>All Campus Clubs Membership Applications Queue</span>
                  </h3>
                  <p className="text-xs text-slate-400">Review and approve pending student join applications across all CMRTC clubs.</p>
                </div>

                {/* Club Filter Select */}
                <select
                  value={facultyClubFilter}
                  onChange={(e) => setFacultyClubFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs border border-amber-500/30 outline-none cursor-pointer"
                >
                  <option value="all">🌟 All Clubs ({memberRequests.filter(r => r.status === 'pending').length})</option>
                  <option value="lexis">Lexis Club</option>
                  <option value="codeholics">Codeholics Club</option>
                  <option value="akriti">AKRITI Cultural</option>
                  <option value="ncc">NCC Cadet Corps</option>
                  <option value="photography">Film & Photo</option>
                  <option value="nss">NSS Unit</option>
                </select>
              </div>

              {filteredFacultyRequests.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-800/40 text-center text-xs text-slate-400">
                  No pending membership applications found for this club category.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredFacultyRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {req.clubName || req.clubId}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">{req.rollNo}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white mt-1">{req.name}</h4>
                        <p className="text-xs text-slate-400">{req.talent} • {req.branch}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveMember(req.id, req.name, req.clubName)}
                          className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer shadow-md"
                          title="Approve Member"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectMember(req.id, req.name)}
                          className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer shadow-md"
                          title="Reject Request"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users size={18} className="text-amber-400" />
                  <span>Student Roster Summary</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>AKRITI Cultural Club Roster</span>
                    <span className="font-bold text-white">420 Active Members</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>Codeholics Tech Club Roster</span>
                    <span className="font-bold text-white">350 Active Members</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>NCC Cadet Corps Roster</span>
                    <span className="font-bold text-white">180 Active Cadets</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>Lexis Club Roster</span>
                    <span className="font-bold text-white">98 Active Members</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <DollarSign size={18} className="text-emerald-400" />
                  <span>Faculty Budget Audit Oversight</span>
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>AKRITI Allocated Budget</span>
                    <span className="font-bold text-emerald-400">₹1,50,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>Codeholics Allocated Budget</span>
                    <span className="font-bold text-emerald-400">₹1,20,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                    <span>NSS Service Allocated Budget</span>
                    <span className="font-bold text-emerald-400">₹80,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: View Reports + Influencer Roster */}
        {activeSection === 'view-reports' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <FileText size={20} className="text-amber-400" />
                <span>Campus Activity & Audit Reports</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm">QR Code Attendance Report</h4>
                  <p className="text-xs text-slate-400">Verified QR scans & attendee timestamps</p>
                  <button onClick={() => triggerToast('Downloaded Event QR Attendance Report CSV 📊')} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer">Download CSV</button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm">Q2 Attendance Summary</h4>
                  <p className="text-xs text-slate-400">Average participation: 88.4%</p>
                  <button onClick={() => triggerToast('Downloaded Q2 Attendance Report PDF')} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer">Download PDF</button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm">Annual Budget Audit</h4>
                  <p className="text-xs text-slate-400">Total expenditure: ₹4.2 Lakhs</p>
                  <button onClick={() => triggerToast('Downloaded Annual Audit Report PDF')} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer">Download PDF</button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                  <h4 className="font-bold text-white text-sm">NACC Accreditation Data</h4>
                  <p className="text-xs text-slate-400">Verified club certificates: 340</p>
                  <button onClick={() => triggerToast('Downloaded NACC Report PDF')} className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer">Download PDF</button>
                </div>
              </div>
            </div>

            {/* Campus Event Feedback & Satisfaction Audit Grid */}
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Star size={20} className="text-amber-400 fill-amber-400" />
                <span>Campus Event Satisfaction & Ratings Audit</span>
              </h3>
              <p className="text-xs text-slate-400">Faculty oversight summary of student event reviews, star ratings, and satisfaction metrics.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAllFeedbackSummaries().map((summary) => (
                  <div key={summary.eventId} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {summary.clubName}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">{summary.avgRating} ★</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">{summary.eventTitle}</h4>
                    <p className="text-xs text-slate-400">Reviews: <strong className="text-white">{summary.totalReviews}</strong> • Rating: <strong className="text-emerald-400">{summary.avgRating} / 5.0</strong></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Influencer Roster CTA inside Reports section */}
            <div className="bg-gradient-to-r from-pink-950/50 to-slate-900/80 p-6 rounded-3xl border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-400" />
                  <span>Campus Influencer & Audition Roster</span>
                </h4>
                <p className="text-xs text-slate-400">Monitor student creators across all clubs for event promotions and outreach calls.</p>
              </div>
              <button
                onClick={() => setIsInfluencerOpen(true)}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase cursor-pointer shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>View Influencer Roster</span>
              </button>
            </div>
          </div>
        )}

        {/* Influencer Sheet Modal */}
        <InfluencerSheetModal
          isOpen={isInfluencerOpen}
          onClose={() => setIsInfluencerOpen(false)}
          clubName="CMRTC Campus"
          currentClubId="all"
          onToast={(msg) => triggerToast(msg)}
        />
      </main>
    </div>
  );
};

export default FacultyDashboard;
