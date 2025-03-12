import React from "react";
import { Box, Typography, Paper, Divider, Grid } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { makeStyles } from "@mui/styles";

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  deptdisttitle: {
    marginBottom: "0 !important", // Reduced margin to match DepartmentOverview title
  },
  pieChartContainer: {
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
  legend: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "5px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    margin: "4px 8px",
    width: "calc(50% - 16px)", // Two columns layout for legend items
  },
  legendColor: {
    width: "10px",
    height: "10px",
    borderRadius: "2px",
    marginRight: "6px",
  },
  legendLabel: {
    fontSize: "12px",
    color: "#555",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statsbox: {
    marginBottom: "20px !important", // Reduced from 44px to match DepartmentOverview spacing
  },
  chartWrapper: {
    width: "100%",
    height: "350px", // Increased height to accommodate wrapped text
    marginTop: "10px",
    marginBottom: "5px",
  },
  noDataContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "350px",
    width: "100%",
  },
});

// We'll use the colors passed from the Dashboard component instead of generating them here

// This function is no longer needed as we'll use the data with colors already prepared by the Dashboard component

const DepartmentDistribution = ({ departmentData }) => {
  const classes = useStyles();

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
  }) => {
    // Calculate outer position for the label (outside the pie)
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.3; // Position label outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Determine text anchor based on position in the circle
    const textAnchor = x > cx ? "start" : "end";

    // Add a line from the pie to the label
    const lineX1 = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const lineY1 = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const lineX2 = x - (textAnchor === "start" ? 10 : -10);
    const lineY2 = y;

    // Function to break long department names into multiple lines if needed
    const getWrappedText = (text, maxWidth = 15) => {
      if (!text || text.length <= maxWidth) return [text];

      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        if ((currentLine + " " + word).length <= maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Break department name into lines if needed
    const nameLines = getWrappedText(name);

    return (
      <g>
        {/* Line connecting pie to label */}
        <line
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2}
          stroke="#999999"
          strokeWidth={1}
        />

        {/* Department name (potentially multi-line) */}
        {nameLines.map((line, i) => (
          <text
            key={`line-${i}`}
            x={x}
            y={y - 8 + i * 14} // Offset each line
            textAnchor={textAnchor}
            fill="#666666"
            fontSize={11}
            fontWeight="normal"
          >
            {line}
          </text>
        ))}

        {/* Percentage value - placed below the last line of text */}
        <text
          x={x}
          y={y - 8 + nameLines.length * 14} // Position below the name text
          textAnchor={textAnchor}
          fill="#333333"
          fontSize={12}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <Grid item xs={12} md={6}>
      <Box className={classes.statsbox}>
        {/* <Typography variant="h5" className={classes.sectionTitle}>
          Department Distribution
        </Typography> */}
        <Paper className={classes.pieChartContainer} elevation={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: primaryColors.dark, fontWeight: 600 }}
            className={classes.deptdisttitle}
          >
            Student Distribution by Department
          </Typography>

          <Divider sx={{ my: 2 }} />

          {departmentData.length === 0 ? (
            <Box className={classes.noDataContainer}>
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
            <Box className={classes.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    innerRadius={30}
                    paddingAngle={1}
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
            </Box>
          )}

          {/* No need for a legend as we now have external labels */}
        </Paper>
      </Box>
    </Grid>
  );
};

export default DepartmentDistribution;