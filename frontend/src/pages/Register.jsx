import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nni: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    province: '',
    region: '',
    ville: '',
    quartier: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Vérifier la force du mot de passe
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  const validateStep1 = () => {
    return formData.nni && formData.phone && formData.email && 
           formData.password && formData.confirmPassword &&
           formData.password === formData.confirmPassword;
  };

  const validateStep2 = () => {
    return formData.nom && formData.prenom && formData.province && formData.ville;
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

    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      setLoading(false);
      return;
    }

    const { confirmPassword, acceptTerms, ...submitData } = formData;

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Inscription réussie! Veuillez vous connecter.' }
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="register-page bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* En-tête */}
            <div className="text-center mb-5">
              <Link to="/" className="text-decoration-none">
                <h1 className="fw-bold text-primary mb-2">
                  <i className="fas fa-store me-2"></i>
                  ZouDou-Souk
                </h1>
              </Link>
              <p className="text-muted">Rejoignez la communauté ZouDou-Souk</p>
            </div>

            <Card className="shadow border-0">
              <Card.Body className="p-4 p-md-5">
                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className={currentStep >= 1 ? "text-primary fw-bold" : "text-muted"}>
                      Informations de compte
                    </small>
                    <small className={currentStep >= 2 ? "text-primary fw-bold" : "text-muted"}>
                      Informations personnelles
                    </small>
                  </div>
                  <ProgressBar 
                    now={currentStep === 1 ? 50 : 100} 
                    variant="primary"
                    style={{ height: '6px' }}
                  />
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Étape 1: Informations de compte */}
                  {currentStep === 1 && (
                    <div className="step-1">
                      <h4 className="fw-bold mb-4">Informations de Compte</h4>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Numéro NNI *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-id-card text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="nni"
                                value={formData.nni}
                                onChange={handleChange}
                                placeholder="Votre numéro NNI"
                                maxLength={8}
                                required
                              />
                            </InputGroup>
                            <Form.Text className="text-muted">
                              8 chiffres de votre carte d'identité nationale
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Numéro de Téléphone *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-phone text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+235 XX XX XX XX"
                                required
                              />
                            </InputGroup>
                            <Form.Text className="text-muted">
                              Ce numéro servira aussi pour votre wallet
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Adresse Email *</Form.Label>
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

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mot de passe *</Form.Label>
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
                            
                            {formData.password && (
                              <div className="mt-2">
                                <small>Force du mot de passe:</small>
                                <ProgressBar 
                                  variant={getPasswordStrengthColor()}
                                  now={passwordStrength} 
                                  className="mb-1"
                                  style={{ height: '4px' }}
                                />
                                <small className={`text-${getPasswordStrengthColor()}`}>
                                  {passwordStrength < 50 && 'Faible'}
                                  {passwordStrength >= 50 && passwordStrength < 75 && 'Moyen'}
                                  {passwordStrength >= 75 && 'Fort'}
                                </small>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirmer le mot de passe *</Form.Label>
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
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                              <Form.Text className="text-danger">
                                Les mots de passe ne correspondent pas
                              </Form.Text>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" as={Link} to="/">
                          <i className="fas fa-arrow-left me-2"></i>
                          Retour
                        </Button>
                        <Button 
                          variant="primary" 
                          onClick={nextStep}
                          disabled={!validateStep1()}
                        >
                          Continuer
                          <i className="fas fa-arrow-right ms-2"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Informations personnelles */}
                  {currentStep === 2 && (
                    <div className="step-2">
                      <h4 className="fw-bold mb-4">Informations Personnelles</h4>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-user text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Votre nom"
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Prénom *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-user text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder="Votre prénom"
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date de naissance</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-calendar text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="date"
                                name="date_naissance"
                                value={formData.date_naissance}
                                onChange={handleChange}
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Lieu de naissance</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-map-marker-alt text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="lieu_naissance"
                                value={formData.lieu_naissance}
                                onChange={handleChange}
                                placeholder="Ville de naissance"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Province *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-globe-africa text-muted"></i>
                              </InputGroup.Text>
                              <Form.Select
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Sélectionnez votre province</option>
                                {provincesTchad.map(province => (
                                  <option key={province} value={province}>{province}</option>
                                ))}
                              </Form.Select>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Région</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-map text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="Votre région"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Ville *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-city text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                placeholder="Votre ville"
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quartier</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className="fas fa-home text-muted"></i>
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="quartier"
                                value={formData.quartier}
                                onChange={handleChange}
                                placeholder="Votre quartier"
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleChange}
                          label={
                            <span>
                              J'accepte les{' '}
                              <Link to="/terms" className="text-primary text-decoration-none">
                                conditions d'utilisation
                              </Link>{' '}
                              et la{' '}
                              <Link to="/privacy" className="text-primary text-decoration-none">
                                politique de confidentialité
                              </Link>
                            </span>
                          }
                          required
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" onClick={prevStep}>
                          <i className="fas fa-arrow-left me-2"></i>
                          Retour
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={loading || !validateStep2() || !formData.acceptTerms}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Inscription...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-plus me-2"></i>
                              Créer mon compte
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-bold">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Avantages */}
            <Row className="mt-4">
              <Col md={4} className="text-center mb-3">
                <div className="bg-white p-3 rounded border">
                  <i className="fas fa-shield-alt fa-2x text-primary mb-2"></i>
                  <h6 className="fw-bold">Sécurisé</h6>
                  <small className="text-muted">Vos données sont protégées</small>
                </div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="bg-white p-3 rounded border">
                  <i className="fas fa-bolt fa-2x text-success mb-2"></i>
                  <h6 className="fw-bold">Rapide</h6>
                  <small className="text-muted">Inscription en 2 minutes</small>
                </div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="bg-white p-3 rounded border">
                  <i className="fas fa-mobile-alt fa-2x text-info mb-2"></i>
                  <h6 className="fw-bold">Mobile Money</h6>
                  <small className="text-muted">Paiements sécurisés</small>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;