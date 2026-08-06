import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleDashboardMap = {
  student: '/student-dashboard',
  core: '/core-dashboard',
  faculty: '/faculty-dashboard',
  admin: '/admin-dashboard'
};

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || 'student';

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const targetPath = roleDashboardMap[userRole] || '/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
