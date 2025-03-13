// src/components/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing session on initial load
  useEffect(() => {
    // Get authentication data from localStorage
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole');
    const storedDetails = localStorage.getItem('userDetails');
    
    if (storedAuth && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      
      if (storedDetails) {
        try {
          setUserDetails(JSON.parse(storedDetails));
        } catch (e) {
          console.error('Error parsing stored user details:', e);
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem('userDetails');
        }
      }
    }
    
    setLoading(false);
  }, []);
  
  // Derived values
  const isCollegeAdmin = userRole === 'college_admin';
  const isDepartmentAdmin = userRole === 'department_admin';

  // Authentication functions
  const login = (accessToken, refreshToken, role, details = null) => {
    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    
    if (details) {
      localStorage.setItem('userDetails', JSON.stringify(details));
      setUserDetails(details);
    }
    
    // Update state
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userDetails');
    
    // Update state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserDetails(null);
  };

  // Provide context values
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    userDetails,
    setUserDetails,
    isCollegeAdmin,
    isDepartmentAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};