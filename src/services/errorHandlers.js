// src/services/errorHandlers.js

/**
 * Extract the error message from an API error response
 * 
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default message to use if extraction fails
 * @returns {string} Extracted error message
 */
export const extractErrorMessage = (error, defaultMessage = 'An error occurred. Please try again.') => {
    if (!error) {
      return defaultMessage;
    }
    
    // Check various locations for error messages
    if (error.response) {
      // Extract from axios response object
      const { data, status } = error.response;
      
      if (data) {
        if (typeof data === 'string') {
          return data;
        }
        
        if (data.message) {
          return data.message;
        }
        
        if (data.detail) {
          return data.detail;
        }
        
        if (data.error) {
          return data.error;
        }
        
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          return data.errors[0].message || JSON.stringify(data.errors[0]);
        }
      }
      
      // Return a status-based message if no specific message found
      if (status === 401) {
        return 'Unauthorized. Please log in again.';
      }
      
      if (status === 403) {
        return 'You do not have permission to perform this action.';
      }
      
      if (status === 404) {
        return 'The requested resource was not found.';
      }
      
      if (status === 500) {
        return 'A server error occurred. Please try again later.';
      }
    }
    
    // Extract from error object itself
    if (error.message) {
      return error.message;
    }
    
    // If all else fails, return the default message
    return defaultMessage;
  };
  
  /**
   * Handle common API errors
   * 
   * @param {Error} error - Error object from API call
   * @param {Object} options - Error handling options
   * @returns {Object} Error handling result
   */
  export const handleApiError = (error, options = {}) => {
    const {
      setError = null,
      setSnackbar = null,
      logout = null,
      navigate = null,
      defaultMessage = 'An error occurred. Please try again.'
    } = options;
    
    // Extract the error message
    const errorMessage = extractErrorMessage(error, defaultMessage);
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      if (logout && navigate) {
        logout();
        navigate('/login', { replace: true });
        return { message: 'Your session has expired. Please log in again.', handled: true };
      }
    }
    
    // Set error state if provided
    if (setError) {
      setError(errorMessage);
    }
    
    // Show snackbar if provided
    if (setSnackbar) {
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
    
    // Log the error for debugging
    console.error('API Error:', error);
    
    return { message: errorMessage, handled: false };
  };
  
  /**
   * Create a custom error with additional properties
   * 
   * @param {string} message - Error message
   * @param {Object} properties - Additional properties to add to the error
   * @returns {Error} Custom error object
   */
  export const createError = (message, properties = {}) => {
    const error = new Error(message);
    
    // Add additional properties
    Object.keys(properties).forEach(key => {
      error[key] = properties[key];
    });
    
    return error;
  };
  
  /**
   * Log an error with additional context
   * 
   * @param {Error} error - Error object
   * @param {string} context - Error context description
   */
  export const logError = (error, context = '') => {
    const contextPrefix = context ? `[${context}] ` : '';
    console.error(`${contextPrefix}Error:`, error);
    
    // In a production app, you might send errors to a logging service here
    // For example: Sentry.captureException(error);
  };