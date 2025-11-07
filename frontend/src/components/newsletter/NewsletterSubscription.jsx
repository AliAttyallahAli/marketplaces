import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { newsletterAPI } from '../../services/newsletter';
import { useAuth } from '../../context/AuthContext';

const NewsletterSubscription = ({ type = 'inline', title = "Restez Informé" }) => {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    promotions: true,
    nouvelles: true,
    conseils: true,
    evenements: true
  });

  // Pré-remplir avec les données utilisateur si connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || '');
      setNom(`${user.prenom} ${user.nom}`.trim());
    }
  }, [isAuthenticated, user]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      setLoading(false);
      return;
    }

    try {
      const response = await newsletterAPI.subscribe({
        email,
        nom: nom || undefined,
        phone: user?.phone,
        user_id: user?.id,
        preferences
      });

      setMessage(response.data.message);
      setEmail('');
      setNom('');
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  if (type === 'inline') {
    return (
      <Card className="border-0 bg-light">
        <Card.Body className="p-4">
          <div className="text-center mb-3">
            <i className="fas fa-newspaper fa-2x text-primary mb-2"></i>
            <h5 className="fw-bold">{title}</h5>
            <p className="text-muted mb-3">
              Recevez les dernières actualités, promotions et conseils de ZouDou-Souk
            </p>
          </div>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubscribe}>
            <Row className="g-2">
              <Col md={5}>
                <Form.Control
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Votre nom (optionnel)"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? '...' : "S'abonner"}
                </Button>
              </Col>
            </Row>

            <div className="mt-3">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Nous protégeons vos données. Désabonnez-vous à tout moment.
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  // Version détaillée
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <i className="fas fa-envelope-open-text fa-3x text-primary mb-3"></i>
          <h4 className="fw-bold">Newsletter ZouDou-Souk</h4>
          <p className="text-muted">
            Ne manquez aucune opportunité ! Recevez nos meilleures offres et actualités.
          </p>
        </div>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubscribe}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Votre nom et prénom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4">
            <Form.Label className="fw-bold">Préférences de communication</Form.Label>
            <div className="bg-light p-3 rounded">
              <Form.Check
                type="checkbox"
                label="Promotions et offres spéciales"
                checked={preferences.promotions}
                onChange={() => handlePreferenceChange('promotions')}
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                label="Nouvelles fonctionnalités"
                checked={preferences.nouvelles}
                onChange={() => handlePreferenceChange('nouvelles')}
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                label="Conseils et astuces"
                checked={preferences.conseils}
                onChange={() => handlePreferenceChange('conseils')}
                className="mb-2"
              />
              <Form.Check
                type="checkbox"
                label="Événements et formations"
                checked={preferences.evenements}
                onChange={() => handlePreferenceChange('evenements')}
              />
            </div>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100 mt-4 py-2"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Inscription...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                M'abonner à la newsletter
              </>
            )}
          </Button>

          <div className="text-center mt-3">
            <small className="text-muted">
              En vous abonnant, vous acceptez notre{' '}
              <a href="/privacy" className="text-decoration-none">Politique de confidentialité</a>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewsletterSubscription;