// src/components/common/ui/Card.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getPrimaryColors } from '../../../utils/colors';

const useStyles = makeStyles({
  statsCard: {
    padding: '16px',
    height: '100%',
    borderRadius: '10px !important',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1) !important',
    },
  },
  // Card1 variant
  horizontal: {
    display: 'flex',
    alignItems: 'center',
  },
  // Card2 variant
  vertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    padding: '15px',
    borderRadius: props => props.variant === 'vertical' ? '50%' : '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: props => props.variant === 'horizontal' ? '16px' : '0',
    marginBottom: props => props.variant === 'vertical' ? '8px' : '0',
  },
  statContent: {
    flexGrow: props => props.variant === 'horizontal' ? 1 : 'initial',
  },
  statValue: {
    fontSize: props => props.variant === 'horizontal' ? '28px !important' : '24px !important',
    fontWeight: 'bold !important',
    marginBottom: '4px !important',
    textAlign: props => props.variant === 'vertical' ? 'center' : 'left',
  },
  statLabel: {
    color: '#666666',
    fontSize: '14px !important',
    textAlign: props => props.variant === 'vertical' ? 'center' : 'left',
  },
});

/**
 * Unified Card component that can display stats in either horizontal or vertical layout
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.icon - Icon to display
 * @param {string|number} props.value - Value to display
 * @param {string} props.label - Label for the card
 * @param {string} props.backgroundColor - Background color for icon section
 * @param {string} props.iconColor - Color for the icon
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {function} props.onClick - Optional click handler
 * @param {string} props.variant - 'horizontal' (Card1) or 'vertical' (Card2)
 * @param {string} props.role - User role ('college_admin' or 'department_admin')
 */
const Card = ({ 
  icon, 
  value, 
  label, 
  backgroundColor, 
  iconColor, 
  loading, 
  onClick,
  variant = 'horizontal',
  role = 'college_admin'
}) => {
  // Use role to determine colors if not explicitly provided
  const colors = getPrimaryColors(role);
  const bgColor = backgroundColor || (variant === 'horizontal' ? '#e3f2fd' : colors.light + '20');
  const iconClr = iconColor || colors.main;
  
  const classes = useStyles({ variant, colors });

  return (
    <Paper 
      className={`${classes.statsCard} ${classes[variant]}`} 
      elevation={2}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Box
        className={classes.statIcon}
        sx={{
          backgroundColor: bgColor,
          color: iconClr,
        }}
      >
        {icon}
      </Box>
      <Box className={classes.statContent}>
        <Typography variant="h5" className={classes.statValue}>
          {loading ? '...' : value}
        </Typography>
        <Typography className={classes.statLabel}>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Card;