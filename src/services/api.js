// src/services/api.js
import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance with authentication token handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Request a new token using the refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          // Update the stored tokens
          if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          }
        }
        
        // If we can't refresh, log out the user
        logout();
        
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh token fails, log out the user
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to logout
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userDetails');
  
  // Redirect to login
  window.location.href = '/login';
};

// API endpoints with proper error handling
const api = {
  // Authentication
  auth: {
    // College Admin login
    loginCollegeAdmin: (credentials) => 
      apiClient.post('/auth/college-admin/login/', credentials),
    
    // Department Admin login
    loginDepartmentAdmin: (credentials) => 
      apiClient.post('/auth/department-admin/login/', credentials),
      
    // Refresh token
    refreshToken: (refreshToken) =>
      apiClient.post('/auth/token/refresh/', { refresh: refreshToken }),
  },
  
  // College Admin endpoints
  collegeAdmin: {
    // Dashboard
    getDashboard: () => 
      apiClient.get('/college-admin/dashboard/'),
      
    // Department admins listing
    getDepartmentAdmins: (page = 1, filters = {}) => {
      let url = `/college-admin/department-admins/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.role) url += `&role=${filters.role}`;
      
      return apiClient.get(url);
    },
    
    // Students listing
    getStudents: (page = 1, filters = {}) => {
      let url = `/college-admin/students/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted !== undefined) url += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      
      return apiClient.get(url);
    },
    
    // Student details
    getStudentDetails: (studentId) => 
      apiClient.get(`/college-admin/student-details/${studentId}/`),
  },
  
  // Department Admin endpoints
  departmentAdmin: {
    // Dashboard
    getDashboard: () => 
      apiClient.get('/department-admin/dashboard/'),
    
    // Students listing
    getStudents: (page = 1, filters = {}) => {
      let url = `/department-admin/students/?page=${page}`;
      
      // Add filters if provided
      if (filters.preferredRole) url += `&preferred_role=${filters.preferredRole}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted !== undefined) url += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      if (filters.canUpdateProfile !== undefined) url += `&can_update_profile=${filters.canUpdateProfile === 'allowed'}`;
      
      return apiClient.get(url);
    },
    
    // Student details
    getStudentDetails: (studentId) => 
      apiClient.get(`/department-admin/student-details/${studentId}/`),
    
    // Profile update permissions
    approveProfileUpdate: (studentId) => 
      apiClient.post(`/department-admin/approve-profile-update/${studentId}/`),
    
    rejectProfileUpdate: (studentId) => 
      apiClient.post(`/department-admin/reject-profile-update/${studentId}/`),
  },
  
  // Notifications - common to both admin types
  notifications: {
    getNotifications: () => 
      apiClient.get('/profiles/my_notifications/'),
    
    markNotificationRead: (notificationId) => 
      apiClient.post(`/profiles/${notificationId}/mark_notification_read/`),
    
    markAllNotificationsRead: () => 
      apiClient.post('/profiles/mark_all_notifications_read/'),
  }
};

export default api;