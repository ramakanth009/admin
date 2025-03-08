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
  Chip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  DashboardOutlined as DashboardIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
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
    backgroundColor: `${departmentColors.light}33`, // Light green with opacity
    borderLeft: `4px solid ${departmentColors.main}`,
    '&:hover': {
      backgroundColor: `${departmentColors.light}33`,
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
    backgroundColor: departmentColors.light,
    marginBottom: '16px',
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: departmentColors.main,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center',
    marginTop: '4px',
  },
  departmentChip: {
    backgroundColor: `${departmentColors.light}33`,
    color: departmentColors.dark,
    borderRadius: '16px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  welcomeText: {
    fontSize: '13px',
    color: '#888888',
    marginTop: '12px',
    textAlign: 'center',
  }
});

// Simplified menu for Department Admin - only Dashboard and Student Management
const menuSections = [
  {
    heading: 'Department Admin',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'Student Management', label: 'Student Management', icon: <SchoolIcon />, path: '/student-management' }
    ]
  }
];

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userDetails } = useAuth();
  
  // Get department name from context or default
  const departmentName = userDetails?.department || "Computer Science";

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear all authentication data using the context logout function
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
          Department Portal
        </Typography>
        <Typography className={classes.brandSubtitle}>
          Learning Management System
        </Typography>
        
        <Chip
          icon={<SchoolIcon style={{ fontSize: '14px' }} />}
          label={departmentName}
          className={classes.departmentChip}
          size="small"
        />
        
       
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
                  button
                  className={`${classes.sidebarItem} ${
                    location.pathname === item.path ? classes.activeTab : ''
                  }`}
                  onClick={() => handleTabClick(item.path)}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === item.path ? departmentColors.main : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        color: location.pathname === item.path ? departmentColors.main : 'inherit'
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
          button 
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