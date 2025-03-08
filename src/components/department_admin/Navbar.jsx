// Department Admin Navbar.jsx
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
  Chip,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search,
  KeyboardArrowDown,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import Notifications from './Notifications';
import axios from 'axios';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  appBar: {
    backgroundColor: `${departmentColors.dark} !important`,
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
    backgroundColor: `${departmentColors.light} !important`,
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
  departmentChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
    color: 'white !important',
    borderRadius: '16px !important',
    padding: '0 8px !important',
    marginLeft: '12px !important',
    fontSize: '0.75rem !important',
    height: '24px !important',
    display: 'flex !important',
    alignItems: 'center !important',
  },
  departmentIcon: {
    fontSize: '14px !important',
    marginRight: '4px !important',
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
  const { logout, userDetails } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        // In a real implementation, make the API call:
        // const response = await axios.get('http://localhost:8000/api/department-admin/profile', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setUserName(response.data.username || "Department Admin");
        // setDepartment(response.data.department || "Computer Science");
        
        // If we have user details from context, use them
        if (userDetails) {
          setUserName(userDetails.username || "Department Admin");
          setDepartment(userDetails.department || "Computer Science");
        } else {
          // Simulate API response
          setTimeout(() => {
            setUserName("Department Admin");
            setDepartment("Computer Science");
            setLoading(false);
          }, 600);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName("Department Admin");
        setDepartment("Computer Science");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userDetails]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all authentication data using the context logout function
    logout();
    
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
            Department Management
          </Typography>
          {department && (
            <Box className={classes.departmentChip}>
              <SchoolIcon className={classes.departmentIcon} />
              <Typography variant="caption">{department}</Typography>
            </Box>
          )}
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
                {!loading && userName ? userName.charAt(0).toUpperCase() : 'D'}
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
                borderRadius: '8px',
                minWidth: 180,
                mt: 1.5,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
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