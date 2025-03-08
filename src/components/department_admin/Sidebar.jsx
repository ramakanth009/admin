import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  DashboardOutlined as DashboardIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import axios from 'axios';

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
  },
  adminTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: departmentColors.main,
  },
  adminSubtitle: {
    fontSize: '14px',
    color: '#666666',
  },
  departmentBadge: {
    backgroundColor: `${departmentColors.light}33`,
    color: departmentColors.dark,
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginTop: '6px',
    display: 'inline-block',
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
  const [departmentData, setDepartmentData] = useState({
    name: '',
    institution: '',
    studentCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch department data from API
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // In a real implementation, uncomment this to make the actual API call
        // const response = await axios.get('http://localhost:8000/api/department-admin/dashboard/', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        
        // For now using simulated data, but in production use response data
        // If we have user details from context, use them
        if (userDetails) {
          setDepartmentData({
            name: userDetails.department || 'Computer Science',
            institution: userDetails.institution_details?.name || 'KLU University',
            studentCount: userDetails.institution_details?.total_students || 25
          });
        } else {
          // Simulated API response
          setTimeout(() => {
            setDepartmentData({
              name: 'Computer Science',
              institution: 'KLU University',
              studentCount: 25
            });
            setLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error('Error fetching department data:', error);
        setLoading(false);
        // Set fallback values if API fails
        setDepartmentData({
          name: 'Unknown Department',
          institution: 'Unknown Institution',
          studentCount: 0
        });
      }
    };

    fetchDepartmentData();
  }, [userDetails]);

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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="40px">
            <CircularProgress size={24} sx={{ color: departmentColors.main }} />
          </Box>
        ) : (
          <>
            <Typography className={classes.adminTitle}>
              {departmentData.institution}
            </Typography>
            <Typography className={classes.adminSubtitle}>
              Department Portal
            </Typography>
            <Box className={classes.departmentBadge}>
              {departmentData.name}
            </Box>
          </>
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