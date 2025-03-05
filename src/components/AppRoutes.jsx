import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../components/login_page/Login';
import ForgotPasswordPage from './ForgotPassword';
import Main from '../components/Main';
import { useAuth } from './AuthContext';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/forgot-password" 
        element={<ForgotPasswordPage />} 
      />
      <Route 
        path="/*" 
        element={isAuthenticated ? <Main /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;