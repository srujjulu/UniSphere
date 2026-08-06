import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getStoredNotifications, 
  markAllNotificationsAsRead, 
  clearNotifications 
} from '../../utils/mockNotifications';

const typeIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle
};

const typeColors = {
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
};

const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(getStoredNotifications);

  const effectiveRole = user?.role || 'student';

  // Filter notifications for the current user's role
  const userNotifications = notifications.filter(
    n => n.role === effectiveRole || n.role === 'all'
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleClearAll = () => {
    const updated = clearNotifications();
    setNotifications(updated);
  };

  return (
    <div className="relative inline-block text-left select-none z-30">
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
        title="Notifications Center"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-lg border-2 border-slate-950 animate-pulse">
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
              className="absolute left-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-32px)] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 z-50 text-slate-200 space-y-3 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-pink-400" />
                  <h3 className="text-sm font-black text-white">Notifications Center</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[10px]">
                      {unreadCount} New
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
                    onClick={handleClearAll}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                    title="Clear notifications"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto flex-1 space-y-2 pr-1 max-h-[50vh]">
                {userNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-1">
                    <Sparkles size={28} className="mx-auto text-slate-600" />
                    <p className="text-xs font-bold text-slate-400">All caught up!</p>
                    <p className="text-[10px] text-slate-500">No new notifications for your role.</p>
                  </div>
                ) : (
                  userNotifications.map((n) => {
                    const IconComp = typeIcons[n.type] || Info;
                    const typeColor = typeColors[n.type] || typeColors.info;
                    return (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border transition-all text-xs space-y-1 ${
                          !n.read 
                            ? 'bg-slate-900/90 border-slate-700/90 shadow-sm' 
                            : 'bg-slate-950/60 border-slate-900 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1 ${typeColor}`}>
                            <IconComp size={10} />
                            <span>{n.title}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-slate-300 font-medium text-[11px] leading-snug">
                          {n.message}
                        </p>
                      </div>
                    );
                  })
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
