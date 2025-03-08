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
  Tabs,
  Tab,
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
import axios from 'axios';

// Import custom components
import AdminStats from '../AdminStats';
import FilterSection from '../FilterSection';
import StatusChip from '../StatusChip';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  searchBox: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableContainer: {
    marginTop: '16px',
    borderRadius: '10px !important',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05) !important',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: `${primaryColors.light}15 !important`,
      cursor: 'pointer',
    },
  },
  actionButton: {
    marginLeft: '8px !important',
    color: primaryColors.main,
  },
  tabs: {
    marginBottom: '16px !important',
    '& .MuiTabs-indicator': {
      backgroundColor: `${primaryColors.main} !important`,
    },
  },
  tab: {
    fontWeight: '500 !important',
    '&.Mui-selected': {
      color: `${primaryColors.main} !important`,
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
  }
});

const AdminsTab = () => {
  const classes = useStyles();
  
  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminTabValue, setAdminTabValue] = useState(0);
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminFilters, setAdminFilters] = useState({
    department: '',
    isActive: '',
    role: '',
  });
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch data on initial load and when filters or page changes
  useEffect(() => {
    fetchAdmins();
  }, [adminPage, adminFilters]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = `page=${adminPage}&page_size=10`;
      if (adminFilters.department) queryParams += `&department=${adminFilters.department}`;
      if (adminFilters.isActive) queryParams += `&is_active=${adminFilters.isActive === 'active'}`;
      if (adminFilters.role) queryParams += `&role=${adminFilters.role}`;

      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8000/api/college-admin/department-admins/?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmins(response.data.results || []);
      setAdminTotalPages(response.data.total_pages || 1);
      setLoading(false);
      setRefreshing(false);
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

  const handleAdminTabChange = (event, newValue) => {
    setAdminTabValue(newValue);
    
    // Update filters based on selected tab
    if (newValue === 0) { // All Admins
      setAdminFilters({
        ...adminFilters,
        isActive: '',
      });
    } else if (newValue === 1) { // Active Admins
      setAdminFilters({
        ...adminFilters,
        isActive: 'active',
      });
    } else if (newValue === 2) { // Inactive Admins
      setAdminFilters({
        ...adminFilters,
        isActive: 'inactive',
      });
    }
    
    setAdminPage(1);
  };

  const handleAdminPageChange = (event, value) => {
    setAdminPage(value);
  };

  const handleAdminFilterChange = (event) => {
    const { name, value } = event.target;
    setAdminFilters({
      ...adminFilters,
      [name]: value,
    });
    setAdminPage(1);
  };

  const resetAdminFilters = () => {
    setAdminFilters({
      department: '',
      isActive: '',
      role: '',
    });
    setAdminTabValue(0);
    setAdminPage(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Extract unique departments for filter options
  const getAvailableDepartments = () => {
    const departments = new Set();
    
    // Add departments from admins
    admins.forEach(admin => {
      if (admin.department) {
        departments.add(admin.department);
      }
    });
    
    return Array.from(departments);
  };

  return (
    <>
      {/* Admin Statistics Cards */}
      <AdminStats admins={admins} loading={loading} />

      {/* Search and filter for admins */}
      <Box className={classes.searchBox}>
        <Box sx={{ flex: 1 }} /> {/* Spacer */}
        {/* Removed filter button */}
        <Tooltip title="Refresh">
          <IconButton
            className={classes.actionButton}
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

      {/* Admin Filters section */}
      {showFilters && (
        <FilterSection
          filters={adminFilters}
          handleFilterChange={handleAdminFilterChange}
          resetFilters={resetAdminFilters}
          availableDepartments={getAvailableDepartments()}
          type="admin"
        />
      )}

      {/* Admin Tabs */}
      <Tabs
        value={adminTabValue}
        onChange={handleAdminTabChange}
        className={classes.tabs}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Admins" className={classes.tab} />
        <Tab label="Active Admins" className={classes.tab} />
        <Tab label="Inactive Admins" className={classes.tab} />
      </Tabs>

      {/* Admins table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
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
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} sx={{ color: primaryColors.main }} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Box className={classes.emptyMessage}>
                    <AdminIcon className={classes.emptyIcon} />
                    <Typography variant="h6">No admins found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your search or filters
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
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AdminIcon sx={{ mr: 1, color: primaryColors.main }} />
                      {admin.username}
                    </Box>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <StatusChip status={admin.role} type="role" />
                  </TableCell>
                  <TableCell>{admin.department || 'Not Assigned'}</TableCell>
                  <TableCell>
                    {new Date(admin.date_joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell><StatusChip status={admin.is_active} type="active" /></TableCell>
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