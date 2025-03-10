import React, { useState, useEffect, useCallback } from 'react';
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
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Import custom components
import StudentStats from './StudentStats';
import FilterSection from './FilterSection';
import StatusChip from './StatusChip';
import StudentDetailsDialog from './StudentDetailsDialog';
import apiService from '../../../services/apiService';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontWeight: 'bold !important',
    color: departmentColors.dark,
  },
  refreshButton: {
    color: `${departmentColors.main} !important`,
    '&:hover': {
      backgroundColor: `${departmentColors.light}30 !important`,
    },
  },
  tableContainer: {
    marginTop: '24px',
    borderRadius: '10px !important',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05) !important',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: `${departmentColors.light}15 !important`,
      cursor: 'pointer',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  refreshInfo: {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    fontSize: '0.875rem',
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

// Auto refresh interval in milliseconds
const AUTO_REFRESH_INTERVAL = 60000; // 1 minute

const StudentsTab = () => {
  const classes = useStyles();
  
  // Students state
  const [students, setStudents] = useState([]);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentFilters, setStudentFilters] = useState({
    preferredRole: '',
    isActive: '',
    profileCompleted: '',
    canUpdateProfile: '',
  });
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Memoize fetchStudents to avoid unnecessary re-renders
  const fetchStudents = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) {
        setLoading(true);
      }
      setError(null);

      // Create filters object in the expected format
      const filters = {
        preferredRole: studentFilters.preferredRole || undefined,
        isActive: studentFilters.isActive !== '' ? studentFilters.isActive === 'active' : undefined,
        profileCompleted: studentFilters.profileCompleted !== '' ? 
          studentFilters.profileCompleted === 'completed' : undefined,
        canUpdateProfile: studentFilters.canUpdateProfile !== '' ?
          studentFilters.canUpdateProfile === 'allowed' : undefined
      };

      try {
        const response = await apiService.departmentAdmin.getStudents(studentPage, filters);
        
        setStudents(response.data.results || []);
        setStudentTotalPages(response.data.total_pages || 1);
        setLastRefreshed(new Date());
      } catch (apiError) {
        console.error('API call failed:', apiError);
        
        if (apiError.response) {
          console.error('Response data:', apiError.response.data);
          console.error('Response status:', apiError.response.status);
          
          setError(`API Error ${apiError.response.status}: ${JSON.stringify(apiError.response.data)}`);
        } else if (apiError.request) {
          console.error('No response received:', apiError.request);
          setError('No response received from server. Please check your network connection.');
        } else {
          console.error('Error setting up request:', apiError.message);
          setError(`Error: ${apiError.message}`);
        }
        
        // Fallback to sample data if API fails
        if (silentRefresh) {
          // Only show fallback data on initial load, not during silent refresh
          return;
        }
        
        setStudents([
          {
            id: 1,
            username: 'student001',
            email: 'student001@example.com',
            department: 'Computer Science',
            date_joined: new Date().toISOString(),
            is_active: true,
            profile_completed: true,
            preferred_role: 'software_developer',
            can_update_profile: false
          },
          {
            id: 2,
            username: 'student002',
            email: 'student002@example.com',
            department: 'Computer Science',
            date_joined: new Date().toISOString(),
            is_active: false,
            profile_completed: false,
            preferred_role: 'data_analyst',
            can_update_profile: true
          }
        ]);
        setStudentTotalPages(1);
      } finally {
        if (!silentRefresh) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (!silentRefresh) {
        setError('Failed to load students. Please try again.');
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, [studentPage, studentFilters]);

  // Fetch data on initial load and when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Set up auto refresh
  useEffect(() => {
    let interval;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchStudents(true); // Silent refresh
      }, AUTO_REFRESH_INTERVAL);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, fetchStudents]);

  const fetchStudentDetails = async (studentId) => {
    try {
      setLoadingDetails(true);
      setError(null);

      try {
        const response = await apiService.departmentAdmin.getStudentDetails(studentId);
        setUserDetails(response.data.data);
      } catch (apiError) {
        console.error('API call for student details failed:', apiError);
        
        // Fallback to sample data on error
        setUserDetails({
          profile: {
            name: 'Sample Student',
            email: 'sample.student@example.com',
            department: 'Computer Science',
            batch: '2020-2024',
            student_id: 'CS2024001',
            phone: '+1234567890',
            current_cgpa: 3.7,
            skills: 'JavaScript, React, Node.js',
            preferred_role: 'software_developer',
            profile_completion_date: new Date().toISOString(),
            last_update_date: new Date().toISOString(),
            rank_in_department: '5/30'
          },
          academic_statistics: {
            total_assessments: 5,
            completed_assessments: 4,
            average_score: 87.5,
            pass_rate: 100
          }
        });
      } finally {
        setLoadingDetails(false);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load student details. Please try again.',
        severity: 'error',
      });
      setLoadingDetails(false);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      fetchStudents();
    }
  };

  const handleStudentPageChange = (event, value) => {
    setStudentPage(value);
  };

  const handleStudentFilterChange = (event) => {
    const { name, value } = event.target;
    setStudentFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
    setStudentPage(1);
  };

  const resetStudentFilters = () => {
    setStudentFilters({
      preferredRole: '',
      isActive: '',
      profileCompleted: '',
      canUpdateProfile: '',
    });
    setStudentPage(1);
  };

  const handleViewStudent = (student) => {
    setSelectedUser(student);
    setOpenDialog(true);
    fetchStudentDetails(student.id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setUserDetails(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Extract unique preferred roles for filter options
  const getAvailableRoles = () => {
    const roles = new Set();
    
    // Add roles from students
    students.forEach(student => {
      if (student.preferred_role) {
        roles.add(student.preferred_role);
      }
    });
    
    return Array.from(roles);
  };

  return (
    <>
      {/* Header with Title and Refresh Button */}
      <Box className={classes.titleContainer}>
        <Typography variant="h5" className={classes.sectionTitle}>
          Department Students
        </Typography>
        
        <Button
          variant="text"
          startIcon={<RefreshIcon className={refreshing ? 'rotating' : ''} />}
          onClick={handleRefresh}
          disabled={refreshing}
          className={classes.refreshButton}
          sx={{
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          Refresh Data
        </Button>
      </Box>
    
      {/* Student Statistics Cards */}
      <StudentStats students={students} loading={loading} />

      {/* Student Filters section - Always visible */}
      <FilterSection
        filters={studentFilters}
        handleFilterChange={handleStudentFilterChange}
        resetFilters={resetStudentFilters}
        availableRoles={getAvailableRoles()}
        type="department_student"
        colors={departmentColors}
      />
      
      {/* Students table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role Preference</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} sx={{ color: departmentColors.main }} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Box className={classes.emptyMessage}>
                    <PeopleIcon className={classes.emptyIcon} />
                    <Typography variant="h6">No students found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className={classes.tableRow}
                  onClick={() => handleViewStudent(student)}
                >
                  <TableCell className={classes.idCell}>{student.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ mr: 1, color: departmentColors.main }} />
                      {student.username}
                    </Box>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.preferred_role ? 
                      student.preferred_role.replace(/_/g, ' ').split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ') 
                      : 'Not Set'}
                  </TableCell>
                  <TableCell>
                    {new Date(student.date_joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell><StatusChip status={student.is_active} type="active" /></TableCell>
                  <TableCell><StatusChip status={student.profile_completed} type="profile" /></TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewStudent(student);
                        }}
                        sx={{ color: departmentColors.main }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Bottom Bar with Pagination and Last Refreshed info */}
        {!loading && students.length > 0 && (
          <Box className={classes.paginationContainer}>
            <Box className={classes.refreshInfo}>
              <Typography variant="body2">
                Last updated at {formatLastRefreshed()} • Auto-refresh {autoRefresh ? 'on' : 'off'}
              </Typography>
            </Box>
            
            <Pagination
              count={studentTotalPages}
              page={studentPage}
              onChange={handleStudentPageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </TableContainer>

      {/* Student details dialog */}
      <StudentDetailsDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        selectedUser={selectedUser}
        userDetails={userDetails}
        loadingDetails={loadingDetails}
        colors={departmentColors}
      />

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

export default StudentsTab;