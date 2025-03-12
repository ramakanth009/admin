import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { 
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Card1 from '../../common/Card1';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50",
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  statsbox: {
    marginBottom: '44px !important',
  },
  sectionTitle: {
    margin: '24px 0 16px 0 !important',
    fontWeight: '600 !important',
    color: departmentColors.dark,
  },
});

const StudentSummary = ({ departmentSummary, loading }) => {
  const classes = useStyles();

  // Calculate some derived stats
  const totalStudents = departmentSummary?.total_students || 0;
  const activeStudents = departmentSummary?.active_students || 0;
  const profilesCompleted = departmentSummary?.profiles_completed || 0;
  const profileCompletionRate = totalStudents > 0 
    ? Math.round((profilesCompleted / totalStudents) * 100) 
    : 0;

  // Define card data for dynamic rendering
  const cardData = [
    {
      icon: <PeopleIcon fontSize="large" />,
      value: totalStudents,
      label: 'Total Students',
      backgroundColor: '#e8f5e9',
      iconColor: departmentColors.main
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      value: activeStudents,
      label: 'Active Students',
      backgroundColor: '#f1f8e9',
      iconColor: '#8BC34A'
    },
    {
      icon: <PersonAddIcon fontSize="large" />,
      value: profilesCompleted,
      label: 'Profiles Completed',
      backgroundColor: '#e0f2f1',
      iconColor: '#26A69A'
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      value: `${profileCompletionRate}%`,
      label: 'Completion Rate',
      backgroundColor: '#fffde7',
      iconColor: '#FBC02D'
    }
  ];

  return (
    <Box className={classes.statsbox}>
      <Typography variant="h5" className={classes.sectionTitle}>
        Student Summary
      </Typography>
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card1
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
    </Box>
  );
};

export default StudentSummary;