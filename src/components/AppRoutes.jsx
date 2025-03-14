import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login_page/Login';
import ForgotPassword from './login_page/ForgotPassword';
import CollegeAdminMain from './college_admin/Main';
import DepartmentAdminMain from './department_admin/Main';
import { useAuth } from './AuthContext';

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  // Define the functions to check user roles
  const isCollegeAdmin = () => userRole === 'college_admin';
  const isDepartmentAdmin = () => userRole === 'department_admin';

  // Select the appropriate Main component based on the user role
  const MainComponent = isCollegeAdmin() 
    ? CollegeAdminMain 
    : isDepartmentAdmin() 
      ? DepartmentAdminMain 
      : null;

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