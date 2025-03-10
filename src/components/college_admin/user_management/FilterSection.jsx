import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FilterList as FilterListIcon } from '@mui/icons-material';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  

  filterSection: {
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '10px',
  },
  filterTitle: {
    fontWeight: '500 !important',
    marginBottom: '16px !important',
    display: 'flex',
    alignItems: 'center',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
  },
  filterFormControl: {
    minWidth: '200px !important',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  resetButton: {
    marginTop: '10px !important',
    backgroundColor: '#f5f5f5 !important',
    color: '#666 !important',
    '&:hover': {
      backgroundColor: '#e0e0e0 !important',
    },
  },
  clearButton: {
    marginTop: '10px !important',
    backgroundColor: `${primaryColors.light}15 !important`,
    color: `${primaryColors.main} !important`,
    '&:hover': {
      backgroundColor: `${primaryColors.light}30 !important`,
    },
  },
});

const FilterSection = ({ 
  filters, 
  handleFilterChange, 
  resetFilters, 
  availableDepartments, 
  type = 'student' // 'student' or 'admin'
}) => {
  const classes = useStyles();

  // Check if any filters are applied
  const areFiltersApplied = () => {
    return Object.values(filters).some(value => value !== '');
  };

  // Clear all filters
  const clearFilters = () => {
    resetFilters();
  };

  return (
    <Paper className={classes.filterSection} elevation={1}>
      <Typography variant="h6" className={classes.filterTitle}>
        <FilterListIcon sx={{ mr: 1, color: primaryColors.main }} />
        Filters
      </Typography>
      <Box className={classes.filterRow}>
        <FormControl className={classes.filterFormControl} size="small">
          <InputLabel className='inputbox'>Department</InputLabel>
          <Select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            label="Department"
          >
            <MenuItem value="">All Departments</MenuItem>
            {availableDepartments.map((dept, index) => (
              <MenuItem key={index} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.filterFormControl} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            name="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {type === 'student' ? (
          <FormControl className={classes.filterFormControl} size="small">
            <InputLabel>Profile Status</InputLabel>
            <Select
              name="profileCompleted"
              value={filters.profileCompleted}
              onChange={handleFilterChange}
              label="Profile Status"
            >
              <MenuItem value="">All Profiles</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <FormControl className={classes.filterFormControl} size="small">
            <InputLabel>Admin Type</InputLabel>
            <Select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              label="Admin Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="college_admin">College Admin</MenuItem>
              <MenuItem value="department_admin">Department Admin</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
      
      <Box className={classes.buttonContainer}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={clearFilters}
          disabled={!areFiltersApplied()}
          className={classes.clearButton}
        >
          Clear Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterSection;