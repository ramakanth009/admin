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
  FormControlLabel,
  Checkbox,
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
    padding: '20px',
  },
  loginContainer: {
    padding: 0,
    maxWidth: '900px', // Slightly wider to accommodate the enhanced sidebar
  },
  loginPaper: {
    display: 'flex',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
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
  },
  tab: {
    fontWeight: 'bold !important',
    fontSize: '14px !important',
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
  const bgStart = selectedRole === 'college_admin' ? '#e3f2fd' : '#e8f5e9';
  const bgEnd = selectedRole === 'college_admin' ? '#bbdefb' : '#c8e6c9';
  const classes = useStyles({ colors, bgStart, bgEnd });

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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
    const { name, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'rememberMe' ? checked : value,
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
              >
                <Tab 
                  label="College Admin" 
                  className={classes.tab}
                  icon={<AdminIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label="Department Admin" 
                  className={classes.tab}
                  icon={<SchoolIcon />}
                  iconPosition="start"
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

                <Grid container sx={{ mt: 2 }} justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          sx={{
                            color: colors.main,
                            '&.Mui-checked': {
                              color: colors.main,
                            },
                          }}
                        />
                      }
                      label="Remember me"
                    />
                  </Grid>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      className={classes.linkItem}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>

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