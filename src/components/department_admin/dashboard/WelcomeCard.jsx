import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  welcomeBanner: {
    padding: '20px',
    marginBottom: '24px',
    background: `linear-gradient(135deg, ${departmentColors.main} 0%, ${departmentColors.dark} 100%)`,
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
    color: `${departmentColors.dark} !important`,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
    },
  },
  institutionName: {
    opacity: 0.8,
    fontSize: '0.9rem !important',
    marginBottom: '8px !important',
  }
});

const WelcomeCard = ({ departmentName, institutionName }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleManageStudentsClick = () => {
    navigate('/user-management');
  };

  return (
    <Paper className={classes.welcomeBanner} elevation={2}>
      <Typography variant="body1" className={classes.institutionName}>
        {institutionName}
      </Typography>
      <Typography variant="h5" className={classes.welcomeTitle}>
        Welcome to {departmentName} Department Portal
      </Typography>
      <Typography variant="body1" className={classes.welcomeMessage}>
        Monitor student progress, manage department resources, and track academic performance all in one place.
      </Typography>
      <Button
        variant="contained"
        size="small"
        className={classes.actionButton}
        startIcon={<PeopleIcon />}
        onClick={handleManageStudentsClick}
      >
        Manage Students
      </Button>
    </Paper>
  );
};

export default WelcomeCard;