import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { notificationsAPI } from '../services/notifications';
import { useAuth } from '../context/AuthContext';

const NotificationPreferences = () => {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
    }
  }, [isAuthenticated]);

  const loadPreferences = async () => {
    try {
      const response = await notificationsAPI.getPreferences();
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setError('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await notificationsAPI.updatePreferences(preferences);
      setMessage('Préférences mises à jour avec succès');
    } catch (error) {
      setError('Erreur lors de la mise à jour des préférences');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCategoryToggle = (category) => {
    setPreferences(prev => {
      const categories = new Set(prev.categories);
      if (categories.has(category)) {
        categories.delete(category);
      } else {
        categories.add(category);
      }
      return { ...prev, categories: Array.from(categories) };
    });
  };

  const notificationCategories = [
    { id: 'transaction', name: 'Transactions', description: 'Achats, ventes, transferts d\'argent' },
    { id: 'security', name: 'Sécurité', description: 'Connexions, modifications de compte' },
    { id: 'system', name: 'Système', description: 'Maintenance, nouvelles fonctionnalités' },
    { id: 'marketing', name: 'Marketing', description: 'Promotions, offres spéciales' },
    { id: 'alert', name: 'Alertes', description: 'Notifications importantes et urgentes' },
    { id: 'message', name: 'Messages', description: 'Messages des vendeurs et support' }
  ];

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Connectez-vous pour gérer vos préférences</h3>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-bell fa-3x text-primary mb-3"></i>
                <h1 className="fw-bold">Préférences de Notifications</h1>
                <p className="text-muted">
                  Contrôlez comment et quand vous recevez les notifications de ZouDou-Souk
                </p>
              </div>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSave}>
                {/* Canaux de notification */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-sliders-h me-2"></i>
                      Canaux de Notification
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        id="email-notifications"
                        label={
                          <div>
                            <strong>Notifications par Email</strong>
                            <div className="text-muted small">
                              Recevez les notifications importantes par email
                            </div>
                          </div>
                        }
                        checked={preferences.email_notifications}
                        onChange={() => handleToggle('email_notifications')}
                      />
                    </div>

                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        id="push-notifications"
                        label={
                          <div>
                            <strong>Notifications Push</strong>
                            <div className="text-muted small">
                              Notifications en temps réel sur la plateforme
                            </div>
                          </div>
                        }
                        checked={preferences.push_notifications}
                        onChange={() => handleToggle('push_notifications')}
                      />
                    </div>

                    <div>
                      <Form.Check
                        type="switch"
                        id="sms-notifications"
                        label={
                          <div>
                            <strong>Notifications SMS</strong>
                            <div className="text-muted small">
                              Alertes importantes par SMS (frais d'opérateur applicables)
                            </div>
                          </div>
                        }
                        checked={preferences.sms_notifications}
                        onChange={() => handleToggle('sms_notifications')}
                      />
                    </div>
                  </Card.Body>
                </Card>

                {/* Catégories de notifications */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-filter me-2"></i>
                      Types de Notifications
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-3">
                      Sélectionnez les types de notifications que vous souhaitez recevoir
                    </p>
                    
                    {notificationCategories.map(category => (
                      <div key={category.id} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          id={`category-${category.id}`}
                          label={
                            <div>
                              <strong>{category.name}</strong>
                              <div className="text-muted small">
                                {category.description}
                              </div>
                            </div>
                          }
                          checked={preferences.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                        />
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                {/* Heures silencieuses */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-moon me-2"></i>
                      Heures Silencieuses
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-3">
                      Pendant ces heures, vous ne recevrez pas de notifications (sauf alertes urgentes)
                    </p>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Heure de début</Form.Label>
                          <Form.Control
                            type="time"
                            value={preferences.quiet_hours_start}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              quiet_hours_start: e.target.value
                            }))}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Heure de fin</Form.Label>
                          <Form.Control
                            type="time"
                            value={preferences.quiet_hours_end}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              quiet_hours_end: e.target.value
                            }))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Actions */}
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary"
                    onClick={() => window.history.back()}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Retour
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Sauvegarder les préférences
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationPreferences;