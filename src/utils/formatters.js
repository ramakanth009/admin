// src/utils/formatters.js

/**
 * Format a date to a readable string format
 * 
 * @param {string|Date} dateValue - Date to format
 * @param {Object} options - Format options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue, options = {}) => {
    if (!dateValue) return '';
    
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return date.toLocaleDateString('en-US', defaultOptions);
  };
  
  /**
   * Format a date to a relative time string (e.g., "5 minutes ago")
   * 
   * @param {string|Date} dateValue - Date to format
   * @returns {string} Relative time string
   */
  export const formatRelativeTime = (dateValue) => {
    if (!dateValue) return '';
    
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    const now = new Date();
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(date);
    }
  };
  
  /**
   * Format a number with comma separators for thousands
   * 
   * @param {number} value - Number to format
   * @param {number} decimals - Number of decimal places to include
   * @returns {string} Formatted number string
   */
  export const formatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null) return '';
    
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  /**
   * Format a decimal as a percentage
   * 
   * @param {number} value - Decimal value to format as percentage
   * @param {number} decimals - Number of decimal places to include
   * @returns {string} Formatted percentage string
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (value === undefined || value === null) return '';
    
    return `${(value * 100).toFixed(decimals)}%`;
  };
  
  /**
   * Format a string to title case (first letter of each word capitalized)
   * 
   * @param {string} str - String to format
   * @returns {string} Title-cased string
   */
  export const toTitleCase = (str) => {
    if (!str) return '';
    
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Format a snake_case or kebab-case string to title case
   * 
   * @param {string} str - String to format
   * @returns {string} Title-cased string
   */
  export const formatCaseToTitle = (str) => {
    if (!str) return '';
    
    return str
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Truncate a string to a maximum length with ellipsis
   * 
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated string
   */
  export const truncateString = (str, maxLength = 50) => {
    if (!str || str.length <= maxLength) return str;
    
    return `${str.substring(0, maxLength - 3)}...`;
  };