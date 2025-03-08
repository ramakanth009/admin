import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';

// Admin dashboard primary colors
const primaryColors = {
  light: "#64B5F6",
  main: "#1976D2",
  dark: "#0D47A1",
};

const useStyles = makeStyles({
  notificationIcon: {
    color: '#ffffff !important',
    marginRight: '16px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  popover: {
    width: 360,
    maxHeight: 480,
    overflow: 'hidden',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: primaryColors.light + '15', // Very light blue
  },
  notificationTitle: {
    fontWeight: 'bold !important',
    color: primaryColors.dark + ' !important',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  buttonIcon: {
    fontSize: '1rem !important',
    marginRight: '4px !important',
  },
  markAllBtn: {
    textTransform: 'none !important',
    fontWeight: 'bold !important',
    color: `${primaryColors.main} !important`,
    padding: '4px 8px !important',
    minWidth: 'auto !important',
  },
  refreshBtn: {
    color: `${primaryColors.main} !important`,
    padding: '4px !important',
    minWidth: 'auto !important',
  },
  notificationsList: {
    maxHeight: 400,
    overflow: 'auto',
    padding: 0,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },
  },
  notificationItem: {
    padding: '10px 16px !important',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f7fa',
    },
  },
  unreadNotification: {
    borderLeft: `3px solid ${primaryColors.main}`,
    backgroundColor: primaryColors.light + '10', // Very light blue
  },
  notificationItemTitle: {
    fontWeight: 'bold !important',
    fontSize: '14px !important',
    color: '#1a1a1a',
    marginBottom: '4px !important',
  },
  notificationMessage: {
    fontSize: '13px !important',
    color: '#666666',
    marginBottom: '4px !important',
    lineHeight: '1.4 !important',
  },
  notificationTime: {
    fontSize: '12px !important',
    color: '#999999',
    display: 'flex !important',
    alignItems: 'center',
  },
  notificationIconIndicator: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginRight: '6px',
  },
  emptyMessage: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#666666',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
    height: '120px',
  },
  badgeStyle: {
    "& .MuiBadge-badge": {
      backgroundColor: '#FF5252 !important',
      color: 'white !important',
    }
  },
  footer: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'center',
    borderTop: '1px solid #e0e0e0',
  },
  viewAllBtn: {
    color: `${primaryColors.main} !important`,
    textTransform: 'none !important',
  }
});

// Debounce function for handling rapid calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Notifications = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    // Sample notifications for display - remove in production
    {
      id: 1,
      title: "New Profile Update Request",
      message: "Student john.doe@example.com has requested permission to update their profile",
      created_at: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
      is_read: false,
      type: "profile_update_request"
    },
    {
      id: 2,
      title: "Student Profile Updated",
      message: "Student jane.smith@example.com has updated their profile",
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
      is_read: false,
      type: "profile_update"
    },
    {
      id: 3,
      title: "New Student Assignment",
      message: "New student alex.wilson@example.com has joined Computer Science department",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
      is_read: true,
      type: "student_assignment"
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(2); // Default to 2 unread notifications
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      // In a real implementation, you would uncomment this and use your actual API endpoint
      // const response = await axios.get('http://localhost:8000/api/profiles/my_notifications/', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      
      // setNotifications(response.data.notifications || []);
      // setUnreadCount(response.data.unread_count || 0);
      setRetryCount(0); // Reset retry count on success
      
      // Simulate API delay
      setTimeout(() => {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }, 600);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. ' + (retryCount < MAX_RETRIES ? 'Retrying...' : 'Please try again later.'));
      setShowError(true);
      
      // Auto retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchNotifications(isRefresh), 2000); // Retry after 2 seconds
      }
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [retryCount]);

  // On mount and when popover opens, fetch notifications
  useEffect(() => {
    if (anchorEl) {
      fetchNotifications();
    }
  }, [anchorEl, fetchNotifications]);

  // Handle error snackbar close
  const handleCloseError = () => {
    setShowError(false);
  };

  // Debounced refresh function to prevent rapid API calls
  const debouncedRefresh = useCallback(
    debounce(() => {
      fetchNotifications(true);
    }, 300),
    [fetchNotifications]
  );

  const handleOpenNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    if (!refreshing) {
      debouncedRefresh();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAllRead) return;
    
    setMarkingAllRead(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      // In a real implementation, you would uncomment this
      // await axios.post('http://localhost:8000/api/profiles/mark_all_notifications_read/', {}, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      
      // Simulate API call
      setTimeout(() => {
        // Update UI without making another API call
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            is_read: true
          }))
        );
        setUnreadCount(0);
        setMarkingAllRead(false);
      }, 500);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      setError('Failed to mark notifications as read. Please try again.');
      setShowError(true);
      setMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      // In a real implementation, you would uncomment this
      // await axios.post(`http://localhost:8000/api/profiles/${id}/mark_notification_read/`, {}, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      
      // Simulate API call
      // Update UI without making another API call
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      setError(`Failed to mark notification as read. Please try again.`);
      setShowError(true);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const getNotificationIcon = (type) => {
    // Return different colors based on notification type
    switch(type) {
      case 'profile_update_request':
        return { color: '#FF5722' }; // Orange
      case 'profile_update':
        return { color: '#4CAF50' }; // Green
      case 'student_assignment':
        return { color: '#2196F3' }; // Blue
      default:
        return { color: primaryColors.main }; // Default blue
    }
  };

  const getNotificationTypeLabel = (type) => {
    // Map notification type to human-readable label
    switch(type) {
      case 'profile_update_request':
        return 'Profile Request';
      case 'profile_update':
        return 'Profile Update';
      case 'student_assignment':
        return 'Student Assignment';
      default:
        return 'Notification';
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <IconButton 
        aria-describedby={id}
        className={classes.notificationIcon} 
        onClick={handleOpenNotifications}
        size="large"
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          className={classes.badgeStyle}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: classes.popover,
          elevation: 3,
        }}
      >
        <Box className={classes.notificationHeader}>
          <Typography variant="subtitle1" className={classes.notificationTitle}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          <Box className={classes.actionButtons}>
            <Button
              size="small"
              className={classes.markAllBtn}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || markingAllRead || loading}
            >
              {markingAllRead ? 'Marking...' : 'Mark all read'}
            </Button>
            <IconButton 
              size="small" 
              className={classes.refreshBtn}
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              <RefreshIcon 
                fontSize="small" 
                className={refreshing ? 'rotating' : ''}
                sx={{
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }}
              />
            </IconButton>
          </Box>
        </Box>
        
        <Divider />
        
        <List className={classes.notificationsList}>
          {loading ? (
            <Box className={classes.loadingContainer}>
              <LoadingSpinner />
            </Box>
          ) : refreshing ? (
            <Box className={classes.loadingContainer} sx={{ height: '120px' }}>
              <CircularProgress size={24} sx={{ color: primaryColors.main }} />
            </Box>
          ) : notifications.length === 0 ? (
            <Typography className={classes.emptyMessage}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  className={`${classes.notificationItem} ${!notification.is_read ? classes.unreadNotification : ''}`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography 
                        className={classes.notificationItemTitle}
                        sx={!notification.is_read ? { color: primaryColors.dark } : {}}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography className={classes.notificationMessage}>
                          {notification.message}
                        </Typography>
                        <Typography className={classes.notificationTime}>
                          <span 
                            className={classes.notificationIconIndicator}
                            style={getNotificationIcon(notification.type)}
                          />
                          <span>{getNotificationTypeLabel(notification.type)} • {formatDate(notification.created_at)}</span>
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <Box className={classes.footer}>
            <Button className={classes.viewAllBtn} size="small">
              View all notifications
            </Button>
          </Box>
        )}
      </Popover>

      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notifications;