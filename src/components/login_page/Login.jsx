// src/components/login_page/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Link,
  Grid,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  School as SchoolIcon,
  SupervisorAccount as AdminIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import LoadingButton from '../common/ui/LoadingButton';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { isValidEmail } from '../../utils/validators';
import { getPrimaryColors } from '../../utils/colors';

// Import the sidebar component
import LoginSidebar from './LoginSidebar';

const useStyles = makeStyles({
  loginPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: props => `linear-gradient(135deg, ${props.bgStart} 0%, ${props.bgEnd} 100%)`,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg %3E%3Cpath fill=\'%23daeeff\' d=\'M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z\'/%3E%3Cpath fill=\'%23c6e4ff\' d=\'M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z\'/%3E%3Cpath fill=\'%23b0daff\' d=\'M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z\'/%3E%3Cpath fill=\'%2398d0ff\' d=\'M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z\'/%3E%3Cpath fill=\'%237bc6ff\' d=\'M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z\'/%3E%3Cpath fill=\'%236eb9f7\' d=\'M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z\'/%3E%3Cpath fill=\'%2361acee\' d=\'M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z\'/%3E%3Cpath fill=\'%23549fe6\' d=\'M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z\'/%3E%3Cpath fill=\'%234691dd\' d=\'M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z\'/%3E%3Cpath fill=\'%233684d5\' d=\'M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z\'/%3E%3C/g%3E%3C/svg%3E")',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    padding: '20px',
    position: 'relative',
  },
  loginContainer: {
    padding: 0,
    maxWidth: '900px', // Slightly wider to accommodate the enhanced sidebar
  },
  loginPaper: {
    display: 'flex',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    padding: '40px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loginButton: {
    marginTop: '16px !important',
    padding: '12px !important',
  },
  linkItem: {
    textDecoration: 'none !important',
    color: props => props.colors.main,
  },
  textField: {
    marginTop: '16px !important',
  },
  loginTabs: {
    marginBottom: '20px',
    width: '100%', // Ensure tabs take full width
  },
  tab: {
    fontWeight: 'bold !important',
    fontSize: '14px !important',
    flex: 1, // Make each tab take equal space
    maxWidth: 'none !important', // Override MUI's default max-width
    minWidth: 'unset !important', // Override MUI's default min-width
    textTransform: 'uppercase !important', // Makes the labels uppercase
    '&.Mui-selected': {
      color: props => `${props.colors.main} !important`,
    },
  },
  tabIndicator: {
    backgroundColor: props => `${props.colors.main} !important`,
  },
  formWrapper: {
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
  },
  formFooter: {
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  brandName: {
    fontWeight: 'bold',
    color: props => props.colors.main,
  },
  forgotPasswordContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '12px',
  }
});

/**
 * Login page component with tabs for college admin and department admin login
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State for login role (0 = college admin, 1 = department admin)
  const [tabIndex, setTabIndex] = useState(0);
  const selectedRole = tabIndex === 0 ? 'college_admin' : 'department_admin';
  
  // Get colors for selected role
  const colors = getPrimaryColors(selectedRole);
  // Adjust background colors based on role
  const bgStart = selectedRole === 'college_admin' ? '#e3f2fd' : '#e8f5e9';
  const bgEnd = selectedRole === 'college_admin' ? '#3684d5' : '#43a047';
  const classes = useStyles({ colors, bgStart, bgEnd });

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newValidationErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newValidationErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newValidationErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newValidationErrors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(newValidationErrors);
    return isValid;
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Reset error when changing tabs
    setError(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error when field is modified
    if (name === 'email' || name === 'password') {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Determine which API endpoint to use based on selected role
      const loginApi = tabIndex === 0
        ? apiService.auth.loginCollegeAdmin
        : apiService.auth.loginDepartmentAdmin;

      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      // Call login API
      try {
        const response = await loginApi(credentials);
        
        // Simulate successful login for demonstration
        // Extract tokens from response
        const { access, refresh } = response.data;
        
        // Store auth info using the context method
        login(access, refresh, selectedRole, {
          email: formData.email,
          username: formData.email.split('@')[0],
          institution: 'Sample University',
          department: selectedRole === 'department_admin' ? 'Computer Science' : null,
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (apiError) {
        console.error('Login failed:', apiError);
        if (apiError.response?.status === 401) {
          setError('Invalid credentials. Please check your email and password.');
        } else {
          setError('An error occurred during login. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className={classes.loginPage}>
      {/* Decorative elements for background interest */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        animation: 'float 8s infinite ease-in-out',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        animation: 'float 6s infinite ease-in-out',
        animationDelay: '1s'
      }} />
      
      <Container className={classes.loginContainer}>
        <Paper className={classes.loginPaper}>
          {/* Left sidebar component */}
          <LoginSidebar role={selectedRole} />

          {/* Login form section */}
          <Box className={classes.formContainer}>
            <Box className={classes.formWrapper}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                Welcome Back!
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Please sign in to continue your learning journey
              </Typography>

              {/* Login type tabs */}
              <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                className={classes.loginTabs}
                classes={{ indicator: classes.tabIndicator }}
                variant="fullWidth" // Ensures equal distribution
                TabIndicatorProps={{ style: { height: '3px' } }} // Makes indicator more prominent
              >
                <Tab 
                  label="COLLEGE ADMIN" 
                  className={classes.tab}
                  icon={<AdminIcon />}
                  iconPosition="top" // Puts icon above text for better alignment
                />
                <Tab 
                  label="DEPARTMENT ADMIN" 
                  className={classes.tab}
                  icon={<SchoolIcon />}
                  iconPosition="top" // Puts icon above text for better alignment
                />
              </Tabs>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  className={classes.textField}
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.main }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className={classes.textField}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: colors.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className={classes.forgotPasswordContainer}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    className={classes.linkItem}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <LoadingButton
                  className={classes.loginButton}
                  label="Sign In"
                  loadingLabel="Signing in..."
                  isLoading={isLoading}
                  fullWidth
                  role={selectedRole}
                />
              </form>
            </Box>
            
            <Box className={classes.formFooter}>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                &copy; 2025 <span className={classes.brandName}>Gigaversity</span>. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;