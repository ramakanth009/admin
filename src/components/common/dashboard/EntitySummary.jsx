// src/components/common/dashboard/EntitySummary.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Card from '../ui/Card';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  statsbox: {
    marginBottom: '44px !important',
  },
  sectionTitle: {
    margin: '24px 0 16px 0 !important',
    fontWeight: '600 !important',
    color: props => props.colors.dark,
  },
});

/**
 * Unified EntitySummary component that displays summary stats based on user role
 * 
 * @param {Object} props - Component props
 * @param {Object} props.summaryData - Data to display (user_summary for college admin, department_summary for department admin)
 * @param {boolean} props.loading - Whether data is loading
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const EntitySummary = ({ 
  summaryData = {}, 
  loading = false,
  role = 'college_admin'
}) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });
  const isCollegeAdmin = role === 'college_admin';

  // Create cards based on role
  const getCards = () => {
    if (isCollegeAdmin) {
      // College admin cards for user summary
      return [
        {
          icon: <PeopleIcon fontSize="large" />,
          value: summaryData?.total_users || 0,
          label: 'Total Users',
          backgroundColor: '#e3f2fd',
          iconColor: colors.main
        },
        {
          icon: <PersonIcon fontSize="large" />,
          value: summaryData?.total_students || 0,
          label: 'Students',
          backgroundColor: '#fff8e1',
          iconColor: '#ffa000'
        },
        {
          icon: <AdminIcon fontSize="large" />,
          value: summaryData?.college_admins || 0,
          label: 'College Admins',
          backgroundColor: '#e8f5e9',
          iconColor: '#43a047'
        },
        {
          icon: <AdminIcon fontSize="large" />,
          value: summaryData?.department_admins || 0,
          label: 'Department Admins',
          backgroundColor: '#ede7f6',
          iconColor: '#5e35b1'
        }
      ];
    } else {
      // Department admin cards for student summary
      const totalStudents = summaryData?.total_students || 0;
      const activeStudents = summaryData?.active_students || 0;
      const profilesCompleted = summaryData?.profiles_completed || 0;
      const profileCompletionRate = totalStudents > 0 
        ? Math.round((profilesCompleted / totalStudents) * 100) 
        : 0;

      return [
        {
          icon: <PeopleIcon fontSize="large" />,
          value: totalStudents,
          label: 'Total Students',
          backgroundColor: '#e8f5e9',
          iconColor: colors.main
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
    }
  };

  const cards = getCards();
  const sectionTitle = isCollegeAdmin ? 'User Summary' : 'Student Summary';

  return (
    <Box className={classes.statsbox}>
      <Typography variant="h5" className={classes.sectionTitle}>
        {sectionTitle}
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              icon={card.icon}
              value={card.value}
              label={card.label}
              backgroundColor={card.backgroundColor}
              iconColor={card.iconColor}
              loading={loading}
              role={role}
              variant="horizontal"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EntitySummary;