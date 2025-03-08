import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  statsCard: {
    height: '100%',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  statIcon: {
    padding: '15px',
    borderRadius: '50%',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '24px !important',
    fontWeight: 'bold !important',
    marginBottom: '4px !important',
  },
  statLabel: {
    color: '#666666',
    fontSize: '14px !important',
    textAlign: 'center',
  },
});

const Card2 = ({ icon, value, label, backgroundColor, iconColor, loading, onClick }) => {
  const classes = useStyles();

  return (
    <Paper 
      className={classes.statsCard} 
      elevation={2}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Box
        className={classes.statIcon}
        sx={{
          backgroundColor: backgroundColor,
          color: iconColor,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" className={classes.statValue}>
        {loading ? '...' : value}
      </Typography>
      <Typography className={classes.statLabel}>
        {label}
      </Typography>
    </Paper>
  );
};

export default Card2;