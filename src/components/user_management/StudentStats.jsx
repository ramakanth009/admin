import React from 'react';
import { Grid } from '@mui/material';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import Card2 from '../common/Card2';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const StudentStats = ({ students, loading }) => {
  // Extract relevant information for stats
  const getTotalStudents = () => {
    if (!students || students.length === 0) return 0;
    return students[0]?.institution_details?.total_students || 0;
  };

  const getActiveStudents = () => {
    if (!students || students.length === 0) return 0;
    return students.filter(s => s.is_active).length || 0;
  };

  const getProfileCompleted = () => {
    if (!students || students.length === 0) return 0;
    return students.filter(s => s.profile_completed).length || 0;
  };

  const getDepartmentCount = () => {
    if (!students || students.length === 0) return 0;
    if (!students[0]?.institution_details?.department_wise_admins) return 0;
    return Object.keys(students[0].institution_details.department_wise_admins).length;
  };

  // Define card data for dynamic rendering
  const cardData = [
    {
      icon: <PeopleIcon fontSize="large" />,
      value: getTotalStudents(),
      label: 'Total Students',
      backgroundColor: '#e3f2fd',
      iconColor: primaryColors.main
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      value: getActiveStudents(),
      label: 'Active Students',
      backgroundColor: '#e8f5e9',
      iconColor: '#2e7d32'
    },
    {
      icon: <PersonIcon fontSize="large" />,
      value: getProfileCompleted(),
      label: 'Profile Completed',
      backgroundColor: '#e3f2fd',
      iconColor: '#1565c0'
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      value: getDepartmentCount(),
      label: 'Departments',
      backgroundColor: '#fff8e1',
      iconColor: '#f57f17'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card2
            icon={card.icon}
            value={card.value}
            label={card.label}
            backgroundColor={card.backgroundColor}
            iconColor={card.iconColor}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StudentStats;