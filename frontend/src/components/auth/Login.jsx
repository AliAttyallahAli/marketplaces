import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Si "Se souvenir de moi" est coché, stocker l'email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Charger l'email mémorisé au chargement
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center min-vh-75">
        <Col md={8} lg={6} xl={5}>
          {/* Carte de connexion */}
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              
              {/* En-tête */}
              <div className="text-center mb-4">
                <div className="icon-wrapper bg-primary rounded-circle mx-auto mb-3" 
                     style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-store fa-2x text-white"></i>
                </div>
                <h2 className="fw-bold text-primary">ZouDou-Souk</h2>
                <p className="text-muted">Connectez-vous à votre compte</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Formulaire */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="fas fa-envelope me-2 text-muted"></i>
                    Adresse Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="fas fa-lock me-2 text-muted"></i>
                    Mot de passe
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Votre mot de passe"
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Se souvenir de moi"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="small"
                  />
                  <Link to="/forgot-password" className="text-primary text-decoration-none small">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Se connecter
                    </>
                  )}
                </Button>
              </Form>

              {/* Séparateur */}
              <div className="text-center my-4">
                <hr className="text-muted" />
                <span className="bg-white px-3 text-muted small">Ou continuer avec</span>
              </div>

              {/* Options de connexion sociale */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <Button variant="outline-dark" className="w-100" disabled>
                    <i className="fab fa-google me-2"></i>
                    Google
                  </Button>
                </div>
                <div className="col-6">
                  <Button variant="outline-primary" className="w-100" disabled>
                    <i className="fab fa-facebook me-2"></i>
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Lien d'inscription */}
              <div className="text-center">
                <p className="text-muted mb-0">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Informations de sécurité */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-shield-alt text-success me-3 fa-lg"></i>
                <div>
                  <small className="text-muted">
                    <strong>Connexion sécurisée</strong> - Vos informations sont protégées par chiffrement
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;