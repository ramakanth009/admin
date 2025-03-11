// src/hooks/useApiRequest.js
import { useState, useCallback } from 'react';

/**
 * Custom hook for making API requests with loading and error states
 * 
 * @param {Function} requestFn - The API request function to call
 * @param {Object} options - Additional options for the request
 * @returns {Object} - Request state and handler functions
 */
const useApiRequest = (requestFn, options = {}) => {
  const { 
    initialData = null,
    onSuccess = () => {},
    onError = () => {},
    errorMessage = 'An error occurred while processing your request.'
  } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Execute the API request
   * 
   * @param {any} params - Parameters to pass to the request function
   * @returns {Promise} - Promise with the API response
   */
  const execute = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestFn(params);
      setData(response.data);
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      let errorMsg = errorMessage;
      
      // Try to extract error message from response
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      onError(err, errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestFn, onSuccess, onError, errorMessage]);
  
  /**
   * Reset the request state
   */
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);
  
  return { 
    data, 
    loading, 
    error, 
    execute, 
    reset, 
    setData 
  };
};

export default useApiRequest;