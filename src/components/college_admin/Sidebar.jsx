import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  DashboardOutlined as DashboardIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto',
    position: 'fixed',
    bottom: 0,
    left: 0,
    top: '64px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  sidebarItem: {
    padding: '8px 16px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#f5f5f5',
    },
  },
  sectionTitle: {
    padding: '16px',
    color: '#666666',
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: `${primaryColors.light}33`, // Light blue with opacity
    borderLeft: `4px solid ${primaryColors.main}`,
    '&:hover': {
      backgroundColor: `${primaryColors.light}33`,
    },
  },
  logoutSection: {
    borderTop: '1px solid #e0e0e0',
    marginTop: 'auto',
  },
  logoutButton: {
    padding: '16px',
    '&:hover': {
      backgroundColor: '#fff1f0',
      cursor: 'pointer',
    },
    '& .MuiListItemIcon-root': {
      color: '#ff4d4f',
    },
    '& .MuiListItemText-primary': {
      color: '#ff4d4f',
    },
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandAvatar: {
    width: 60,
    height: 60,
    backgroundColor: primaryColors.light,
    marginBottom: '16px',
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: primaryColors.main,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center',
    marginTop: '4px',
  },
  welcomeText: {
    fontSize: '13px',
    color: '#888888',
    marginTop: '12px',
    textAlign: 'center',
  }
});

// Simplified menu - only Dashboard and Student Management
const menuSections = [
  {
    heading: 'College Admin',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'User Management', label: 'User Management', icon: <SchoolIcon />, path: '/user-management' }
    ]
  }
];

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  return (
    <Paper className={classes.sidebar} elevation={0}>
      <Box className={classes.sidebarHeader}>
        <Avatar className={classes.brandAvatar}>
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Typography className={classes.brandTitle}>
          Admin Portal
        </Typography>
        <Typography className={classes.brandSubtitle}>
          Learning Management System
        </Typography>
      </Box>
      
      <Box className={classes.sidebarContent}>
        <List>
          {menuSections.map((section, index) => (
            <React.Fragment key={index}>
              <Typography className={classes.sectionTitle}>
                {section.heading}
              </Typography>
              {section.items.map((item) => (
                <ListItem
                  key={item.id}
                  button // Correct boolean attribute
                  className={`${classes.sidebarItem} ${
                    location.pathname.startsWith(item.path) ? classes.activeTab : ''
                  }`}
                  onClick={() => handleTabClick(item.path)}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname.startsWith(item.path) ? primaryColors.main : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: location.pathname.startsWith(item.path) ? 'bold' : 'normal',
                        color: location.pathname.startsWith(item.path) ? primaryColors.main : 'inherit'
                      }
                    }}
                  />
                </ListItem>
              ))}
              {index < menuSections.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
      
      {/* Logout Section */}
      <Box className={classes.logoutSection}>
        <ListItem 
          button // Correct boolean attribute
          className={classes.logoutButton}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Paper>
  );
};

export default Sidebar;