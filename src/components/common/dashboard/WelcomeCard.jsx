// src/components/common/dashboard/WelcomeCard.jsx
import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  welcomeBanner: {
    padding: '20px',
    marginBottom: '24px',
    background: props => `linear-gradient(135deg, ${props.colors.main} 0%, ${props.colors.dark} 100%)`,
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
    color: props => `${props.colors.dark} !important`,
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

/**
 * Unified WelcomeCard component that displays a welcome message based on user role
 * 
 * @param {Object} props - Component props
 * @param {string} props.entityName - Institution or department name
 * @param {string} props.institutionName - Parent institution name (for department admin)
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const WelcomeCard = ({ 
  entityName = '',
  institutionName = '',
  role = 'college_admin'
}) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const navigate = useNavigate();
  const isCollegeAdmin = role === 'college_admin';

  const handleManageStudentsClick = () => {
    navigate('/student-management');
  };

  // Determine appropriate title and message based on role
  const getTitle = () => {
    if (isCollegeAdmin) {
      return `Welcome to ${entityName} Admin Portal`;
    } else {
      return `Welcome to ${entityName} Department Portal`;
    }
  };

  const getMessage = () => {
    if (isCollegeAdmin) {
      return "Manage your institution's departments, students, and academic resources all in one place.";
    } else {
      return "Monitor student progress, manage department resources, and track academic performance all in one place.";
    }
  };

  return (
    <Paper className={classes.welcomeBanner} elevation={2}>
      {/* Show institution name for department admin */}
      {!isCollegeAdmin && institutionName && (
        <Typography className={classes.institutionName}>
          {institutionName}
        </Typography>
      )}
      
      <Typography variant="h5" className={classes.welcomeTitle}>
        {getTitle()}
      </Typography>
      
      <Typography variant="body1" className={classes.welcomeMessage}>
        {getMessage()}
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