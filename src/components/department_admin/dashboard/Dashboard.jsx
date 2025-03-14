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
import apiService from '../../../services/apiService';

// Import modular components
import WelcomeCard from "./WelcomeCard";
// import DepartmentDetails from "./DepartmentDetails";
import StudentSummary from "./StudentSummary";
import StudentPerformance from "./data_box/StudentPerformance";
import StudentOverview from "./data_box/StudentOverview";

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
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
  departmentInfo: {
    marginBottom: "8px !important",
    display: "flex",
    alignItems: "center",
  },
  departmentName: {
    fontWeight: "bold !important",
    marginLeft: "8px !important",
    color: departmentColors.main,
  },
  refreshButton: {
    marginLeft: "10px !important",
    color: departmentColors.main,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "200px",
  },
});

// Central color generation function to ensure consistent colors across components
const generateColors = (count) => {
  const baseColors = [
    "#4CAF50", // Primary green
    "#8BC34A", // Light green
    "#CDDC39", // Lime
    "#FFEB3B", // Yellow
    "#FFC107", // Amber
    "#FF9800", // Orange
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors = [...baseColors];

  while (colors.length < count) {
    const colorIndex = colors.length % baseColors.length;
    const baseColor = baseColors[colorIndex];

    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    const shiftAmount = 30 * (Math.floor(colors.length / baseColors.length) + 1);
    const newR = Math.min(
      255,
      Math.max(0, r + (colors.length % 3 === 0 ? shiftAmount : -shiftAmount))
    );
    const newG = Math.min(
      255,
      Math.max(0, g + (colors.length % 3 === 1 ? shiftAmount : -shiftAmount))
    );
    const newB = Math.min(
      255,
      Math.max(0, b + (colors.length % 3 === 2 ? shiftAmount : -shiftAmount))
    );

    const newColor = `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    colors.push(newColor);
  }

  return colors;
};

// Prepare student data with consistent colors
const prepareStudentData = (performanceData) => {
  if (!performanceData) return [];

  const categories = Object.entries(performanceData);
  const colors = generateColors(categories.length);

  return categories.map(([category, score], index) => ({
    name: category,
    value: score,
    color: colors[index],
  }));
};

const Dashboard = () => {
  const classes = useStyles();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await apiService.departmentAdmin.getDashboard();
      
      setDashboardData(response.data);

      // Process student performance data for charts with consistent colors
      // Simulated data for now
      const samplePerformanceData = {
        "Assignments": 85,
        "Quizzes": 78,
        "Exams": 92,
        "Projects": 88,
        "Participation": 95
      };
      
      const preparedData = prepareStudentData(samplePerformanceData);
      setStudentData(preparedData);

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
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

  if (loading && !refreshing) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress size={60} sx={{ color: departmentColors.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefresh}
          sx={{ backgroundColor: departmentColors.main }}
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
          <Box className={classes.departmentInfo}>
            <SchoolIcon sx={{ color: departmentColors.main }} />
            <Typography variant="h6" className={classes.departmentName}>
              {dashboardData?.department}
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

      {/* Welcome Banner */}
      <WelcomeCard 
        departmentName={dashboardData?.department || "Computer Science"} 
        institutionName={dashboardData?.institution || "KLU University"}
      />

      {/* Department Info Card */}
      {/* <DepartmentDetails departmentDetails={dashboardData?.stats?.department_summary} /> */}

      {/* Student Summary */}
      <StudentSummary 
        departmentSummary={dashboardData?.stats?.department_summary} 
        loading={loading} 
      />

      {/* Student Performance & Overview - with consistent colors */}
      <Grid container spacing={3}>
        {/* Pass the prepared data with colors to both components */}
        <StudentPerformance
          studentData={studentData}
        />
        
        <StudentOverview 
          studentData={studentData}
        />
      </Grid>
    </Box>
  );
};

export default Dashboard;