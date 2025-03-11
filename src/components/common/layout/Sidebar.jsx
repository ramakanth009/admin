// src/components/common/layout/Sidebar.jsx
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
  SupervisorAccount as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { getPrimaryColors } from '../../../utils/colors';

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
    backgroundColor: props => `${props.colors.light}33`, // Light color with opacity
    borderLeft: props => `4px solid ${props.colors.main}`,
    '&:hover': {
      backgroundColor: props => `${props.colors.light}33`,
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
    marginBottom: '16px',
    backgroundColor: props => props.colors.light,
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: props => props.colors.main,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center',
    marginTop: '4px',
  },
  departmentChip: {
    backgroundColor: props => `${props.colors.light}33`,
    color: props => props.colors.dark,
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

/**
 * Unified Sidebar component that displays appropriate menu items based on user role
 * 
 * @param {Object} props - Component props
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const Sidebar = ({ role = 'college_admin' }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userDetails, isCollegeAdmin } = useAuth();
  
  // Determine menu items based on role
  const getMenuSections = () => {
    if (role === 'college_admin') {
      return [
        {
          heading: 'College Admin',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { id: 'User Management', label: 'User Management', icon: <SchoolIcon />, path: '/student-management' }
          ]
        }
      ];
    } else {
      return [
        {
          heading: 'Department Admin',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { id: 'Student Management', label: 'Student Management', icon: <SchoolIcon />, path: '/student-management' }
          ]
        }
      ];
    }
  };

  const menuSections = getMenuSections();
  
  // Get department name from context or default
  const departmentName = userDetails?.department || "Computer Science";
  
  // Get portal title based on role
  const getPortalTitle = () => {
    return role === 'college_admin' ? 'Admin Portal' : 'Department Portal';
  };

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
          {role === 'college_admin' ? <AdminIcon fontSize="large" /> : <SchoolIcon fontSize="large" />}
        </Avatar>
        <Typography className={classes.brandTitle}>
          {getPortalTitle()}
        </Typography>
        <Typography className={classes.brandSubtitle}>
          Learning Management System
        </Typography>
        
        {/* Show department chip for department admin only */}
        {role === 'department_admin' && (
          <Chip
            icon={<SchoolIcon style={{ fontSize: '14px' }} />}
            label={departmentName}
            className={classes.departmentChip}
            size="small"
          />
        )}
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
                      color: location.pathname === item.path ? colors.main : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        color: location.pathname === item.path ? colors.main : 'inherit'
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