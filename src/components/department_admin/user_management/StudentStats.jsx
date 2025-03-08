import React from 'react';
import { Grid } from '@mui/material';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import Card2 from '../../common/Card2';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
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

  const getUpdateRequests = () => {
    if (!students || students.length === 0) return 0;
    return students.filter(s => s.can_update_profile).length || 0;
  };

  // Define card data for dynamic rendering
  const cardData = [
    {
      icon: <PeopleIcon fontSize="large" />,
      value: getTotalStudents(),
      label: 'Total Students',
      backgroundColor: '#e8f5e9',
      iconColor: departmentColors.main
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      value: getActiveStudents(),
      label: 'Active Students',
      backgroundColor: '#f1f8e9',
      iconColor: '#8BC34A'
    },
    {
      icon: <PersonIcon fontSize="large" />,
      value: getProfileCompleted(),
      label: 'Profiles Completed',
      backgroundColor: '#e0f2f1',
      iconColor: '#26A69A'
    },
    {
      icon: <UpdateIcon fontSize="large" />,
      value: getUpdateRequests(),
      label: 'Update Requests',
      backgroundColor: '#fff8e1',
      iconColor: '#FBC02D'
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