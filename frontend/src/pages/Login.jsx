import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      client: { email: 'client@zoudousouk.td', password: 'password123' },
      vendeur: { email: 'vendeur@zoudousouk.td', password: 'password123' },
      admin: { email: 'admin@zoudousouk.td', password: 'password123' }
    };

    setFormData(prev => ({
      ...prev,
      ...demoAccounts[role]
    }));
  };

  return (
    <div className="login-page bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            {/* En-tête */}
            <div className="text-center mb-5">
              <Link to="/" className="text-decoration-none">
                <h1 className="fw-bold text-primary mb-2">
                  <i className="fas fa-store me-2"></i>
                  ZouDou-Souk
                </h1>
              </Link>
              <p className="text-muted">Connectez-vous à votre compte</p>
            </div>

            <Card className="shadow border-0">
              <Card.Body className="p-5">
                {/* Comptes de démonstration */}
                <div className="mb-4">
                  <h6 className="text-center text-muted mb-3">Comptes de démonstration</h6>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleDemoLogin('client')}
                    >
                      <i className="fas fa-user me-1"></i>
                      Client
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => handleDemoLogin('vendeur')}
                    >
                      <i className="fas fa-store me-1"></i>
                      Vendeur
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      onClick={() => handleDemoLogin('admin')}
                    >
                      <i className="fas fa-cog me-1"></i>
                      Admin
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-envelope text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mot de passe</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="fas fa-lock text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Votre mot de passe"
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </Button>
                    </InputGroup>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Form.Check
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        label="Se souvenir de moi"
                        className="small"
                      />
                      <Link to="/forgot-password" className="small text-decoration-none">
                        Mot de passe oublié ?
                      </Link>
                    </div>
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
                        Connexion...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Se connecter
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Pas encore de compte ?{' '}
                      <Link to="/register" className="text-primary text-decoration-none fw-bold">
                        Créer un compte
                      </Link>
                    </p>
                  </div>
                </Form>

                {/* Séparateur */}
                <div className="position-relative my-4">
                  <hr />
                  <div className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    Ou connectez-vous avec
                  </div>
                </div>

                {/* Options de connexion sociales */}
                <div className="d-grid gap-2">
                  <Button variant="outline-dark" disabled>
                    <i className="fab fa-google me-2"></i>
                    Continuer avec Google
                  </Button>
                  <Button variant="outline-primary" disabled>
                    <i className="fab fa-facebook me-2"></i>
                    Continuer avec Facebook
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Informations de sécurité */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Vos données sont sécurisées et protégées
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;