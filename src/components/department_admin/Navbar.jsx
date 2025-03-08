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
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search,
  KeyboardArrowDown,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import Notifications from './Notifications';

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
  }
});

const NavBar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { logout, userDetails } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminName, setAdminName] = useState("Department Admin");
  const [department, setDepartment] = useState("");
  const [institution, setInstitution] = useState("");

  useEffect(() => {
    // In a real app, you'd fetch this information from your backend API
    // using the stored access token
    const fetchAdminProfile = async () => {
      try {
        // This is simulated - replace with actual API call
        // const token = localStorage.getItem('accessToken');
        // const response = await axios.get('api/department-admin/profile', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // If we have user details from context, use them
        if (userDetails) {
          setAdminName(userDetails.username || "Department Admin");
          setDepartment(userDetails.department || "");
          setInstitution(userDetails.institution_details?.name || "");
        } else {
          // Simulated data
          setAdminName("Department Admin");
          setDepartment("Computer Science");
          setInstitution("KLU University");
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchAdminProfile();
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
          
          <Box 
            className={classes.profileSection}
            onClick={handleProfileClick}
          >
            <Avatar className={classes.avatar}>
              {adminName ? adminName.charAt(0).toUpperCase() : 'D'}
            </Avatar>
            <Typography className={classes.userName}>{adminName}</Typography>
            <KeyboardArrowDown className={classes.dropdownIcon} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleClose}>My Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;