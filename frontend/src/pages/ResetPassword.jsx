import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Simuler la réinitialisation
    setTimeout(() => {
      setMessage('Votre mot de passe a été réinitialisé avec succès!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="reset-password-page bg-light min-vh-100 d-flex align-items-center">
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
                  <h4 className="fw-bold">Nouveau mot de passe</h4>
                  <p className="text-muted">
                    Choisissez un nouveau mot de passe sécurisé
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
                  <Form.Group className="mb-3">
                    <Form.Label>Nouveau mot de passe</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-lock text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 caractères"
                        minLength={6}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-lock text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Retapez votre mot de passe"
                        required
                      />
                    </InputGroup>
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
                        Réinitialisation...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-redo me-2"></i>
                        Réinitialiser le mot de passe
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

            {/* Conseils de sécurité */}
            <Card className="mt-4 border-0 bg-warning bg-opacity-10">
              <Card.Body className="p-3">
                <h6 className="fw-bold mb-2">
                  <i className="fas fa-lightbulb me-2"></i>
                  Conseils de sécurité
                </h6>
                <ul className="small mb-0">
                  <li>Utilisez au moins 8 caractères</li>
                  <li>Mélangez lettres, chiffres et symboles</li>
                  <li>Évitez les mots de passe courants</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;