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
  CardContent,
  DialogTitle
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
  SupervisorAccount as AdminIcon,
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
  categoryTabs: {
    marginBottom: '20px !important',
    '& .MuiTabs-indicator': {
      backgroundColor: `${primaryColors.main} !important`,
    },
  },
  categoryTab: {
    fontWeight: '600 !important',
    fontSize: '16px !important',
    '&.Mui-selected': {
      color: `${primaryColors.main} !important`,
    },
  },
  tabPanel: {
    padding: '0 !important',
  }
});

// Custom TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StudentManagement = () => {
  const classes = useStyles();
  const [categoryTab, setCategoryTab] = useState(0); // 0 for Students, 1 for Admins
  
  // Students state
  const [students, setStudents] = useState([]);
  const [studentTabValue, setStudentTabValue] = useState(0);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentFilters, setStudentFilters] = useState({
    department: '',
    isActive: '',
    profileCompleted: '',
  });
  
  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminTabValue, setAdminTabValue] = useState(0);
  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch data on initial load
  useEffect(() => {
    if (categoryTab === 0) {
      fetchStudents();
    } else {
      fetchAdmins();
    }
  }, [categoryTab]);
  
  // Fetch students when filters or page changes
  useEffect(() => {
    if (categoryTab === 0) {
      fetchStudents();
    }
  }, [studentPage, studentFilters]);
  
  // Fetch admins when filters or page changes
  useEffect(() => {
    if (categoryTab === 1) {
      fetchAdmins();
    }
  }, [adminPage, adminFilters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = `page=${studentPage}&page_size=10`; // Set page size to 10
      if (studentFilters.department) queryParams += `&department=${studentFilters.department}`;
      if (studentFilters.isActive) queryParams += `&is_active=${studentFilters.isActive === 'active'}`;
      if (studentFilters.profileCompleted) queryParams += `&profile_completed=${studentFilters.profileCompleted === 'completed'}`;
      if (studentSearchQuery) queryParams += `&search=${studentSearchQuery}`;

      const token = localStorage.getItem('accessToken');
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
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      let queryParams = `page=${adminPage}&page_size=10`; // Set page size to 10
      if (adminFilters.department) queryParams += `&department=${adminFilters.department}`;
      if (adminFilters.isActive) queryParams += `&is_active=${adminFilters.isActive === 'active'}`;
      if (adminFilters.role) queryParams += `&role=${adminFilters.role}`;
      if (adminSearchQuery) queryParams += `&search=${adminSearchQuery}`;

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

      setUserDetails(response.data.data);
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
      if (categoryTab === 0) {
        setStudentSearchQuery('');
        setStudentPage(1);
        fetchStudents();
      } else {
        setAdminSearchQuery('');
        setAdminPage(1);
        fetchAdmins();
      }
    }
  };

  const handleCategoryTabChange = (event, newValue) => {
    setCategoryTab(newValue);
    setShowFilters(false); // Reset filters visibility on tab change
  };

  const handleStudentTabChange = (event, newValue) => {
    setStudentTabValue(newValue);
    
    // Update filters based on selected tab
    if (newValue === 0) { // All Students
      setStudentFilters({
      ...studentFilters,
      isActive: '',
      profileCompleted: '',
      });
    } else if (newValue === 1) { // Active Students
      setStudentFilters({
        ...studentFilters,
        isActive: 'active',
        profileCompleted: '',
      });
    } else if (newValue === 2) { // Inactive Students
      setStudentFilters({
        ...studentFilters,
        isActive: 'inactive',
        profileCompleted: '',
      });
    } else if (newValue === 3) { // Profile Completed
      setStudentFilters({
        ...studentFilters,
        profileCompleted: 'completed',
        isActive: '',
      });
    } else if (newValue === 4) { // Profile Incomplete
      setStudentFilters({
        ...studentFilters,
        profileCompleted: 'incomplete',
        isActive: '',
      });
    }
    
    setStudentPage(1);
  };

  const handleAdminTabChange = (event, newValue) => {
    setAdminTabValue(newValue);
    
    // Update filters based on selected tab
    if (newValue === 0) { // All Admins
      setAdminFilters({
        ...adminFilters,
        isActive: '',
        role: '',
      });
    } 
    // else if (newValue === 1) { // College Admins
    //   setAdminFilters({
    //     ...adminFilters,
    //     role: 'college_admin',
    //     isActive: '',
    //   });
    // }
     else if (newValue === 2) { // Department Admins
      setAdminFilters({
        ...adminFilters,
        role: 'department_admin',
        isActive: '',
      });
    } else if (newValue === 3) { // Active Admins
      setAdminFilters({
        ...adminFilters,
        isActive: 'active',
        role: '',
      });
    }
    
    setAdminPage(1);
  };

  const handleStudentPageChange = (event, value) => {
    setStudentPage(value);
  };

  const handleAdminPageChange = (event, value) => {
    setAdminPage(value);
  };

  const handleStudentSearch = () => {
    setStudentPage(1);
    fetchStudents();
  };

  const handleAdminSearch = () => {
    setAdminPage(1);
    fetchAdmins();
  };

  const handleStudentSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStudentSearch();
    }
  };

  const handleAdminSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminSearch();
    }
  };

  const handleClearStudentSearch = () => {
    setStudentSearchQuery('');
    setStudentPage(1);
    fetchStudents();
  };

  const handleClearAdminSearch = () => {
    setAdminSearchQuery('');
    setAdminPage(1);
    fetchAdmins();
  };

  const handleStudentFilterChange = (event) => {
    const { name, value } = event.target;
    setStudentFilters({
      ...studentFilters,
      [name]: value,
    });
    setStudentPage(1);
  };

  const handleAdminFilterChange = (event) => {
    const { name, value } = event.target;
    setAdminFilters({
      ...adminFilters,
      [name]: value,
    });
    setAdminPage(1);
  };

  const resetStudentFilters = () => {
    setStudentFilters({
      department: '',
      isActive: '',
      profileCompleted: '',
    });
    setStudentTabValue(0);
    setStudentPage(1);
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

  // Extract unique departments from students and admins for filter options
  const getAvailableDepartments = () => {
    const departments = new Set();
    
    // Add departments from students
    students.forEach(student => {
      if (student.department) {
        departments.add(student.department);
      }
    });
    
    // Add departments from admins
    admins.forEach(admin => {
      if (admin.department) {
        departments.add(admin.department);
      }
    });
    
    return Array.from(departments);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerRow}>
        <Typography variant="h4" className={classes.pageTitle}>
          User Management
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ 
            backgroundColor: primaryColors.main,
            '&:hover': { backgroundColor: primaryColors.dark }
          }}
        >
          {categoryTab === 0 ? 'Add Student' : 'Add Admin'}
        </Button> */}
      </Box>

      {/* User Category Tabs */}
      <Tabs 
        value={categoryTab}
        onChange={handleCategoryTabChange}
        className={classes.categoryTabs}
        variant="fullWidth"
        indicatorColor="primary"
      >
        <Tab 
          label="Students" 
          className={classes.categoryTab}
          icon={<PersonIcon />}
          iconPosition="start"
        />
        <Tab 
          label="Admins" 
          className={classes.categoryTab}
          icon={<AdminIcon />}
          iconPosition="start"
        />
      </Tabs>

      {/* Students Tab Panel */}
      <TabPanel value={categoryTab} index={0}>
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
                {!loading && students.length > 0 && students[0].institution_details ? 
                  students[0].institution_details.total_students : '...'}
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
                {!loading && students.length > 0 ? 
                  students.filter(s => s.is_active).length : '...'}
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
                {!loading && students.length > 0 ? 
                  students.filter(s => s.profile_completed).length : '...'}
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
                <SchoolIcon fontSize="large" />
              </Box>
              <Typography variant="h5" className={classes.statValue}>
                {!loading && students.length > 0 && students[0].institution_details ? 
                  Object.keys(students[0].institution_details.department_wise_admins || {}).length : '...'}
              </Typography>
              <Typography className={classes.statLabel}>
                Departments
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and filter for students */}
        <Box className={classes.searchBox}>
          <TextField
            className={classes.searchField}
            placeholder="Search students by name, email, or ID..."
            variant="outlined"
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
            onKeyPress={handleStudentSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: studentSearchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearStudentSearch}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleStudentSearch}
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

        {/* Student Filters section */}
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
                  value={studentFilters.department}
                  onChange={handleStudentFilterChange}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {getAvailableDepartments().map((dept, index) => (
                    <MenuItem key={index} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.filterFormControl} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="isActive"
                  value={studentFilters.isActive}
                  onChange={handleStudentFilterChange}
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
                  value={studentFilters.profileCompleted}
                  onChange={handleStudentFilterChange}
                  label="Profile Status"
                >
                  <MenuItem value="">All Profiles</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="incomplete">Incomplete</MenuItem>
                </Select>
              </FormControl>

              <Button 
                variant="outlined" 
                onClick={resetStudentFilters}
                sx={{ color: primaryColors.main, borderColor: primaryColors.main }}
              >
                Reset Filters
              </Button>
            </Box>
          </Paper>
        )}

        {/* Student Tabs */}
        <Tabs
          value={studentTabValue}
          onChange={handleStudentTabChange}
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
                      {/* <Tooltip title="Edit">
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
                      </Tooltip> */}
                      {/* <Tooltip title="Delete">
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
                      </Tooltip> */}
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
      </TabPanel>

      {/* Student details dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className={classes.studentDetailDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          {selectedUser ? `Student Details: ${selectedUser.username}` : 'Student Details'}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={60} sx={{ color: primaryColors.main }} />
            </Box>
          ) : !userDetails ? (
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
                        <Typography className={classes.value}>{userDetails.profile.name}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Email:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.email}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Department:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.department}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Department Rank:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.department_rank}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Preferred Role:</Typography>
                        <Typography className={classes.value}>
                          {userDetails.profile.preferred_role.replace('_', ' ').split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Skills:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.skills}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Profile Completed:</Typography>
                        <Typography className={classes.value}>
                          {new Date(userDetails.profile.profile_completion_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Last Updated:</Typography>
                        <Typography className={classes.value}>
                          {new Date(userDetails.profile.last_update_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card className={classes.infoCard} elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                        Academic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Student ID:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.student_id}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Batch:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.batch}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Current CGPA:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.current_cgpa}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Phone:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.phone}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Total Assessments:</Typography>
                        <Typography className={classes.value}>{userDetails.academic_statistics.total_assessments}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Completed Assessments:</Typography>
                        <Typography className={classes.value}>{userDetails.academic_statistics.completed_assessments}</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Average Score:</Typography>
                        <Typography className={classes.value}>{userDetails.academic_statistics.average_score.toFixed(1)}%</Typography>
                      </Box>
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Pass Rate:</Typography>
                        <Typography className={classes.value}>{userDetails.academic_statistics.pass_rate.toFixed(1)}%</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Assessment Details */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                Assessment History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {userDetails.assessments && userDetails.assessments.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No assessment history available for this student.
                </Alert>
              ) : (
                userDetails.assessments && userDetails.assessments.map((assessment, index) => (
                  <Paper key={index} elevation={1} sx={{ mb: 2, p: 2, borderRadius: '8px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontWeight: 'bold', color: primaryColors.dark }}>
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
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Score:</Typography>
                          <Typography className={classes.value}>{assessment.score}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Submitted:</Typography>
                          <Typography className={classes.value}>
                            {new Date(assessment.submitted_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Evaluated:</Typography>
                          <Typography className={classes.value}>
                            {assessment.evaluated_at ? new Date(assessment.evaluated_at).toLocaleDateString() : 'Pending'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Duration:</Typography>
                          <Typography className={classes.value}>{assessment.duration_minutes} mins</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {assessment.answers && assessment.answers.length > 0 && (
                      <>
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
                                <Typography variant="body2">
                                  Student answer: {answer.student_answer}
                                </Typography>
                                <Typography variant="body2" sx={{ color: answer.is_correct ? '#2e7d32' : '#e65100' }}>
                                  {answer.is_correct ? 
                                    `Correct (+${answer.marks_allocated} marks)` : 
                                    `Incorrect (0/${answer.marks_allocated} marks)`}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))
              )}

              {/* Curriculum */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: primaryColors.main }} />
                Assigned Curriculum
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {userDetails.curriculum && userDetails.curriculum.length === 0 ? (
                <Alert severity="info">
                  No curriculum assigned to this student.
                </Alert>
              ) : (
                userDetails.curriculum && userDetails.curriculum.map((curriculum, index) => (
                  <Paper key={index} elevation={1} sx={{ mb: 2, p: 2, borderRadius: '8px' }}>
                    <Typography sx={{ fontWeight: 'bold', color: primaryColors.dark }}>
                      {curriculum.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {curriculum.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Role:</strong> {curriculum.role.replace('_', ' ')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {new Date(curriculum.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    {curriculum.content && curriculum.content.modules && (
                      <>
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
                      </>
                    )}
                  </Paper>
                ))
              )}
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
          {/* <Button
            variant="contained"
            sx={{ 
              backgroundColor: primaryColors.main,
              '&:hover': { backgroundColor: primaryColors.dark }
            }}
          >
            Edit Student
          </Button> */}
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
    
      {/* Admins Tab Panel */}
      <TabPanel value={categoryTab} index={1}>
        {/* Admin Statistics Cards */}
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
                <AdminIcon fontSize="large" />
              </Box>
              <Typography variant="h5" className={classes.statValue}>
                {!loading && admins.length > 0 && admins[0].institution_details ? 
                  (admins[0].institution_details.total_college_admins + 
                  admins[0].institution_details.total_department_admins) : '...'}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Admins
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
                <AdminIcon fontSize="large" />
              </Box>
              <Typography variant="h5" className={classes.statValue}>
                {!loading && admins.length > 0 && admins[0].institution_details ? 
                  admins[0].institution_details.total_college_admins : '...'}
              </Typography>
              <Typography className={classes.statLabel}>
                College Admins
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
                <AdminIcon fontSize="large" />
              </Box>
              <Typography variant="h5" className={classes.statValue}>
                {!loading && admins.length > 0 && admins[0].institution_details ? 
                  admins[0].institution_details.total_department_admins : '...'}
              </Typography>
              <Typography className={classes.statLabel}>
                Department Admins
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
                <SchoolIcon fontSize="large" />
              </Box>
              <Typography variant="h5" className={classes.statValue}>
                {!loading && admins.length > 0 && admins[0].institution_details && 
                 admins[0].institution_details.department_wise_admins ? 
                  Object.keys(admins[0].institution_details.department_wise_admins).length : '...'}
              </Typography>
              <Typography className={classes.statLabel}>
                Departments
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and filter for admins */}
        <Box className={classes.searchBox}>
          <TextField
            className={classes.searchField}
            placeholder="Search admins by name, email, or department..."
            variant="outlined"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            onKeyPress={handleAdminSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: adminSearchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearAdminSearch}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleAdminSearch}
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

        {/* Admin Filters section */}
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
                  value={adminFilters.department}
                  onChange={handleAdminFilterChange}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {getAvailableDepartments().map((dept, index) => (
                    <MenuItem key={index} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.filterFormControl} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="isActive"
                  value={adminFilters.isActive}
                  onChange={handleAdminFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.filterFormControl} size="small">
                <InputLabel>Admin Type</InputLabel>
                <Select
                  name="role"
                  value={adminFilters.role}
                  onChange={handleAdminFilterChange}
                  label="Admin Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="college_admin">College Admin</MenuItem>
                  <MenuItem value="department_admin">Department Admin</MenuItem>
                </Select>
              </FormControl>

              <Button 
                variant="outlined" 
                onClick={resetAdminFilters}
                sx={{ color: primaryColors.main, borderColor: primaryColors.main }}
              >
                Reset Filters
              </Button>
            </Box>
          </Paper>
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
          <Tab label="College Admins" className={classes.tab} />
          <Tab label="Department Admins" className={classes.tab} />
          <Tab label="Active Admins" className={classes.tab} />
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
                {/* <TableCell>Actions</TableCell> */}
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
                      <Chip
                        label={admin.role === 'college_admin' ? 'College Admin' : 'Department Admin'}
                        size="small"
                        sx={{
                          backgroundColor: admin.role === 'college_admin' ? '#e3f2fd' : '#e8f5e9',
                          color: admin.role === 'college_admin' ? '#1565c0' : '#2e7d32',
                        }}
                      />
                    </TableCell>
                    <TableCell>{admin.department || 'Not Assigned'}</TableCell>
                    <TableCell>
                      {new Date(admin.date_joined).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{renderStatusChip(admin.is_active, 'active')}</TableCell>
                    {/* <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action for admin
                          }}
                          sx={{ color: primaryColors.main }}
                        >
                          <VisibilityIcon fontSize="small" />
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
                    </TableCell> */}
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
      </TabPanel>
      </Box>
  );
};

export default StudentManagement;