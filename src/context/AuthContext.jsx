import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    if (email === 'admin@cmr.edu.in' && password === 'password123') {
      setUser({ email, name: 'Admin User' });
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password. Use: admin@cmr.edu.in / password123' };
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    // Simulate registration
    if (email.endsWith('@cmr.edu.in')) {
      setUser({ email, name: email.split('@')[0] });
      return { success: true };
    } else {
      return { success: false, message: 'Registration is restricted to @cmr.edu.in email addresses.' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
