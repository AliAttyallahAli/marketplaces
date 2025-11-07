import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Badge, Button, ListGroup, Spinner } from 'react-bootstrap';
import { notificationsAPI } from '../../services/notifications';
import { useAuth } from '../../context/AuthContext';
import './Notifications.css';

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Polling pour nouvelles notifications
      const interval = setInterval(loadNotifications, 30000); // Toutes les 30 secondes
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications({ 
        limit: 5, 
        unread_only: false 
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: 1 } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: 1 }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'fas fa-info-circle text-info',
      success: 'fas fa-check-circle text-success',
      warning: 'fas fa-exclamation-triangle text-warning',
      error: 'fas fa-times-circle text-danger',
      transaction: 'fas fa-exchange-alt text-primary',
      system: 'fas fa-cog text-secondary',
      promo: 'fas fa-gift text-warning'
    };
    return icons[type] || 'fas fa-bell text-primary';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!isAuthenticated) return null;

  return (
    <Dropdown 
      show={showDropdown} 
      onToggle={setShowDropdown}
      ref={dropdownRef}
      align="end"
    >
      <Dropdown.Toggle 
        as={Button} 
        variant="outline-light" 
        className="position-relative border-0"
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-dropdown">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0 fw-bold">Notifications</h6>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 text-primary"
              onClick={handleMarkAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center p-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <i className="fas fa-bell-slash fa-2x mb-2"></i>
              <p className="mb-0">Aucune notification</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map(notification => (
                <ListGroup.Item 
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  action
                  onClick={() => {
                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                    if (!notification.is_read) {
                      handleMarkAsRead(notification.id, { stopPropagation: () => {} });
                    }
                    setShowDropdown(false);
                  }}
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-1 fw-bold">{notification.title}</h6>
                        <small className="text-muted">
                          {formatTime(notification.created_at)}
                        </small>
                      </div>
                      <p className="mb-1 small">{notification.message}</p>
                      {notification.action_label && (
                        <small className="text-primary">
                          {notification.action_label} →
                        </small>
                      )}
                    </div>
                    {!notification.is_read && (
                      <div 
                        className="flex-shrink-0 ms-2 mark-read-btn"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <i className="fas fa-circle text-primary" style={{ fontSize: '8px' }}></i>
                      </div>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <div className="border-top p-2 text-center">
          <a 
            href="/notifications" 
            className="btn btn-outline-primary btn-sm w-100"
            onClick={() => setShowDropdown(false)}
          >
            Voir toutes les notifications
          </a>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;