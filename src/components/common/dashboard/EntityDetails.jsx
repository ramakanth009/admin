// src/components/common/dashboard/EntityDetails.jsx
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  infoCard: {
    background: `linear-gradient(to right, #f8f9fa, #ffffff)`,
    borderLeft: props => `4px solid ${props.colors.main}`,
    marginBottom: '24px',
    padding: '16px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  }
});

/**
 * Unified entity details component that displays institution or department info
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entityDetails - Entity details to display
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const EntityDetails = ({ entityDetails, role = 'college_admin' }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const isCollegeAdmin = role === 'college_admin';
  const currentYear = new Date().getFullYear();

  if (!entityDetails) {
    return null;
  }

  // Determine content based on role
  const getMainContent = () => {
    if (isCollegeAdmin) {
      // Content for college admin
      return (
        <>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: colors.dark }}
          >
            {entityDetails.name} ({entityDetails.code})
          </Typography>
          <Typography variant="body2">
            Est. {entityDetails.established_year} • {entityDetails.city},{" "}
            {entityDetails.state}
          </Typography>
        </>
      );
    } else {
      // Content for department admin
      return (
        <>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: colors.dark }}
          >
            {entityDetails.department}
          </Typography>
          <Typography variant="body2">
            Total Students: {entityDetails.total_students} • 
            Active: {entityDetails.active_students}
          </Typography>
        </>
      );
    }
  };

  // Determine secondary content based on role
  const getSecondaryContent = () => {
    if (isCollegeAdmin) {
      // Content for college admin
      return (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TrendingUpIcon
            sx={{ fontSize: 16, marginRight: 1, color: colors.main }}
          />
          Active since {currentYear - entityDetails.established_year} years
        </Typography>
      );
    } else {
      // Content for department admin
      return (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TrendingUpIcon
            sx={{ fontSize: 16, marginRight: 1, color: colors.main }}
          />
          Profiles Completed: {entityDetails.profiles_completed} 
          ({Math.round((entityDetails.profiles_completed / entityDetails.total_students) * 100)}%)
        </Typography>
      );
    }
  };

  return (
    <Paper className={classes.infoCard} elevation={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {getMainContent()}
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
          {getSecondaryContent()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EntityDetails;