// src/hooks/useRoleBasedAccess.js
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for handling role-based access to features and components
 * 
 * @returns {Object} Role-based access helpers
 */
const useRoleBasedAccess = () => {
  const { userRole, isCollegeAdmin, isDepartmentAdmin } = useAuth();
  
  /**
   * Check if user has access to a specific resource
   * 
   * @param {string} resource - Resource to check access for
   * @returns {boolean} Whether the user has access
   */
  const hasAccess = useCallback((resource) => {
    // College admin specific resources
    const collegeAdminOnly = [
      'admin_management',
      'institution_settings',
      'department_management',
      'super_user_actions'
    ];
    
    // Department admin specific resources
    const departmentAdminOnly = [
      'profile_approval',
      'curriculum_assignment',
      'department_specific_reports'
    ];
    
    // Shared resources
    const sharedResources = [
      'students_view',
      'dashboard_view',
      'notifications',
      'personal_settings'
    ];
    
    if (sharedResources.includes(resource)) {
      return true;
    }
    
    if (collegeAdminOnly.includes(resource) && isCollegeAdmin()) {
      return true;
    }
    
    if (departmentAdminOnly.includes(resource) && isDepartmentAdmin()) {
      return true;
    }
    
    return false;
  }, [userRole, isCollegeAdmin, isDepartmentAdmin]);
  
  /**
   * Get role-specific configuration for a resource
   * 
   * @param {string} resource - Resource to get configuration for
   * @param {Object} collegeConfig - Configuration for college admin
   * @param {Object} departmentConfig - Configuration for department admin
   * @returns {Object} Role-specific configuration
   */
  const getRoleConfig = useCallback((resource, collegeConfig, departmentConfig) => {
    if (isCollegeAdmin()) {
      return collegeConfig;
    }
    
    return departmentConfig;
  }, [isCollegeAdmin]);
  
  /**
   * Get a visible subset of elements based on user role
   * 
   * @param {Array} items - Array of items
   * @param {string} roleKey - Property name that contains role information
   * @returns {Array} Filtered array of items
   */
  const filterByRole = useCallback((items, roleKey = 'roles') => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    return items.filter(item => {
      // If no roles specified, show to all
      if (!item[roleKey] || !Array.isArray(item[roleKey])) {
        return true;
      }
      
      // Show if current role is in the item's roles
      return item[roleKey].includes(userRole);
    });
  }, [userRole]);
  
  return {
    hasAccess,
    getRoleConfig,
    filterByRole,
    currentRole: userRole
  };
};

export default useRoleBasedAccess;