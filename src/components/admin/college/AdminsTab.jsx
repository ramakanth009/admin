// src/components/admin/college/AdminsTab.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Refresh as RefreshIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import { getPrimaryColors } from '../../../utils/colors';
import apiService from '../../../services/apiService';

// Import dependent components
import AdminStats from './AdminStats';
import StatusChip from '../../common/ui/StatusChip';
import FilterSection from '../../common/user_management/FilterSection';

const useStyles = makeStyles({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontWeight: 'bold !important',
    color: props => props.colors.dark,
  },
  refreshButton: {
    color: props => `${props.colors.main} !important`,
    '&:hover': {
      backgroundColor: props => `${props.colors.light}30 !important`,
    },
  },
  tableContainer: {
    marginTop: '16px',
    borderRadius: '10px !important',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05) !important',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: props => `${props.colors.light}15 !important`,
      cursor: 'pointer',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px',
  },
  emptyMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '48px !important',
    marginBottom: '16px',
    color: '#ccc',
  },
  idCell: {
    fontFamily: 'monospace',
    fontWeight: '500',
    color: '#555',
  }
});

/**
 * AdminsTab component for college admin
 */
const AdminsTab = () => {
  // Component-specific styles
  const colors = getPrimaryColors('college_admin');
  const classes = useStyles({ colors });
  
  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminFilters, setAdminFilters] = useState({
    department: '',
    isActive: '',
    role: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [availableDepartments, setAvailableDepartments] = useState([]);

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchAdmins();
  }, [adminPage, adminFilters]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.collegeAdmin.getDepartmentAdmins(adminPage, adminFilters);
        
        setAdmins(response.data.results || []);
        setAdminTotalPages(response.data.total_pages || 1);
        
        // Extract unique departments for filters
        const departments = new Set();
        response.data.results.forEach(admin => {
          if (admin.department) {
            departments.add(admin.department);
          }
        });
        setAvailableDepartments(Array.from(departments));
        
        setLoading(false);
        setRefreshing(false);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to load admins. Please try again.');
        
        // Sample data for demonstration
        setAdmins([
          {
            id: 1,
            username: 'admin001',
            email: 'admin001@example.com',
            role: 'college_admin',
            department: null,
            date_joined: new Date().toISOString(),
            is_active: true
          },
          {
            id: 2,
            username: 'admin002',
            email: 'admin002@example.com',
            role: 'department_admin',
            department: 'Computer Science',
            date_joined: new Date().toISOString(),
            is_active: true
          }
        ]);
        setAdminTotalPages(1);
        setAvailableDepartments(['Computer Science', 'Mechanical Engineering']);
        
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to load admins. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      setAdminPage(1);
      fetchAdmins();
    }
  };

  const handleAdminPageChange = (event, value) => {
    setAdminPage(value);
  };

  const handleAdminFilterChange = (event) => {
    const { name, value } = event.target;
    setAdminFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setAdminPage(1);
  };

  const resetAdminFilters = () => {
    setAdminFilters({
      department: '',
      isActive: '',
      role: '',
    });
    setAdminPage(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <>
      <Typography variant="h5" className={classes.sectionTitle}>
        Admin Management
      </Typography>
      
      {/* Admin Statistics Cards */}
      <AdminStats admins={admins} loading={loading} />
      
      {/* Admin Filters Section */}
      <FilterSection
        filters={adminFilters}
        handleFilterChange={handleAdminFilterChange}
        resetFilters={resetAdminFilters}
        availableDepartments={availableDepartments}
        type="admin"
        role="college_admin"
      />
      
      {/* Admins table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Box className={classes.titleContainer} sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6">
            Admin Users
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              className={classes.refreshButton}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshIcon
                className={refreshing ? 'rotating' : ''}
                sx={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Admin Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} sx={{ color: colors.main }} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Box className={classes.emptyMessage}>
                    <AdminIcon className={classes.emptyIcon} />
                    <Typography variant="h6">No admins found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your filters or refreshing the page
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className={classes.tableRow}
                >
                  <TableCell className={classes.idCell}>{admin.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AdminIcon sx={{ mr: 1, color: colors.main }} />
                      {admin.username}
                    </Box>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <StatusChip status={admin.role} type="role" role="college_admin" />
                  </TableCell>
                  <TableCell>{admin.department || 'Not Assigned'}</TableCell>
                  <TableCell>
                    {new Date(admin.date_joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell><StatusChip status={admin.is_active} type="active" role="college_admin" /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Admin Pagination */}
        {!loading && admins.length > 0 && (
          <Box className={classes.paginationContainer}>
            <Pagination
              count={adminTotalPages}
              page={adminPage}
              onChange={handleAdminPageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminsTab;