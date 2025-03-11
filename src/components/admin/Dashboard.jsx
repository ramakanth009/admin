// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  Button,
  CircularProgress,
  Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Refresh as RefreshIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import apiService from '../../services/apiService';
import { getPrimaryColors, generateColors } from "../../utils/colors";
import { prepareChartData } from "../common/charts/ColorGenerator";

// Import shared components
import WelcomeCard from "../common/dashboard/WelcomeCard";
import EntityDetails from "../common/dashboard/EntityDetails";
import EntitySummary from "../common/dashboard/EntitySummary";

// Dynamically import role-specific components
const DynamicVisualizations = {
  college_admin: {
    // Lazy-load college admin specific visualizations
    LeftVisualization: React.lazy(() => import("../admin/college/visualizations/DepartmentDistribution")),
    RightVisualization: React.lazy(() => import("../admin/college/visualizations/DepartmentOverview")),
  },
  department_admin: {
    // Lazy-load department admin specific visualizations
    LeftVisualization: React.lazy(() => import("../admin/department/visualizations/StudentPerformance")),
    RightVisualization: React.lazy(() => import("../admin/department/visualizations/StudentOverview")),
  }
};

const useStyles = makeStyles({
  root: {
    padding: "20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  entityInfo: {
    marginBottom: "8px !important",
    display: "flex",
    alignItems: "center",
  },
  entityName: {
    fontWeight: "bold !important",
    marginLeft: "8px !important",
    color: props => props.colors.main,
  },
  refreshButton: {
    marginLeft: "10px !important",
    color: props => props.colors.main,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "200px",
  },
  visualizationFallback: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "350px",
    width: "100%",
  },
});

/**
 * Unified dashboard component with role-based rendering
 */
const Dashboard = () => {
  // Get user role from Auth context
  const { userRole, isCollegeAdmin } = useAuth();
  const role = userRole || 'college_admin';
  
  // Get colors based on role
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Visualization data state
  const [visualizationData, setVisualizationData] = useState([]);
  
  // Get dynamic visualizations based on role
  const { LeftVisualization, RightVisualization } = DynamicVisualizations[role];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      try {
        const response = await apiService.admin.getDashboard();
        setDashboardData(response.data);
        
        // Process data based on role
        if (isCollegeAdmin()) {
          // For college admin - prepare department distribution data
          const departmentData = prepareChartData(
            response.data.stats?.department_distribution || {},
            'college_admin'
          );
          setVisualizationData(departmentData);
        } else {
          // For department admin - prepare student performance data
          // This is simulated data since we don't have the right API response structure
          const samplePerformanceData = {
            "Assignments": 85,
            "Quizzes": 78,
            "Exams": 92,
            "Projects": 88,
            "Participation": 95
          };
          
          const studentData = prepareChartData(samplePerformanceData, 'department_admin');
          setVisualizationData(studentData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
        
        // Fallback data for demonstration purposes
        if (isCollegeAdmin()) {
          const mockDepartmentData = {
            "Computer Science": 45,
            "Mechanical Engineering": 30,
            "Electrical Engineering": 25,
            "Civil Engineering": 20,
            "Chemical Engineering": 15
          };
          
          setDashboardData({
            institution_name: "Sample University",
            stats: {
              user_summary: {
                total_users: 150,
                college_admins: 5,
                department_admins: 15,
                total_students: 130
              },
              institution_details: {
                name: "Sample University",
                code: "SU-2025",
                city: "Sample City",
                state: "Sample State",
                established_year: 2000
              },
              department_distribution: mockDepartmentData
            }
          });
          
          setVisualizationData(prepareChartData(mockDepartmentData, 'college_admin'));
        } else {
          const mockPerformanceData = {
            "Assignments": 85,
            "Quizzes": 78,
            "Exams": 92,
            "Projects": 88,
            "Participation": 95
          };
          
          setDashboardData({
            department: "Computer Science",
            institution: "Sample University",
            stats: {
              department_summary: {
                department: "Computer Science",
                total_students: 45,
                active_students: 40,
                profiles_completed: 35
              }
            }
          });
          
          setVisualizationData(prepareChartData(mockPerformanceData, 'department_admin'));
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error("Error in dashboard:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      setLoading(true);
      fetchDashboardData();
    }
  };

  const getEntityName = () => {
    if (isCollegeAdmin()) {
      return dashboardData?.institution_name || "Institution";
    } else {
      return dashboardData?.department || "Department";
    }
  };

  if (loading && !refreshing) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress size={60} sx={{ color: colors.main }} />
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={{ backgroundColor: colors.main }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      {refreshing && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Refreshing dashboard data...
        </Alert>
      )}

      <Box className={classes.headerRow}>
        <Box>
          <Box className={classes.entityInfo}>
            <SchoolIcon sx={{ color: colors.main }} />
            <Typography variant="h6" className={classes.entityName}>
              {getEntityName()}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            className={classes.refreshButton}
            size="large"
          >
            <RefreshIcon
              fontSize="medium"
              className={refreshing ? "rotating" : ""}
              sx={{
                animation: refreshing ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Welcome Banner - shared component with role-based content */}
      <WelcomeCard 
        entityName={getEntityName()}
        institutionName={isCollegeAdmin() ? "" : dashboardData?.institution}
        role={role}
      />

      {/* Entity Info Card - shared component with role-based content */}
      <EntityDetails 
        entityDetails={
          isCollegeAdmin() 
            ? dashboardData?.stats?.institution_details
            : dashboardData?.stats?.department_summary
        } 
        role={role}
      />

      {/* Entity Summary - shared component with role-based content */}
      <EntitySummary 
        summaryData={
          isCollegeAdmin()
            ? dashboardData?.stats?.user_summary
            : dashboardData?.stats?.department_summary
        }
        loading={loading}
        role={role}
      />

      {/* Role-specific visualizations */}
      <Grid container spacing={3}>
        {/* Left Visualization */}
        <Grid item xs={12} md={6}>
          <React.Suspense 
            fallback={
              <Box className={classes.visualizationFallback}>
                <CircularProgress size={40} sx={{ color: colors.main }} />
              </Box>
            }
          >
            <LeftVisualization 
              data={visualizationData} 
              colors={colors}
            />
          </React.Suspense>
        </Grid>
        
        {/* Right Visualization */}
        <Grid item xs={12} md={6}>
          <React.Suspense 
            fallback={
              <Box className={classes.visualizationFallback}>
                <CircularProgress size={40} sx={{ color: colors.main }} />
              </Box>
            }
          >
            <RightVisualization 
              data={visualizationData}
              colors={colors}
            />
          </React.Suspense>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;