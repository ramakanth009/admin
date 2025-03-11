// src/components/common/ui/StatusChip.jsx
import React from 'react';
import { Chip } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  statusChip: {
    fontWeight: '500 !important',
  },
  activeChip: {
    backgroundColor: '#e8f5e9 !important',
    color: '#2e7d32 !important',
  },
  inactiveChip: {
    backgroundColor: '#ffebee !important',
    color: '#c62828 !important',
  },
  completedChip: {
    backgroundColor: props => `${props.colors.light}20 !important`,
    color: props => `${props.colors.dark} !important`,
  },
  incompleteChip: {
    backgroundColor: '#fff8e1 !important',
    color: '#f57f17 !important',
  },
  allowedChip: {
    backgroundColor: '#e3f2fd !important',
    color: '#1565c0 !important',
  },
  deniedChip: {
    backgroundColor: '#f5f5f5 !important',
    color: '#616161 !important',
  },
  roleChip: {
    backgroundColor: props => props.value === 'college_admin' ? '#e3f2fd' : '#e8f5e9',
    color: props => props.value === 'college_admin' ? '#1565c0' : '#2e7d32',
  },
});

/**
 * Unified StatusChip component that displays status indicators
 * 
 * @param {Object} props - Component props
 * @param {boolean|string} props.status - Status value to display
 * @param {string} props.type - Type of status ('active', 'profile', 'update', 'role')
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const StatusChip = ({ status, type, role = 'college_admin' }) => {
  const colors = getPrimaryColors(role);
  const classes = useStyles({ colors, value: status });

  if (type === 'active') {
    return (
      <Chip
        icon={status ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
        label={status ? 'Active' : 'Inactive'}
        className={`${classes.statusChip} ${status ? classes.activeChip : classes.inactiveChip}`}
        size="small"
      />
    );
  } else if (type === 'profile') {
    return (
      <Chip
        icon={status ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
        label={status ? 'Completed' : 'Incomplete'}
        className={`${classes.statusChip} ${status ? classes.completedChip : classes.incompleteChip}`}
        size="small"
      />
    );
  } else if (type === 'update') {
    return (
      <Chip
        icon={status ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
        label={status ? 'Allowed' : 'Not Allowed'}
        className={`${classes.statusChip} ${status ? classes.allowedChip : classes.deniedChip}`}
        size="small"
      />
    );
  } else if (type === 'role') {
    return (
      <Chip
        label={status === 'college_admin' ? 'College Admin' : 'Department Admin'}
        size="small"
        className={`${classes.statusChip} ${classes.roleChip}`}
      />
    );
  }
  
  return null;
};

export default StatusChip;