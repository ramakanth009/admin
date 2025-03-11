// src/services/apiService.js
import api from './api';

/**
 * Helper to get current user role from localStorage
 * @returns {string} User role ('college_admin' or 'department_admin')
 */
const getUserRole = () => {
  return localStorage.getItem('userRole') || 'college_admin'; // Default fallback
};

/**
 * Enhanced API service with role-based request handling
 */
const apiService = {
  // Authentication endpoints (unchanged)
  auth: {
    loginCollegeAdmin: (credentials) => api.auth.loginCollegeAdmin(credentials),
    loginDepartmentAdmin: (credentials) => api.auth.loginDepartmentAdmin(credentials),
  },
  
  // Role-aware admin functions
  admin: {
    /**
     * Get dashboard data based on user role
     * @returns {Promise} API response with dashboard data
     */
    getDashboard: () => {
      const role = getUserRole();
      return role === 'college_admin' 
        ? api.collegeAdmin.getDashboard()
        : api.departmentAdmin.getDashboard();
    },
    
    /**
     * Get students list based on user role and filters
     * @param {number} page - Page number for pagination
     * @param {Object} filters - Filter criteria
     * @returns {Promise} API response with students data
     */
    getStudents: (page = 1, filters = {}) => {
      const role = getUserRole();
      return role === 'college_admin'
        ? api.collegeAdmin.getStudents(page, filters)
        : api.departmentAdmin.getStudents(page, filters);
    },
    
    /**
     * Get detailed student information based on user role
     * @param {number} studentId - Student ID to fetch details for
     * @returns {Promise} API response with student details
     */
    getStudentDetails: (studentId) => {
      const role = getUserRole();
      return role === 'college_admin'
        ? api.collegeAdmin.getStudentDetails(studentId)
        : api.departmentAdmin.getStudentDetails(studentId);
    },
  },
  
  // College admin specific endpoints
  collegeAdmin: {
    /**
     * Get department admins (college admin only)
     * @param {number} page - Page number for pagination
     * @param {Object} filters - Filter criteria
     * @returns {Promise} API response with department admins data
     */
    getDepartmentAdmins: (page = 1, filters = {}) => {
      return api.collegeAdmin.getDepartmentAdmins(page, filters);
    },
  },
  
  // Department admin specific endpoints
  departmentAdmin: {
    /**
     * Approve student profile update request (department admin only)
     * @param {number} studentId - Student ID to approve update for
     * @returns {Promise} API response with approval status
     */
    approveProfileUpdate: (studentId) => {
      return api.departmentAdmin.approveProfileUpdate(studentId);
    },
    
    /**
     * Reject student profile update request (department admin only)
     * @param {number} studentId - Student ID to reject update for
     * @returns {Promise} API response with rejection status
     */
    rejectProfileUpdate: (studentId) => {
      return api.departmentAdmin.rejectProfileUpdate(studentId);
    },
  },
  
  // Notifications (common to both admin types)
  notifications: {
    /**
     * Get notifications for the current user
     * @returns {Promise} API response with notifications data
     */
    getNotifications: () => {
      return api.notifications.getNotifications();
    },
    
    /**
     * Mark a specific notification as read
     * @param {number} notificationId - Notification ID to mark as read
     * @returns {Promise} API response with update status
     */
    markNotificationRead: (notificationId) => {
      return api.notifications.markNotificationRead(notificationId);
    },
    
    /**
     * Mark all notifications as read
     * @returns {Promise} API response with update status
     */
    markAllNotificationsRead: () => {
      return api.notifications.markAllNotificationsRead();
    },
  },
  
  /**
   * Get user role from localStorage
   * @returns {string} User role ('college_admin' or 'department_admin')
   */
  getUserRole: getUserRole,
  
  /**
   * Check if current user is a college admin
   * @returns {boolean} True if user is a college admin
   */
  isCollegeAdmin: () => getUserRole() === 'college_admin',
  
  /**
   * Check if current user is a department admin
   * @returns {boolean} True if user is a department admin
   */
  isDepartmentAdmin: () => getUserRole() === 'department_admin',
};

export default apiService;