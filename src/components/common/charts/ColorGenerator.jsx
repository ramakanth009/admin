// src/components/common/charts/ColorGenerator.jsx
import React from 'react';
import { generateColors, getPrimaryColors } from '../../../utils/colors';

/**
 * Enhances data for charts by adding consistent colors
 * 
 * @param {Array} data - Original data array
 * @param {string} role - User role ('college_admin' or 'department_admin')
 * @param {string} nameKey - The property name in data objects that contains item names
 * @param {string} valueKey - The property name in data objects that contains values
 * @returns {Array} Data array with added color property
 */
export const enhanceDataWithColors = (data, role = 'college_admin', nameKey = 'name', valueKey = 'value') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Generate colors based on the number of data items
  const colors = generateColors(data.length, role);

  // Add colors to data objects
  return data.map((item, index) => ({
    ...item,
    color: item.color || colors[index]
  }));
};

/**
 * Prepares data for charts from key-value object
 * 
 * @param {Object} dataObject - Object with keys as names and values as data points
 * @param {string} role - User role ('college_admin' or 'department_admin')
 * @returns {Array} Formatted data array with colors for charts
 */
export const prepareChartData = (dataObject, role = 'college_admin') => {
  if (!dataObject || typeof dataObject !== 'object') {
    return [];
  }

  // Convert object to array format
  const dataArray = Object.entries(dataObject).map(([name, value]) => ({
    name,
    value
  }));

  // Add colors to the data
  return enhanceDataWithColors(dataArray, role);
};

/**
 * Component wrapper that adds colors to chart data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Original data array
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 * @param {Function} props.children - Render function that receives the enhanced data
 */
const ColorGenerator = ({ data, role = 'college_admin', children }) => {
  // Enhance data with colors
  const enhancedData = enhanceDataWithColors(data, role);

  // Call children as a function with the enhanced data
  return children(enhancedData);
};

export default ColorGenerator;