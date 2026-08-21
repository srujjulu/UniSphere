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
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.rollNo === '237R1A05BA' || parsed.rollNumber === '237R1A05BA' || parsed.email === 'student@cmr.edu.in' || parsed.email === 'srujan@cmr.edu.in' || parsed.email === 'srujanya@cmr.edu.in') {
          if (parsed.name === 'Srujan Maringanti' || parsed.name === 'Srujan Reddy' || parsed.name === 'Student Member') {
            parsed.name = 'Srujanya Maringanti';
            localStorage.setItem('cmrtc_auth_user', JSON.stringify(parsed));
          }
        }
        return parsed;
      }
      return null;
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
    const rawPrefix = cleanEmail.split('@')[0];
    
    // Check if user was registered previously in local storage registry
    let savedRegisteredUsers = {};
    try {
      savedRegisteredUsers = JSON.parse(localStorage.getItem('cmrtc_registered_users') || '{}');
    } catch {}

    const registeredProfile = savedRegisteredUsers[cleanEmail];

    let displayName = registeredProfile?.name;
    let rollNo = registeredProfile?.rollNumber || registeredProfile?.rollNo;
    let branch = registeredProfile?.branch || 'Computer Science & Engineering (CSE)';
    let academicYear = registeredProfile?.academicYear || '3rd Year • Semester 1';
    let phone = registeredProfile?.phone || '+91 98765 43210';

    if (!displayName) {
      if (cleanEmail === 'student@cmr.edu.in' || cleanEmail === 'srujan@cmr.edu.in' || cleanEmail === 'srujanya@cmr.edu.in' || cleanEmail === '237r1a05ba@cmrtc.ac.in') {
        displayName = 'Srujanya Maringanti';
        rollNo = '237R1A05BA';
      } else if (/^\d{2}[a-zA-Z0-9]+$/i.test(rawPrefix)) {
        rollNo = rawPrefix.toUpperCase();
        displayName = `Student (${rollNo})`;
      } else {
        // Format names like "rahul.sharma" or "john_doe" to "Rahul Sharma" / "John Doe"
        displayName = rawPrefix
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
        rollNo = `237R1A${Math.abs(cleanEmail.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 9000 + 1000)}`;
      }
    }

    if (!rollNo) {
      rollNo = `237R1A${Math.abs(cleanEmail.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 9000 + 1000)}`;
    }

    const userData = { 
      email: cleanEmail, 
      name: displayName, 
      rollNumber: rollNo,
      rollNo: rollNo,
      branch: branch,
      academicYear: academicYear,
      phone: phone,
      role: finalRole,
      assignedClub: assignedClub || registeredProfile?.assignedClub || 'codeholics',
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

  const register = async (email, password, role = 'student', assignedClub = 'codeholics', customName = '', customRoll = '') => {
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

    const rawPrefix = cleanEmail.split('@')[0];
    let name = customName?.trim();
    if (!name) {
      name = rawPrefix
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }

    let rollNo = customRoll?.trim();
    if (!rollNo) {
      if (/^\d{2}[a-zA-Z0-9]+$/i.test(rawPrefix)) {
        rollNo = rawPrefix.toUpperCase();
      } else {
        rollNo = `237R1A${Math.abs(cleanEmail.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 9000 + 1000)}`;
      }
    }

    // Save in registered users registry
    try {
      const savedRegistered = JSON.parse(localStorage.getItem('cmrtc_registered_users') || '{}');
      savedRegistered[cleanEmail] = {
        email: cleanEmail,
        name,
        rollNumber: rollNo,
        rollNo,
        branch: 'Computer Science & Engineering (CSE)',
        academicYear: '3rd Year • Semester 1',
        phone: '+91 98765 43210',
        role,
        assignedClub
      };
      localStorage.setItem('cmrtc_registered_users', JSON.stringify(savedRegistered));
    } catch {}

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
          name: response.user.name || name,
          rollNumber: response.user.rollNumber || rollNo,
          rollNo: response.user.rollNo || rollNo,
          branch: response.user.branch || 'Computer Science & Engineering (CSE)',
          academicYear: response.user.academicYear || '3rd Year • Semester 1',
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
      rollNumber: rollNo,
      rollNo: rollNo,
      branch: 'Computer Science & Engineering (CSE)',
      academicYear: '3rd Year • Semester 1',
      phone: '+91 98765 43210',
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

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...updatedFields,
      rollNo: updatedFields.rollNumber || updatedFields.rollNo || user.rollNo || user.rollNumber,
      rollNumber: updatedFields.rollNumber || updatedFields.rollNo || user.rollNumber || user.rollNo
    };
    setUser(updatedUser);
    try {
      localStorage.setItem('cmrtc_auth_user', JSON.stringify(updatedUser));
      if (user.email) {
        const savedRegistered = JSON.parse(localStorage.getItem('cmrtc_registered_users') || '{}');
        savedRegistered[user.email] = {
          ...(savedRegistered[user.email] || {}),
          ...updatedUser
        };
        localStorage.setItem('cmrtc_registered_users', JSON.stringify(savedRegistered));
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}
    return updatedUser;
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
      updateProfile,
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
