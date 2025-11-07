import React, { useState, useEffect, useRef } from 'react';
import { NavDropdown, Badge, ListGroup, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import manquant ajouté
import { notificationAPI } from '../../services/notifications';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    // Polling pour les nouvelles notifications
    const interval = setInterval(loadNotifications, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Simulation de données en attendant l'API
      const mockNotifications = [
        {
          id: 1,
          title: 'Transaction réussie',
          message: 'Votre paiement de 25,000 FCFA a été effectué avec succès',
          type: 'transaction',
          read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Nouveau message',
          message: 'Vous avez reçu un nouveau message de Jean Dupont',
          type: 'info',
          read: true,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          title: 'Produit en promotion',
          message: 'Le produit "Smartphone Samsung" est maintenant en promotion',
          type: 'product',
          read: false,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Simulation de marquage comme lu
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simulation de marquage tout comme lu
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      transaction: 'fas fa-exchange-alt',
      payment: 'fas fa-money-bill-wave',
      product: 'fas fa-shopping-bag',
      system: 'fas fa-cog',
      security: 'fas fa-shield-alt',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle',
      success: 'fas fa-check-circle'
    };
    return icons[type] || 'fas fa-bell';
  };

  const getNotificationVariant = (type) => {
    const variants = {
      transaction: 'primary',
      payment: 'success',
      product: 'info',
      system: 'secondary',
      security: 'warning',
      info: 'info',
      warning: 'warning',
      success: 'success'
    };
    return variants[type] || 'secondary';
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  return (
    <NavDropdown
      title={
        <span className="position-relative">
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
        </span>
      }
      id="notification-dropdown"
      align="end"
      show={showDropdown}
      onToggle={(show) => setShowDropdown(show)}
      ref={dropdownRef}
    >
      <NavDropdown.Header>
        <div className="d-flex justify-content-between align-items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 text-decoration-none"
              onClick={markAllAsRead}
            >
              <small>Marquer tout comme lu</small>
            </Button>
          )}
        </div>
      </NavDropdown.Header>

      <div style={{ maxHeight: '400px', overflowY: 'auto', width: '350px' }}>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-4">
            <i className="fas fa-bell-slash fa-2x text-muted mb-2"></i>
            <p className="text-muted mb-0">Aucune notification</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.slice(0, 10).map(notification => (
              <ListGroup.Item
                key={notification.id}
                className={`border-0 ${!notification.read ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex align-items-start">
                  <div className={`text-${getNotificationVariant(notification.type)} me-3`}>
                    <i className={`${getNotificationIcon(notification.type)} fa-lg`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                        {notification.title}
                      </h6>
                      {!notification.read && (
                        <Badge bg="primary" pill style={{ fontSize: '0.5rem' }}>
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    <p className="mb-1" style={{ fontSize: '0.8rem' }}>
                      {notification.message}
                    </p>
                    <small className="text-muted">
                      {formatNotificationTime(notification.created_at)}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to="/notifications" className="text-center">
        <small>Voir toutes les notifications</small>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default NotificationSystem;