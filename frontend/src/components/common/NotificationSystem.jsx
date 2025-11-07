import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Simuler le chargement des notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Paiement réussi',
        message: 'Votre paiement de 5,000 FCFA a été effectué avec succès',
        timestamp: new Date(Date.now() - 300000),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Nouveau message',
        message: 'Vous avez reçu un message concernant votre commande #1234',
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 3,
        type: 'warning',
        title: 'Alerte sécurité',
        message: 'Veuillez compléter votre vérification KYC',
        timestamp: new Date(Date.now() - 86400000),
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'text-success',
      error: 'text-danger',
      warning: 'text-warning',
      info: 'text-info'
    };
    return colors[type] || 'text-primary';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
    
    return timestamp.toLocaleDateString('fr-FR');
  };

  return (
    <div className="notification-system">
      <div className="dropdown">
        <button 
          className="btn btn-outline-secondary position-relative dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.6rem' }}
            >
              {unreadCount}
            </Badge>
          )}
        </button>
        
        <div className="dropdown-menu dropdown-menu-end p-3" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Notifications</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="text-center text-muted py-3">
                <i className="fas fa-bell-slash fa-2x mb-2"></i>
                <p className="mb-0">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    <i className={`${getNotificationIcon(notification.type)} ${getNotificationColor(notification.type)} me-3 mt-1`}></i>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold mb-1">{notification.title}</h6>
                        {!notification.read && (
                          <span className="badge bg-primary" style={{ fontSize: '0.5rem' }}>Nouveau</span>
                        )}
                      </div>
                      <p className="mb-1 small">{notification.message}</p>
                      <small className="text-muted">
                        {formatTime(notification.timestamp)}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-3">
            <button className="btn btn-sm btn-outline-secondary">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;