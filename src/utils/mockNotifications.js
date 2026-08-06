export const initialNotifications = [
  {
    id: 'notif-1',
    role: 'student',
    title: 'Membership Approved! 🎉',
    message: 'Your membership application for AKRITI Cultural Club has been approved by the Core Team.',
    time: '10 mins ago',
    type: 'success',
    read: false,
    link: '/student-dashboard'
  },
  {
    id: 'notif-2',
    role: 'student',
    title: 'Event Pass Confirmed 🎫',
    message: 'Successfully registered for CMR HackFest 2026 36-Hour Hackathon. Seat #42 reserved.',
    time: '2 hours ago',
    type: 'info',
    read: false,
    link: '/student-dashboard'
  },
  {
    id: 'notif-3',
    role: 'student',
    title: 'New Event Photos Uploaded 📸',
    message: 'AKRITI Cultural Club uploaded 12 high-res photos from Pegasus 2025 Dance Auditions.',
    time: '1 day ago',
    type: 'info',
    read: true,
    link: '/student-dashboard'
  },
  {
    id: 'notif-4',
    role: 'core',
    title: 'Pending Membership Requests ⏳',
    message: '3 new students have requested to join Codeholics Tech Club.',
    time: '30 mins ago',
    type: 'warning',
    read: false,
    link: '/core-dashboard'
  },
  {
    id: 'notif-5',
    role: 'faculty',
    title: 'Major Event Approval Required 📋',
    message: 'AKRITI Club submitted "Pegasus 2026 Annual Cultural Fest" (Budget: ₹1.5 Lakhs) for review.',
    time: '1 hour ago',
    type: 'warning',
    read: false,
    link: '/faculty-dashboard'
  },
  {
    id: 'notif-6',
    role: 'admin',
    title: 'System Audit Alert 🛡️',
    message: 'Database backup completed successfully. Total active student accounts: 1,240.',
    time: '3 hours ago',
    type: 'info',
    read: true,
    link: '/admin-dashboard'
  }
];

export const getStoredNotifications = () => {
  if (typeof window === 'undefined') return initialNotifications;
  const stored = localStorage.getItem('cmrtc_notifications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialNotifications;
    }
  }
  return initialNotifications;
};

export const addNotification = (newNotif) => {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications();
  const item = {
    id: `notif-${Date.now()}`,
    time: 'Just now',
    read: false,
    type: 'info',
    ...newNotif
  };
  const updated = [item, ...current];
  localStorage.setItem('cmrtc_notifications', JSON.stringify(updated));
  return updated;
};

export const markAllNotificationsAsRead = () => {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, read: true }));
  localStorage.setItem('cmrtc_notifications', JSON.stringify(updated));
  return updated;
};

export const clearNotifications = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cmrtc_notifications', JSON.stringify([]));
  return [];
};
