// src/components/common/user_management/FilterSection.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Grid
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  filterSection: {
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '10px',
  },
  filterTitle: {
    fontWeight: '500 !important',
    marginBottom: '20px !important',
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    width: '100% !important',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end', // This aligns button with the bottom of form controls
  },
  clearButton: {
    height: '40px !important',
    // Dynamic color based on props
    backgroundColor: (props) => `${props.colors.light}15 !important`,
    color: (props) => `${props.colors.main} !important`,
    '&:hover': {
      backgroundColor: (props) => `${props.colors.light}30 !important`,
    },
  },
});

/**
 * Unified FilterSection component that displays appropriate filters based on user role
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {function} props.handleFilterChange - Handler for filter changes
 * @param {function} props.resetFilters - Handler to reset all filters
 * @param {Array} props.availableDepartments - List of available departments for filtering
 * @param {Array} props.availableRoles - List of available roles for filtering
 * @param {string} props.type - Filter type ('student', 'admin', or 'department_student')
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const FilterSection = ({ 
  filters, 
  handleFilterChange, 
  resetFilters, 
  availableDepartments = [],
  availableRoles = [],
  type = 'student',
  role = 'college_admin' 
}) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors });

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
        <FilterListIcon sx={{ mr: 1, color: colors.main }} />
        Filters
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        {/* For college admin student view */}
        {type === 'student' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
                <InputLabel>Department</InputLabel>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>
          </>
        )}

        {/* For college admin admin view */}
        {type === 'admin' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
                <InputLabel>Department</InputLabel>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>
          </>
        )}

        {/* For department admin student view */}
        {type === 'department_student' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} size="small" fullWidth>
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
            </Grid>
          </>
        )}

        {/* Clear Filters Button - always in the last column */}
        <Grid item xs={12} sm={6} md={3} className={classes.buttonContainer}>
          <Button 
            variant="outlined" 
            size="medium"
            onClick={clearFilters}
            disabled={!areFiltersApplied()}
            className={classes.clearButton}
            fullWidth
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterSection;