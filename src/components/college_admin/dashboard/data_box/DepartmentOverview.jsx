import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CardContent, 
  Divider, 
  Button, 
  Grid
} from '@mui/material';
import { 
  Person as PersonIcon 
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
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
  departmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

const DepartmentOverview = ({ departmentData }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
      <Paper className={classes.summaryCard} elevation={2}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: primaryColors.dark, fontWeight: 600 }}
          >
            Department Overview
          </Typography>

          <Divider sx={{ my: 2 }} />

          {departmentData.length > 0 ? (
            departmentData.map((dept, index) => (
              <Box key={index} className={classes.departmentItem}>
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
                No departments found
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
            <Typography variant="body2" sx={{ color: "#666" }}>
              Total Departments: {departmentData.length}
            </Typography>
            {/* <Button
              variant="text"
              size="small"
              sx={{ color: primaryColors.main }}
            >
              View Details
            </Button> */}
          </Box>
        </CardContent>
      </Paper>
    </Grid>
  );
};

export default DepartmentOverview;