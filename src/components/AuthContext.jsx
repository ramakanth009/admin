// src/components/AuthContext.jsx (simplified)
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Simple boolean values, not functions
  const isCollegeAdmin = userRole === 'college_admin';
  const isDepartmentAdmin = userRole === 'department_admin';

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    isCollegeAdmin,
    isDepartmentAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};