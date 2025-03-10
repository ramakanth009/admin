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
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Import custom components
import StudentStats from '../StudentStats';
import FilterSection from '../FilterSection';
import StatusChip from '../StatusChip';
import StudentDetailsDialog from '../StudentDetailsDialog';

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
  }
});

const StudentsTab = () => {
  const classes = useStyles();
  
  // Students state
  const [students, setStudents] = useState([]);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentFilters, setStudentFilters] = useState({
    department: '',
    isActive: '',
    profileCompleted: '',
  });
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch data on initial load and when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [studentPage, studentFilters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = `page=${studentPage}&page_size=10`;
      
      if (studentFilters.department) {
        queryParams += `&department=${encodeURIComponent(studentFilters.department)}`;
      }
      
      if (studentFilters.isActive !== '') {
        queryParams += `&is_active=${studentFilters.isActive === 'active'}`;
      }
      
      if (studentFilters.profileCompleted !== '') {
        queryParams += `&profile_completed=${studentFilters.profileCompleted === 'completed'}`;
      }

      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(
          `http://localhost:8000/api/college-admin/students/?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(response.data.results || []);
        setStudentTotalPages(response.data.total_pages || 1);
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
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      setLoadingDetails(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(
          `http://localhost:8000/api/college-admin/student-details/${studentId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserDetails(response.data.data);
      } catch (apiError) {
        console.error('API call for student details failed:', apiError);
        
        if (apiError.response) {
          setSnackbar({
            open: true,
            message: `Failed to load student details: ${JSON.stringify(apiError.response.data)}`,
            severity: 'error',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Failed to load student details. Network error.',
            severity: 'error',
          });
        }
      } finally {
        setLoadingDetails(false);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      setSnackbar({
        open: true,
        message: `Failed to load student details: ${error.message}`,
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
      department: '',
      isActive: '',
      profileCompleted: '',
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

  // Extract unique departments for filter options
  const getAvailableDepartments = () => {
    const departments = new Set();
    
    // Add departments from students
    students.forEach(student => {
      if (student.department) {
        departments.add(student.department);
      }
    });
    
    return Array.from(departments);
  };

  return (
    <>
      <Typography variant="h5" className={classes.sectionTitle}>
        Student Management
      </Typography>
    
      {/* Student Statistics Cards */}
      <StudentStats students={students} loading={loading} />

      {/* Student Filters section - Always visible */}
      <FilterSection
        filters={studentFilters}
        handleFilterChange={handleStudentFilterChange}
        resetFilters={resetStudentFilters}
        availableDepartments={getAvailableDepartments()}
        type="student"
      />
      
      {/* Refresh button */}
      <Box className={classes.searchBox}>
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

      {/* Students table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
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
                  <CircularProgress size={40} sx={{ color: primaryColors.main }} />
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
                      <SchoolIcon sx={{ mr: 1, color: primaryColors.main }} />
                      {student.username}
                    </Box>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department || 'Not Assigned'}</TableCell>
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
                        sx={{ color: primaryColors.main }}
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

        {/* Student Pagination */}
        {!loading && students.length > 0 && (
          <Box className={classes.paginationContainer}>
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