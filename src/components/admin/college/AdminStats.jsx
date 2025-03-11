// src/components/admin/college/AdminStats.jsx
import React from 'react';
import { Grid } from '@mui/material';
import { 
  SupervisorAccount as AdminIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import Card from '../../common/ui/Card';
import { getPrimaryColors } from '../../../utils/colors';

/**
 * AdminStats component for college admin
 * 
 * @param {Object} props - Component props
 * @param {Array} props.admins - Admin users data
 * @param {boolean} props.loading - Loading state
 */
const AdminStats = ({ admins = [], loading = false }) => {
  const colors = getPrimaryColors('college_admin');
  
  // Extract relevant information for stats
  const getTotalAdmins = () => {
    if (!admins || admins.length === 0 || !admins[0]?.institution_details) return 0;
    return (admins[0].institution_details.total_college_admins || 0) + 
           (admins[0].institution_details.total_department_admins || 0);
  };

  const getCollegeAdmins = () => {
    if (!admins || admins.length === 0 || !admins[0]?.institution_details) return 0;
    return admins[0].institution_details.total_college_admins || 0;
  };

  const getDepartmentAdmins = () => {
    if (!admins || admins.length === 0 || !admins[0]?.institution_details) return 0;
    return admins[0].institution_details.total_department_admins || 0;
  };

  const getDepartmentCount = () => {
    if (!admins || admins.length === 0 || !admins[0]?.institution_details) return 0;
    if (!admins[0].institution_details.department_wise_admins) return 0;
    return Object.keys(admins[0].institution_details.department_wise_admins).length;
  };

  // Define card data for dynamic rendering
  const cardData = [
    {
      icon: <AdminIcon fontSize="large" />,
      value: getTotalAdmins(),
      label: 'Total Admins',
      backgroundColor: '#e3f2fd',
      iconColor: colors.main
    },
    {
      icon: <AdminIcon fontSize="large" />,
      value: getCollegeAdmins(),
      label: 'College Admins',
      backgroundColor: '#e8f5e9',
      iconColor: '#2e7d32'
    },
    {
      icon: <AdminIcon fontSize="large" />,
      value: getDepartmentAdmins(),
      label: 'Department Admins',
      backgroundColor: '#e3f2fd',
      iconColor: '#1565c0'
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      value: getDepartmentCount(),
      label: 'Departments',
      backgroundColor: '#fff8e1',
      iconColor: '#f57f17'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            icon={card.icon}
            value={card.value}
            label={card.label}
            backgroundColor={card.backgroundColor}
            iconColor={card.iconColor}
            loading={loading}
            role="college_admin"
            variant="horizontal"
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;