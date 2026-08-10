import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const roleLabels = {
  student: 'Student Member',
  core: 'Club Core Team / Coordinator',
  faculty: 'Faculty Coordinator',
  admin: 'Administrator'
};

export const isCollegeEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  const allowedDomains = ['cmr.edu.in', 'cmrtc.ac.in', 'cmrg.ac.in', 'cmr.ac.in', 'cmrcet.ac.in', 'cmrec.ac.in'];
  return allowedDomains.some(domain => clean.endsWith(`@${domain}`));
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

  // Sync with backend on initial load if token exists
  useEffect(() => {
    const syncCurrentUser = async () => {
      const token = localStorage.getItem('unisphere_jwt_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res?.user) {
            const userData = {
              ...res.user,
              roleTitle: roleLabels[res.user.role] || 'Student Member'
            };
            setUser(userData);
            setIsCoordinator(res.user.role !== 'student');
            localStorage.setItem('cmrtc_auth_user', JSON.stringify(userData));
          }
        } catch (err) {
          // Keep offline state if server is not reachable
        }
      }
    };

    syncCurrentUser();
  }, []);

  const login = async (email, password, role = 'student', assignedClub = 'codeholics') => {
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return { success: false, message: 'Please enter your college email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Strict College Email Enforcement for All Roles
    if (!isCollegeEmail(cleanEmail)) {
      setLoading(false);
      return { 
        success: false, 
        message: 'Access Denied: Only official college email IDs (@cmr.edu.in or @cmrtc.ac.in) are permitted for student, faculty, core team, and admin logins.' 
      };
    }

    let finalRole = role;
    if (cleanEmail.includes('admin')) finalRole = 'admin';
    else if (cleanEmail.includes('faculty') || cleanEmail.includes('prof') || cleanEmail.includes('hod') || cleanEmail.includes('dr.')) finalRole = 'faculty';
    else if (cleanEmail.includes('core') || cleanEmail.includes('coordinator') || cleanEmail.includes('lead')) finalRole = 'core';

    // 1. Try Backend API first
    try {
      const response = await authApi.login({ email: cleanEmail, password });
      if (response?.token && response?.user) {
        localStorage.setItem('unisphere_jwt_token', response.token);
        const userData = {
          ...response.user,
          roleTitle: roleLabels[response.user.role] || 'Student Member'
        };
        setUser(userData);
        const isLead = response.user.role !== 'student';
        setIsCoordinator(isLead);
        localStorage.setItem('cmrtc_auth_user', JSON.stringify(userData));
        if (isLead) localStorage.setItem('cmrtc_is_coordinator', 'true');
        else localStorage.removeItem('cmrtc_is_coordinator');

        setLoading(false);
        return { success: true, role: response.user.role };
      }
    } catch (err) {
      console.warn('Backend login unavailable or invalid credentials, falling back to local session:', err.message);
    }

    // 2. Client Fallback
    const name = cleanEmail.split('@')[0].toUpperCase();
    const userData = { 
      email: cleanEmail, 
      name, 
      rollNumber: cleanEmail.split('@')[0].toUpperCase(),
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
    
    setLoading(false);
    return { success: true, role: finalRole };
  };

  const register = async (email, password, role = 'student', assignedClub = 'codeholics') => {
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return { success: false, message: 'Please enter your college email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Strict College Email Enforcement
    if (!isCollegeEmail(cleanEmail)) {
      setLoading(false);
      return { 
        success: false, 
        message: 'Registration Restricted: Only official college email IDs (@cmr.edu.in or @cmrtc.ac.in) can create accounts.' 
      };
    }

    const name = cleanEmail.split('@')[0].toUpperCase();

    // 1. Try Backend API
    try {
      const response = await authApi.register({
        name,
        email: cleanEmail,
        password,
        role,
        assignedClub
      });

      if (response?.token && response?.user) {
        localStorage.setItem('unisphere_jwt_token', response.token);
        const userData = {
          ...response.user,
          roleTitle: roleLabels[response.user.role] || 'Student Member'
        };
        setUser(userData);
        const isLead = response.user.role !== 'student';
        setIsCoordinator(isLead);
        localStorage.setItem('cmrtc_auth_user', JSON.stringify(userData));
        if (isLead) localStorage.setItem('cmrtc_is_coordinator', 'true');
        else localStorage.removeItem('cmrtc_is_coordinator');

        setLoading(false);
        return { success: true, role: response.user.role };
      }
    } catch (err) {
      console.warn('Backend register fallback:', err.message);
    }

    // 2. Client Fallback
    const userData = { 
      email: cleanEmail, 
      name, 
      rollNumber: name,
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
      else localStorage.removeItem('cmrtc_is_coordinator');
    } catch {}
    
    setLoading(false);
    return { success: true, role };
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
      localStorage.removeItem('unisphere_jwt_token');
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
