import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance with authentication token handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
    
    // If the error is due to an expired token and we haven't tried to refresh yet
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
          localStorage.setItem('accessToken', response.data.access);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('isAuthenticated');
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Role-based API endpoints
const api = {
  // Authentication
  auth: {
    // Both admin types use the same login endpoint
    login: (credentials) => 
      apiClient.post('/auth/admin/login/', credentials),
  },
  
  // College Admin endpoints
  collegeAdmin: {
    getDashboard: () => 
      apiClient.get('/college-admin/dashboard/'),
      
    getDepartmentAdmins: (page = 1, filters = {}) => {
      let url = `/college-admin/department-admins/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.role) url += `&role=${filters.role}`;
      
      return apiClient.get(url);
    },
    
    getStudents: (page = 1, filters = {}) => {
      let url = `/college-admin/students/?page=${page}`;
      
      // Add filters if provided
      if (filters.department) url += `&department=${filters.department}`;
      if (filters.isActive !== undefined) url += `&is_active=${filters.isActive === 'active'}`;
      if (filters.profileCompleted !== undefined) url += `&profile_completed=${filters.profileCompleted === 'completed'}`;
      
      return apiClient.get(url);
    },
    
    getStudentDetails: (studentId) => 
      apiClient.get(`/college-admin/student-details/${studentId}/`),
  },
  
  // Department Admin endpoints
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