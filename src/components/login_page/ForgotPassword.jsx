// src/components/login_page/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import LoadingButton from '../common/ui/LoadingButton';
import { isValidEmail } from '../../utils/validators';
import { getPrimaryColors } from '../../utils/colors';

const useStyles = makeStyles({
  forgotPasswordPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: '20px',
  },
  forgotPasswordContainer: {
    padding: 0,
    maxWidth: '500px',
  },
  forgotPasswordPaper: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  formContainer: {
    padding: '40px',
  },
  title: {
    fontWeight: 'bold !important',
    marginBottom: '8px !important',
  },
  submitButton: {
    marginTop: '16px !important',
    padding: '12px !important',
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none !important',
    color: props => props.colors.main,
    marginTop: '16px !important',
  },
  textField: {
    marginTop: '16px !important',
  },
  successContainer: {
    textAlign: 'center',
    padding: '16px',
  },
  successIcon: {
    fontSize: '72px !important',
    color: '#4caf50',
    marginBottom: '16px',
  },
});

/**
 * Forgot password component for both admin types
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  // Default to college admin colors
  const colors = getPrimaryColors('college_admin');
  const classes = useStyles({ colors });

  // Email state
  const [email, setEmail] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear validation error when email is modified
    setValidationError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setValidationError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to request password reset
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <Box className={classes.forgotPasswordPage}>
      <Container className={classes.forgotPasswordContainer}>
        <Paper className={classes.forgotPasswordPaper}>
          <Box className={classes.formContainer}>
            {!success ? (
              <>
                <Typography variant="h5" className={classes.title}>
                  Forgot Password
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    className={classes.textField}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    variant="outlined"
                    error={!!validationError}
                    helperText={validationError}
                  />

                  <LoadingButton
                    className={classes.submitButton}
                    label="Reset Password"
                    loadingLabel="Sending..."
                    isLoading={isLoading}
                    fullWidth
                    role="college_admin"
                  />
                </form>

                <Link
                  component={RouterLink}
                  to="/login"
                  className={classes.linkItem}
                >
                  <ArrowBackIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                  Back to Login
                </Link>
              </>
            ) : (
              <Box className={classes.successContainer}>
                <Typography variant="h5" className={classes.title} color="primary">
                  Check Your Email
                </Typography>
                <Typography variant="body1" paragraph>
                  We've sent a password reset link to <strong>{email}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Please check your email and follow the instructions to reset your password.
                  If you don't see the email, check your spam folder.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  sx={{ mt: 2 }}
                >
                  Return to Login
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;