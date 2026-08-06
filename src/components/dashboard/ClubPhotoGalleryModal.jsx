import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  ExternalLink, 
  FolderPlus, 
  Trash2, 
  Calendar, 
  Images, 
  Edit3, 
  Clock, 
  Folder
} from 'lucide-react';
import { 
  getStoredAlbums, 
  saveNewAlbum, 
  updateAlbumDriveLink, 
  deleteAlbum 
} from '../../utils/mockGallery';
import { useAuth } from '../../context/AuthContext';

const ClubPhotoGalleryModal = ({ isOpen, onClose, initialClubId = 'all', onToast }) => {
  const { user, isCoordinator } = useAuth();
  const [albums, setAlbums] = useState(getStoredAlbums);
  
  // Filtering & Sorting State
  const [selectedClubFilter, setSelectedClubFilter] = useState(initialClubId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Create Album Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClubId, setNewClubId] = useState('akriti');
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [newPhotoCount, setNewPhotoCount] = useState('150');
  const [createError, setCreateError] = useState('');

  // Edit Album Drive Link Modal State
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  const canManage = isCoordinator || (user && user.role !== 'student');

  useEffect(() => {
    if (initialClubId) setSelectedClubFilter(initialClubId);
  }, [initialClubId]);

  if (!isOpen) return null;

  // Filter & Sort Albums
  let filteredAlbums = albums.filter((alb) => {
    const matchesClub = selectedClubFilter === 'all' || alb.clubId === selectedClubFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      alb.eventName.toLowerCase().includes(q) ||
      alb.clubName.toLowerCase().includes(q)
    );
    return matchesClub && matchesSearch;
  });

  if (sortOrder === 'newest') {
    filteredAlbums = [...filteredAlbums].reverse();
  }

  // Create Google Drive Album Handler
  const handleCreateAlbumSubmit = (e) => {
    e.preventDefault();
    setCreateError('');

    if (!newEventName.trim()) {
      setCreateError('Event Name is required.');
      return;
    }
    if (!newEventDate.trim()) {
      setCreateError('Event Date is required.');
      return;
    }
    if (!newDriveUrl.trim()) {
      setCreateError('Google Drive Folder Link is required.');
      return;
    }

    const clubNamesMap = {
      akriti: 'AKRITI Cultural Club',
      codeholics: 'Codeholics Tech Club',
      photography: 'Film & Photography Club',
      lexis: 'The Lexis Literary Club',
      ncc: 'NCC Cadet Corps',
      nss: 'NSS Service Scheme'
    };

    const defaultCover = newCoverUrl.trim() || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

    const newAlbumObj = {
      id: `album-${Date.now()}`,
      clubId: newClubId,
      clubName: clubNamesMap[newClubId] || 'Campus Club',
      eventName: newEventName.trim(),
      eventDate: newEventDate.trim(),
      coverImage: defaultCover,
      driveUrl: newDriveUrl.trim(),
      uploadedBy: user?.name || 'Club Coordinator',
      createdAt: new Date().toISOString().split('T')[0],
      photoCount: parseInt(newPhotoCount) || 150
    };

    const updated = saveNewAlbum(newAlbumObj);
    setAlbums(updated);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewEventName('');
    setNewEventDate('');
    setNewCoverUrl('');
    setNewDriveUrl('');
    setNewPhotoCount('150');

    if (onToast) onToast(`Created Google Drive Album "${newAlbumObj.eventName}"! 📁`, 'success');
  };

  // Open Google Drive Album in New Tab
  const handleOpenDriveAlbum = (album) => {
    if (onToast) onToast(`Opening ${album.eventName} Google Drive Album... 📁`, 'info');
    window.open(album.driveUrl, '_blank', 'noopener,noreferrer');
  };

  // Open Edit Drive Link Modal
  const handleStartEdit = (album) => {
    setEditingAlbum(album);
    setEditDriveUrl(album.driveUrl);
    setEditCoverUrl(album.coverImage);
  };

  // Submit Edit Drive Link
  const handleSaveEditSubmit = (e) => {
    e.preventDefault();
    if (!editingAlbum || !editDriveUrl.trim()) return;

    const updated = updateAlbumDriveLink(editingAlbum.id, editDriveUrl.trim(), editCoverUrl.trim());
    setAlbums(updated);
    setEditingAlbum(null);

    if (onToast) onToast(`Updated Google Drive Link for "${editingAlbum.eventName}"! 📁`, 'success');
  };

  // Delete Album Handler
  const handleDeleteAlbum = (albumId, eventName) => {
    const updated = deleteAlbum(albumId);
    setAlbums(updated);
    if (onToast) onToast(`Deleted Event Album "${eventName}"`, 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#070B14]/85 backdrop-blur-md"
        />

        {/* Main Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-pink-400 font-bold shadow-inner">
                <Folder size={24} />
              </div>

              <div>
                <span className="text-xs font-bold text-pink-400 tracking-wider uppercase flex items-center gap-1">
                  <span>CMRTC Campus Portal</span> • <span>Google Drive Event Albums</span>
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Event Photo Albums & Google Drive Gallery
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {canManage && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  <FolderPlus size={16} />
                  <span>Add Google Drive Album</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search, Sort & Filters Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full lg:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums by event name..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-xs font-medium outline-none focus:border-pink-500 transition-all"
              />
            </div>

            {/* Sort Order Dropdown */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 whitespace-nowrap">
                <Clock size={14} />
                <span>Sort By:</span>
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none focus:border-pink-500 cursor-pointer"
              >
                <option value="newest">Newest Events First</option>
                <option value="oldest">Oldest Events First</option>
              </select>
            </div>

            {/* Club Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
              {[
                { id: 'all', label: 'All Clubs' },
                { id: 'akriti', label: 'AKRITI' },
                { id: 'codeholics', label: 'Codeholics' },
                { id: 'photography', label: 'Film & Photo' },
                { id: 'lexis', label: 'The Lexis' },
                { id: 'ncc', label: 'NCC' },
                { id: 'nss', label: 'NSS' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedClubFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    selectedClubFilter === f.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ALBUM CARDS GRID */}
          <div className="overflow-y-auto p-6 flex-1 bg-slate-900/5">
            {filteredAlbums.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <Folder size={40} className="mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">No event albums found</p>
                <p className="text-xs text-slate-400">Try adjusting your filters or add a Google Drive album link.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    {/* Album Cover Image with Total Photos Counter Tag */}
                    <div className="h-52 overflow-hidden relative bg-slate-900">
                      <img
                        src={album.coverImage}
                        alt={album.eventName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Club Badge Tag */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] border border-white/20 shadow-md">
                        {album.clubName.split(' ')[0]}
                      </span>

                      {/* Total Photos Tag */}
                      <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-pink-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 border border-pink-400/40">
                        <Images size={13} />
                        <span>{album.photoCount || 150}+ Photos</span>
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-pink-600 transition-colors">
                          {album.eventName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{album.eventDate}</span>
                        </p>
                      </div>

                      {/* View Album Button & Coordinator Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenDriveAlbum(album)}
                          className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <Folder size={14} />
                          <span>View Album (Google Drive)</span>
                          <ExternalLink size={13} />
                        </button>

                        {canManage && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(album)}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Edit Google Drive Link"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteAlbum(album.id, album.eventName)}
                              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Delete Album"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* CREATE GOOGLE DRIVE ALBUM MODAL (Coordinators & Admins Only) */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FolderPlus size={20} className="text-pink-600" />
                  <span>Add Google Drive Event Album</span>
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAlbumSubmit} className="space-y-3.5 text-left">
                {createError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                    {createError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Club *</label>
                  <select
                    value={newClubId}
                    onChange={(e) => setNewClubId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 bg-white cursor-pointer"
                  >
                    <option value="akriti">AKRITI Cultural Club</option>
                    <option value="codeholics">Codeholics Tech Club</option>
                    <option value="photography">Film & Photography Club</option>
                    <option value="lexis">The Lexis Literary Club</option>
                    <option value="ncc">NCC Cadet Corps</option>
                    <option value="nss">NSS Service Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. Pegasus 2026 Dance Auditions"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Date *</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. August 15, 2026"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Drive Folder Link *</label>
                  <input
                    type="text"
                    value={newDriveUrl}
                    onChange={(e) => setNewDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Make sure the Google Drive folder sharing permission is set to "Anyone with the link can view".</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Album Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    value={newCoverUrl}
                    onChange={(e) => setNewCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Total Photos (Optional)</label>
                  <input
                    type="number"
                    value={newPhotoCount}
                    onChange={(e) => setNewPhotoCount(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Publish Google Drive Album
                </button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT GOOGLE DRIVE LINK MODAL */}
        {editingAlbum && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-pink-600" />
                  <span>Edit Google Drive Link</span>
                </h3>
                <button onClick={() => setEditingAlbum(null)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEditSubmit} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Drive Folder Link *</label>
                  <input
                    type="text"
                    value={editDriveUrl}
                    onChange={(e) => setEditDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editCoverUrl}
                    onChange={(e) => setEditCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ClubPhotoGalleryModal;
