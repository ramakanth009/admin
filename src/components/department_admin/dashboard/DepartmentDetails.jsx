import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  infoCard: {
    background: `linear-gradient(to right, #f8f9fa, #ffffff)`,
    borderLeft: `4px solid ${departmentColors.main}`,
    marginBottom: '24px',
    padding: '16px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  }
});

const DepartmentDetails = ({ departmentDetails }) => {
  const classes = useStyles();
  
  if (!departmentDetails) {
    return null;
  }

  return (
    <Paper className={classes.infoCard} elevation={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: departmentColors.dark }}
          >
            {departmentDetails.department}
          </Typography>
          <Typography variant="body2">
            Total Students: {departmentDetails.total_students} • 
            Active: {departmentDetails.active_students}
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
              sx={{ fontSize: 16, marginRight: 1, color: departmentColors.main }}
            />
            Profiles Completed: {departmentDetails.profiles_completed} 
            ({Math.round((departmentDetails.profiles_completed / departmentDetails.total_students) * 100)}%)
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DepartmentDetails;