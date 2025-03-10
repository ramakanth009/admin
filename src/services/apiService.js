// src/services/apiService.js
import api from './api';

// Simple wrapper around the api service to provide a cleaner interface
const apiService = {
  // Authentication
  auth: {
    loginCollegeAdmin: (credentials) => api.auth.loginCollegeAdmin(credentials),
    loginDepartmentAdmin: (credentials) => api.auth.loginDepartmentAdmin(credentials),
  },
  
  // College Admin endpoints
  collegeAdmin: {
    getDashboard: () => api.collegeAdmin.getDashboard(),
    getDepartmentAdmins: (page = 1, filters = {}) => api.collegeAdmin.getDepartmentAdmins(page, filters),
    getStudents: (page = 1, filters = {}) => api.collegeAdmin.getStudents(page, filters),
    getStudentDetails: (studentId) => api.collegeAdmin.getStudentDetails(studentId),
  },
  
  // Department Admin endpoints
  departmentAdmin: {
    getDashboard: () => api.departmentAdmin.getDashboard(),
    getStudents: (page = 1, filters = {}) => api.departmentAdmin.getStudents(page, filters),
    getStudentDetails: (studentId) => api.departmentAdmin.getStudentDetails(studentId),
    approveProfileUpdate: (studentId) => api.departmentAdmin.approveProfileUpdate(studentId),
    rejectProfileUpdate: (studentId) => api.departmentAdmin.rejectProfileUpdate(studentId),
  },
  
  // Notifications
  notifications: {
    getNotifications: () => api.notifications.getNotifications(),
    markNotificationRead: (notificationId) => api.notifications.markNotificationRead(notificationId),
    markAllNotificationsRead: () => api.notifications.markAllNotificationsRead(),
  }
};

export default apiService;