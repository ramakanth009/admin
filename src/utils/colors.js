// src/utils/colors.js

/**
 * Centralized color definitions for the admin panels
 */

// Define primary colors for each admin role
export const primaryColors = {
    college_admin: {
      light: "#64B5F6",
      main: "#1976D2", 
      dark: "#0D47A1",
    },
    department_admin: {
      light: "#81C784",
      main: "#4CAF50",
      dark: "#2E7D32",
    }
  };
  
  /**
   * Get the primary colors based on role
   * @param {string} role - 'college_admin' or 'department_admin'
   * @returns {Object} Color object with light, main, and dark values
   */
  export const getPrimaryColors = (role) => {
    return primaryColors[role] || primaryColors.college_admin;
  };
  
  /**
   * Generate an array of colors for data visualization based on role
   * @param {number} count - Number of colors needed
   * @param {string} role - 'college_admin' or 'department_admin'
   * @returns {Array} Array of color hex codes
   */
  export const generateColors = (count, role = 'college_admin') => {
    // Base colors for each role
    const baseColors = role === 'college_admin' 
      ? ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]
      : ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800"];
  
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }
  
    const colors = [...baseColors];
  
    // Generate additional colors if needed
    while (colors.length < count) {
      const colorIndex = colors.length % baseColors.length;
      const baseColor = baseColors[colorIndex];
  
      // Parse RGB components
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
  
      // Shift color values to create variations
      const shiftAmount = 30 * (Math.floor(colors.length / baseColors.length) + 1);
      const newR = Math.min(
        255,
        Math.max(0, r + (colors.length % 3 === 0 ? shiftAmount : -shiftAmount))
      );
      const newG = Math.min(
        255,
        Math.max(0, g + (colors.length % 3 === 1 ? shiftAmount : -shiftAmount))
      );
      const newB = Math.min(
        255,
        Math.max(0, b + (colors.length % 3 === 2 ? shiftAmount : -shiftAmount))
      );
  
      // Convert back to hex
      const newColor = `#${newR.toString(16).padStart(2, "0")}${newG
        .toString(16)
        .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
      
      colors.push(newColor);
    }
  
    return colors;
  };
  
  /**
   * Get a color for a specific status type
   * @param {string} statusType - Type of status (e.g., 'success', 'warning', 'error')
   * @returns {Object} Color object with background and text colors
   */
  export const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'success':
        return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'warning':
        return { bg: '#fff8e1', text: '#f57f17' };
      case 'error':
        return { bg: '#ffebee', text: '#c62828' };
      case 'info':
        return { bg: '#e3f2fd', text: '#1565c0' };
      default:
        return { bg: '#f5f5f5', text: '#616161' };
    }
  };