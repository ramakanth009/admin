// src/components/AppRoutes.jsx - UPDATED
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './login_page/Login';
import ForgotPassword from './login_page/ForgotPassword';
import CollegeAdminMain from './college_admin/Main';
import DepartmentAdminMain from './department_admin/Main';
import { useAuth } from './AuthContext';

const AppRoutes = () => {
  const { isAuthenticated, isCollegeAdmin, isDepartmentAdmin } = useAuth();

  // Select the appropriate Main component based on the user role
  // Don't call any functions inside the JSX that might change on every render
  const getMainComponent = () => {
    if (isCollegeAdmin()) {
      return CollegeAdminMain;
    } else if (isDepartmentAdmin()) {
      return DepartmentAdminMain;
    }
    return null;
  };

  const MainComponent = getMainComponent();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPassword />} 
      />
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            MainComponent ? <MainComponent /> : <Navigate to="/login" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;