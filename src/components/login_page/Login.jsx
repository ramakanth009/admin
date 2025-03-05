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
    background: `linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(13, 71, 161, 0.9) 100%)`,
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
        borderColor: primaryColors.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: primaryColors.main,
      },
    },
  },
  submitButton: {
    marginTop: "20px",
    background: `${primaryColors.main} !important`,
    color: "white",
    padding: "12px",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      background: `${primaryColors.dark} !important`,
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
    color: primaryColors.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  brandName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: primaryColors.main,
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
  // New styles for enhanced loading button
  loadingProgress: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: primaryColors.light,
    opacity: 0.3,
    transition: "width 0.3s ease-in-out",
    zIndex: 0,
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    position: "relative",
  },
  loadingSpinner: {
    marginRight: "10px",
    color: "white",
    fontWeight:"bold !important",
  },
  loadingText: {
    opacity: 1,
    transition: "opacity 0.3s ease-in-out",
  }
});

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0); // Track loading progress for animation
  const [showLoadingText, setShowLoadingText] = useState(false); // Show loading text with delay
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

  // Handle loading animation
  useEffect(() => {
    let interval;
    
    if (loading) {
      // Start progress animation
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // Slow down as we approach 90%
          const nextValue = prev < 70 ? prev + 3 : prev + 0.5;
          return Math.min(nextValue, 90);
        });
      }, 100);
      
      // Show loading text after a small delay
      const textTimer = setTimeout(() => {
        setShowLoadingText(true);
      }, 600);
      
      return () => {
        clearInterval(interval);
        clearTimeout(textTimer);
      };
    } else {
      // Reset loading state when done
      if (loadingProgress > 0) {
        // Quick completion animation when loading is done
        interval = setInterval(() => {
          setLoadingProgress((prev) => {
            return prev < 100 ? prev + 5 : 100;
          });
        }, 30);
        
        // Reset after completion
        const resetTimer = setTimeout(() => {
          setLoadingProgress(0);
          setShowLoadingText(false);
        }, 1000);
        
        return () => {
          clearInterval(interval);
          clearTimeout(resetTimer);
        };
      }
    }
  }, [loading, loadingProgress]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

    // Add an intentional delay to show the loading animation
    // This can be removed in production if the actual API call is slow enough
    // to naturally show the loading animation
    setTimeout(async () => {
      try {
        // College admin login endpoint
        const response = await axios.post("http://localhost:8000/api/auth/admin/login/", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.access) {
          // Use the login function from AuthContext
          login(response.data.access, response.data.refresh, "college_admin");
          
          if (formData.rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          // Wait for the loading animation to complete
          setTimeout(() => {
            // Redirect to dashboard
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
    }, 1500); // Simulate a network delay
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
            <Typography variant="h5" gutterBottom>
              College Admin Login
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Sign in to manage your institution
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
                      <EmailIcon sx={{ color: primaryColors.main }} />
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
                      <LockIcon sx={{ color: primaryColors.main }} />
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
                          color: primaryColors.main,
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

              {/* Enhanced loading button */}
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