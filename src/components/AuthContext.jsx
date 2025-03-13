// src/components/AuthContext.jsx - UPDATED
import React, { createContext, useState, useEffect, useContext } from 'react';
import LoadingSpinner from './common/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    // This effect should only run once on mount
    const checkAuth = () => {
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
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    checkAuth();
    // Empty dependency array ensures this runs only once
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

  const isCollegeAdmin = () => userRole === 'college_admin';
  const isDepartmentAdmin = () => userRole === 'department_admin';

  if (isLoading) {
    return <LoadingSpinner message="Initializing application..." />;
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
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};