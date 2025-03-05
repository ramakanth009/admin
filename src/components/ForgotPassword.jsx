// src/components/login_page/ForgotPassword.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  Link
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: `linear-gradient(135deg, ${primaryColors.main} 0%, ${primaryColors.dark} 100%)`,
    padding: "20px",
  },
  paper: {
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "500px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "30px !important",
    color: primaryColors.dark,
    fontWeight: "bold !important",
  },
  iconBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  errorIcon: {
    fontSize: "80px !important",
    color: "#ff9800",
  },
  message: {
    marginBottom: "30px !important",
    textAlign: "center",
    color: "#555",
  },
  contactInfo: {
    marginBottom: "30px !important",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    margin: "15px 0 !important",
    padding: "12px !important",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    transition: "transform 0.2s, box-shadow 0.2s",
    '&:hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#f0f4f8",
    }
  },
  contactIcon: {
    marginRight: "12px",
    color: primaryColors.main,
  },
  contactText: {
    color: "#555",
    fontSize: "16px !important",
  },
  contactLink: {
    textDecoration: "none !important",
    color: "inherit !important",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    marginTop: "10px !important",
    color: `${primaryColors.main} !important`,
    display: "flex !important",
    alignItems: "center !important",
  },
  alertBox: {
    marginBottom: "30px !important",
  }
});

const ForgotPasswordPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Super admin contact info
  const superAdminEmail = "super_admin@example.com";
  const superAdminPhone = "+1 (555) 123-4567";

  const handleEmailClick = () => {
    window.location.href = `mailto:${superAdminEmail}?subject=Password Reset Request`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${superAdminPhone}`;
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h4" className={classes.title} align="center">
            Forgot Password
          </Typography>
          
          <Box className={classes.iconBox}>
            <ErrorIcon className={classes.errorIcon} />
          </Box>
          
          <Alert severity="info" className={classes.alertBox}>
            Oops! You don't have access to change the password. Contact the Super Admin.
          </Alert>
          
          <Typography variant="body1" className={classes.message}>
            Please reach out to the Super Administrator with your account details to reset your password.
          </Typography>
          
          <Box className={classes.contactInfo}>
            <Paper className={classes.contactItem} elevation={0}>
              <Link
                className={classes.contactLink}
                onClick={handleEmailClick}
              >
                <EmailIcon className={classes.contactIcon} />
                <Typography className={classes.contactText}>
                  {superAdminEmail}
                </Typography>
              </Link>
            </Paper>
            
            <Paper className={classes.contactItem} elevation={0}>
              <Link
                className={classes.contactLink}
                onClick={handlePhoneClick}
              >
                <PhoneIcon className={classes.contactIcon} />
                <Typography className={classes.contactText}>
                  {superAdminPhone}
                </Typography>
              </Link>
            </Paper>
          </Box>
          
          <Button
            className={classes.backButton}
            onClick={handleBackToLogin}
            startIcon={<ArrowBackIcon />}
          >
            Back to Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;