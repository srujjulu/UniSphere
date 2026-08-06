import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClubPage from './pages/ClubPage';
import ClubSignInPage from './pages/ClubSignInPage';
import ClubSignUpPage from './pages/ClubSignUpPage';
import ClubMemberDashboardPage from './pages/ClubMemberDashboardPage';

// Dedicated Dashboards & RBAC Guard
import StudentDashboard from './components/dashboard/StudentDashboard';
import CoreTeamDashboard from './components/dashboard/CoreTeamDashboard';
import FacultyDashboard from './components/dashboard/FacultyDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

function DashboardRoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Dashboard />;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'core':
      return <CoreTeamDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Dashboard />;
  }
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Homepage & Main Discovery Dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<DashboardRoleRedirect />} />
      <Route path="/explore-clubs" element={<Dashboard />} />

      {/* Authentication */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* 4 Dedicated Role-Based Dashboards */}
      <Route 
        path="/student-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/core-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['core', 'admin']}>
            <CoreTeamDashboard />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/faculty-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['faculty', 'admin']}>
            <FacultyDashboard />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        } 
      />

      {/* Individual Dedicated Page for Each Club & Member Dashboards */}
      <Route path="/club/:clubId" element={<ClubPage />} />
      <Route path="/club/:clubId/signin" element={<ClubSignInPage />} />
      <Route path="/club/:clubId/signup" element={<ClubSignUpPage />} />
      <Route path="/club/:clubId/register" element={<ClubSignUpPage />} />
      <Route path="/club/:clubId/member-dashboard" element={<ClubMemberDashboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
