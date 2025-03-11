// src/components/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login_page/Login';
import ForgotPassword from './login_page/ForgotPassword';
import Main from './admin/Main';
import { useAuth } from '../contexts/AuthContext';

/**
 * AppRoutes component that handles routing based on authentication state
 */
const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

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
            <Main />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default AppRoutes;