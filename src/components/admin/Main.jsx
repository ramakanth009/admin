// src/components/admin/Main.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useAuth } from '../../contexts/AuthContext';
import { getPrimaryColors } from '../../utils/colors';

// Import unified components
import Sidebar from '../common/layout/Sidebar';
import Navbar from '../common/layout/Navbar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
  },
  mainContent: {
    marginLeft: '260px', // Width of the sidebar
    padding: '84px 20px 20px',
    flexGrow: 1,
    transition: 'margin-left 0.3s',
    width: 'calc(100% - 260px)',
  },
  fullWidth: {
    marginLeft: 0,
    width: '100%',
  },
});

/**
 * Unified Main component that serves as the application layout container
 * and handles role-based routing
 */
const Main = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated, userRole, isCollegeAdmin, isDepartmentAdmin } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure user has valid role
  if (!isCollegeAdmin() && !isDepartmentAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box className={classes.root}>
      {/* Unified navbar with role prop */}
      <Navbar role={userRole} />
      
      <Box className={classes.contentWrapper}>
        {/* Unified sidebar with role prop */}
        <Sidebar role={userRole} />
        
        <Box className={classes.mainContent}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Unified dashboard with role detection */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Unified user management with role detection */}
            <Route path="/student-management" element={<UserManagement />} />
            
            {/* College admin specific routes can be conditionally rendered here */}
            {isCollegeAdmin() && (
              <>
                {/* Example: <Route path="/college-settings" element={<CollegeSettings />} /> */}
              </>
            )}
            
            {/* Department admin specific routes can be conditionally rendered here */}
            {isDepartmentAdmin() && (
              <>
                {/* Example: <Route path="/department-settings" element={<DepartmentSettings />} /> */}
              </>
            )}
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;