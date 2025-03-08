import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CardContent, 
  Divider, 
  Grid,
  LinearProgress
} from '@mui/material';
import { 
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  summaryCard: {
    height: '100%',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    fontSize: '0.75rem',
    color: '#666',
  },
  progress: {
    height: '8px !important',
    borderRadius: '4px !important',
  }
});

const StudentOverview = ({ studentData }) => {
  const classes = useStyles();

  const getProgressColor = (score) => {
    if (score >= 90) return departmentColors.dark;
    if (score >= 70) return departmentColors.main;
    if (score >= 50) return departmentColors.light;
    return "#FF9800"; // Orange for lower scores
  };

  return (
    <Grid item xs={12} md={6}>
      <Paper className={classes.summaryCard} elevation={2}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: departmentColors.dark, fontWeight: 600 }}
          >
            Performance Overview
          </Typography>

          <Divider sx={{ my: 2 }} />

          {studentData.length > 0 ? (
            studentData.map((category, index) => (
              <Box key={index} className={classes.categoryItem}>
                <Box className={classes.categoryHeader}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: getProgressColor(category.value)
                    }}
                  >
                    {category.value}%
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={category.value}
                  className={classes.progress}
                  sx={{ 
                    backgroundColor: '#eee',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressColor(category.value)
                    }
                  }}
                />
                
                <Box className={classes.progressLabel}>
                  <Typography variant="caption">Threshold: 70%</Typography>
                  <Typography variant="caption">Target: 90%</Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
              }}
            >
              <Typography sx={{ color: "#666" }}>
                No performance data found
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#666", display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon fontSize="small" sx={{ mr: 0.5, color: departmentColors.main }} />
              Based on {studentData.length} assessment categories
            </Typography>
          </Box>
        </CardContent>
      </Paper>
    </Grid>
  );
};

export default StudentOverview;