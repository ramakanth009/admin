import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom'; // Update this import

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  welcomeBanner: {
    padding: '20px',
    marginBottom: '24px',
    background: `linear-gradient(135deg, ${primaryColors.main} 0%, ${primaryColors.dark} 100%)`,
    color: 'white',
    borderRadius: '10px',
  },
  welcomeTitle: {
    fontWeight: 'bold !important',
    marginBottom: '8px !important',
  },
  welcomeMessage: {
    opacity: 0.9,
  },
  actionButton: {
    marginTop: '16px !important',
    backgroundColor: 'white !important',
    color: `${primaryColors.dark} !important`,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
    },
  },
});

const WelcomeCard = ({ institutionName }) => {
  const classes = useStyles();
  const navigate = useNavigate(); // Update this line

  const handleManageStudentsClick = () => {
    navigate('/user-management'); // Update this function
  };

  return (
    <Paper className={classes.welcomeBanner} elevation={2}>
      <Typography variant="h5" className={classes.welcomeTitle}>
        Welcome to {institutionName} Admin Portal
      </Typography>
      <Typography variant="body1" className={classes.welcomeMessage}>
        Manage your institution's departments, students, and academic
        resources all in one place.
      </Typography>
      <Button
        variant="contained"
        size="small"
        className={classes.actionButton}
        startIcon={<PeopleIcon />}
        onClick={handleManageStudentsClick} // Update this line
      >
        Manage Students
      </Button>
    </Paper>
  );
};

export default WelcomeCard;