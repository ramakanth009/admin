import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Import the updated StudentsTab component
import StudentsTab from './StudentsTab';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  root: {
    padding: '20px',
  }
});

const UserManagement = () => {
  const classes = useStyles();

  // Department admin only has access to students, no tabs needed
  return (
    <Box className={classes.root}>
      <StudentsTab />
    </Box>
  );
};

export default UserManagement;