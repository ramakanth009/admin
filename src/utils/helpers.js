// src/utils/helpers.js

/**
 * Debounce function to limit how often a function can be called
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };
  
  /**
   * Throttle function to limit how often a function can be called
   * 
   * @param {Function} func - Function to throttle
   * @param {number} wait - Milliseconds to wait
   * @returns {Function} Throttled function
   */
  export const throttle = (func, wait) => {
    let waiting = false;
    return function(...args) {
      const context = this;
      if (!waiting) {
        func.apply(context, args);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, wait);
      }
    };
  };
  
  /**
   * Deep clone an object
   * 
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  /**
   * Get a nested property from an object safely (without throwing errors for missing properties)
   * 
   * @param {Object} obj - Object to get property from
   * @param {string|Array} path - Path to property (e.g., 'user.profile.name' or ['user', 'profile', 'name'])
   * @param {*} defaultValue - Default value if property not found
   * @returns {*} Property value or default value
   */
  export const getNestedProperty = (obj, path, defaultValue = null) => {
    if (!obj) return defaultValue;
    
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      
      result = result[key];
      
      if (result === undefined) {
        return defaultValue;
      }
    }
    
    return result === undefined ? defaultValue : result;
  };
  
  /**
   * Group an array of objects by a property
   * 
   * @param {Array} array - Array to group
   * @param {string|Function} key - Property name or function to get property
   * @returns {Object} Grouped object
   */
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  /**
   * Sort an array of objects by a property
   * 
   * @param {Array} array - Array to sort
   * @param {string|Function} key - Property name or function to get property
   * @param {string} direction - Sort direction ('asc' or 'desc')
   * @returns {Array} Sorted array
   */
  export const sortBy = (array, key, direction = 'asc') => {
    const sortedArray = [...array];
    const directionMultiplier = direction.toLowerCase() === 'desc' ? -1 : 1;
    
    return sortedArray.sort((a, b) => {
      const aValue = typeof key === 'function' ? key(a) : a[key];
      const bValue = typeof key === 'function' ? key(b) : b[key];
      
      if (aValue < bValue) return -1 * directionMultiplier;
      if (aValue > bValue) return 1 * directionMultiplier;
      return 0;
    });
  };
  
  /**
   * Filter an array of objects by a property
   * 
   * @param {Array} array - Array to filter
   * @param {Object} filters - Filters to apply (property: value)
   * @returns {Array} Filtered array
   */
  export const filterBy = (array, filters) => {
    return array.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          return true; // Skip empty filters
        }
        
        return item[key] === value;
      });
    });
  };
  
  /**
   * Check if an object is empty
   * 
   * @param {Object} obj - Object to check
   * @returns {boolean} Whether the object is empty
   */
  export const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  
  /**
   * Capitalize the first letter of a string
   * 
   * @param {string} string - String to capitalize
   * @returns {string} Capitalized string
   */
  export const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  /**
   * Check if the user has a specific role
   * 
   * @param {string} role - Role to check
   * @returns {boolean} Whether the user has the role
   */
  export const hasRole = (role) => {
    const userRole = localStorage.getItem('userRole');
    return userRole === role;
  };