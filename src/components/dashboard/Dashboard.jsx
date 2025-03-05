import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  SupervisorAccount,
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

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
  pageTitle: {
    marginBottom: "24px !important",
    fontWeight: "bold !important",
    color: primaryColors.dark,
  },
  summaryCard: {
    height: "100%",
    borderRadius: "10px !important",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1) !important",
    },
  },
  statsbox: {
    marginBottom: "44px !important",
  },
  statCard: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    height: "100%",
    borderRadius: "10px !important",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1) !important",
    },
  },
  statIcon: {
    padding: "15px",
    marginRight: "16px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flexGrow: 1,
  },
  statValue: {
    fontSize: "28px !important",
    fontWeight: "bold !important",
    marginBottom: "4px !important",
  },
  statLabel: {
    color: "#666666",
    fontSize: "14px !important",
  },
  sectionTitle: {
    margin: "24px 0 16px 0 !important",
    fontWeight: "600 !important",
    color: primaryColors.dark,
  },
  pieChartContainer: {
    height: "320px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  departmentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    margin: "8px 12px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
    marginRight: "8px",
  },
  legendLabel: {
    fontSize: "14px",
    color: "#555",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "200px",
  },
  refreshButton: {
    marginLeft: "10px !important",
    color: primaryColors.main,
  },
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
  welcomeBanner: {
    padding: "20px",
    marginBottom: "24px",
    background: `linear-gradient(135deg, ${primaryColors.main} 0%, ${primaryColors.dark} 100%)`,
    color: "white",
    borderRadius: "10px",
  },
  welcomeTitle: {
    fontWeight: "bold !important",
    marginBottom: "8px !important",
  },
  welcomeMessage: {
    opacity: 0.9,
  },
  actionButton: {
    marginTop: "16px !important",
    backgroundColor: "white !important",
    color: `${primaryColors.dark} !important`,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9) !important",
    },
  },
  infoCard: {
    background: `linear-gradient(to right, #f8f9fa, #ffffff)`,
    borderLeft: `4px solid ${primaryColors.main}`,
    marginBottom: "24px",
    padding: "16px",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateX(5px)",
    },
  },
});

// // Custom colors for pie chart
// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#8884d8",
//   "#82ca9d",
// ];
// Replace your current COLORS array with this color generation function
const generateColors = (count) => {
  const baseColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // If we have fewer departments than base colors, just return what we need
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Otherwise, generate additional colors by interpolating between our base colors
  const colors = [...baseColors];

  while (colors.length < count) {
    // Get a new color by mixing adjacent colors or slightly altering existing ones
    const colorIndex = colors.length % baseColors.length;
    const baseColor = baseColors[colorIndex];

    // Convert hex to RGB, shift the values slightly, then convert back to hex
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Create a modified color with a slight hue/brightness shift
    const shiftAmount =
      30 * (Math.floor(colors.length / baseColors.length) + 1);
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

const Dashboard = () => {
  const classes = useStyles();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // // Prepare chart data for department distribution
  // const prepareDepartmentData = (distributionData) => {
  //   if (!distributionData) return [];

  //   return Object.entries(distributionData).map(([dept, count], index) => ({
  //     name: dept,
  //     value: count,
  //     color: COLORS[index % COLORS.length],
  //   }));
  // };
  // In your Dashboard component, replace the prepareDepartmentData function with:

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

  const departmentData = dashboardData
    ? prepareDepartmentData(dashboardData.stats.department_distribution)
    : [];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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
          <Typography variant="h4" className={classes.pageTitle}>
            College Admin Dashboard
          </Typography>
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
      <Paper className={classes.welcomeBanner} elevation={2}>
        <Typography variant="h5" className={classes.welcomeTitle}>
          Welcome to {dashboardData?.stats.institution_details.name} Admin
          Portal
        </Typography>
        <Typography variant="body1" className={classes.welcomeMessage}>
          Manage your institution's departments, students, and academic
          resources all in one place.
        </Typography>
        <Button
          variant="contained"
          size="small"
          className={classes.actionButton}
          startIcon={<PeopleIcon />}
        >
          Manage Students
        </Button>
      </Paper>

      {/* Institution Info Card */}
      <Paper className={classes.infoCard} elevation={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: primaryColors.dark }}
            >
              {dashboardData?.stats.institution_details.name} (
              {dashboardData?.stats.institution_details.code})
            </Typography>
            <Typography variant="body2">
              Est. {dashboardData?.stats.institution_details.established_year} •{" "}
              {dashboardData?.stats.institution_details.city},{" "}
              {dashboardData?.stats.institution_details.state}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TrendingUpIcon
                sx={{ fontSize: 16, marginRight: 1, color: primaryColors.main }}
              />
              Active since{" "}
              {2025 - dashboardData?.stats.institution_details.established_year}{" "}
              years
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box className={classes.statsbox}>
        {/* Stats Cards */}
        <Typography variant="h5" className={classes.sectionTitle}>
          User Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.statCard} elevation={2}>
              <Box
                className={classes.statIcon}
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: primaryColors.main,
                }}
              >
                <PeopleIcon fontSize="large" />
              </Box>
              <Box className={classes.statContent}>
                <Typography variant="h5" className={classes.statValue}>
                  {dashboardData?.stats.user_summary.total_users}
                </Typography>
                <Typography className={classes.statLabel}>
                  Total Users
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.statCard} elevation={2}>
              <Box
                className={classes.statIcon}
                sx={{
                  backgroundColor: "#fff8e1",
                  color: "#ffa000",
                }}
              >
                <PersonIcon fontSize="large" />
              </Box>
              <Box className={classes.statContent}>
                <Typography variant="h5" className={classes.statValue}>
                  {dashboardData?.stats.user_summary.total_students}
                </Typography>
                <Typography className={classes.statLabel}>Students</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.statCard} elevation={2}>
              <Box
                className={classes.statIcon}
                sx={{
                  backgroundColor: "#e8f5e9",
                  color: "#43a047",
                }}
              >
                <AdminIcon fontSize="large" />
              </Box>
              <Box className={classes.statContent}>
                <Typography variant="h5" className={classes.statValue}>
                  {dashboardData?.stats.user_summary.college_admins}
                </Typography>
                <Typography className={classes.statLabel}>
                  College Admins
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className={classes.statCard} elevation={2}>
              <Box
                className={classes.statIcon}
                sx={{
                  backgroundColor: "#ede7f6",
                  color: "#5e35b1",
                }}
              >
                <SupervisorAccount fontSize="large" />
              </Box>
              <Box className={classes.statContent}>
                <Typography variant="h5" className={classes.statValue}>
                  {dashboardData?.stats.user_summary.department_admins}
                </Typography>
                <Typography className={classes.statLabel}>
                  Department Admins
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.statsbox}>
        {/* Department Distribution Section */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Department Distribution
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.pieChartContainer} elevation={2}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: primaryColors.dark, fontWeight: 600 }}
              >
                Student Distribution by Department
              </Typography>
              {departmentData.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#666",
                    }}
                  >
                    <WarningIcon sx={{ mr: 1, fontSize: 20 }} />
                    No department data available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name) => [`${value} Students`, name]}
                      contentStyle={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <Box className={classes.legend}>
                {departmentData.map((entry, index) => (
                  <Box key={`legend-${index}`} className={classes.legendItem}>
                    <Box
                      className={classes.legendColor}
                      sx={{ backgroundColor: entry.color }}
                    />
                    <Typography className={classes.legendLabel}>
                      {entry.name} ({entry.value})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className={classes.summaryCard} elevation={2}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: primaryColors.dark, fontWeight: 600 }}
                >
                  Department Overview
                </Typography>

                <Divider sx={{ my: 2 }} />

                {Object.entries(
                  dashboardData?.stats.department_distribution || {}
                ).length > 0 ? (
                  Object.entries(
                    dashboardData?.stats.department_distribution || {}
                  ).map(([dept, count], index) => (
                    <Box key={index} className={classes.departmentItem}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {dept}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {count} Students
                        </Typography>
                        {/* <PersonIcon
                          fontSize="small"
                          sx={{ color: COLORS[index % COLORS.length] }}
                        /> */}
                        <PersonIcon
                          fontSize="small"
                          sx={{ color: departmentData[index]?.color }}
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                    }}
                  >
                    <Typography sx={{ color: "#666" }}>
                      No departments found
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Total Departments:{" "}
                    {
                      Object.keys(
                        dashboardData?.stats.department_distribution || {}
                      ).length
                    }
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ color: primaryColors.main }}
                    startIcon={<AssignmentIcon />}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
