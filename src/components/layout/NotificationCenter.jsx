import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  Award,
  Calendar,
  DollarSign,
  UserCheck,
  Star,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getStoredNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  clearNotification,
  clearNotifications 
} from '../../utils/mockNotifications';

const typeIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle
};

const categoryBadgeColors = {
  'Membership Approved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Membership Rejected': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Event Reminder': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Certificate Available': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'New Announcement': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'New Membership Request': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'New Event Registration': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Feedback Submitted': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Budget Request': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Event Approval Request': 'bg-amber-500/20 text-amber-300 border-amber-500/30'
};

const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  const effectiveRole = user?.role || 'student';

  const syncNotifications = () => {
    const all = getStoredNotifications();
    setNotifications(all);
  };

  useEffect(() => {
    syncNotifications();
    window.addEventListener('storage', syncNotifications);
    return () => window.removeEventListener('storage', syncNotifications);
  }, []);

  // Filter notifications for the current user's role
  const userNotifications = notifications.filter(
    n => n.role === effectiveRole || n.role === 'all'
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const displayNotifications = userNotifications.filter(n => 
    filter === 'unread' ? !n.read : true
  );

  const handleMarkItemRead = (id, e) => {
    e.stopPropagation();
    markNotificationAsRead(id);
    syncNotifications();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(effectiveRole);
    syncNotifications();
  };

  const handleClearItem = (id, e) => {
    e.stopPropagation();
    clearNotification(id);
    syncNotifications();
  };

  return (
    <div className="relative inline-block text-left select-none z-30 font-sans">
      {/* Bell Trigger with Glowing Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
        title="Campus Notification Center"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-lg border-2 border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-32px)] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-5 z-50 text-slate-200 space-y-4 max-h-[85vh] flex flex-col"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-pink-400" />
                  <h3 className="text-sm font-black text-white">Campus Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px]">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-1 rounded-lg font-extrabold cursor-pointer transition-all ${
                    filter === 'all' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({userNotifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-1 rounded-lg font-extrabold cursor-pointer transition-all ${
                    filter === 'unread' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification List Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px] scrollbar-thin">
                {displayNotifications.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <Sparkles size={28} className="mx-auto text-slate-600" />
                    <p className="text-xs font-bold text-slate-400">No notifications found.</p>
                  </div>
                ) : (
                  displayNotifications.map((notif) => {
                    const badgeClass = categoryBadgeColors[notif.category] || 'bg-blue-500/20 text-blue-300 border-blue-500/30';

                    return (
                      <div
                        key={notif.id}
                        onClick={(e) => handleMarkItemRead(notif.id, e)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative group ${
                          notif.read 
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100' 
                            : 'bg-slate-900/90 border-slate-700/80 shadow-md'
                        }`}
                      >
                        {!notif.read && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#EC4899]" />
                        )}

                        <div className="flex items-center justify-between gap-2 pr-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}>
                            {notif.category || notif.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{notif.time}</span>
                        </div>

                        <div className="space-y-0.5">
                          <h4 className="text-xs font-extrabold text-white leading-snug">{notif.title}</h4>
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{notif.message}</p>
                        </div>

                        <div className="pt-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.read && (
                            <button
                              onClick={(e) => handleMarkItemRead(notif.id, e)}
                              className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <CheckCheck size={12} />
                              <span>Mark Read</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => handleClearItem(notif.id, e)}
                            className="text-[10px] font-bold text-slate-500 hover:text-red-400 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer CTA */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Role: <strong className="text-white uppercase">{effectiveRole}</strong></span>
                {userNotifications.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-pink-400 hover:underline font-bold"
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
