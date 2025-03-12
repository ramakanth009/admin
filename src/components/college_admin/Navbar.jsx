// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Paper,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search,
  KeyboardArrowDown,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import Notifications from './Notifications';
import axios from 'axios';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  appBar: {
    backgroundColor: `${primaryColors.dark} !important`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15) !important',
    zIndex: '1201 !important',
  },
  toolbar: {
    display: 'flex !important',
    justifyContent: 'space-between !important',
    padding: '0 20px !important',
    minHeight: '64px !important',
  },
  logo: {
    color: '#ffffff !important',
    fontWeight: '600 !important',
    fontSize: '1.25rem !important',
    letterSpacing: '0.5px !important',
  },
  search: {
    position: 'relative !important',
    borderRadius: '8px !important',
    backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25) !important',
    },
    marginRight: '16px !important',
    width: '300px !important',
    transition: 'all 0.3s ease !important',
  },
  searchIcon: {
    padding: '0 16px !important',
    height: '100% !important',
    position: 'absolute !important',
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    color: '#ffffff !important',
  },
  inputRoot: {
    color: '#ffffff !important',
    width: '100% !important',
  },
  inputInput: {
    padding: '8px 8px 8px 48px !important',
    width: '100% !important',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7) !important',
      opacity: 1,
    },
  },
  profileSection: {
    display: 'flex !important',
    alignItems: 'center !important',
    cursor: 'pointer !important',
    padding: '4px 8px !important',
    borderRadius: '8px !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
    },
  },
  avatar: {
    backgroundColor: `${primaryColors.light} !important`,
    marginRight: '8px !important',
  },
  userName: {
    color: '#ffffff !important',
    marginRight: '4px !important',
    fontWeight: '500 !important',
  },
  dropdownIcon: {
    color: '#ffffff !important',
  },
  menuItem: {
    display: 'flex !important',
    alignItems: 'center !important',
    gap: '8px !important',
  },
  logoutIcon: {
    color: '#f44336 !important',
    fontSize: '1.2rem !important',
  },
});

const NavBar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // In a real implementation, make the API call:
        // const response = await axios.get('http://localhost:8000/api/users/profile', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setUserName(response.data.username || "Admin User");
        
        // For demo purposes, simulate fetching the user's name
        setTimeout(() => {
          const userRole = localStorage.getItem('userRole');
          setUserName(userRole === 'college_admin' ? 'Admin User' : 'Department Admin');
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName("Admin User");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userDetails');
    
    // Update authentication context
    setIsAuthenticated(false);
    
    // Close menu
    handleClose();
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" className={classes.logo}>
            Institution Management
          </Typography>
        </Box>

        <Paper component="form" className={classes.search}>
          <Box className={classes.searchIcon}>
            <Search />
          </Box>
          <InputBase
            placeholder="Search students..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </Paper>

        <Box display="flex" alignItems="center">
          <Notifications />
          
          <Tooltip title="Account menu">
            <Box 
              className={classes.profileSection}
              onClick={handleProfileClick}
            >
              <Avatar className={classes.avatar}>
                {!loading && userName ? userName.charAt(0).toUpperCase() : 'A'}
              </Avatar>
              <Typography className={classes.userName}>
                {!loading ? userName : 'Loading...'}
              </Typography>
              <KeyboardArrowDown className={classes.dropdownIcon} />
            </Box>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
                borderRadius: '8px',
                mt: 1.5,
              },
            }}
          >
            <MenuItem 
              onClick={handleLogout} 
              className={classes.menuItem}
            >
              <LogoutIcon className={classes.logoutIcon} />
              <Typography color="#f44336">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;