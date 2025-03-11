// src/services/api.js
import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        // If refresh successful, update token and retry
        if (response.data.access) {
          localStorage.setItem('accessToken', response.data.access);
          
          // Update axios headers
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const api = {
  // Authentication endpoints
  auth: {
    loginCollegeAdmin: (credentials) => 
      apiClient.post('/auth/college-admin/login/', credentials),
    
    loginDepartmentAdmin: (credentials) => 
      apiClient.post('/auth/department-admin/login/', credentials),
    
    refreshToken: (refreshToken) => 
      apiClient.post('/auth/refresh/', { refresh: refreshToken }),
  },
  
  // College admin endpoints
  collegeAdmin: {
    getDashboard: () => 
      apiClient.get('/college-admin/dashboard/'),
    
    getStudents: (page = 1, filters = {}) => {
      let url = `/college-admin/students/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted !== undefined) url += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      
      return apiClient.get(url);
    },
    
    getStudentDetails: (studentId) => 
      apiClient.get(`/college-admin/${studentId}/student_details/`),
    
    getDepartmentAdmins: (page = 1, filters = {}) => {
      let url = `/college-admin/department-admins/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.role) url += `&role=${filters.role}`;
      
      return apiClient.get(url);
    },
  },
  
  // Department admin endpoints
  departmentAdmin: {
    getDashboard: () => 
      apiClient.get('/department-admin/dashboard/'),
    
    getStudents: (page = 1, filters = {}) => {
      let url = `/department-admin/students/?page=${page}`;
      
      // Add filters if provided
      if (filters.preferredRole) url += `&preferred_role=${filters.preferredRole}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted !== undefined) url += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      if (filters.canUpdateProfile !== undefined) url += `&can_update_profile=${filters.canUpdateProfile === 'allowed'}`;
      
      return apiClient.get(url);
    },
    
    getStudentDetails: (studentId) => 
      apiClient.get(`/department-admin/student-details/${studentId}/`),
    
    approveProfileUpdate: (studentId) => 
      apiClient.post(`/department-admin/approve-profile-update/${studentId}/`),
    
    rejectProfileUpdate: (studentId) => 
      apiClient.post(`/department-admin/reject-profile-update/${studentId}/`),
  },
  
  // Notifications (common for both admin types)
  notifications: {
    getNotifications: () => 
      apiClient.get('/profiles/my_notifications/'),
    
    markNotificationRead: (notificationId) => 
      apiClient.post(`/profiles/${notificationId}/mark_notification_read/`),
    
    markAllNotificationsRead: () => 
      apiClient.post('/profiles/mark_all_notifications_read/'),
  },
};

export default api;