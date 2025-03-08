import React from "react";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { makeStyles } from "@mui/styles";

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  chartTitle: {
    marginBottom: "0 !important",
  },
  chartContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    borderRadius: "10px !important",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1) !important",
    },
  },
  chartWrapper: {
    width: "100%",
    height: "350px",
    marginTop: "10px",
    marginBottom: "5px",
  },
  statsbox: {
    marginBottom: "20px !important",
  },
  noDataContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "350px",
    width: "100%",
  },
});

const StudentPerformance = ({ studentData }) => {
  const classes = useStyles();

  const formatData = (data) => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      category: item.name,
      score: item.value,
      fill: item.color || departmentColors.main,
    }));
  };

  const formatYAxisTick = (value) => {
    return `${value}%`;
  };

  const formattedData = formatData(studentData);

  return (
    <Grid item xs={12} md={6}>
      <Box className={classes.statsbox}>
        <Paper className={classes.chartContainer} elevation={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: departmentColors.dark, fontWeight: 600 }}
            className={classes.chartTitle}
          >
            Student Performance by Category
          </Typography>

          <Divider sx={{ my: 2 }} />

          {formattedData.length === 0 ? (
            <Box className={classes.noDataContainer}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#666",
                }}
              >
                <WarningIcon sx={{ mr: 1, fontSize: 20 }} />
                No performance data available
              </Typography>
            </Box>
          ) : (
            <Box className={classes.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#ccc" }}
                    axisLine={{ stroke: "#ccc" }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tickFormatter={formatYAxisTick}
                    domain={[0, 100]}
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#ccc" }}
                    axisLine={{ stroke: "#ccc" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Score"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "10px",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingTop: "10px" }}
                  />
                  <Bar
                    dataKey="score"
                    name="Performance Score"
                    fill={departmentColors.main}
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#666", mt: 1 }}
          >
            Average student performance across different assessment categories
          </Typography>
        </Paper>
      </Box>
    </Grid>
  );
};

export default StudentPerformance;