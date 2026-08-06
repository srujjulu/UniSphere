import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Sparkles, 
  User, 
  PhoneCall, 
  CheckCircle2, 
  Plus, 
  Award,
  Filter
} from 'lucide-react';
import { getStoredInfluencers, saveInfluencer } from '../../utils/mockInfluencers';

const InstagramSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

const InfluencerSheetModal = ({ isOpen, onClose, clubName = 'All Clubs', currentClubId = 'all', onToast }) => {
  const [influencers, setInfluencers] = useState(getStoredInfluencers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState(currentClubId === 'all' ? 'all' : currentClubId);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [auditionTarget, setAuditionTarget] = useState(null);

  // New Influencer Form State
  const [newName, setNewName] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newBranch, setNewBranch] = useState('CSE - 3rd Year');
  const [newClubId, setNewClubId] = useState('akriti');
  const [newDomain, setNewDomain] = useState('Dance & Choreography');
  const [newInsta, setNewInsta] = useState('');
  const [newYoutube, setNewYoutube] = useState('');
  const [newFollowers, setNewFollowers] = useState('5.0K');
  const [newSubscribers, setNewSubscribers] = useState('2.5K');
  const [newBio, setNewBio] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const filteredInfluencers = influencers.filter((inf) => {
    const matchesClub = selectedClubFilter === 'all' || inf.clubId === selectedClubFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      inf.name.toLowerCase().includes(q) ||
      inf.rollNo.toLowerCase().includes(q) ||
      inf.domain.toLowerCase().includes(q) ||
      inf.instagram.toLowerCase().includes(q) ||
      inf.youtube.toLowerCase().includes(q)
    );
    return matchesClub && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim()) {
      setFormError('Please enter full name');
      return;
    }
    if (!newRollNo.trim()) {
      setFormError('Please enter Roll Number / Student ID');
      return;
    }
    if (!newInsta.trim()) {
      setFormError('Instagram Handle (@username) is required');
      return;
    }

    const formattedInsta = newInsta.startsWith('@') ? newInsta : `@${newInsta}`;
    const formattedYt = newYoutube ? (newYoutube.startsWith('@') ? newYoutube : `@${newYoutube}`) : '@CMRTC_Student';

    const created = {
      id: `inf-${Date.now()}`,
      name: newName.trim(),
      rollNo: newRollNo.trim().toUpperCase(),
      branch: newBranch,
      clubId: newClubId,
      domain: newDomain,
      instagram: formattedInsta,
      instagramUrl: `https://instagram.com/${formattedInsta.replace('@', '')}`,
      youtube: formattedYt,
      youtubeUrl: `https://youtube.com/${formattedYt.replace('@', '')}`,
      followers: newFollowers || '1.0K',
      subscribers: newSubscribers || '500',
      status: 'Available for Auditions',
      bio: newBio.trim() || `Student creator specializing in ${newDomain} at CMRTC.`
    };

    const updatedList = saveInfluencer(created);
    setInfluencers(updatedList);
    setIsAddFormOpen(false);
    
    // Reset inputs
    setNewName('');
    setNewRollNo('');
    setNewInsta('');
    setNewYoutube('');
    setNewBio('');

    if (onToast) onToast(`Added ${created.name} to Campus Influencers Sheet! 🌟`, 'success');
  };

  const handleSendAuditionInvite = (inf) => {
    if (onToast) {
      onToast(`📩 Official Audition Call sent to ${inf.name} via ${inf.instagram}!`, 'success');
    }
    setAuditionTarget(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090E1B]/85 backdrop-blur-md"
        />

        {/* Modal Main Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-pink-400 font-bold shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-400 tracking-wider uppercase flex items-center gap-1">
                  <span>CMRTC Campus Portal</span> • <span>Influencer Roster</span>
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Campus Student Influencer Sheet
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Add Student Influencer</span>
              </button>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Subheader Search & Filters */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, talent, @insta, YT..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium outline-none focus:border-pink-500 transition-all"
              />
            </div>

            {/* Club Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Filter size={14} />
                <span>Club Filter:</span>
              </span>
              {[
                { id: 'all', label: 'All Clubs' },
                { id: 'akriti', label: 'AKRITI (Arts/Dance)' },
                { id: 'codeholics', label: 'Codeholics (Tech)' },
                { id: 'photography', label: 'Film & Photo' },
                { id: 'lexis', label: 'The Lexis' },
                { id: 'ncc', label: 'NCC' },
                { id: 'nss', label: 'NSS' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedClubFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    selectedClubFilter === filter.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roster Cards List */}
          <div className="overflow-y-auto p-6 flex-1 space-y-4">
            {filteredInfluencers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <User size={36} className="mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">No student influencers found</p>
                <p className="text-xs text-slate-400">Try adjusting your search query or club filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInfluencers.map((inf) => (
                  <div
                    key={inf.id}
                    className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: User Avatar & Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                          {inf.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                            {inf.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {inf.rollNo} • {inf.branch}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 font-bold text-[11px] border border-pink-100 whitespace-nowrap">
                        {inf.domain}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                      "{inf.bio}"
                    </p>

                    {/* Handles & Subscriber Metrics */}
                    <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <a
                          href={inf.instagramUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <InstagramSvg />
                          <span>{inf.instagram}</span>
                        </a>

                        <a
                          href={inf.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <YoutubeSvg />
                          <span>{inf.youtube}</span>
                        </a>
                      </div>

                      <div className="text-right text-[11px] font-bold text-slate-500 font-mono">
                        <span className="text-pink-600">{inf.followers}</span> Followers
                      </div>
                    </div>

                    {/* Audition Call CTA Button */}
                    <button
                      onClick={() => setAuditionTarget(inf)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <PhoneCall size={15} className="text-emerald-400" />
                      <span>Call for Audition / Event Invite</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Award size={15} className="text-pink-600" />
              <span>CMRTC Campus Talent & Social Reach Network</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-black transition-all"
            >
              Close Sheet
            </button>
          </div>
        </motion.div>

        {/* Add Student Influencer Modal */}
        {isAddFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-pink-600" />
                  <span>Add Student Influencer to Sheet</span>
                </h3>
                <button
                  onClick={() => setIsAddFormOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-left">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={newRollNo}
                      onChange={(e) => setNewRollNo(e.target.value)}
                      placeholder="e.g. 227R1A0501"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Branch & Year
                    </label>
                    <input
                      type="text"
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                      placeholder="e.g. CSE - 3rd Year"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Club Category
                    </label>
                    <select
                      value={newClubId}
                      onChange={(e) => setNewClubId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500 bg-white cursor-pointer"
                    >
                      <option value="akriti">AKRITI (Dance/Arts)</option>
                      <option value="codeholics">Codeholics (Tech)</option>
                      <option value="photography">Film & Photo</option>
                      <option value="lexis">The Lexis (Public Speaking)</option>
                      <option value="ncc">NCC (Fitness)</option>
                      <option value="nss">NSS (Social)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Talent Domain
                    </label>
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      placeholder="e.g. Hip-Hop Dance"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      value={newInsta}
                      onChange={(e) => setNewInsta(e.target.value)}
                      placeholder="@insta_handle"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      YouTube Handle
                    </label>
                    <input
                      type="text"
                      value={newYoutube}
                      onChange={(e) => setNewYoutube(e.target.value)}
                      placeholder="@youtube_channel"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Insta Followers
                    </label>
                    <input
                      type="text"
                      value={newFollowers}
                      onChange={(e) => setNewFollowers(e.target.value)}
                      placeholder="e.g. 12.5K"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      YouTube Subs
                    </label>
                    <input
                      type="text"
                      value={newSubscribers}
                      onChange={(e) => setNewSubscribers(e.target.value)}
                      placeholder="e.g. 8.2K"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Creator Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="Short description of student's talent, awards, or previous performances..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all"
                >
                  Save to Influencer Sheet
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Audition Call Invite Confirmation Popup */}
        {auditionTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <PhoneCall size={28} />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                Send Audition Call / Event Invite
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                You are inviting <strong>{auditionTarget.name}</strong> ({auditionTarget.domain}) for an official club audition / promo shoot.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
                <p><strong>Instagram:</strong> {auditionTarget.instagram}</p>
                <p><strong>YouTube:</strong> {auditionTarget.youtube}</p>
                <p><strong>Followers / Reach:</strong> {auditionTarget.followers} Followers</p>
                <p><strong>Roll No:</strong> {auditionTarget.rollNo} ({auditionTarget.branch})</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setAuditionTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleSendAuditionInvite(auditionTarget)}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>Send Call Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default InfluencerSheetModal;
