// src/components/login_page/LoginSidebar.jsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  School as SchoolIcon,
  SupervisorAccount as AdminIcon,
  CheckCircle as CheckCircleIcon,
  Dashboard as DashboardIcon,
  PeopleAlt as PeopleAltIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Apartment as ApartmentIcon 
} from '@mui/icons-material';
import { getPrimaryColors } from '../../utils/colors';

const useStyles = makeStyles({
  loginImage: {
    background: props => `linear-gradient(135deg, ${props.colors.main} 0%, ${props.colors.dark} 100%)`,
    color: 'white',
    display: {
      xs: 'none',
      md: 'flex',
    },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    flex: '0 0 40%',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    position: 'relative',
    zIndex: 2,
  },
  logo: {
    fontSize: '72px !important',
    marginBottom: '20px',
  },
  appName: {
    fontSize: '28px !important',
    fontWeight: 'bold !important',
    marginBottom: '8px !important',
    textAlign: 'center',
  },
  appDescription: {
    textAlign: 'center',
    fontSize: '16px !important',
    marginBottom: '10px',
    fontWeight: '500 !important',
  },
  featureList: {
    marginTop: '30px',
    listStyle: 'none',
    padding: 0,
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  featureItem: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateX(5px)',
    },
  },
  featureIcon: {
    marginRight: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: '15px !important',
    fontWeight: '500 !important',
  },
  welcomeText: {
    fontSize: '22px !important',
    fontWeight: 'bold !important',
    marginBottom: '10px !important',
    marginTop: '30px !important',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  circle1: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '-50px',
    left: '-50px',
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: '30px',
    right: '-30px',
    zIndex: 1,
  },
  poweredBy: {
    position: 'absolute',
    bottom: '15px',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '12px !important',
    opacity: 0.7,
    zIndex: 2,
  },
});

/**
 * Login sidebar component for the login page
 * 
 * @param {Object} props - Component props
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const LoginSidebar = ({ role = 'college_admin' }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  
  // Role-specific title and welcome message
  const getRoleTitle = () => {
    return role === 'college_admin' 
      ? 'Institution Administration Portal' 
      : 'Department Management Portal';
  };
  
  const getWelcomeMessage = () => {
    return role === 'college_admin'
      ? 'Manage Your Institution Efficiently'
      : 'Empower Your Department';
  };

  // Role-specific features with appropriate icons
  const getFeatures = () => {
    if (role === 'college_admin') {
      return [
        { 
          text: 'Institution-wide dashboards and analytics', 
          icon: <DashboardIcon /> 
        },
        // { 
        //   text: 'Manage departments and admin access', 
        //   icon: <AdminIcon /> 
        // },
        { 
          text: 'Monitor student data across all departments', 
          icon: <PeopleAltIcon /> 
        },
        { 
          text: 'Track institutional performance metrics', 
          icon: <AssessmentIcon /> 
        },
        // { 
        //   text: 'Configure institution-wide settings', 
        //   icon: <SettingsIcon /> 
        // },
      ];
    } else {
      return [
        { 
          text: 'Department-specific performance insights', 
          icon: <DashboardIcon /> 
        },
        // { 
        //   text: 'Approve student profile updates', 
        //   icon: <CheckCircleIcon /> 
        // },
        // { 
        //   text: 'Manage student assessments and curriculum', 
        //   icon: <SchoolIcon /> 
        // },
        { 
          text: 'Track student progress and metrics', 
          icon: <AssessmentIcon /> 
        },
        { 
          text: 'Manage department resources efficiently', 
          icon: <ApartmentIcon /> 
        },
      ];
    }
  };

  const features = getFeatures();

  return (
    <Box className={classes.loginImage}>
      {/* Decorative circles */}
      <Box className={classes.circle1} />
      <Box className={classes.circle2} />
      
      {/* Logo and Title */}
      <Box className={classes.logoContainer}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          mb: 2
        }}>
          {role === 'college_admin' ? (
            <AdminIcon sx={{ fontSize: 48 }} />
          ) : (
            <SchoolIcon sx={{ fontSize: 48 }} />
          )}
        </Avatar>
        <Typography variant="h5" className={classes.appName}>
          Gigaversity Learning Platform
        </Typography>
        <Typography variant="body1" className={classes.appDescription}>
          {getRoleTitle()}
        </Typography>
      </Box>
      
      {/* Welcome message */}
      <Typography className={classes.welcomeText}>
        {getWelcomeMessage()}
      </Typography>
      
      {/* Feature List */}
      <Box className={classes.featureList}>
        {features.map((feature, index) => (
          <Box key={index} className={classes.featureItem}>
            <Box className={classes.featureIcon}>
              {feature.icon}
            </Box>
            <Typography className={classes.featureText}>
              {feature.text}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Powered by tag */}
      <Typography className={classes.poweredBy}>
        Powered by Gigaversity • Education Reimagined
      </Typography>
    </Box>
  );
};

export default LoginSidebar;