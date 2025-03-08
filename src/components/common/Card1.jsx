import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  statCard: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  statIcon: {
    padding: '15px',
    marginRight: '16px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flexGrow: 1,
  },
  statValue: {
    fontSize: '28px !important',
    fontWeight: 'bold !important',
    marginBottom: '4px !important',
  },
  statLabel: {
    color: '#666666',
    fontSize: '14px !important',
  },
});

const Card1 = ({ icon, value, label, backgroundColor, iconColor, loading }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.statCard} elevation={2}>
      <Box
        className={classes.statIcon}
        sx={{
          backgroundColor: backgroundColor,
          color: iconColor,
        }}
      >
        {icon}
      </Box>
      <Box className={classes.statContent}>
        <Typography variant="h5" className={classes.statValue}>
          {loading ? '...' : value}
        </Typography>
        <Typography className={classes.statLabel}>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Card1;