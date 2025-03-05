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
  Chip,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  InsertDriveFile as FileIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2", 
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  root: {
    padding: '20px',
  },
  pageTitle: {
    marginBottom: '24px !important',
    fontWeight: 'bold !important',
    color: primaryColors.dark,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchBox: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchField: {
    marginRight: '16px !important',
    flex: 1,
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
  statusChip: {
    fontWeight: '500 !important',
  },
  activeChip: {
    backgroundColor: '#e8f5e9 !important',
    color: '#2e7d32 !important',
  },
  inactiveChip: {
    backgroundColor: '#ffebee !important',
    color: '#c62828 !important',
  },
  completedChip: {
    backgroundColor: '#e3f2fd !important',
    color: '#1565c0 !important',
  },
  incompleteChip: {
    backgroundColor: '#fff8e1 !important',
    color: '#f57f17 !important',
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
  },
  filterSection: {
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '10px',
  },
  filterTitle: {
    fontWeight: '500 !important',
    marginBottom: '16px !important',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
  },
  filterFormControl: {
    minWidth: '200px',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
  studentDetailDialog: {
    '& .MuiDialog-paper': {
      maxWidth: '900px',
      width: '100%',
    },
  },
  dialogTitle: {
    backgroundColor: primaryColors.dark,
    color: 'white',
  },
  studentInfoCards: {
    marginBottom: '20px',
  },
  infoCard: {
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1) !important',
    },
  },
  cardIcon: {
    marginBottom: '8px',
    fontSize: '32px !important',
    color: primaryColors.main,
  },
  labelValue: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px dashed #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  label: {
    fontWeight: '500 !important',
    color: '#666',
  },
  value: {
    fontWeight: '500 !important',
  },
  assessmentSection: {
    marginTop: '16px',
  },
  assessmentItem: {
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #eee',
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  assessmentTitle: {
    fontWeight: '600 !important',
    color: primaryColors.dark,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  progressBar: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    marginRight: '12px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: primaryColors.main,
  },
  statsCard: {
    height: '100%',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  statIcon: {
    padding: '15px',
    borderRadius: '50%',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '24px !important',
    fontWeight: 'bold !important',
    marginBottom: '4px !important',
  },
  statLabel: {
    color: '#666666',
    fontSize: '14px !important',
    textAlign: 'center',
  },
});

const StudentManagement = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    isActive: '',
    profileCompleted: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch students on initial load and when filters change
  useEffect(() => {
    fetchStudents();
  }, [page, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = `page=${page}&page_size=10`; // Set page_size to 10 explicitly
      if (filters.department) queryParams += `&department=${filters.department}`;
      if (filters.isActive) queryParams += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted) queryParams += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      if (searchQuery) queryParams += `&search=${searchQuery}`;

      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8000/api/college-admin/students/?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(response.data.results);
      setTotalPages(response.data.total_pages);
      setLoading(false);
      setRefreshing(false);
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
      const response = await axios.get(
        `http://localhost:8000/api/college-admin/student-details/${studentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudentDetails(response.data.data);
      setLoadingDetails(false);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load student details. Please try again.',
        severity: 'error',
      });
      setLoadingDetails(false);
      setOpenDialog(false);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      setSearchQuery('');
      setPage(1);
      fetchStudents();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update filters based on selected tab
    if (newValue === 0) { // All Students
      setFilters({
        ...filters,
        isActive: '',
        profileCompleted: '',
      });
    } else if (newValue === 1) { // Active Students
      setFilters({
        ...filters,
        isActive: 'active',
        profileCompleted: '',
      });
    } else if (newValue === 2) { // Inactive Students
      setFilters({
        ...filters,
        isActive: 'inactive',
        profileCompleted: '',
      });
    } else if (newValue === 3) { // Profile Completed
      setFilters({
        ...filters,
        profileCompleted: 'completed',
        isActive: '',
      });
    } else if (newValue === 4) { // Profile Incomplete
      setFilters({
        ...filters,
        profileCompleted: 'incomplete',
        isActive: '',
      });
    }
    
    setPage(1);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchStudents();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    fetchStudents();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      department: '',
      isActive: '',
      profileCompleted: '',
    });
    setTabValue(0);
    setPage(1);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
    fetchStudentDetails(student.id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Function to render status chips
  const renderStatusChip = (status, type) => {
    if (type === 'active') {
      return (
        <Chip
          icon={status ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
          label={status ? 'Active' : 'Inactive'}
          className={`${classes.statusChip} ${status ? classes.activeChip : classes.inactiveChip}`}
          size="small"
        />
      );
    } else if (type === 'profile') {
      return (
        <Chip
          icon={status ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
          label={status ? 'Completed' : 'Incomplete'}
          className={`${classes.statusChip} ${status ? classes.completedChip : classes.incompleteChip}`}
          size="small"
        />
      );
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerRow}>
        <Typography variant="h4" className={classes.pageTitle}>
          Student Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ 
            backgroundColor: primaryColors.main,
            '&:hover': { backgroundColor: primaryColors.dark }
          }}
        >
          Add Student
        </Button>
      </Box>

      {/* Student Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.statsCard} elevation={2}>
            <Box
              className={classes.statIcon}
              sx={{
                backgroundColor: '#e3f2fd',
                color: primaryColors.main,
              }}
            >
              <PeopleIcon fontSize="large" />
            </Box>
            <Typography variant="h5" className={classes.statValue}>
              {!loading && students.length > 0 ? students[0].institution_details.total_students : '...'}
            </Typography>
            <Typography className={classes.statLabel}>
              Total Students
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.statsCard} elevation={2}>
            <Box
              className={classes.statIcon}
              sx={{
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
              }}
            >
              <CheckCircleIcon fontSize="large" />
            </Box>
            <Typography variant="h5" className={classes.statValue}>
              {!loading && students.length > 0 
                ? students.filter(s => s.is_active).length 
                : '...'}
            </Typography>
            <Typography className={classes.statLabel}>
              Active Students
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.statsCard} elevation={2}>
            <Box
              className={classes.statIcon}
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
              }}
            >
              <PersonIcon fontSize="large" />
            </Box>
            <Typography variant="h5" className={classes.statValue}>
              {!loading && students.length > 0 
                ? students.filter(s => s.profile_completed).length 
                : '...'}
            </Typography>
            <Typography className={classes.statLabel}>
              Profile Completed
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.statsCard} elevation={2}>
            <Box
              className={classes.statIcon}
              sx={{
                backgroundColor: '#fff8e1',
                color: '#f57f17',
              }}
            >
              <AssessmentIcon fontSize="large" />
            </Box>
            <Typography variant="h5" className={classes.statValue}>
              {!loading && students.length > 0 
                ? Object.keys(students[0].institution_details.department_wise_admins || {}).length 
                : '...'}
            </Typography>
            <Typography className={classes.statLabel}>
              Departments
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and filter */}
      <Box className={classes.searchBox}>
        <TextField
          className={classes.searchField}
          placeholder="Search students by name, email, or ID..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ 
            backgroundColor: primaryColors.main,
            '&:hover': { backgroundColor: primaryColors.dark }
          }}
        >
          Search
        </Button>
        <IconButton
          className={classes.actionButton}
          onClick={() => setShowFilters(!showFilters)}
          color={showFilters ? 'primary' : 'default'}
        >
          <FilterListIcon />
        </IconButton>
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

      {/* Filters section */}
      {showFilters && (
        <Paper className={classes.filterSection} elevation={1}>
          <Typography variant="h6" className={classes.filterTitle}>
            Filters
          </Typography>
          <Box className={classes.filterRow}>
            <FormControl className={classes.filterFormControl} size="small">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                <MenuItem value="Information Technology">Information Technology</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
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

            <Button 
              variant="outlined" 
              onClick={resetFilters}
              sx={{ color: primaryColors.main, borderColor: primaryColors.main }}
            >
              Reset Filters
            </Button>
          </Box>
        </Paper>
      )}

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        className={classes.tabs}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Students" className={classes.tab} />
        <Tab label="Active Students" className={classes.tab} />
        <Tab label="Inactive Students" className={classes.tab} />
        <Tab label="Profile Completed" className={classes.tab} />
        <Tab label="Profile Incomplete" className={classes.tab} />
      </Tabs>

      {/* Students table */}
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
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
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
                  <TableCell>{renderStatusChip(student.is_active, 'active')}</TableCell>
                  <TableCell>{renderStatusChip(student.profile_completed, 'profile')}</TableCell>
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
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit action
                        }}
                        sx={{ color: '#ff9800' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete action
                        }}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <Box className={classes.paginationContainer}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </TableContainer>

      {/* Student details dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className={classes.studentDetailDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          {selectedStudent ? `Student Details: ${selectedStudent.username}` : 'Student Details'}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={60} sx={{ color: primaryColors.main }} />
            </Box>
          ) : !studentDetails ? (
            <Alert severity="info">No details available for this student.</Alert>
          ) : (
            <Box>
              {/* Profile Overview Cards */}
              <Grid container spacing={3} className={classes.studentInfoCards}>
                <Grid item xs={12} md={6}>
                  <Card className={classes.infoCard} elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                        Personal Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Name:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.name}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Email:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.email}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Department:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.department_rank}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Preferred Role:</Typography>
                        <Typography className={classes.value}>
                          {studentDetails.profile.preferred_role.replace('_', ' ').split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Skills:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.skills}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Profile Completed:</Typography>
                        <Typography className={classes.value}>
                          {new Date(studentDetails.profile.profile_completion_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Last Updated:</Typography>
                        <Typography className={classes.value}>
                          {new Date(studentDetails.profile.last_update_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Student ID:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.student_id}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Batch:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.batch}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Phone:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.phone}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card className={classes.infoCard} elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                        Academic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Current CGPA:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.current_cgpa}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Department Rank:</Typography>
                        <Typography className={classes.value}>{studentDetails.profile.department}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Academic Statistics */}
              <Card className={classes.infoCard} elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                    Academic Statistics
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className={classes.statsCard} elevation={1}>
                        <Typography variant="h5" className={classes.statValue}>
                          {studentDetails.academic_statistics.total_assessments}
                        </Typography>
                        <Typography className={classes.statLabel}>
                          Total Assessments
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className={classes.statsCard} elevation={1}>
                        <Typography variant="h5" className={classes.statValue}>
                          {studentDetails.academic_statistics.completed_assessments}
                        </Typography>
                        <Typography className={classes.statLabel}>
                          Completed Assessments
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className={classes.statsCard} elevation={1}>
                        <Typography variant="h5" className={classes.statValue}>
                          {studentDetails.academic_statistics.average_score.toFixed(1)}%
                        </Typography>
                        <Typography className={classes.statLabel}>
                          Average Score
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className={classes.statsCard} elevation={1}>
                        <Typography variant="h5" className={classes.statValue}>
                          {studentDetails.academic_statistics.pass_rate.toFixed(1)}%
                        </Typography>
                        <Typography className={classes.statLabel}>
                          Pass Rate
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Assessment Details */}
              <Typography variant="h6" gutterBottom>
                <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                Assessment History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {studentDetails.assessments.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No assessment history available for this student.
                </Alert>
              ) : (
                studentDetails.assessments.map((assessment, index) => (
                  <Paper key={index} className={classes.assessmentItem} elevation={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography className={classes.assessmentTitle}>
                        {assessment.title}
                      </Typography>
                      <Chip 
                        label={assessment.status} 
                        size="small"
                        sx={{ 
                          backgroundColor: assessment.status === 'Passed' ? '#e8f5e9' : '#ffebee',
                          color: assessment.status === 'Passed' ? '#2e7d32' : '#c62828'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {assessment.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Score:</strong> {assessment.score}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Submitted:</strong> {new Date(assessment.submitted_at).toLocaleString()}
                      </Typography>
                      {assessment.evaluated_at && (
                        <Typography variant="body2">
                          <strong>Evaluated:</strong> {new Date(assessment.evaluated_at).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Question Responses:
                    </Typography>
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', p: 1 }}>
                      {assessment.answers.map((answer, idx) => (
                        <Box key={idx} sx={{ mb: 1, p: 1, backgroundColor: answer.is_correct ? '#f1f8e9' : '#fff8e8', borderRadius: '4px' }}>
                          <Typography variant="body2" fontWeight="500">
                            Question {idx + 1}: {answer.question_text}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: answer.is_correct ? '#2e7d32' : '#e65100' }}>
                              Student answer: {answer.student_answer}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                              {answer.is_correct ? 
                                `Correct (+${answer.marks_allocated} marks)` : 
                                `Incorrect (0/${answer.marks_allocated} marks)`}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                ))
              )}

              {/* Curriculum */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                <FileIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                Assigned Curriculum
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {studentDetails.curriculum.length === 0 ? (
                <Alert severity="info">
                  No curriculum assigned to this student.
                </Alert>
              ) : (
                studentDetails.curriculum.map((curriculum, index) => (
                  <Paper key={index} className={classes.assessmentItem} elevation={1}>
                    <Typography className={classes.assessmentTitle}>
                      {curriculum.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {curriculum.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Role:</strong> {curriculum.role.replace('_', ' ')}
                      </Typography>
                      {curriculum.file_url && (
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<FileIcon />}
                          sx={{ color: primaryColors.main, borderColor: primaryColors.main }}
                          onClick={() => window.open(curriculum.file_url, '_blank')}
                        >
                          Download PDF
                        </Button>
                      )}
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Curriculum Modules:
                    </Typography>
                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', p: 1 }}>
                      {curriculum.content.modules.map((module, idx) => (
                        <Box key={idx} sx={{ mb: 2 }}>
                          <Typography variant="body1" fontWeight="500" color={primaryColors.dark}>
                            {module.name}
                          </Typography>
                          <Box component="ul" sx={{ mt: 0.5, mb: 1, pl: 2 }}>
                            {module.topics.map((topic, topicIdx) => (
                              <Box component="li" key={topicIdx} sx={{ mb: 0.5 }}>
                                <Typography variant="body2">{topic}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                ))
              )}

              {/* Institution Context */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                Institution Context
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: '8px' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="500">
                      Department Statistics
                    </Typography>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Total Students in Department:</Typography>
                      <Typography className={classes.value}>{studentDetails.institution_context.total_students_in_department}</Typography>
                    </Box>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Department Average CGPA:</Typography>
                      <Typography className={classes.value}>{studentDetails.institution_context.department_average_cgpa.toFixed(2)}</Typography>
                    </Box>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Student's CGPA:</Typography>
                      <Typography className={classes.value}>{studentDetails.profile.current_cgpa}</Typography>
                    </Box>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>CGPA Comparison:</Typography>
                      <Typography className={classes.value} sx={{ 
                        color: studentDetails.profile.current_cgpa >= studentDetails.institution_context.department_average_cgpa 
                          ? '#2e7d32' : '#c62828'
                      }}>
                        {studentDetails.profile.current_cgpa >= studentDetails.institution_context.department_average_cgpa 
                          ? `Above average by ${(studentDetails.profile.current_cgpa - studentDetails.institution_context.department_average_cgpa).toFixed(2)}` 
                          : `Below average by ${(studentDetails.institution_context.department_average_cgpa - studentDetails.profile.current_cgpa).toFixed(2)}`}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="500">
                      Performance Comparison
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80%' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="500" gutterBottom>
                          CGPA vs Department Average
                        </Typography>
                        <Box className={classes.progressContainer}>
                          <Box className={classes.progressBar}>
                            <Box 
                              className={classes.progressFill} 
                              sx={{ 
                                width: `${(studentDetails.profile.current_cgpa / 4) * 100}%`,
                                backgroundColor: primaryColors.main
                              }}
                            />
                          </Box>
                          <Typography variant="body2">{studentDetails.profile.current_cgpa}/4.0</Typography>
                        </Box>
                        <Box className={classes.progressContainer}>
                          <Box className={classes.progressBar}>
                            <Box 
                              className={classes.progressFill} 
                              sx={{ 
                                width: `${(studentDetails.institution_context.department_average_cgpa / 4) * 100}%`,
                                backgroundColor: '#ff9800'
                              }}
                            />
                          </Box>
                          <Typography variant="body2">{studentDetails.institution_context.department_average_cgpa.toFixed(2)}/4.0</Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" fontWeight="500" gutterBottom>
                          Class Rank
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h4" fontWeight="bold" color={primaryColors.main}>
                            {studentDetails.profile.department_rank.split('/')[0]}
                          </Typography>
                          <Typography variant="body1" sx={{ mx: 1 }}>
                            out of
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="#666">
                            {studentDetails.profile.department_rank.split('/')[1]}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: '#666' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: primaryColors.main,
              '&:hover': { backgroundColor: primaryColors.dark }
            }}
          >
            Edit Student
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default StudentManagement;