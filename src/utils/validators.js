// src/utils/validators.js

/**
 * Validates an email address
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a password meets minimum requirements
   * 
   * @param {string} password - Password to validate
   * @param {Object} options - Validation options
   * @returns {boolean} Whether the password is valid
   */
  export const isValidPassword = (password, options = {}) => {
    const defaultOptions = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true,
      ...options
    };
    
    if (!password || password.length < defaultOptions.minLength) return false;
    
    if (defaultOptions.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (defaultOptions.requireLowercase && !/[a-z]/.test(password)) return false;
    if (defaultOptions.requireNumber && !/[0-9]/.test(password)) return false;
    if (defaultOptions.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    
    return true;
  };
  
  /**
   * Validates that a string is not empty
   * 
   * @param {string} value - String to validate
   * @returns {boolean} Whether the string is not empty
   */
  export const isNotEmpty = (value) => {
    return !!value && value.trim() !== '';
  };
  
  /**
   * Validates that a value is a number
   * 
   * @param {*} value - Value to validate
   * @returns {boolean} Whether the value is a number
   */
  export const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  /**
   * Validates that a value is within a range
   * 
   * @param {number} value - Value to validate
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {boolean} Whether the value is within the range
   */
  export const isInRange = (value, min, max) => {
    if (!isNumber(value)) return false;
    
    const numValue = Number(value);
    return numValue >= min && numValue <= max;
  };
  
  /**
   * Validates that a value is a valid date
   * 
   * @param {*} value - Value to validate
   * @returns {boolean} Whether the value is a valid date
   */
  export const isValidDate = (value) => {
    if (!value) return false;
    
    const date = value instanceof Date ? value : new Date(value);
    return !isNaN(date.getTime());
  };
  
  /**
   * Validates that a value matches a regular expression
   * 
   * @param {string} value - Value to validate
   * @param {RegExp} regex - Regular expression to match
   * @returns {boolean} Whether the value matches the regex
   */
  export const matchesPattern = (value, regex) => {
    if (!value || !regex) return false;
    
    return regex.test(value);
  };
  
  /**
   * Validates that a value is a valid URL
   * 
   * @param {string} value - Value to validate
   * @returns {boolean} Whether the value is a valid URL
   */
  export const isValidUrl = (value) => {
    if (!value) return false;
    
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Validates that a value is a valid phone number
   * 
   * @param {string} value - Value to validate
   * @returns {boolean} Whether the value is a valid phone number
   */
  export const isValidPhone = (value) => {
    if (!value) return false;
    
    // Basic phone validation regex that allows for international formats
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(value.replace(/[\s()-]/g, ''));
  };