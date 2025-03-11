// src/components/admin/department/visualizations/StudentOverview.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress
} from '@mui/material';
import { 
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import ChartCard from '../../../common/charts/ChartCard';

/**
 * Student overview component for department admin
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Student performance data
 * @param {Object} props.colors - Theme colors
 */
const StudentOverview = ({ data = [], colors }) => {
  // Get appropriate color for progress bar based on score
  const getProgressColor = (score) => {
    if (score >= 90) return colors.dark;
    if (score >= 70) return colors.main;
    if (score >= 50) return colors.light;
    return "#FF9800"; // Orange for lower scores
  };

  return (
    <ChartCard
      title="Performance Overview"
      loading={false}
      hasData={data?.length > 0}
      noDataMessage={<div>No performance data found</div>}
      role="department_admin"
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#666", display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon fontSize="small" sx={{ mr: 0.5, color: colors.main }} />
            Based on {data.length} assessment categories
          </Typography>
        </Box>
      }
    >
      <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
        {data.map((category, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '10px 0',
              borderBottom: index < data.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
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
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#eee',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(category.value)
                }
              }}
            />
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
              fontSize: '0.75rem',
              color: '#666',
            }}>
              <Typography variant="caption">Threshold: 70%</Typography>
              <Typography variant="caption">Target: 90%</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </ChartCard>
  );
};

export default StudentOverview;