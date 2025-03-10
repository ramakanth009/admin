// src/components/login_page/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { useAuth } from "../AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import LoadingButton from "../common/LoadingButton";
import apiService from '../../services/apiService';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: (props) => 
      `linear-gradient(135deg, ${props.colors.main} 0%, ${props.colors.dark} 100%)`,
    padding: "20px",
  },
  paper: {
    display: "flex",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    minHeight: "600px",
  },
  leftSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    background: (props) => 
      `linear-gradient(135deg, rgba(${props.isCollegeAdmin ? '25, 118, 210, 0.9' : '76, 175, 80, 0.9'}) 0%, rgba(${props.isCollegeAdmin ? '13, 71, 161, 0.9' : '46, 125, 50, 0.9'}) 100%)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    color: "white",
    position: "relative",
    overflow: "hidden",
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
  form: {
    width: "100%",
    marginTop: "20px",
  },
  textField: {
    marginBottom: "20px !important",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: (props) => props.colors.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: (props) => props.colors.main,
      },
    },
  },
  submitButton: {
    marginTop: "20px",
    background: (props) => `${props.colors.main} !important`,
    color: "white",
    padding: "12px",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      background: (props) => `${props.colors.dark} !important`,
    },
  },
  welcomeText: {
    fontSize: "36px !important",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "white",
    textAlign: "center",
  },
  featureList: {
    marginTop: "20px !important",
    listStyle: "none",
    padding: 0,
    "& li": {
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      fontSize: "18px",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateX(10px)",
      },
      "& .MuiSvgIcon-root": {
        marginRight: "15px",
        fontSize: "24px",
      },
    },
  },
  forgotPassword: {
    color: (props) => props.colors.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  brandName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: (props) => props.colors.main,
    marginBottom: "40px",
  },
  contactInfo: {
    position: "absolute",
    bottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  shine: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    animation: "$shine 3s infinite",
  },
  "@keyframes shine": {
    "0%": {
      transform: "translateX(-100%) translateY(-100%)",
    },
    "100%": {
      transform: "translateX(100%) translateY(100%)",
    },
  },
  adminTabs: {
    marginBottom: "20px !important",
    "& .MuiTabs-indicator": {
      backgroundColor: (props) => `${props.colors.main} !important`,
    },
    "& .MuiTab-root": {
      "&.Mui-selected": {
        color: (props) => `${props.colors.main} !important`,
      },
    },
  },
});

// Updated login endpoints for different admin types
const COLLEGE_ADMIN_LOGIN_ENDPOINT = "http://localhost:8000/api/auth/college-admin/login/";
const DEPARTMENT_ADMIN_LOGIN_ENDPOINT = "http://localhost:8000/api/auth/department-admin/login/";

const LoginPage = () => {
  const [loginType, setLoginType] = useState("college_admin");
  const colors = loginType === "college_admin" ? primaryColors : departmentColors;
  const classes = useStyles({ colors, isCollegeAdmin: loginType === "college_admin" });
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    // Check if there's a remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prevState => ({
        ...prevState,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
    
    // Simulate page loading to show animation
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginTypeChange = (event, newValue) => {
    setLoginType(newValue);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "rememberMe" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the appropriate login endpoint based on the selected admin type
      const response = await (loginType === "college_admin" 
        ? apiService.auth.loginCollegeAdmin({
            email: formData.email,
            password: formData.password,
          })
        : apiService.auth.loginDepartmentAdmin({
            email: formData.email,
            password: formData.password,
          })
      );

      if (response.data.access) {
        // Use the login function from AuthContext
        login(response.data.access, response.data.refresh, loginType);
        
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Wait for the loading animation to complete
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError(
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "An error occurred during login. Please try again."
        );
      }
      setLoading(false);
    }
  };

  const getFeaturesList = () => {
    if (loginType === "college_admin") {
      return (
        <>
          <Typography className={classes.welcomeText}>
            College Administration Panel
          </Typography>
          <ul className={classes.featureList}>
            <li>
              <AdminIcon />
              Manage your institution's dashboard and analytics
            </li>
            <li>
              <SchoolIcon />
              Create and update department admin accounts
            </li>
            <li>
              <GroupsIcon />
              Access institution-wide student information
            </li>
            <li>
              <SchoolIcon />
              Manage curriculum and assessment content
            </li>
          </ul>
        </>
      );
    } else {
      return (
        <>
          <Typography className={classes.welcomeText}>
            Department Administration Panel
          </Typography>
          <ul className={classes.featureList}>
            <li>
              <AdminIcon />
              Manage your department's dashboard and analytics
            </li>
            <li>
              <SchoolIcon />
              Monitor student performance and progress
            </li>
            <li>
              <GroupsIcon />
              Access department-specific student information
            </li>
            <li>
              <SchoolIcon />
              Track assessment outcomes and curriculum
            </li>
          </ul>
        </>
      );
    }
  };

  if (pageLoading) {
    return <LoadingSpinner message="Preparing login..." />;
  }

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Paper className={classes.paper}>
          <Box className={classes.leftSection}>
            <Typography className={classes.brandName}>Gigaversity LMS</Typography>
            
            <Tabs
              value={loginType}
              onChange={handleLoginTypeChange}
              className={classes.adminTabs}
              variant="fullWidth"
            >
              <Tab 
                label="College Admin" 
                value="college_admin"
                icon={<AdminIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Department Admin" 
                value="department_admin"
                icon={<SchoolIcon />}
                iconPosition="start"
              />
            </Tabs>
            
            <Typography variant="h5" gutterBottom>
              {loginType === "college_admin" ? "College Admin Login" : "Department Admin Login"}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {loginType === "college_admin" 
                ? "Sign in to manage your institution" 
                : "Sign in to manage your department"}
            </Typography>

            <form className={classes.form} onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                className={classes.textField}
                fullWidth
                name="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
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
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: colors.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{
                        "&.Mui-checked": {
                          color: colors.main,
                        },
                      }}
                    />
                  }
                  label="Remember me"
                />
                <Link 
                  className={classes.forgotPassword}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/forgot-password');
                  }}
                >
                  Forgot Password?
                </Link>
              </Grid>

              <LoadingButton
                className={classes.submitButton}
                fullWidth
                isLoading={loading}
                onClick={handleSubmit}
                disabled={loading}
              />
            </form>
          </Box>

          <Box className={classes.rightSection}>
            <div className={classes.shine} />
            {getFeaturesList()}
            <Typography className={classes.contactInfo}>
              For support: support@learningsystem.com | +1 (555) 123-4567
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;