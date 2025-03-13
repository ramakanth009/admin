// src/services/apiService.js
import api from './api';

// Simple wrapper around the api service to provide a cleaner interface
const apiService = {
  // Authentication
  auth: {
    loginCollegeAdmin: (credentials) => {
      console.log('Logging in college admin with:', credentials.email);
      return api.auth.loginCollegeAdmin(credentials);
    },
    
    loginDepartmentAdmin: (credentials) => {
      console.log('Logging in department admin with:', credentials.email);
      return api.auth.loginDepartmentAdmin(credentials);
    },
    
    refreshToken: (refreshToken) => {
      return api.auth.refreshToken(refreshToken);
    }
  },
  
  // College Admin endpoints
  collegeAdmin: {
    getDashboard: () => {
      console.log('Fetching college admin dashboard');
      return api.collegeAdmin.getDashboard()
        .catch(error => {
          console.error('Dashboard fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock dashboard data in development mode');
            return {
              data: {
                status: 'success',
                message: 'Success (Mock Data)',
                data: {
                  user_summary: {
                    total_users: 8,
                    college_admins: 2,
                    department_admins: 3,
                    total_students: 3
                  },
                  department_distribution: {
                    "Computer Science": 1,
                    "Mechanical Engineering": 2
                  },
                  institution_details: {
                    name: "KLU University",
                    code: "KLU202455",
                    city: "Vijayawada",
                    state: "Andhra Pradesh",
                    established_year: 2020,
                    address: "123 Education Street, Vijayawada",
                    website: "https://www.klu.edu",
                    contact_email: "info@klu.edu",
                    contact_phone: "+1234567890"
                  }
                }
              }
            };
          }
          throw error;
        });
    },
    
    getDepartmentAdmins: (page = 1, filters = {}) => {
      console.log(`Fetching department admins page ${page} with filters:`, filters);
      return api.collegeAdmin.getDepartmentAdmins(page, filters)
        .catch(error => {
          console.error('Department admins fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock department admins data in development mode');
            return {
              data: {
                links: { next: null, previous: null },
                count: 2,
                total_pages: 1,
                current_page: 1,
                results: [
                  {
                    id: 1,
                    email: "department1@example.com",
                    username: "departadmin1",
                    role: "department_admin",
                    department: "Computer Science",
                    is_active: true,
                    profile_completed: true,
                    can_update_profile: true,
                    date_joined: new Date().toISOString(),
                    institution: 1
                  },
                  {
                    id: 2,
                    email: "department2@example.com",
                    username: "departadmin2",
                    role: "department_admin",
                    department: "Mechanical Engineering",
                    is_active: true,
                    profile_completed: false,
                    can_update_profile: true,
                    date_joined: new Date().toISOString(),
                    institution: 1
                  }
                ]
              }
            };
          }
          throw error;
        });
    },
    
    getStudents: (page = 1, filters = {}) => {
      console.log(`Fetching students page ${page} with filters:`, filters);
      return api.collegeAdmin.getStudents(page, filters)
        .catch(error => {
          console.error('Students fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock students data in development mode');
            return {
              data: {
                links: { next: null, previous: null },
                count: 3,
                total_pages: 1,
                current_page: 1,
                results: [
                  {
                    id: 1,
                    email: "student1@example.com",
                    username: "student1",
                    role: "student",
                    department: "Computer Science",
                    is_active: true,
                    profile_completed: true,
                    can_update_profile: false,
                    date_joined: new Date().toISOString(),
                    institution: 1,
                    institution_details: {
                      id: 1,
                      total_users: 8,
                      total_college_admins: 2,
                      total_department_admins: 3,
                      total_students: 3,
                      department_wise_admins: {
                        "Computer Science": 1,
                        "Mechanical Engineering": 2
                      }
                    }
                  },
                  {
                    id: 2,
                    email: "student2@example.com",
                    username: "student2",
                    role: "student",
                    department: "Mechanical Engineering",
                    is_active: false,
                    profile_completed: true,
                    can_update_profile: false,
                    date_joined: new Date().toISOString(),
                    institution: 1,
                    institution_details: {
                      id: 1,
                      total_users: 8,
                      total_college_admins: 2,
                      total_department_admins: 3,
                      total_students: 3,
                      department_wise_admins: {
                        "Computer Science": 1,
                        "Mechanical Engineering": 2
                      }
                    }
                  },
                  {
                    id: 3,
                    email: "student3@example.com",
                    username: "student3",
                    role: "student",
                    department: "Computer Science",
                    is_active: true,
                    profile_completed: false,
                    can_update_profile: true,
                    date_joined: new Date().toISOString(),
                    institution: 1,
                    institution_details: {
                      id: 1,
                      total_users: 8,
                      total_college_admins: 2,
                      total_department_admins: 3,
                      total_students: 3,
                      department_wise_admins: {
                        "Computer Science": 1,
                        "Mechanical Engineering": 2
                      }
                    }
                  }
                ]
              }
            };
          }
          throw error;
        });
    },
    
    getStudentDetails: (studentId) => {
      console.log(`Fetching student details for ID: ${studentId}`);
      return api.collegeAdmin.getStudentDetails(studentId)
        .catch(error => {
          console.error('Student details fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock student details data in development mode');
            return {
              data: {
                status: 'success',
                data: {
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
                    department_rank: '5/30'
                  },
                  academic_statistics: {
                    total_assessments: 5,
                    completed_assessments: 4,
                    average_score: 87.5,
                    pass_rate: 100
                  }
                }
              }
            };
          }
          throw error;
        });
    },
  },
  
  // Department Admin endpoints
  departmentAdmin: {
    getDashboard: () => {
      console.log('Fetching department admin dashboard');
      return api.departmentAdmin.getDashboard()
        .catch(error => {
          console.error('Dashboard fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock dashboard data in development mode');
            return {
              data: {
                status: 'success',
                department: 'Computer Science',
                institution: 'KLU University',
                stats: {
                  department_summary: {
                    department: 'Computer Science',
                    total_students: 4,
                    active_students: 3,
                    profiles_completed: 2
                  },
                  institution_details: {
                    name: 'KLU University',
                    code: 'KLU20241'
                  }
                }
              }
            };
          }
          throw error;
        });
    },
    
    getStudents: (page = 1, filters = {}) => {
      console.log(`Fetching department students page ${page} with filters:`, filters);
      return api.departmentAdmin.getStudents(page, filters)
        .catch(error => {
          console.error('Students fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock students data in development mode');
            return {
              data: {
                links: { next: null, previous: null },
                count: 2,
                total_pages: 1,
                current_page: 1,
                results: [
                  {
                    id: 1,
                    email: "student1@example.com",
                    username: "student1",
                    role: "student",
                    department: "Computer Science",
                    is_active: true,
                    profile_completed: true,
                    can_update_profile: false,
                    preferred_role: "software_developer",
                    date_joined: new Date().toISOString(),
                    institution: 1,
                    institution_details: {
                      id: 1,
                      name: "KLU University",
                      code: "KLU20241"
                    }
                  },
                  {
                    id: 2,
                    email: "student2@example.com",
                    username: "student2",
                    role: "student",
                    department: "Computer Science",
                    is_active: false,
                    profile_completed: false,
                    can_update_profile: true,
                    preferred_role: "data_scientist",
                    date_joined: new Date().toISOString(),
                    institution: 1,
                    institution_details: {
                      id: 1,
                      name: "KLU University",
                      code: "KLU20241"
                    }
                  }
                ]
              }
            };
          }
          throw error;
        });
    },
    
    getStudentDetails: (studentId) => {
      console.log(`Fetching department student details for ID: ${studentId}`);
      return api.departmentAdmin.getStudentDetails(studentId)
        .catch(error => {
          console.error('Student details fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock student details data in development mode');
            return {
              data: {
                status: 'success',
                data: {
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
                    pass_rate: 100,
                    topic_performance: {
                      Web: {
                        total_score: 80.0,
                        max_score: 25,
                        count: 1,
                        percentage: 320.0
                      }
                    }
                  }
                }
              }
            };
          }
          throw error;
        });
    },
    
    approveProfileUpdate: (studentId) => {
      console.log(`Approving profile update for student ID: ${studentId}`);
      return api.departmentAdmin.approveProfileUpdate(studentId);
    },
    
    rejectProfileUpdate: (studentId) => {
      console.log(`Rejecting profile update for student ID: ${studentId}`);
      return api.departmentAdmin.rejectProfileUpdate(studentId);
    },
  },
  
  // Notifications
  notifications: {
    getNotifications: () => {
      console.log('Fetching notifications');
      return api.notifications.getNotifications()
        .catch(error => {
          console.error('Notifications fetch error:', error);
          // For development: return mock data if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock notifications data in development mode');
            return {
              data: {
                total_count: 3,
                unread_count: 2,
                notifications: [
                  {
                    id: 1,
                    title: "New Profile Update Request",
                    message: "Student john.doe@example.com has requested permission to update their profile",
                    type: "profile_update_request",
                    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
                    is_read: false
                  },
                  {
                    id: 2,
                    title: "Student Profile Updated",
                    message: "Student jane.smith@example.com has updated their profile",
                    type: "profile_update",
                    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
                    is_read: false
                  },
                  {
                    id: 3,
                    title: "New Student Assignment",
                    message: "New student alex.wilson@example.com has joined Computer Science department",
                    type: "student_assignment",
                    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
                    is_read: true
                  }
                ]
              }
            };
          }
          throw error;
        });
    },
    
    markNotificationRead: (notificationId) => {
      console.log(`Marking notification ID ${notificationId} as read`);
      return api.notifications.markNotificationRead(notificationId)
        .catch(error => {
          console.error('Mark notification read error:', error);
          // For development: simulate success if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock success response in development mode');
            return { data: { status: 'success' } };
          }
          throw error;
        });
    },
    
    markAllNotificationsRead: () => {
      console.log('Marking all notifications as read');
      return api.notifications.markAllNotificationsRead()
        .catch(error => {
          console.error('Mark all notifications read error:', error);
          // For development: simulate success if API is not available
          if (process.env.NODE_ENV === 'development') {
            console.log('Using mock success response in development mode');
            return { data: { status: 'success' } };
          }
          throw error;
        });
    },
  }
};

export default apiService;