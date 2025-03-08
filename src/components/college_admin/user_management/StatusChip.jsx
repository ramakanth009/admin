import React from 'react';
import { Chip } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

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
    backgroundColor: '#e3f2fd !important',
    color: '#1565c0 !important',
  },
  incompleteChip: {
    backgroundColor: '#fff8e1 !important',
    color: '#f57f17 !important',
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
  } else if (type === 'role') {
    return (
      <Chip
        label={status === 'college_admin' ? 'College Admin' : 'Department Admin'}
        size="small"
        className={classes.statusChip}
        sx={{
          backgroundColor: status === 'college_admin' ? '#e3f2fd' : '#e8f5e9',
          color: status === 'college_admin' ? '#1565c0' : '#2e7d32',
        }}
      />
    );
  }
  
  return null;
};

export default StatusChip;