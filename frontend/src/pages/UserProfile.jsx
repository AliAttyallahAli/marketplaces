import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI, walletAPI } from '../services/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserProfile = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [profileResponse, walletResponse] = await Promise.all([
        userAPI.getProfile(),
        walletAPI.getBalance()
      ]);
      
      setProfile(profileResponse.data.user);
      setWallet(walletResponse.data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (formData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(formData);
      setSuccess('Profil mis à jour avec succès');
      setShowEditModal(false);
      loadUserData(); // Recharger les données
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleKYCSubmit = async (kycData) => {
    // Implémentation de la soumission KYC
    console.log('KYC Data:', kycData);
    setSuccess('Documents KYC soumis avec succès');
    setShowKYCModal(false);
  };

  const generateVisaCard = () => {
    // Génération de la carte Visa virtuelle
    setShowWalletModal(true);
  };

  if (loading) {
    return <LoadingSpinner centered text="Chargement du profil..." />;
  }

  if (!profile) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Profil non trouvé</h3>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Mon Profil</h1>
          <p className="text-muted">Gérez vos informations personnelles et votre compte</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        {/* Sidebar Profil */}
        <Col lg={4} className="mb-4">
          <ProfileSidebar 
            profile={profile} 
            wallet={wallet}
            onEdit={() => setShowEditModal(true)}
            onGenerateVisa={generateVisaCard}
          />
        </Col>

        {/* Contenu Principal */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="px-3 pt-3"
              >
                {/* Onglet Profil */}
                <Tab eventKey="profile" title={
                  <span>
                    <i className="fas fa-user me-2"></i>
                    Informations Personnelles
                  </span>
                }>
                  <ProfileInfo 
                    profile={profile} 
                    onEdit={() => setShowEditModal(true)}
                  />
                </Tab>

                {/* Onglet Wallet */}
                <Tab eventKey="wallet" title={
                  <span>
                    <i className="fas fa-wallet me-2"></i>
                    Portefeuille
                  </span>
                }>
                  <WalletInfo 
                    wallet={wallet}
                    onGenerateVisa={generateVisaCard}
                  />
                </Tab>

                {/* Onglet Sécurité */}
                <Tab eventKey="security" title={
                  <span>
                    <i className="fas fa-shield-alt me-2"></i>
                    Sécurité
                  </span>
                }>
                  <SecurityInfo 
                    profile={profile}
                    onKYC={() => setShowKYCModal(true)}
                  />
                </Tab>

                {/* Onglet Historique */}
                <Tab eventKey="history" title={
                  <span>
                    <i className="fas fa-history me-2"></i>
                    Historique
                  </span>
                }>
                  <TransactionHistory userId={profile.id} />
                </Tab>

                {/* Onglet Paramètres */}
                <Tab eventKey="settings" title={
                  <span>
                    <i className="fas fa-cog me-2"></i>
                    Paramètres
                  </span>
                }>
                  <SettingsPanel 
                    profile={profile}
                    onLogout={logout}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal d'édition du profil */}
      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
        loading={saving}
      />

      {/* Modal KYC */}
      <KYCModal
        show={showKYCModal}
        onHide={() => setShowKYCModal(false)}
        onSubmit={handleKYCSubmit}
      />

      {/* Modal Wallet et Carte Visa */}
      <WalletModal
        show={showWalletModal}
        onHide={() => setShowWalletModal(false)}
        wallet={wallet}
        profile={profile}
      />
    </Container>
  );
};

// Composant Sidebar du Profil
const ProfileSidebar = ({ profile, wallet, onEdit, onGenerateVisa }) => {
  const getRoleBadge = (role) => {
    const variants = {
      'admin': { bg: 'warning', text: 'Administrateur' },
      'vendeur': { bg: 'success', text: 'Vendeur' },
      'client': { bg: 'secondary', text: 'Client' }
    };
    const roleInfo = variants[role] || variants.client;
    
    return (
      <Badge bg={roleInfo.bg} className="fs-6">
        {roleInfo.text}
      </Badge>
    );
  };

  const getVerificationStatus = (profile) => {
    if (profile.kyc_verified) {
      return { text: 'Vérifié', color: 'success', icon: 'fa-check-circle' };
    } else if (profile.kyb_verified) {
      return { text: 'Entreprise vérifiée', color: 'info', icon: 'fa-building' };
    } else {
      return { text: 'En attente', color: 'warning', icon: 'fa-clock' };
    }
  };

  const verification = getVerificationStatus(profile);

  return (
    <div className="sticky-top" style={{ top: '100px' }}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center p-4">
          {/* Photo de profil */}
          <div className="mb-3">
            {profile.photo ? (
              <img 
                src={profile.photo} 
                alt="Profile" 
                className="rounded-circle"
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
          </div>
          
          {/* Nom et rôle */}
          <h4 className="fw-bold mb-1">{profile.prenom} {profile.nom}</h4>
          <div className="mb-3">
            {getRoleBadge(profile.role)}
          </div>

          {/* Statut de vérification */}
          <div className="mb-3">
            <Badge bg={verification.color} className="mb-2">
              <i className={`fas ${verification.icon} me-1`}></i>
              {verification.text}
            </Badge>
          </div>

          {/* Informations de contact */}
          <div className="text-muted mb-3">
            <div>
              <i className="fas fa-envelope me-2"></i>
              {profile.email}
            </div>
            <div>
              <i className="fas fa-phone me-2"></i>
              {profile.phone}
            </div>
          </div>

          {/* Solde du wallet */}
          {wallet && (
            <Card className="bg-primary text-white mb-3">
              <Card.Body className="py-3">
                <div className="small">Solde disponible</div>
                <div className="h4 fw-bold mb-0">
                  {parseFloat(wallet.balance).toLocaleString('fr-TD')} FCFA
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Actions rapides */}
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={onEdit}>
              <i className="fas fa-edit me-2"></i>
              Modifier le profil
            </Button>
            
            {wallet && (
              <Button variant="outline-primary" onClick={onGenerateVisa}>
                <i className="fas fa-credit-card me-2"></i>
                Ma carte Visa
              </Button>
            )}

            {profile.role === 'client' && (
              <Button variant="success" href="/become-vendor">
                <i className="fas fa-store me-2"></i>
                Devenir vendeur
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Statistiques rapides */}
      <Card className="border-0 shadow-sm mt-3">
        <Card.Body>
          <h6 className="fw-bold mb-3">Statistiques</h6>
          <div className="small">
            <div className="d-flex justify-content-between mb-2">
              <span>Membre depuis:</span>
              <strong>{new Date(profile.created_at).toLocaleDateString('fr-FR')}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Dernière connexion:</span>
              <strong>Aujourd'hui</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Statut:</span>
              <Badge bg="success" className="small">Actif</Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// Composant Informations du Profil
const ProfileInfo = ({ profile, onEdit }) => {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Informations Personnelles</h5>
        <Button variant="outline-primary" size="sm" onClick={onEdit}>
          <i className="fas fa-edit me-2"></i>
          Modifier
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <div className="mb-4">
            <h6 className="fw-bold text-muted mb-2">Informations de base</h6>
            <div className="bg-light rounded p-3">
              <div className="mb-2">
                <strong>Nom complet:</strong><br />
                {profile.prenom} {profile.nom}
              </div>
              <div className="mb-2">
                <strong>NNI:</strong><br />
                {profile.nni}
              </div>
              <div className="mb-2">
                <strong>Date de naissance:</strong><br />
                {profile.date_naissance ? new Date(profile.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
              </div>
              <div>
                <strong>Lieu de naissance:</strong><br />
                {profile.lieu_naissance || 'Non renseigné'}
              </div>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="mb-4">
            <h6 className="fw-bold text-muted mb-2">Coordonnées</h6>
            <div className="bg-light rounded p-3">
              <div className="mb-2">
                <strong>Email:</strong><br />
                {profile.email}
              </div>
              <div className="mb-2">
                <strong>Téléphone:</strong><br />
                {profile.phone}
              </div>
              <div>
                <strong>Adresse:</strong><br />
                {profile.quartier && `${profile.quartier}, `}
                {profile.ville && `${profile.ville}, `}
                {profile.region && `${profile.region}, `}
                {profile.province || 'Non renseignée'}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Informations de compte */}
      <div>
        <h6 className="fw-bold text-muted mb-2">Informations du compte</h6>
        <div className="bg-light rounded p-3">
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>Rôle:</strong><br />
                <Badge bg={
                  profile.role === 'admin' ? 'warning' :
                  profile.role === 'vendeur' ? 'success' : 'secondary'
                }>
                  {profile.role}
                </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Statut de vérification:</strong><br />
                {profile.kyc_verified ? (
                  <Badge bg="success">
                    <i className="fas fa-check me-1"></i>
                    KYC Vérifié
                  </Badge>
                ) : (
                  <Badge bg="warning">
                    <i className="fas fa-clock me-1"></i>
                    KYC En attente
                  </Badge>
                )}
              </div>
            </Col>
          </Row>
          <div className="mt-2">
            <strong>Date d'inscription:</strong><br />
            {new Date(profile.created_at).toLocaleDateString('fr-FR')} à {new Date(profile.created_at).toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Informations Wallet
const WalletInfo = ({ wallet, onGenerateVisa }) => {
  if (!wallet) {
    return (
      <div className="p-4 text-center">
        <i className="fas fa-wallet fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">Portefeuille non disponible</h5>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
             style={{ width: '80px', height: '80px' }}>
          <i className="fas fa-wallet fa-2x text-white"></i>
        </div>
        <h4 className="fw-bold">Mon Portefeuille</h4>
        <p className="text-muted">Gérez votre argent en toute sécurité</p>
      </div>

      {/* Solde principal */}
      <Card className="bg-gradient-primary text-white mb-4">
        <Card.Body className="text-center py-4">
          <div className="small mb-2">Solde disponible</div>
          <div className="display-6 fw-bold mb-3">
            {parseFloat(wallet.balance).toLocaleString('fr-TD')} FCFA
          </div>
          <div className="small">
            <i className="fas fa-mobile-alt me-2"></i>
            Numéro de wallet: {wallet.phone}
          </div>
        </Card.Body>
      </Card>

      {/* Actions rapides */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Button variant="outline-primary" className="w-100 h-100 py-3" href="/p2p">
            <i className="fas fa-paper-plane fa-2x mb-2 d-block"></i>
            Envoyer de l'argent
          </Button>
        </Col>
        <Col md={6} className="mb-3">
          <Button variant="outline-success" className="w-100 h-100 py-3" onClick={onGenerateVisa}>
            <i className="fas fa-credit-card fa-2x mb-2 d-block"></i>
            Carte Visa
          </Button>
        </Col>
      </Row>

      {/* Informations du wallet */}
      <Card>
        <Card.Body>
          <h6 className="fw-bold mb-3">Informations du portefeuille</h6>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>Numéro de wallet:</strong><br />
                <span className="text-muted">{wallet.phone}</span>
              </div>
              <div className="mb-3">
                <strong>QR Code:</strong><br />
                {wallet.qr_code ? (
                  <span className="text-success">
                    <i className="fas fa-check me-2"></i>
                    Disponible
                  </span>
                ) : (
                  <span className="text-muted">Non généré</span>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Statut:</strong><br />
                <Badge bg="success">Actif</Badge>
              </div>
              <div className="mb-3">
                <strong>Devise:</strong><br />
                <span className="text-muted">FCFA (XAF)</span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

// Composant Sécurité
const SecurityInfo = ({ profile, onKYC }) => {
  return (
    <div className="p-4">
      <h5 className="fw-bold mb-4">Sécurité et Vérification</h5>

      {/* Statut KYC */}
      <Card className={profile.kyc_verified ? "border-success" : "border-warning"}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold">
                <i className={`fas ${profile.kyc_verified ? 'fa-check-circle text-success' : 'fa-clock text-warning'} me-2`}></i>
                Vérification d'identité (KYC)
              </h6>
              <p className="mb-0 text-muted">
                {profile.kyc_verified 
                  ? 'Votre identité a été vérifiée avec succès'
                  : 'Complétez votre vérification d\'identité pour accéder à toutes les fonctionnalités'
                }
              </p>
            </div>
            <div>
              {profile.kyc_verified ? (
                <Badge bg="success">Vérifié</Badge>
              ) : (
                <Button variant="primary" size="sm" onClick={onKYC}>
                  Vérifier mon identité
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Informations de sécurité */}
      <Card className="mt-3">
        <Card.Body>
          <h6 className="fw-bold mb-3">Sécurité du compte</h6>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-shield-alt text-success fa-lg me-3"></i>
                <div>
                  <strong>Authentification</strong><br />
                  <small className="text-muted">Connexion sécurisée</small>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-mobile-alt text-primary fa-lg me-3"></i>
                <div>
                  <strong>Mobile Money</strong><br />
                  <small className="text-muted">Paiements sécurisés</small>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-lock text-warning fa-lg me-3"></i>
                <div>
                  <strong>Données chiffrées</strong><br />
                  <small className="text-muted">Protection des données</small>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="fas fa-eye-slash text-info fa-lg me-3"></i>
                <div>
                  <strong>Vie privée</strong><br />
                  <small className="text-muted">Respect de la confidentialité</small>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Conseils de sécurité */}
      <Card className="mt-3 bg-light">
        <Card.Body>
          <h6 className="fw-bold mb-3">
            <i className="fas fa-lightbulb text-warning me-2"></i>
            Conseils de sécurité
          </h6>
          <ul className="mb-0 small">
            <li>Ne partagez jamais vos identifiants de connexion</li>
            <li>Utilisez un mot de passe fort et unique</li>
            <li>Vérifiez toujours l'URL du site (zoudousouk.td)</li>
            <li>Signalez toute activité suspecte au support</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

// Composant Historique des Transactions (simplifié)
const TransactionHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = async () => {
    try {
      const response = await walletAPI.getTransactions();
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner text="Chargement de l'historique..." />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Historique des transactions</h5>
        <Button variant="outline-primary" size="sm" href="/p2p?tab=history">
          Voir tout
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">Aucune transaction</h5>
          <p className="text-muted">Vos transactions apparaîtront ici</p>
        </div>
      ) : (
        <div className="list-group">
          {transactions.slice(0, 10).map(transaction => (
            <div key={transaction.id} className="list-group-item border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{transaction.type}</strong>
                  <br />
                  <small className="text-muted">
                    {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                  </small>
                </div>
                <div className="text-end">
                  <div className={`fw-bold ${transaction.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {transaction.amount > 0 ? '+' : ''}{parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA
                  </div>
                  <Badge bg={
                    transaction.status === 'completed' ? 'success' :
                    transaction.status === 'pending' ? 'warning' : 'danger'
                  }>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Paramètres
const SettingsPanel = ({ profile, onLogout }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    transactions: true,
    promotions: false
  });

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4">
      <h5 className="fw-bold mb-4">Paramètres du compte</h5>

      {/* Notifications */}
      <Card className="mb-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">
            <i className="fas fa-bell me-2 text-primary"></i>
            Notifications
          </h6>
          {Object.entries(notifications).map(([key, value]) => (
            <Form.Check
              key={key}
              type="switch"
              id={`notification-${key}`}
              label={
                <span>
                  {key === 'email' && 'Notifications par email'}
                  {key === 'sms' && 'Notifications par SMS'}
                  {key === 'push' && 'Notifications push'}
                  {key === 'transactions' && 'Alertes de transactions'}
                  {key === 'promotions' && 'Offres promotionnelles'}
                </span>
              }
              checked={value}
              onChange={(e) => handleNotificationChange(key, e.target.checked)}
              className="mb-2"
            />
          ))}
        </Card.Body>
      </Card>

      {/* Confidentialité */}
      <Card className="mb-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">
            <i className="fas fa-eye me-2 text-primary"></i>
            Confidentialité
          </h6>
          <Form.Check
            type="switch"
            id="profile-visible"
            label="Rendre mon profil visible par les autres utilisateurs"
            defaultChecked
            className="mb-2"
          />
          <Form.Check
            type="switch"
            id="show-activity"
            label="Afficher mon activité récente"
            defaultChecked
            className="mb-2"
          />
        </Card.Body>
      </Card>

      {/* Actions de compte */}
      <Card className="border-warning">
        <Card.Body>
          <h6 className="fw-bold mb-3 text-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Actions du compte
          </h6>
          <div className="d-grid gap-2">
            <Button variant="outline-warning" size="sm">
              <i className="fas fa-download me-2"></i>
              Télécharger mes données
            </Button>
            <Button variant="outline-danger" size="sm">
              <i className="fas fa-user-slash me-2"></i>
              Désactiver mon compte
            </Button>
            <Button variant="danger" onClick={onLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Déconnexion
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// Modal d'édition du profil
const EditProfileModal = ({ show, onHide, profile, onSave, loading }) => {
  const [formData, setFormData] = useState({
    nom: profile?.nom || '',
    prenom: profile?.prenom || '',
    date_naissance: profile?.date_naissance || '',
    lieu_naissance: profile?.lieu_naissance || '',
    province: profile?.province || '',
    region: profile?.region || '',
    ville: profile?.ville || '',
    quartier: profile?.quartier || ''
  });

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le profil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
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
                />
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
                  value={formData.date_naissance}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lieu de naissance</Form.Label>
                <Form.Control
                  type="text"
                  name="lieu_naissance"
                  value={formData.lieu_naissance}
                  onChange={handleChange}
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
                  value={formData.province}
                  onChange={handleChange}
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
                  value={formData.region}
                  onChange={handleChange}
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
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Modal KYC
const KYCModal = ({ show, onHide, onSubmit }) => {
  const [kycData, setKycData] = useState({
    piece_identite: null,
    photo_identite: null,
    selfie: null,
    justificatif_domicile: null
  });

  const handleFileChange = (name, file) => {
    setKycData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(kycData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Vérification d'identité (KYC)</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            La vérification KYC est nécessaire pour accéder à toutes les fonctionnalités de ZouDou-Souk.
          </div>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Pièce d'identité *</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange('piece_identite', e.target.files[0])}
                  required
                />
                <Form.Text className="text-muted">
                  Carte NNI, passeport ou permis de conduire
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Photo de la pièce *</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('photo_identite', e.target.files[0])}
                  required
                />
                <Form.Text className="text-muted">
                  Photo claire de votre pièce d'identité
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Selfie avec pièce *</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('selfie', e.target.files[0])}
                  required
                />
                <Form.Text className="text-muted">
                  Selfie montrant votre visage et la pièce d'identité
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Justificatif de domicile</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange('justificatif_domicile', e.target.files[0])}
                />
                <Form.Text className="text-muted">
                  Facture de moins de 3 mois
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Soumettre pour vérification
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Modal Wallet et Carte Visa
const WalletModal = ({ show, onHide, wallet, profile }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ma Carte Visa Virtuelle</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {/* Simulation de carte Visa */}
        <div className="bg-primary text-white rounded-3 p-4 mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h5 className="fw-bold mb-1">ZouDou-Souk</h5>
              <small>Visa Virtuelle</small>
            </div>
            <div className="text-end">
              <div className="bg-white text-primary rounded p-1 px-2 small fw-bold">
                VISA
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="fs-5 fw-bold mb-2">
              {wallet?.phone?.replace(/(\d{2})(?=\d)/g, '$1 ')}
            </div>
            <div className="small">
              {profile.prenom} {profile.nom}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-end">
            <div>
              <small>Expire</small>
              <div className="fw-bold">12/26</div>
            </div>
            <div className="text-center">
              <div className="bg-warning rounded p-2 d-inline-block">
                {/* QR Code placeholder */}
                <div className="bg-white p-1 rounded">
                  <div style={{ width: '60px', height: '60px', background: '#f8f9fa' }}
                       className="d-flex align-items-center justify-content-center">
                    <small className="text-muted">QR</small>
                  </div>
                </div>
              </div>
              <div className="small mt-1">Scanner pour payer</div>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 border rounded">
              <i className="fas fa-download fa-2x text-primary mb-2"></i>
              <div className="small">Télécharger PDF</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 border rounded">
              <i className="fas fa-share-alt fa-2x text-success mb-2"></i>
              <div className="small">Partager</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 border rounded">
              <i className="fas fa-print fa-2x text-info mb-2"></i>
              <div className="small">Imprimer</div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-3">
          <i className="fas fa-info-circle me-2"></i>
          Cette carte Visa virtuelle est liée à votre numéro de wallet {wallet?.phone}. 
          Utilisez-la pour recevoir des paiements en scannant le QR code.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfile;