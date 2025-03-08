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
  School,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import axios from 'axios';

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
  },
  adminTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: primaryColors.main,
  },
  adminSubtitle: {
    fontSize: '14px',
    color: '#666666',
  },
});

// Simplified menu - only Dashboard and Student Management
const menuSections = [
  {
    heading: 'College Admin',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { id: 'User Management', label: 'User Management', icon: <School />, path: '/student-management' }
    ]
  }
];

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useAuth();
  const [institutionData, setInstitutionData] = useState({
    name: '',
    code: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch institution data from API
    const fetchInstitutionData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // In a real implementation, uncomment this to make the actual API call
        // const response = await axios.get('http://localhost:8000/api/college-admin/dashboard/', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        
        // For now using simulated data, but in production use response data
        // setInstitutionData({
        //   name: response.data.institution_name,
        //   code: response.data.stats.institution_details.code,
        // });

        // Simulated API response
        setTimeout(() => {
          setInstitutionData({
            name: 'KLU University',
            code: 'KLU20241',
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching institution data:', error);
        setLoading(false);
        // Set fallback values if API fails
        setInstitutionData({
          name: 'Unknown Institution',
          code: 'N/A',
        });
      }
    };

    fetchInstitutionData();
  }, []);

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    // Update authentication context
    setIsAuthenticated(false);
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  return (
    <Paper className={classes.sidebar} elevation={0}>
      <Box className={classes.sidebarHeader}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="40px">
            <CircularProgress size={24} sx={{ color: primaryColors.main }} />
          </Box>
        ) : (
          <>
            <Typography className={classes.adminTitle}>
              {institutionData.name}
            </Typography>
            <Typography className={classes.adminSubtitle}>
              Code: {institutionData.code}
            </Typography>
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
                      color: location.pathname === item.path ? primaryColors.main : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                        color: location.pathname === item.path ? primaryColors.main : 'inherit'
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