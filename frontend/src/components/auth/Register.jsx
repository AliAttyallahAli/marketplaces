import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROVINCES_TCHAD } from '../../utils/constants';

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
    quartier: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Informations personnelles' },
    { number: 2, title: 'Coordonnées' },
    { number: 3, title: 'Localisation' },
    { number: 4, title: 'Sécurité' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nni && formData.nom && formData.prenom && formData.date_naissance;
      case 2:
        return formData.phone && formData.email;
      case 3:
        return formData.province && formData.ville;
      case 4:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && acceptedTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      setError('Veuillez remplir tous les champs obligatoires de cette étape');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateStep(4)) {
      setError('Veuillez compléter toutes les étapes correctement');
      setLoading(false);
      return;
    }

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

    const { confirmPassword, ...submitData } = formData;

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/login', { 
        state: { 
          message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' 
        } 
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h5 className="fw-bold mb-4">
              <i className="fas fa-user me-2 text-primary"></i>
              Informations Personnelles
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>NNI *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nni"
                    value={formData.nni}
                    onChange={handleChange}
                    required
                    placeholder="Votre numéro NNI"
                    maxLength={8}
                  />
                  <Form.Text className="text-muted">
                    8 chiffres de votre carte d'identité nationale
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de naissance *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder="Votre prénom"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Lieu de naissance</Form.Label>
              <Form.Control
                type="text"
                name="lieu_naissance"
                value={formData.lieu_naissance}
                onChange={handleChange}
                placeholder="Ville de naissance"
              />
            </Form.Group>
          </>
        );

      case 2:
        return (
          <>
            <h5 className="fw-bold mb-4">
              <i className="fas fa-address-card me-2 text-primary"></i>
              Coordonnées
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+235 XX XX XX XX"
                  />
                  <Form.Text className="text-muted">
                    Ce numéro servira également de numéro de wallet
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      case 3:
        return (
          <>
            <h5 className="fw-bold mb-4">
              <i className="fas fa-map-marker-alt me-2 text-primary"></i>
              Localisation
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Province *</Form.Label>
                  <Form.Select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez votre province</option>
                    {PROVINCES_TCHAD.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Région</Form.Label>
                  <Form.Control
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Votre région"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ville *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    required
                    placeholder="Votre ville"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quartier</Form.Label>
                  <Form.Control
                    type="text"
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleChange}
                    placeholder="Votre quartier"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      case 4:
        return (
          <>
            <h5 className="fw-bold mb-4">
              <i className="fas fa-shield-alt me-2 text-primary"></i>
              Sécurité du Compte
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Minimum 6 caractères"
                    minLength={6}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmer le mot de passe *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Retapez votre mot de passe"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mb-3">
                <small className="text-muted">Force du mot de passe:</small>
                <ProgressBar 
                  now={Math.min((formData.password.length / 6) * 100, 100)} 
                  variant={
                    formData.password.length >= 8 ? 'success' : 
                    formData.password.length >= 6 ? 'warning' : 'danger'
                  } 
                  className="mt-1"
                />
                <Form.Text className="text-muted">
                  {formData.password.length >= 8 ? 'Fort' : 
                   formData.password.length >= 6 ? 'Moyen' : 'Faible'}
                </Form.Text>
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
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
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              
              {/* En-tête */}
              <div className="text-center mb-4">
                <div className="icon-wrapper bg-primary rounded-circle mx-auto mb-3" 
                     style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-user-plus fa-2x text-white"></i>
                </div>
                <h2 className="fw-bold text-primary">Rejoindre ZouDou-Souk</h2>
                <p className="text-muted">Créez votre compte en quelques étapes simples</p>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <ProgressBar now={progress} variant="primary" className="mb-2" />
                <div className="d-flex justify-content-between">
                  {steps.map(step => (
                    <div key={step.number} className="text-center">
                      <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${
                        currentStep >= step.number ? 'bg-primary text-white' : 'bg-light text-muted'
                      }`} 
                      style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                        {step.number}
                      </div>
                      <div className="small text-muted mt-1">{step.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Formulaire */}
              <Form onSubmit={handleSubmit}>
                {renderStep()}

                {/* Boutons de navigation */}
                <div className="d-flex justify-content-between mt-4">
                  {currentStep > 1 ? (
                    <Button variant="outline-secondary" onClick={prevStep}>
                      <i className="fas fa-arrow-left me-2"></i>
                      Retour
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 4 ? (
                    <Button variant="primary" onClick={nextStep}>
                      Continuer
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !acceptedTerms}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Inscription...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Form>

              {/* Lien de connexion */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Se connecter
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Avantages */}
          <Row className="mt-4">
            <Col md={4} className="text-center mb-3">
              <div className="p-3 border rounded bg-light">
                <i className="fas fa-shield-alt fa-2x text-success mb-2"></i>
                <h6 className="fw-bold">Sécurisé</h6>
                <small className="text-muted">Vos données sont protégées</small>
              </div>
            </Col>
            <Col md={4} className="text-center mb-3">
              <div className="p-3 border rounded bg-light">
                <i className="fas fa-bolt fa-2x text-warning mb-2"></i>
                <h6 className="fw-bold">Rapide</h6>
                <small className="text-muted">Inscription en 2 minutes</small>
              </div>
            </Col>
            <Col md={4} className="text-center mb-3">
              <div className="p-3 border rounded bg-light">
                <i className="fas fa-mobile-alt fa-2x text-primary mb-2"></i>
                <h6 className="fw-bold">Mobile Money</h6>
                <small className="text-muted">Paiements sécurisés</small>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;