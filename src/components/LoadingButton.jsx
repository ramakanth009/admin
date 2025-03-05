import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

// Primary colors defined for the admin dashboard
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const LoadingButton = ({ 
  label = "Sign In", 
  loadingLabel = "Signing in...",
  className, 
  isLoading, 
  onClick, 
  fullWidth, 
  disabled,
  variant = "contained",
  type = "submit",
  size = "large"
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoadingText, setShowLoadingText] = useState(false);
  
  useEffect(() => {
    let interval;
    
    if (isLoading) {
      // Start progress animation
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // Slow down as we approach 90%
          const nextValue = prev < 70 ? prev + 3 : prev + 0.5;
          return Math.min(nextValue, 90);
        });
      }, 100);
      
      // Show loading text after a small delay
      const textTimer = setTimeout(() => {
        setShowLoadingText(true);
      }, 600);
      
      return () => {
        clearInterval(interval);
        clearTimeout(textTimer);
      };
    } else {
      // Reset loading state when done
      if (loadingProgress > 0) {
        // Quick completion animation when loading is done
        interval = setInterval(() => {
          setLoadingProgress((prev) => {
            return prev < 100 ? prev + 5 : 100;
          });
        }, 30);
        
        // Reset after completion
        const resetTimer = setTimeout(() => {
          setLoadingProgress(0);
          setShowLoadingText(false);
        }, 1000);
        
        return () => {
          clearInterval(interval);
          clearTimeout(resetTimer);
        };
      }
    }
  }, [isLoading, loadingProgress]);
  
  return (
    <Button
      className={className}
      variant={variant}
      fullWidth={fullWidth}
      type={type}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '12px',
        paddingBottom: '12px',
        backgroundColor: isLoading ? `${primaryColors.main}` : undefined,
        '&:hover': {
          backgroundColor: isLoading ? `${primaryColors.main}` : undefined,
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Loading progress indicator */}
      {loadingProgress > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${loadingProgress}%`,
            backgroundColor: primaryColors.light,
            opacity: 0.3,
            transition: 'width 0.3s ease-in-out',
            zIndex: 0,
          }}
        />
      )}
      
      {/* Button content */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {isLoading && (
          <CircularProgress
            size={20}
            thickness={4}
            sx={{
              color: 'white',
              marginRight: '10px',
              opacity: showLoadingText ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        )}
        {isLoading && showLoadingText ? loadingLabel : label}
      </Box>
    </Button>
  );
};

export default LoadingButton;