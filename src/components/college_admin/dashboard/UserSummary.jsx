import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { 
  People as PeopleIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Card1 from '../../common/Card1';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  statsbox: {
    marginBottom: '44px !important',
  },
  sectionTitle: {
    margin: '24px 0 16px 0 !important',
    fontWeight: '600 !important',
    color: primaryColors.dark,
  },
});

const UserSummary = ({ userSummary, loading }) => {
  const classes = useStyles();

  // Define card data for dynamic rendering
  const cardData = [
    {
      icon: <PeopleIcon fontSize="large" />,
      value: userSummary?.total_users || 0,
      label: 'Total Users',
      backgroundColor: '#e3f2fd',
      iconColor: primaryColors.main
    },
    {
      icon: <PersonIcon fontSize="large" />,
      value: userSummary?.total_students || 0,
      label: 'Students',
      backgroundColor: '#fff8e1',
      iconColor: '#ffa000'
    },
    {
      icon: <AdminIcon fontSize="large" />,
      value: userSummary?.college_admins || 0,
      label: 'College Admins',
      backgroundColor: '#e8f5e9',
      iconColor: '#43a047'
    },
    {
      icon: <AdminIcon fontSize="large" />,
      value: userSummary?.department_admins || 0,
      label: 'Department Admins',
      backgroundColor: '#ede7f6',
      iconColor: '#5e35b1'
    }
  ];

  return (
    <Box className={classes.statsbox}>
      <Typography variant="h5" className={classes.sectionTitle}>
        User Summary
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

export default UserSummary;