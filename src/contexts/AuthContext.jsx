// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/common/ui/LoadingSpinner';
import { getPrimaryColors } from '../utils/colors';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component that manages authentication state
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    const storedDetails = localStorage.getItem('userDetails');
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      if (storedDetails) {
        try {
          setUserDetails(JSON.parse(storedDetails));
        } catch (e) {
          console.error("Error parsing user details:", e);
          setUserDetails(null);
        }
      }
    }
    
    // Simulate a slightly longer load for smooth animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Authentication methods
  const login = (token, refreshToken, role, details = null) => {
    localStorage.setItem('accessToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
    
    if (details) {
      localStorage.setItem('userDetails', JSON.stringify(details));
      setUserDetails(details);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserDetails(null);
  };

  // Role helper methods
  const isCollegeAdmin = () => userRole === 'college_admin';
  const isDepartmentAdmin = () => userRole === 'department_admin';
  
  // Enhanced helpers
  const getColors = () => {
    return getPrimaryColors(userRole || 'college_admin');
  };
  
  const getEntityName = () => {
    return userRole === 'college_admin' 
      ? userDetails?.institution || 'Institution'
      : userDetails?.department || 'Department';
  };
  
  // Role-based access control helper
  const canAccess = (resource) => {
    switch(resource) {
      case 'admin_management':
        return userRole === 'college_admin';
      case 'department_settings':
        return true; // Both roles can access, but with different scopes
      case 'profile_approval':
        return userRole === 'department_admin';
      default:
        return true;
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Initializing application..." role={userRole || 'college_admin'} />;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated,
      userRole,
      userDetails,
      isCollegeAdmin,
      isDepartmentAdmin,
      login,
      logout,
      getColors,
      getEntityName,
      canAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};