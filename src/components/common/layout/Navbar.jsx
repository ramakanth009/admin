// src/components/common/layout/Navbar.jsx
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
  Chip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search,
  KeyboardArrowDown,
  Logout as LogoutIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import Notifications from './Notifications';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: props => `${props.colors.dark} !important`,
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
    backgroundColor: props => `${props.colors.light} !important`,
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
});

/**
 * Unified navbar component with role-based styling and content
 * 
 * @param {Object} props - Component props
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const Navbar = ({ role = 'college_admin' }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const navigate = useNavigate();
  const { logout, userDetails } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const isCollegeAdmin = role === 'college_admin';

  useEffect(() => {
    // Fetch user data or use from context
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (userDetails) {
          setUserName(userDetails.username || (isCollegeAdmin ? "Admin User" : "Department Admin"));
          setDepartment(userDetails.department || "");
        } else {
          // Simulate API response for demo
          setTimeout(() => {
            setUserName(isCollegeAdmin ? 'Admin User' : 'Department Admin');
            setDepartment(isCollegeAdmin ? '' : "Computer Science");
            setLoading(false);
          }, 600);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName(isCollegeAdmin ? "Admin User" : "Department Admin");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userDetails, isCollegeAdmin]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all authentication data
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
            {isCollegeAdmin ? "Institution Management" : "Department Management"}
          </Typography>
          
          {/* Show department chip for department admin only */}
          {!isCollegeAdmin && department && (
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
            placeholder={isCollegeAdmin ? "Search users..." : "Search students..."}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </Paper>

        <Box display="flex" alignItems="center">
          <Notifications role={role} />
          
          <Tooltip title="Account menu">
            <Box 
              className={classes.profileSection}
              onClick={handleProfileClick}
            >
              <Avatar className={classes.avatar}>
                {!loading && userName ? userName.charAt(0).toUpperCase() : isCollegeAdmin ? 'A' : 'D'}
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

export default Navbar;