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
  Snackbar,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Refresh as RefreshIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import axios from 'axios';

// Import custom components
import AdminStats from '../AdminStats';
import StatusChip from '../StatusChip';
import apiService from '../../../../services/apiService';

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
    justifyContent: 'flex-end',
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
  sectionTitle: {
    marginBottom: '16px !important',
    fontWeight: 'bold !important',
    color: primaryColors.dark,
  },
  idCell: {
    fontFamily: 'monospace',
    fontWeight: '500',
    color: '#555',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  refreshButton: {
    color: `${primaryColors.main} !important`,
    '&:hover': {
      backgroundColor: `${primaryColors.light}30 !important`,
    },
  }
});

const AdminsTab = () => {
  const classes = useStyles();
  
  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch data on initial load and when page changes
  useEffect(() => {
    fetchAdmins();
  }, [adminPage]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.collegeAdmin.getDepartmentAdmins(adminPage);
        
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

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <>
      {/* Header with Title and Refresh Button */}
      <Box className={classes.titleContainer}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Admin Management
        </Typography>
        
        <Button
          variant="text"
          startIcon={
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
          }
          onClick={handleRefresh}
          disabled={refreshing}
          className={classes.refreshButton}
        >
          Refresh Data
        </Button>
      </Box>
      
      {/* Admin Statistics Cards */}
      <AdminStats admins={admins} loading={loading} />
      
      {/* Admins table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
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
                  <CircularProgress size={40} sx={{ color: primaryColors.main }} />
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
                      Try refreshing the page
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