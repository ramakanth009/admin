// src/components/admin/college/visualizations/DepartmentOverview.jsx
import React from 'react';
import { 
  Box, 
  Typography,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon 
} from '@mui/icons-material';
import ChartCard from '../../../common/charts/ChartCard';

/**
 * Department overview component for college admin
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Department data
 * @param {Object} props.colors - Theme colors
 */
const DepartmentOverview = ({ data = [], colors }) => {
  // Sort departments by number of students
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <ChartCard
      title="Department Overview"
      loading={false}
      hasData={data?.length > 0}
      noDataMessage={<div>No departments found</div>}
      role="college_admin"
      footer={`Total Departments: ${data.length}`}
    >
      <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
        {sortedData.map((dept, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '10px 0',
              borderBottom: index < sortedData.length - 1 ? '1px solid #f0f0f0' : 'none',
              '&:hover': {
                backgroundColor: `${colors.light}15`,
              }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {dept.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {dept.value} Students
              </Typography>
              <PersonIcon
                fontSize="small"
                sx={{ color: dept.color }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </ChartCard>
  );
};

export default DepartmentOverview;