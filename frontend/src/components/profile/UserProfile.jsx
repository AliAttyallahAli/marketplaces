import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Button, 
  Tab, 
  Tabs, 
  Alert, 
  Badge, 
  Modal,
  Image,
  ListGroup,
  ProgressBar
} from 'react-bootstrap';
import { userAPI } from '../../services/auth';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';
import Wallet from '../wallet/Wallet';
import UpgradeVendeur from './UpgradeVendeur';
import KycForm from './KycForm';
import TransactionHistory from '../wallet/TransactionHistory';
import VisaCardGenerator from '../documents/VisaCardGenerator';
import SubscriptionPlans from '../subscriptions/SubscriptionPlans';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const { user, logout, upgradeToVendeur } = useAuth();

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  useEffect(() => {
    loadProfile();
    loadWalletData();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const loadWalletData = async () => {
    try {
      const response = await walletAPI.getBalance();
      setWalletData(response.data);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile(profile);
      setSuccess('Profil mis à jour avec succès');
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setPhotoUploading(true);
    setError('');

    try {
      // Simuler l'upload de la photo
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target.result;
        setProfile(prev => ({ ...prev, photo: photoUrl }));
        setSuccess('Photo de profil mise à jour avec succès');
        setShowPhotoModal(false);
        setPhotoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Erreur lors du téléchargement de la photo');
      setPhotoUploading(false);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'admin': { bg: 'warning', text: 'Administrateur' },
      'vendeur': { bg: 'success', text: 'Vendeur' },
      'client': { bg: 'secondary', text: 'Client' }
    };
    const config = variants[role] || { bg: 'secondary', text: role };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getVerificationStatus = () => {
    if (user?.role === 'vendeur' && profile?.kyb_verified) {
      return { status: 'complete', text: 'Vérifié Vendeur', color: 'success' };
    }
    if (profile?.kyc_verified) {
      return { status: 'complete', text: 'KYC Vérifié', color: 'success' };
    }
    return { status: 'pending', text: 'En attente de vérification', color: 'warning' };
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.nom,
      profile.prenom,
      profile.email,
      profile.phone,
      profile.province,
      profile.ville,
      profile.photo
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <Row>
        {/* Sidebar Profil */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-4">
              {/* Photo de profil */}
              <div className="profile-avatar mb-3">
                {profile?.photo ? (
                  <Image 
                    src={profile.photo} 
                    alt="Profile" 
                    roundedCircle
                    fluid
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <i className="fas fa-user fa-3x"></i>
                  </div>
                )}
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <i className="fas fa-camera me-1"></i>
                  Changer
                </Button>
              </div>
              
              {/* Informations principales */}
              <h4 className="fw-bold mb-1">{profile?.prenom} {profile?.nom}</h4>
              <div className="mb-2">
                {getRoleBadge(profile?.role)}
              </div>
              
              <p className="text-muted mb-2">
                <i className="fas fa-envelope me-2"></i>
                {profile?.email}
              </p>
              <p className="text-muted mb-3">
                <i className="fas fa-phone me-2"></i>
                {profile?.phone}
              </p>

              {/* Statut de vérification */}
              <div className="verification-status mb-3">
                <Badge bg={getVerificationStatus().color} className="me-2">
                  <i className="fas fa-shield-alt me-1"></i>
                  {getVerificationStatus().text}
                </Badge>
              </div>

              {/* Complétion du profil */}
              <div className="profile-completion mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Complétion du profil</small>
                  <small className="fw-bold">{profileCompletion}%</small>
                </div>
                <ProgressBar 
                  now={profileCompletion} 
                  variant={profileCompletion >= 80 ? 'success' : profileCompletion >= 50 ? 'warning' : 'danger'}
                  style={{ height: '6px' }}
                />
              </div>

              {/* Statistiques rapides */}
              <ListGroup variant="flush" className="text-start">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <small>Membre depuis</small>
                  <small className="fw-bold">
                    {new Date(profile?.created_at).toLocaleDateString('fr-FR')}
                  </small>
                </ListGroup.Item>
                {walletData && (
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                    <small>Solde wallet</small>
                    <small className="fw-bold text-success">
                      {parseFloat(walletData.balance).toLocaleString('fr-TD')} FCFA
                    </small>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <small>Statut</small>
                  <Badge bg="success" className="small">Actif</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Actions rapides */}
          <Card className="shadow-sm border-0 mt-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Actions rapides</h6>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm" href="/p2p">
                  <i className="fas fa-paper-plane me-2"></i>
                  Transfert P2P
                </Button>
                <Button variant="outline-success" size="sm" href="/services">
                  <i className="fas fa-file-invoice me-2"></i>
                  Payer une facture
                </Button>
                <Button variant="outline-info" size="sm" href="/marketplace">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Marketplace
                </Button>
                {user?.role === 'client' && (
                  <Button variant="outline-warning" size="sm" href="/subscriptions">
                    <i className="fas fa-store me-2"></i>
                    Devenir vendeur
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Contenu principal */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="px-3 pt-3"
                fill
              >
                {/* Onglet Profil */}
                <Tab eventKey="profile" title={
                  <span>
                    <i className="fas fa-user me-2"></i>
                    Profil
                  </span>
                }>
                  <div className="p-3">
                    {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                    {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

                    <Form onSubmit={handleSaveProfile}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nom *</Form.Label>
                            <Form.Control
                              type="text"
                              name="nom"
                              value={profile?.nom || ''}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Prénom *</Form.Label>
                            <Form.Control
                              type="text"
                              name="prenom"
                              value={profile?.prenom || ''}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profile?.email || ''}
                              onChange={handleInputChange}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              L'email ne peut pas être modifié
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={profile?.phone || ''}
                              onChange={handleInputChange}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Le téléphone ne peut pas être modifié
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Date de naissance</Form.Label>
                            <Form.Control
                              type="date"
                              name="date_naissance"
                              value={profile?.date_naissance || ''}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Lieu de naissance</Form.Label>
                            <Form.Control
                              type="text"
                              name="lieu_naissance"
                              value={profile?.lieu_naissance || ''}
                              onChange={handleInputChange}
                              placeholder="Ville de naissance"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Province *</Form.Label>
                            <Form.Select
                              name="province"
                              value={profile?.province || ''}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Sélectionnez votre province</option>
                              {provincesTchad.map(province => (
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
                              value={profile?.region || ''}
                              onChange={handleInputChange}
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
                              value={profile?.ville || ''}
                              onChange={handleInputChange}
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
                              value={profile?.quartier || ''}
                              onChange={handleInputChange}
                              placeholder="Votre quartier"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div>
                          <small className="text-muted">
                            Dernière mise à jour: {new Date(profile?.updated_at || profile?.created_at).toLocaleString('fr-FR')}
                          </small>
                        </div>
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
                            'Enregistrer les modifications'
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab>

                {/* Onglet Portefeuille */}
                <Tab eventKey="wallet" title={
                  <span>
                    <i className="fas fa-wallet me-2"></i>
                    Portefeuille
                  </span>
                }>
                  <div className="p-3">
                    <Wallet />
                  </div>
                </Tab>

                {/* Onglet Vérification KYC */}
                <Tab eventKey="kyc" title={
                  <span>
                    <i className="fas fa-id-card me-2"></i>
                    Vérification
                  </span>
                }>
                  <div className="p-3">
                    <KycForm onVerificationComplete={loadProfile} />
                  </div>
                </Tab>

                {/* Onglet Devenir Vendeur (seulement pour les clients) */}
                {user?.role === 'client' && (
                  <Tab eventKey="upgrade" title={
                    <span>
                      <i className="fas fa-store me-2"></i>
                      Devenir Vendeur
                    </span>
                  }>
                    <div className="p-3">
                      <UpgradeVendeur onUpgradeComplete={loadProfile} />
                    </div>
                  </Tab>
                )}

                {/* Onglet Transactions */}
                <Tab eventKey="transactions" title={
                  <span>
                    <i className="fas fa-exchange-alt me-2"></i>
                    Transactions
                  </span>
                }>
                  <div className="p-3">
                    <TransactionHistory />
                  </div>
                </Tab>

                {/* Onglet Documents */}
                <Tab eventKey="documents" title={
                  <span>
                    <i className="fas fa-file-alt me-2"></i>
                    Documents
                  </span>
                }>
                  <div className="p-3">
                    <VisaCardGenerator />
                    
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">Autres Documents</h6>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Card className="border h-100">
                            <Card.Body className="text-center">
                              <i className="fas fa-file-invoice fa-2x text-primary mb-3"></i>
                              <h6>Relevés de Transactions</h6>
                              <p className="text-muted small mb-3">
                                Consultez et téléchargez vos historiques de transaction
                              </p>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => window.open('/documents?tab=transactions', '_blank')}
                              >
                                <i className="fas fa-external-link-alt me-1"></i>
                                Accéder
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={6} className="mb-3">
                          <Card className="border h-100">
                            <Card.Body className="text-center">
                              <i className="fas fa-file-contract fa-2x text-success mb-3"></i>
                              <h6>Contrats Légaux</h6>
                              <p className="text-muted small mb-3">
                                Conditions d'utilisation et politique de confidentialité
                              </p>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => window.open('/documents?tab=contracts', '_blank')}
                              >
                                <i className="fas fa-external-link-alt me-1"></i>
                                Accéder
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tab>

                {/* Onglet Abonnement (pour les vendeurs) */}
                {user?.role === 'vendeur' && (
                  <Tab eventKey="subscription" title={
                    <span>
                      <i className="fas fa-crown me-2"></i>
                      Mon Abonnement
                    </span>
                  }>
                    <div className="p-3">
                      <SubscriptionPlans />
                    </div>
                  </Tab>
                )}

                {/* Onglet Sécurité */}
                <Tab eventKey="security" title={
                  <span>
                    <i className="fas fa-shield-alt me-2"></i>
                    Sécurité
                  </span>
                }>
                  <div className="p-3">
                    <Card className="border-0">
                      <Card.Body>
                        <h5 className="fw-bold mb-4">Paramètres de Sécurité</h5>
                        
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                            <div>
                              <h6 className="fw-bold mb-1">Mot de passe</h6>
                              <p className="text-muted mb-0">Défini le {new Date(profile?.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <Button variant="outline-primary" size="sm">
                              Modifier
                            </Button>
                          </ListGroup.Item>

                          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                            <div>
                              <h6 className="fw-bold mb-1">Authentification à deux facteurs</h6>
                              <p className="text-muted mb-0">Ajoutez une couche de sécurité supplémentaire</p>
                            </div>
                            <Form.Check 
                              type="switch"
                              id="2fa-switch"
                            />
                          </ListGroup.Item>

                          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                            <div>
                              <h6 className="fw-bold mb-1">Sessions actives</h6>
                              <p className="text-muted mb-0">Gérez vos appareils connectés</p>
                            </div>
                            <Button variant="outline-info" size="sm">
                              Voir
                            </Button>
                          </ListGroup.Item>

                          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                            <div>
                              <h6 className="fw-bold mb-1 text-danger">Supprimer le compte</h6>
                              <p className="text-muted mb-0">Cette action est irréversible</p>
                            </div>
                            <Button variant="outline-danger" size="sm">
                              Supprimer
                            </Button>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de changement de photo */}
      <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer la photo de profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              {profile?.photo ? (
                <Image 
                  src={profile.photo} 
                  alt="Profile" 
                  roundedCircle
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-light border d-inline-flex align-items-center justify-content-center"
                  style={{ width: '150px', height: '150px' }}
                >
                  <i className="fas fa-user fa-4x text-muted"></i>
                </div>
              )}
            </div>
            
            <Form.Group>
              <Form.Label>Choisir une nouvelle photo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={photoUploading}
              />
              <Form.Text className="text-muted">
                Formats supportés: JPG, PNG, GIF. Taille max: 5MB
              </Form.Text>
            </Form.Group>

            {photoUploading && (
              <div className="mt-3">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <span>Téléchargement en cours...</span>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;