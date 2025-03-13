import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Sidebar from './Sidebar';
import NavBar from './Navbar';
import Dashboard from './dashboard/Dashboard';
import UserManagement from './user_management/UserManagement';
import { useAuth } from '../AuthContext';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

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

const Main = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If not authenticated or not a department admin, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box className={classes.root}>
      <NavBar />
      <Box className={classes.contentWrapper}>
        <Sidebar />
        <Box className={classes.mainContent}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student-management" element={<UserManagement />} />
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;