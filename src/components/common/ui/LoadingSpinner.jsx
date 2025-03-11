// src/components/common/ui/LoadingSpinner.jsx
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: props => `linear-gradient(135deg, ${props.colors.main}15 0%, ${props.colors.light}10 100%)`,
    position: 'relative',
  },
  loadingText: {
    marginTop: '20px !important',
    color: props => props.colors.main,
    fontWeight: '500 !important',
    opacity: 0,
    animation: '$fadeIn 1s ease-in-out forwards',
  },
  progressWrapper: {
    position: 'relative',
    animation: '$scaleIn 0.5s ease-out forwards',
  },
  progressBackground: {
    position: 'absolute',
    color: props => `${props.colors.light}40 !important`,
    opacity: 0.4,
  },
  progress: {
    color: props => `${props.colors.main} !important`,
    animationDuration: '1s !important',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes scaleIn': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  blurredBackground: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: props => `${props.colors.light}20`,
    filter: 'blur(80px)',
    zIndex: 0,
    opacity: 0,
    animation: '$pulseBackground 3s ease-in-out infinite',
  },
  '@keyframes pulseBackground': {
    '0%': {
      opacity: 0.2,
      transform: 'scale(0.8)',
    },
    '50%': {
      opacity: 0.4,
      transform: 'scale(1.1)',
    },
    '100%': {
      opacity: 0.2,
      transform: 'scale(0.8)',
    },
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: props => props.colors.main,
    margin: '0 3px',
    opacity: 0.3,
  },
  activeDot: {
    opacity: 1,
    animation: '$pulseDot 1s infinite',
  },
  '@keyframes pulseDot': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.3)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
});

/**
 * Unified loading spinner component with theme support
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const LoadingSpinner = ({ message = "Loading...", role = "college_admin" }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const [activeDot, setActiveDot] = useState(0);
  const [rotationValue, setRotationValue] = useState(0);

  useEffect(() => {
    // Animate the dots
    const dotInterval = setInterval(() => {
      setActiveDot(prev => (prev + 1) % 3);
    }, 500);

    // Add a subtle rotation effect
    const rotationInterval = setInterval(() => {
      setRotationValue(prev => (prev + 2) % 360);
    }, 50);

    return () => {
      clearInterval(dotInterval);
      clearInterval(rotationInterval);
    };
  }, []);

  return (
    <Box className={classes.loadingContainer}>
      <Box className={classes.blurredBackground} />
      
      <Box 
        className={classes.progressWrapper}
        sx={{ transform: `rotate(${rotationValue}deg)` }}
      >
        <CircularProgress
          className={classes.progressBackground}
          variant="determinate"
          size={60}
          thickness={4}
          value={100}
        />
        <CircularProgress
          className={classes.progress}
          size={60}
          thickness={4}
        />
      </Box>
      
      <Typography variant="h6" className={classes.loadingText}>
        {message}
      </Typography>
      
      <Box className={classes.dots}>
        <Box 
          className={`${classes.dot} ${activeDot === 0 ? classes.activeDot : ''}`} 
          sx={{ 
            animationDelay: '0s',
            transform: activeDot === 0 ? 'scale(1.3)' : 'scale(1)'
          }}
        />
        <Box 
          className={`${classes.dot} ${activeDot === 1 ? classes.activeDot : ''}`}
          sx={{ 
            animationDelay: '0.2s',
            transform: activeDot === 1 ? 'scale(1.3)' : 'scale(1)'
          }}
        />
        <Box 
          className={`${classes.dot} ${activeDot === 2 ? classes.activeDot : ''}`}
          sx={{ 
            animationDelay: '0.4s',
            transform: activeDot === 2 ? 'scale(1.3)' : 'scale(1)'
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;