// src/components/admin/UserManagement.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getPrimaryColors } from '../../utils/colors';

// Import shared student tab component
import StudentsTab from '../common/user_management/StudentsTab';

// Import college admin specific admin tab (only loaded for college admins)
const AdminsTab = React.lazy(() => import('../admin/college/AdminsTab'));

const useStyles = makeStyles({
  root: {
    padding: '20px',
  },
  categoryTabs: {
    marginBottom: '20px !important',
    '& .MuiTabs-indicator': {
      backgroundColor: props => `${props.colors.main} !important`,
    },
  },
  categoryTab: {
    fontWeight: '600 !important',
    fontSize: '16px !important',
    '&.Mui-selected': {
      color: props => `${props.colors.main} !important`,
    },
  },
  tabPanel: {
    padding: '0 !important',
  }
});

// Custom TabPanel component
const TabPanel = ({ children, value, index, ...other }) => {
  const { userRole } = useAuth();
  const colors = getPrimaryColors(userRole || 'college_admin');
  const classes = useStyles({ colors });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

/**
 * Unified user management component with role-based content
 */
const UserManagement = () => {
  const { userRole, isCollegeAdmin } = useAuth();
  const colors = getPrimaryColors(userRole || 'college_admin');
  const classes = useStyles({ colors });
  
  // Tabs state - only relevant for college admin as department admin only has students tab
  const [categoryTab, setCategoryTab] = useState(0); // 0 for Students, 1 for Admins

  const handleCategoryTabChange = (event, newValue) => {
    setCategoryTab(newValue);
  };

  // For department admin, render just the students tab
  if (!isCollegeAdmin()) {
    return (
      <Box className={classes.root}>
        <StudentsTab role={userRole} />
      </Box>
    );
  }

  // For college admin, render tabbed interface with Students and Admins tabs
  return (
    <Box className={classes.root}>
      {/* User Category Tabs - only shown for college admin */}
      <Tabs 
        value={categoryTab}
        onChange={handleCategoryTabChange}
        className={classes.categoryTabs}
        variant="fullWidth"
        indicatorColor="primary"
      >
        <Tab 
          label="Students" 
          className={classes.categoryTab}
          icon={<PersonIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Admins" 
          className={classes.categoryTab}
          icon={<AdminIcon />}
          iconPosition="start"
        />
      </Tabs>

      {/* Students Tab Panel */}
      <TabPanel value={categoryTab} index={0}>
        <StudentsTab role={userRole} />
      </TabPanel>
    
      {/* Admins Tab Panel - only for college admin */}
      <TabPanel value={categoryTab} index={1}>
        <React.Suspense fallback={<div>Loading admins tab...</div>}>
          <AdminsTab />
        </React.Suspense>
      </TabPanel>
    </Box>
  );
};

export default UserManagement;