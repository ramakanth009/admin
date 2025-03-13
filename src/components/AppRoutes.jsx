// src/components/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './login_page/Login';
import ForgotPassword from './login_page/ForgotPassword';
import CollegeAdminMain from './college_admin/Main';
import DepartmentAdminMain from './department_admin/Main';

const AppRoutes = () => {
  const { isAuthenticated, isCollegeAdmin, isDepartmentAdmin } = useAuth();
  
  let MainComponent = null;
  if (isCollegeAdmin) {
    MainComponent = CollegeAdminMain;
  } else if (isDepartmentAdmin) {
    MainComponent = DepartmentAdminMain;
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Dashboard and other authenticated routes */}
      <Route path="/dashboard" element={isAuthenticated ? (MainComponent ? <MainComponent /> : <Navigate to="/login" />) : <Navigate to="/login" />} />
      
      {/* Catch-all route for the root path */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      
      {/* Catch-all route for any other path */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;