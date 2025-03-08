import React from 'react';
import { Chip } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Department admin colors
const departmentColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
};

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
    backgroundColor: '#e0f2f1 !important',
    color: '#00796b !important',
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
});

const StatusChip = ({ status, type }) => {
  const classes = useStyles();

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
  }
  
  return null;
};

export default StatusChip;