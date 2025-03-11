// src/components/common/charts/ChartCard.jsx
import React from 'react';
import { Box, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  chartContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  chartTitle: {
    marginBottom: '0 !important',
    fontWeight: '600 !important',
    color: props => props.colors.dark,
  },
  chartWrapper: {
    width: '100%',
    height: '350px',
    marginTop: '10px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    color: '#666',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '8px',
  },
});

/**
 * A wrapper component for chart visualizations that provides consistent styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {ReactNode} props.children - Chart content
 * @param {string} props.footer - Optional footer text
 * @param {boolean} props.loading - Whether the chart is loading
 * @param {boolean} props.hasData - Whether the chart has data to display
 * @param {ReactNode} props.noDataMessage - Message to show when no data is available
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const ChartCard = ({ 
  title, 
  children, 
  footer, 
  loading = false, 
  hasData = true, 
  noDataMessage = "No data available", 
  role = "college_admin" 
}) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });

  return (
    <Paper className={classes.chartContainer} elevation={2}>
      <Typography
        variant="h6"
        gutterBottom
        className={classes.chartTitle}
      >
        {title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box className={classes.chartWrapper}>
        {loading ? (
          <CircularProgress size={40} sx={{ color: colors.main }} />
        ) : !hasData ? (
          <Box className={classes.noDataContainer}>
            {noDataMessage}
          </Box>
        ) : (
          children
        )}
      </Box>

      {footer && (
        <Box className={classes.footer}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" align="center" sx={{ color: '#666' }}>
            {footer}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ChartCard;