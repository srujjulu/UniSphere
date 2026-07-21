import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    if (email && password && password.length >= 4) {
      const name = email.split('@')[0].toUpperCase();
      setUser({ email, name });
      return { success: true };
    } else {
      return { success: false, message: 'Please enter a valid email and password.' };
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    if (email && password && password.length >= 4) {
      const name = email.split('@')[0].toUpperCase();
      setUser({ email, name });
      return { success: true };
    } else {
      return { success: false, message: 'Please enter a valid email and password.' };
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
