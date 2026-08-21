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
  Folder,
  Sparkles,
  Shield,
  Layers,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { 
  getStoredAlbums, 
  restoreDefaultAlbums,
  saveNewAlbum, 
  updateAlbumDriveLink, 
  deleteAlbum,
  clubMasterDrives
} from '../../utils/mockGallery';
import { useAuth } from '../../context/AuthContext';

const ClubPhotoGalleryModal = ({ isOpen, onClose, initialClubId = 'all', onToast }) => {
  const { user, isCoordinator } = useAuth();
  const isStudent = !user || user.role === 'student';
  const isCoreTeam = user && user.role === 'core';
  const assignedClubId = user?.assignedClub || (isCoreTeam ? 'codeholics' : 'all');
  
  // Default to assigned club for core team, or initialClubId / 'all' for others
  const defaultClub = isCoreTeam ? (initialClubId !== 'all' ? initialClubId : assignedClubId) : initialClubId;

  const [albums, setAlbums] = useState(getStoredAlbums);
  const [selectedClubFilter, setSelectedClubFilter] = useState(defaultClub);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Photo Lightbox Viewer State
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Create Album Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClubId, setNewClubId] = useState(isCoreTeam ? assignedClubId : 'akriti');
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newCoverUrl, setNewCoverUrl] = useState('');
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [newPhotoCount, setNewPhotoCount] = useState('150');
  const [createError, setCreateError] = useState('');

  // Edit Album Modal State
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');

  // Sync albums from localStorage on open or club change
  useEffect(() => {
    setAlbums(getStoredAlbums());
    if (initialClubId && initialClubId !== 'all') {
      setSelectedClubFilter(initialClubId);
    }
  }, [isOpen, initialClubId]);

  if (!isOpen) return null;

  // Permissions: Core team can manage only their club; Faculty/Admin can manage all
  const canManage = isCoordinator || isCoreTeam || user?.role === 'admin' || user?.role === 'faculty';

  // Filter & Search Logic
  let filteredAlbums = albums.filter((album) => {
    const matchesClub = selectedClubFilter === 'all' || album.clubId === selectedClubFilter;
    const matchesSearch = !searchQuery.trim() || (
      album.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.clubName.toLowerCase().includes(searchQuery.toLowerCase())
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

    const clubMeta = clubMasterDrives[newClubId];
    const defaultCover = newCoverUrl.trim() || '/images/codeholics/codeholics-hack-the-verse.png';

    const newAlbumObj = {
      id: `album-${Date.now()}`,
      clubId: newClubId,
      clubName: clubMeta?.clubName || 'Campus Club',
      eventName: newEventName.trim(),
      eventDate: newEventDate.trim(),
      coverImage: defaultCover,
      photos: [defaultCover],
      driveUrl: newDriveUrl.trim(),
      uploadedBy: `${user?.name || 'Coordinator'} (${clubMeta?.shortName || 'Club'})`,
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

    if (onToast) onToast(`Posted new Event Drive Album "${newAlbumObj.eventName}" for ${clubMeta?.shortName}! 📁`, 'success');
  };

  const isDemoDriveUrl = (url) => {
    if (!url) return true;
    return url.includes('1Codeholics_') || url.includes('1AKRITI_') || url.includes('1FAP_') || url.includes('1Lexis_') || url.includes('1NCC_') || url.includes('1NSS_') || url.includes('_MasterDrive_') || url.includes('_CMRTC');
  };

  // Open Lightbox Viewer for an Album
  const handleViewAlbumPhotos = (album) => {
    setViewingAlbum(album);
    setPhotoIndex(0);
  };

  // Open Google Drive Album safely
  const handleOpenDriveAlbum = (album) => {
    if (isDemoDriveUrl(album.driveUrl)) {
      setViewingAlbum(album);
      setPhotoIndex(0);
      if (onToast) onToast(`Viewing ${album.eventName} high-res gallery! Coordinators can paste real Google Drive folder link in settings 📸`, 'info');
    } else {
      if (onToast) onToast(`Opening ${album.eventName} Google Drive Album... 📁`, 'info');
      window.open(album.driveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Open Master Drive Link in New Tab safely
  const handleOpenMasterDrive = (driveUrl, clubName) => {
    if (isDemoDriveUrl(driveUrl)) {
      if (onToast) onToast(`Opening ${clubName} Drive repository! Coordinators can link custom Google Drive folder URLs 📁`, 'info');
      window.open('https://drive.google.com/', '_blank', 'noopener,noreferrer');
    } else {
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Download high-resolution photo helper
  const handleDownloadPhoto = async (photoUrl, eventName) => {
    const filename = `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_Photo.jpg`;
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      if (onToast) onToast(`Downloaded photograph: ${filename} 📥`, 'success');
    } catch {
      const link = document.createElement('a');
      link.href = photoUrl;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onToast) onToast('Downloading high-resolution event photograph! 📥', 'success');
    }
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

  // Restore Default Albums Handler
  const handleRestoreAllDefaults = () => {
    const restored = restoreDefaultAlbums();
    setAlbums(restored);
    if (onToast) onToast('Restored all official club event photo albums! 📸', 'success');
  };

  const activeClubMeta = clubMasterDrives[selectedClubFilter] || null;

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
                  <span>CMRTC Campus Portal</span> • <span>Club Google Drive Albums</span>
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isCoreTeam ? `${activeClubMeta?.clubName || 'Club'} Google Drive Gallery` : 'Campus Clubs Event Google Drive Hub'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
              {canManage && (
                <>
                  <button
                    onClick={handleRestoreAllDefaults}
                    title="Restore default club albums"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw size={14} className="text-pink-400" />
                    <span>Restore Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewClubId(selectedClubFilter !== 'all' ? selectedClubFilter : (isCoreTeam ? assignedClubId : 'akriti'));
                      setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                  >
                    <FolderPlus size={16} />
                    <span>+ Post Event Drive Album</span>
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Core Coordinator Managed Club Banner */}
          {isCoreTeam && activeClubMeta && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 border-b border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px] uppercase border border-pink-500/30">
                  {activeClubMeta.category}
                </span>
                <span className="text-xs font-bold text-slate-200">
                  Managing: <strong>{activeClubMeta.clubName}</strong> Official Event Albums
                </span>
              </div>

              <button
                onClick={() => handleOpenMasterDrive(activeClubMeta.driveUrl, activeClubMeta.clubName)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Folder size={14} />
                <span>Open {activeClubMeta.shortName} Master Drive Folder</span>
                <ExternalLink size={12} />
              </button>
            </div>
          )}

          {/* Student View: All Club Master Drive Quick Access Cards */}
          {isStudent && (
            <div className="bg-slate-100/90 p-4 border-b border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-pink-600" />
                  <span>Individual Club Google Drive Folders (Direct Access)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Click any club drive to open its full photo archive
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {Object.values(clubMasterDrives).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleOpenMasterDrive(c.driveUrl, c.clubName)}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-pink-500/40 hover:shadow-md transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-pink-50 group-hover:text-pink-600">
                        {c.category}
                      </span>
                      <ExternalLink size={11} className="text-slate-400 group-hover:text-pink-600" />
                    </div>
                    <p className="font-extrabold text-slate-800 text-xs truncate group-hover:text-pink-600">
                      {c.shortName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {c.totalAlbums} Event Albums
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                <p className="text-xs text-slate-400">Try selecting another club filter or post a new Google Drive event album.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => {
                  const clubMeta = clubMasterDrives[album.clubId] || null;
                  const clubDisplayName = clubMeta?.shortName || album.clubName;
                  const canEditThisAlbum = canManage && (!isCoreTeam || album.clubId === assignedClubId || selectedClubFilter === album.clubId);

                  return (
                    <div
                      key={album.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                      {/* Album Cover Image with Total Photos Counter Tag */}
                      <div 
                        onClick={() => handleViewAlbumPhotos(album)}
                        className="h-52 overflow-hidden relative bg-slate-900 cursor-pointer"
                      >
                        <img
                          src={album.coverImage}
                          alt={album.eventName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Club Badge Tag */}
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-extrabold text-[11px] shadow-md border ${
                          album.clubId === 'akriti' ? 'bg-pink-600/90 text-white border-pink-400/30' :
                          album.clubId === 'codeholics' ? 'bg-blue-600/90 text-white border-blue-400/30' :
                          album.clubId === 'photography' ? 'bg-purple-600/90 text-white border-purple-400/30' :
                          album.clubId === 'lexis' ? 'bg-emerald-600/90 text-white border-emerald-400/30' :
                          album.clubId === 'ncc' ? 'bg-amber-600/90 text-white border-amber-400/30' :
                          'bg-red-600/90 text-white border-red-400/30'
                        }`}>
                          {clubDisplayName}
                        </span>

                        {/* Total Photos Tag */}
                        <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-pink-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 border border-pink-400/40">
                          <Images size={13} />
                          <span>{album.photos?.length || 1}+ Photos</span>
                        </span>

                        {/* Hover Overlay Prompt */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                          <Eye size={16} />
                          <span>Click to View Gallery</span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 
                            onClick={() => handleViewAlbumPhotos(album)}
                            className="font-black text-slate-900 text-base leading-snug group-hover:text-pink-600 transition-colors cursor-pointer"
                          >
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
                            onClick={() => handleViewAlbumPhotos(album)}
                            className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                          >
                            <Eye size={14} />
                            <span>View Photos</span>
                          </button>

                          <button
                            onClick={() => handleOpenDriveAlbum(album)}
                            className="py-2.5 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-all cursor-pointer active:scale-95"
                            title="Open in Google Drive"
                          >
                            <Folder size={14} />
                            <span>Drive</span>
                            <ExternalLink size={11} />
                          </button>

                          {canEditThisAlbum && (
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
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* IN-APP PHOTO LIGHTBOX VIEWER MODAL */}
        {viewingAlbum && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
            <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]">
              {/* Lightbox Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 text-white">
                <div className="space-y-0.5 min-w-0 text-left">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {viewingAlbum.clubName}
                  </span>
                  <h3 className="font-black text-white text-sm sm:text-base truncate mt-1">
                    {viewingAlbum.eventName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{viewingAlbum.eventDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const photoList = viewingAlbum.photos || [viewingAlbum.coverImage];
                      const cur = photoList[photoIndex] || viewingAlbum.coverImage;
                      handleDownloadPhoto(cur, viewingAlbum.eventName);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={() => handleOpenDriveAlbum(viewingAlbum)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Folder size={14} />
                    <span className="hidden sm:inline">Google Drive</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => setViewingAlbum(null)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Photo Display Stage with Carousel */}
              {(() => {
                const photos = viewingAlbum.photos && viewingAlbum.photos.length > 0 ? viewingAlbum.photos : [viewingAlbum.coverImage];
                const currentImg = photos[photoIndex] || viewingAlbum.coverImage;

                return (
                  <div className="relative flex-1 bg-black flex items-center justify-center p-4 min-h-[360px] max-h-[60vh] overflow-hidden">
                    <img
                      src={currentImg}
                      alt={`${viewingAlbum.eventName} - photo ${photoIndex + 1}`}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
                    />

                    {/* Left / Right Carousel Controls */}
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer active:scale-90"
                          title="Previous Photo"
                        >
                          <ChevronLeft size={22} />
                        </button>
                        <button
                          onClick={() => setPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer active:scale-90"
                          title="Next Photo"
                        >
                          <ChevronRight size={22} />
                        </button>
                      </>
                    )}

                    {/* Photo Counter Pill */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-xs font-bold border border-white/10">
                      Photo {photoIndex + 1} of {photos.length}
                    </div>
                  </div>
                );
              })()}

              {/* Thumbnail Strip */}
              {(() => {
                const photos = viewingAlbum.photos && viewingAlbum.photos.length > 0 ? viewingAlbum.photos : [viewingAlbum.coverImage];
                if (photos.length <= 1) return null;

                return (
                  <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
                    {photos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPhotoIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          photoIndex === idx ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* CREATE GOOGLE DRIVE ALBUM MODAL (Coordinators & Admins Only) */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FolderPlus size={20} className="text-pink-600" />
                  <span>Post Event Album to Google Drive</span>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Target Club *</label>
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
                    required
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. CMR HackFest 2026 Grand Finale"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Date *</label>
                  <input
                    type="text"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. October 15, 2026"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Drive Folder Link *</label>
                  <input
                    type="url"
                    required
                    value={newDriveUrl}
                    onChange={(e) => setNewDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL (Optional)</label>
                  <input
                    type="text"
                    value={newCoverUrl}
                    onChange={(e) => setNewCoverUrl(e.target.value)}
                    placeholder="e.g. /images/codeholics/codeholics-hack-the-verse.png"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Approximate Photo Count</label>
                  <input
                    type="number"
                    value={newPhotoCount}
                    onChange={(e) => setNewPhotoCount(e.target.value)}
                    placeholder="150"
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

