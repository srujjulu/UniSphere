import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const roleLabels = {
  student: 'Student Member',
  core: 'Club Core Team / Coordinator',
  faculty: 'Faculty Coordinator',
  admin: 'Administrator'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cmrtc_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isCoordinator, setIsCoordinator] = useState(() => {
    try {
      return localStorage.getItem('cmrtc_is_coordinator') === 'true';
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, role = 'student', assignedClub = 'codeholics') => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);

    if (email && password && password.length >= 4) {
      const name = email.split('@')[0].toUpperCase();
      let finalRole = role;
      if (email.includes('admin')) finalRole = 'admin';
      else if (email.includes('faculty')) finalRole = 'faculty';
      else if (email.includes('core')) finalRole = 'core';

      const userData = { 
        email, 
        name, 
        role: finalRole,
        assignedClub: assignedClub || 'codeholics',
        roleTitle: roleLabels[finalRole] || 'Student Member'
      };
      
      setUser(userData);
      const isLead = finalRole !== 'student';
      setIsCoordinator(isLead);
      
      try {
        localStorage.setItem('cmrtc_auth_user', JSON.stringify(userData));
        if (isLead) localStorage.setItem('cmrtc_is_coordinator', 'true');
        else localStorage.removeItem('cmrtc_is_coordinator');
      } catch {}
      
      return { success: true, role: finalRole };
    } else {
      return { success: false, message: 'Please enter a valid email and password.' };
    }
  };

  const register = async (email, password, role = 'student', assignedClub = 'codeholics') => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);

    if (email && password && password.length >= 4) {
      const name = email.split('@')[0].toUpperCase();
      const userData = { 
        email, 
        name, 
        role,
        assignedClub: assignedClub || 'codeholics',
        roleTitle: roleLabels[role] || 'Student Member'
      };
      
      setUser(userData);
      const isLead = role !== 'student';
      setIsCoordinator(isLead);
      
      try {
        localStorage.setItem('cmrtc_auth_user', JSON.stringify(userData));
        if (isLead) localStorage.setItem('cmrtc_is_coordinator', 'true');
      } catch {}
      
      return { success: true, role };
    } else {
      return { success: false, message: 'Please enter a valid email and password.' };
    }
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role: newRole,
      roleTitle: roleLabels[newRole] || 'Student Member'
    };
    setUser(updatedUser);
    const isLead = newRole !== 'student';
    setIsCoordinator(isLead);
    try {
      localStorage.setItem('cmrtc_auth_user', JSON.stringify(updatedUser));
      if (isLead) localStorage.setItem('cmrtc_is_coordinator', 'true');
      else localStorage.removeItem('cmrtc_is_coordinator');
    } catch {}
  };

  const authenticateCoordinator = (pin) => {
    const validPins = ['2026', 'CMRTC', 'CMRTC2026', 'ADMIN'];
    if (validPins.includes(pin.trim().toUpperCase())) {
      setIsCoordinator(true);
      if (user && user.role === 'student') {
        switchRole('core');
      }
      try { localStorage.setItem('cmrtc_is_coordinator', 'true'); } catch {}
      return { success: true };
    }
    return { success: false, message: 'Invalid Coordinator Security PIN. Use 2026 to verify.' };
  };

  const revokeCoordinator = () => {
    setIsCoordinator(false);
    if (user) {
      switchRole('student');
    }
    try { localStorage.removeItem('cmrtc_is_coordinator'); } catch {}
  };

  const logout = () => {
    setUser(null);
    setIsCoordinator(false);
    try {
      localStorage.removeItem('cmrtc_auth_user');
      localStorage.removeItem('cmrtc_is_coordinator');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isCoordinator, 
      login, 
      register, 
      switchRole,
      authenticateCoordinator, 
      revokeCoordinator, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
