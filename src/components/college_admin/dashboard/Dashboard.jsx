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
import axios from "axios";

// Import modular components
import WelcomeCard from "./WelcomeCard";
import CollegeDetails from "./CollegeDetails";
import UserSummary from "./UserSummary";
import DepartmentDistribution from "./data_box/DepartmentDistribution";
import DepartmentOverview from "./data_box/DepartmentOverview";

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  root: {
    padding: "20px",
  },
  // pageTitle: {
  //   marginBottom: "24px !important",
  //   fontWeight: "bold !important",
  //   color: primaryColors.dark,
  // },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  institutionInfo: {
    marginBottom: "8px !important",
    display: "flex",
    alignItems: "center",
  },
  institutionName: {
    fontWeight: "bold !important",
    marginLeft: "8px !important",
    color: primaryColors.main,
  },
  refreshButton: {
    marginLeft: "10px !important",
    color: primaryColors.main,
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
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
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

// Prepare department data with consistent colors
const prepareDepartmentData = (distributionData) => {
  if (!distributionData) return [];

  const departments = Object.entries(distributionData);
  const colors = generateColors(departments.length);

  return departments.map(([dept, count], index) => ({
    name: dept,
    value: count,
    color: colors[index],
  }));
};

const Dashboard = () => {
  const classes = useStyles();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:8000/api/college-admin/dashboard/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboardData(response.data);

      // Process department data for charts with consistent colors
      const preparedData = prepareDepartmentData(response.data.stats.department_distribution);
      setDepartmentData(preparedData);

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
        <CircularProgress size={60} sx={{ color: primaryColors.main }} />
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
          sx={{ backgroundColor: primaryColors.main }}
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
          {/* <Typography variant="h4" className={classes.pageTitle}>
            College Admin Dashboard
          </Typography> */}
          <Box className={classes.institutionInfo}>
            <SchoolIcon sx={{ color: primaryColors.main }} />
            <Typography variant="h6" className={classes.institutionName}>
              {dashboardData?.institution_name}
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
      <WelcomeCard institutionName={dashboardData?.institution_name} />

      {/* Institution Info Card */}
      <CollegeDetails institutionDetails={dashboardData?.stats?.institution_details} />

      {/* User Summary */}
      <UserSummary 
        userSummary={dashboardData?.stats?.user_summary} 
        loading={loading} 
      />

      {/* Department Distribution & Overview - Now with consistent colors */}
      <Grid container spacing={3}>
        {/* Pass the prepared data with colors to both components */}
        <DepartmentDistribution
          departmentData={departmentData}
        />
        
        <DepartmentOverview 
          departmentDistribution={dashboardData?.stats?.department_distribution} 
          departmentData={departmentData}
        />
      </Grid>
    </Box>
  );
};

export default Dashboard;