import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Simuler l'envoi d'email
    setTimeout(() => {
      setMessage('Un email de réinitialisation a été envoyé à votre adresse.');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="forgot-password-page bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <h3 className="fw-bold text-primary mb-2">
                      <i className="fas fa-store me-2"></i>
                      ZouDou-Souk
                    </h3>
                  </Link>
                  <h4 className="fw-bold">Mot de passe oublié</h4>
                  <p className="text-muted">
                    Entrez votre email pour recevoir un lien de réinitialisation
                  </p>
                </div>

                {message && (
                  <Alert variant="success" className="mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Adresse Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                    <Form.Text className="text-muted">
                      Nous enverrons un lien de réinitialisation à cette adresse
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Envoyer le lien
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    <Link to="/login" className="text-primary text-decoration-none">
                      <i className="fas fa-arrow-left me-1"></i>
                      Retour à la connexion
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Informations de sécurité */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Le lien de réinitialisation expire après 24 heures
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;