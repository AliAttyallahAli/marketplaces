import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Badge, Form, Tabs, Tab, Alert } from 'react-bootstrap';
import { notificationsAPI } from '../services/notifications';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications({ limit: 50 });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];
    
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(notif => !notif.is_read);
        break;
      case 'transactions':
        filtered = filtered.filter(notif => notif.category === 'transaction');
        break;
      case 'promotions':
        filtered = filtered.filter(notif => notif.type === 'promo');
        break;
      case 'system':
        filtered = filtered.filter(notif => notif.category === 'system');
        break;
      default:
        // 'all' - pas de filtre
        break;
    }
    
    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: 1 } : notif
        )
      );
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleArchive = async (notificationId) => {
    try {
      await notificationsAPI.archive(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedNotifications.size === 0) return;

    try {
      const promises = Array.from(selectedNotifications).map(id => {
        if (bulkAction === 'read') {
          return notificationsAPI.markAsRead(id);
        } else if (bulkAction === 'archive') {
          return notificationsAPI.archive(id);
        }
      });

      await Promise.all(promises);
      
      if (bulkAction === 'read') {
        setNotifications(prev => 
          prev.map(notif => 
            selectedNotifications.has(notif.id) ? { ...notif, is_read: 1 } : notif
          )
        );
      } else if (bulkAction === 'archive') {
        setNotifications(prev => 
          prev.filter(notif => !selectedNotifications.has(notif.id))
        );
      }

      setSelectedNotifications(new Set());
      setBulkAction('');
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(notif => notif.id)));
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      error: 'fas fa-times-circle',
      transaction: 'fas fa-exchange-alt',
      system: 'fas fa-cog',
      promo: 'fas fa-gift'
    };
    return icons[type] || 'fas fa-bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'danger',
      transaction: 'primary',
      system: 'secondary',
      promo: 'warning'
    };
    return colors[type] || 'primary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Connectez-vous pour voir vos notifications</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Mes Notifications</h1>
              <p className="text-muted">
                Restez informé de toutes vos activités sur ZouDou-Souk
              </p>
            </div>
            <div className="d-flex gap-2">
              {selectedNotifications.size > 0 && (
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select 
                    size="sm" 
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="">Action groupée</option>
                    <option value="read">Marquer comme lu</option>
                    <option value="archive">Archiver</option>
                  </Form.Select>
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                  >
                    Appliquer
                  </Button>
                </div>
              )}
              <Button 
                variant="outline-primary"
                onClick={() => notificationsAPI.markAllAsRead().then(loadNotifications)}
              >
                <i className="fas fa-check-double me-2"></i>
                Tout marquer comme lu
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3} className="mb-4">
          <Card>
            <Card.Body>
              <h6 className="fw-bold mb-3">Filtres</h6>
              <ListGroup variant="flush">
                <ListGroup.Item 
                  action 
                  active={activeTab === 'all'}
                  onClick={() => setActiveTab('all')}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>Toutes</span>
                  <Badge bg="secondary">{notifications.length}</Badge>
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'unread'}
                  onClick={() => setActiveTab('unread')}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>Non lues</span>
                  <Badge bg="primary">
                    {notifications.filter(n => !n.is_read).length}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'transactions'}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'promotions'}
                  onClick={() => setActiveTab('promotions')}
                >
                  Promotions
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'system'}
                  onClick={() => setActiveTab('system')}
                >
                  Système
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Gestion</h6>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={selectAll}
                >
                  {selectedNotifications.size === filteredNotifications.length ? 
                    'Tout désélectionner' : 'Tout sélectionner'
                  }
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Archiver toutes les notifications lues?')) {
                      // Implémenter l'archivage massif
                    }
                  }}
                >
                  Archiver les lues
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucune notification</h5>
                  <p className="text-muted">
                    {activeTab === 'unread' ? 
                      'Vous avez lu toutes vos notifications' :
                      'Aucune notification dans cette catégorie'
                    }
                  </p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {filteredNotifications.map(notification => (
                    <ListGroup.Item 
                      key={notification.id}
                      className={`p-3 ${!notification.is_read ? 'bg-light' : ''}`}
                    >
                      <div className="d-flex align-items-start">
                        <Form.Check
                          type="checkbox"
                          checked={selectedNotifications.has(notification.id)}
                          onChange={() => toggleNotificationSelection(notification.id)}
                          className="flex-shrink-0 me-3 mt-1"
                        />
                        
                        <div className="flex-shrink-0 me-3">
                          <i 
                            className={`${getNotificationIcon(notification.type)} text-${getNotificationColor(notification.type)} fa-lg`}
                          ></i>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0 fw-bold">{notification.title}</h6>
                            <small className="text-muted">
                              {formatDate(notification.created_at)}
                            </small>
                          </div>
                          
                          <p className="mb-2 text-muted">{notification.message}</p>

                          {notification.action_url && (
                            <div className="mb-2">
                              <a 
                                href={notification.action_url}
                                className="btn btn-sm btn-outline-primary"
                              >
                                {notification.action_label || 'Voir les détails'} →
                              </a>
                            </div>
                          )}

                          <div className="d-flex gap-2">
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <i className="fas fa-check me-1"></i>
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => handleArchive(notification.id)}
                            >
                              <i className="fas fa-archive me-1"></i>
                              Archiver
                            </Button>
                          </div>
                        </div>

                        {!notification.is_read && (
                          <Badge bg="primary" className="flex-shrink-0 ms-2">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {filteredNotifications.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Affichage de {filteredNotifications.length} notification(s)
              </small>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={loadNotifications}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Actualiser
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;