import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClubPage from './pages/ClubPage';
import ClubSignInPage from './pages/ClubSignInPage';

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* 1st Page: Login (if logged out) or direct Dashboard (if logged in) */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* 2nd Page: All Clubs Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 3rd Page: Individual Dedicated Page for Each Club */}
      <Route path="/club/:clubId" element={<ClubPage />} />
      <Route path="/club/:clubId/signin" element={<ClubSignInPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

