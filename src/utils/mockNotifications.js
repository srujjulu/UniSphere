export const initialNotifications = [
  // Student Notifications
  {
    id: 'notif-s1',
    role: 'student',
    title: 'Membership Approved! 🎉',
    message: 'Your membership application for The Lexis Club has been APPROVED by club leads.',
    time: '10 mins ago',
    type: 'success',
    category: 'Membership Approved',
    read: false
  },
  {
    id: 'notif-s2',
    role: 'student',
    title: 'Membership Status Update 📋',
    message: 'Your application for Codeholics Club was reviewed. Contact coordinator for seat allocation.',
    time: '45 mins ago',
    type: 'warning',
    category: 'Membership Rejected',
    read: false
  },
  {
    id: 'notif-s3',
    role: 'student',
    title: 'Event Reminder ⏰',
    message: 'Reminder: CMR HackFest 2026 36-Hour Hackathon starts tomorrow at Tech Lab 4!',
    time: '2 hours ago',
    type: 'info',
    category: 'Event Reminder',
    read: false
  },
  {
    id: 'notif-s4',
    role: 'student',
    title: 'Certificate Available 📜',
    message: 'New verified certificate available: "Model United Nations Best Delegate Certification".',
    time: '5 hours ago',
    type: 'success',
    category: 'Certificate Available',
    read: false
  },
  {
    id: 'notif-s5',
    role: 'student',
    title: 'New Announcement 📢',
    message: 'AKRITI Cultural Club published: "Pegasus 2026 Annual Cultural Fest Registrations Open!"',
    time: '1 day ago',
    type: 'info',
    category: 'New Announcement',
    read: true
  },

  // Core Team Notifications
  {
    id: 'notif-c1',
    role: 'core',
    title: 'New Membership Request 👤',
    message: 'Student Srujan Maringanti (237R1A05BA) submitted membership application for Lexis Club.',
    time: '15 mins ago',
    type: 'warning',
    category: 'New Membership Request',
    read: false
  },
  {
    id: 'notif-c2',
    role: 'core',
    title: 'New Event Registration 🎟️',
    message: 'New student registration confirmed for CMR HackFest 2026 36-Hour Hackathon.',
    time: '1 hour ago',
    type: 'info',
    category: 'New Event Registration',
    read: false
  },
  {
    id: 'notif-c3',
    role: 'core',
    title: 'Feedback Submitted ⭐',
    message: 'New 5-star review submitted for Pegasus 2025 Cultural Fest Showcase.',
    time: '3 hours ago',
    type: 'success',
    category: 'Feedback Submitted',
    read: false
  },

  // Faculty Notifications
  {
    id: 'notif-f1',
    role: 'faculty',
    title: 'Budget Approval Request 💰',
    message: 'AKRITI Cultural Club submitted budget allocation request of ₹1,50,000 for Pegasus 2026.',
    time: '30 mins ago',
    type: 'warning',
    category: 'Budget Request',
    read: false
  },
  {
    id: 'notif-f2',
    role: 'faculty',
    title: 'Event Approval Request ⚡',
    message: 'Codeholics Tech Club submitted major event proposal: "CMR HackFest 2026 36-Hour Hackathon".',
    time: '2 hours ago',
    type: 'warning',
    category: 'Event Approval Request',
    read: false
  },

  // Admin Notifications
  {
    id: 'notif-a1',
    role: 'admin',
    title: 'System Budget & Audit Alert 🛡️',
    message: 'Annual club expenditure audit ready for sign-off. Total active student users: 1,240.',
    time: '1 hour ago',
    type: 'info',
    category: 'Budget Request',
    read: false
  },
  {
    id: 'notif-a2',
    role: 'admin',
    title: 'Major Event Approval Request ⚡',
    message: 'New campus-wide technical symposium proposed by Faculty Board.',
    time: '4 hours ago',
    type: 'warning',
    category: 'Event Approval Request',
    read: false
  }
];

export const getStoredNotifications = () => {
  if (typeof window === 'undefined') return initialNotifications;
  const stored = localStorage.getItem('cmrtc_notifications_data');
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
  localStorage.setItem('cmrtc_notifications_data', JSON.stringify(updated));
  return updated;
};

export const markNotificationAsRead = (id) => {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('cmrtc_notifications_data', JSON.stringify(updated));
  return updated;
};

export const markAllNotificationsAsRead = (role = 'student') => {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications();
  const updated = current.map(n => (n.role === role || n.role === 'all' || !role) ? { ...n, read: true } : n);
  localStorage.setItem('cmrtc_notifications_data', JSON.stringify(updated));
  return updated;
};

export const clearNotification = (id) => {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications();
  const updated = current.filter(n => n.id !== id);
  localStorage.setItem('cmrtc_notifications_data', JSON.stringify(updated));
  return updated;
};

export const clearNotifications = () => {
  if (typeof window === 'undefined') return [];
  localStorage.setItem('cmrtc_notifications_data', JSON.stringify([]));
  return [];
};
