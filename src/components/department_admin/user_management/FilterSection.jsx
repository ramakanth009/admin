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

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
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
    backgroundColor: `${departmentColors.light}15 !important`,
    color: `${departmentColors.main} !important`,
    '&:hover': {
      backgroundColor: `${departmentColors.light}30 !important`,
    },
  },
});

const FilterSection = ({ 
  filters, 
  handleFilterChange, 
  resetFilters, 
  availableRoles,
  type = 'department_student' 
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
        <FilterListIcon sx={{ mr: 1, color: departmentColors.main }} />
        Filters
      </Typography>
      <Box className={classes.filterRow}>
        {type === 'department_student' && (
          <FormControl className={classes.filterFormControl} size="small">
            <InputLabel>Role Preference</InputLabel>
            <Select
              name="preferredRole"
              value={filters.preferredRole}
              onChange={handleFilterChange}
              label="Role Preference"
            >
              <MenuItem value="">All Roles</MenuItem>
              {availableRoles.map((role, index) => (
                <MenuItem key={index} value={role}>
                  {role.replace(/_/g, ' ').split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

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

        {type === 'department_student' && (
          <FormControl className={classes.filterFormControl} size="small">
            <InputLabel>Update Permission</InputLabel>
            <Select
              name="canUpdateProfile"
              value={filters.canUpdateProfile}
              onChange={handleFilterChange}
              label="Update Permission"
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="allowed">Update Allowed</MenuItem>
              <MenuItem value="not_allowed">Update Not Allowed</MenuItem>
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