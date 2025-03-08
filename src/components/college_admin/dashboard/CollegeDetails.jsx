import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  infoCard: {
    background: `linear-gradient(to right, #f8f9fa, #ffffff)`,
    borderLeft: `4px solid ${primaryColors.main}`,
    marginBottom: '24px',
    padding: '16px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  }
});

const CollegeDetails = ({ institutionDetails }) => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  if (!institutionDetails) {
    return null;
  }

  return (
    <Paper className={classes.infoCard} elevation={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: primaryColors.dark }}
          >
            {institutionDetails.name} ({institutionDetails.code})
          </Typography>
          <Typography variant="body2">
            Est. {institutionDetails.established_year} • {institutionDetails.city},{" "}
            {institutionDetails.state}
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
            Active since {currentYear - institutionDetails.established_year} years
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CollegeDetails;