import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';

// Import modular components
import StudentsTab from './tabs/StudentsTab';
import AdminsTab from './tabs/AdminsTab';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  root: {
    padding: '20px',
  },
  categoryTabs: {
    marginBottom: '20px !important',
    '& .MuiTabs-indicator': {
      backgroundColor: `${primaryColors.main} !important`,
    },
  },
  categoryTab: {
    fontWeight: '600 !important',
    fontSize: '16px !important',
    '&.Mui-selected': {
      color: `${primaryColors.main} !important`,
    },
  },
  tabPanel: {
    padding: '0 !important',
  }
});

// Custom TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

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

const StudentManagement = () => {
  const classes = useStyles();
  const [categoryTab, setCategoryTab] = useState(0); // 0 for Students, 1 for Admins

  const handleCategoryTabChange = (event, newValue) => {
    setCategoryTab(newValue);
  };

  return (
    <Box className={classes.root}>
      {/* User Category Tabs */}
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
        <StudentsTab />
      </TabPanel>
    
      {/* Admins Tab Panel */}
      <TabPanel value={categoryTab} index={1}>
        <AdminsTab />
      </TabPanel>
    </Box>
  );
};

export default StudentManagement;