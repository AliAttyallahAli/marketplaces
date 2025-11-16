import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Tab, 
  Nav, 
  Button, 
  Alert, 
  Badge, 
  Modal, 
  Form 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI, walletAPI } from '../services/api';
import { toast } from 'react-toastify';

// Import des composants corrigés
import UserProfile from '../components/profile/UserProfile';
import KycForm from '../components/profile/KycForm';
import UpgradeVendeur from '../components/profile/UpgradeVendeur';
import Wallet from '../components/wallet/Wallet';
import TransactionHistory from '../components/wallet/TransactionHistory';

const Profile = () => {
  const { user, upgradeToVendeur } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVisaModal, setShowVisaModal] = useState(false);

  useEffect(() => {
    loadUserData();
    
    // Gérer les tabs depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const [profileResponse, walletResponse] = await Promise.all([
        userAPI.getProfile(),
        walletAPI.getBalance()
      ]);
      
      setUserData(profileResponse.data.user);
      setWalletData(walletResponse.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeVendeur = async (vendeurData) => {
    try {
      const result = await upgradeToVendeur(vendeurData);
      if (result.success) {
        await loadUserData();
        setActiveTab('profile');
      }
    } catch (error) {
      console.error('Erreur upgrade vendeur:', error);
    }
  };

  const generateVisaCard = () => {
    setShowVisaModal(true);
    toast.info('Génération de votre carte Visa en cours...');
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement de votre profil...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={3} className="mb-4">
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="text-center">
              <div className="mb-3">
                {userData?.photo ? (
                  <img 
                    src={userData.photo} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <i className="fas fa-user fa-2x"></i>
                  </div>
                )}
              </div>
              
              <h5 className="fw-bold mb-1">
                {userData?.prenom} {userData?.nom}
              </h5>
              
              <Badge 
                bg={
                  userData?.role === 'admin' ? 'warning' :
                  userData?.role === 'vendeur' ? 'success' : 'secondary'
                }
                className="mb-2"
              >
                {userData?.role === 'admin' ? 'Administrateur' :
                 userData?.role === 'vendeur' ? 'Vendeur' : 'Client'}
              </Badge>

              {walletData && (
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted d-block">Solde Wallet</small>
                  <h4 className="text-primary fw-bold mb-0">
                    {parseFloat(walletData.balance).toLocaleString('fr-FR')} XAF
                  </h4>
                  <small className="text-muted">
                    {walletData.phone}
                  </small>
                </div>
              )}

              <div className="mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={generateVisaCard}
                >
                  <i className="fas fa-credit-card me-1"></i>
                  Carte Visa
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 pt-4">
              <h4 className="fw-bold mb-0">Mon Profil</h4>
            </Card.Header>
            
            <Card.Body className="p-0">
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="tabs" className="px-3 pt-3">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">
                      <i className="fas fa-user me-2"></i>
                      Profil
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link eventKey="wallet">
                      <i className="fas fa-wallet me-2"></i>
                      Portefeuille
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link eventKey="transactions">
                      <i className="fas fa-history me-2"></i>
                      Historique
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link eventKey="kyc">
                      <i className="fas fa-id-card me-2"></i>
                      Vérification KYC
                    </Nav.Link>
                  </Nav.Item>
                  
                  {userData?.role === 'client' && (
                    <Nav.Item>
                      <Nav.Link eventKey="upgrade">
                        <i className="fas fa-store me-2"></i>
                        Devenir Vendeur
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>

                <Tab.Content className="p-4">
                  <Tab.Pane eventKey="profile">
                    <UserProfile 
                      userData={userData} 
                      onUpdate={loadUserData} 
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey="wallet">
                    <Wallet 
                      walletData={walletData}
                      onUpdate={loadUserData}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey="transactions">
                    <TransactionHistory />
                  </Tab.Pane>

                  <Tab.Pane eventKey="kyc">
                    <KycForm 
                      userData={userData}
                      onUpdate={loadUserData}
                    />
                  </Tab.Pane>

                  {userData?.role === 'client' && (
                    <Tab.Pane eventKey="upgrade">
                      <UpgradeVendeur 
                        userData={userData}
                        onSubmit={handleUpgradeVendeur}
                      />
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showVisaModal} onHide={() => setShowVisaModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-credit-card me-2"></i>
            Votre Carte Visa ZouDou-Souk
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VisaCardPreview userData={userData} walletData={walletData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVisaModal(false)}>
            Fermer
          </Button>
          <Button variant="primary" onClick={generateVisaCard}>
            <i className="fas fa-download me-2"></i>
            Télécharger PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Composant de prévisualisation de la carte Visa
const VisaCardPreview = ({ userData, walletData }) => {
  return (
    <div className="visa-card-preview">
      <div className="visa-card bg-primary text-white rounded-3 p-4 position-relative" 
           style={{ maxWidth: '400px', margin: '0 auto' }}>
        
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 className="fw-bold mb-0">ZouDou-Souk</h5>
            <small>Carte Visa Virtuelle</small>
          </div>
          <div className="text-end">
            <i className="fab fa-cc-visa fa-2x"></i>
          </div>
        </div>

        <div className="mb-4">
          <div className="card-number h4 fw-bold font-monospace mb-2">
            {walletData?.phone?.replace(/\+/g, '').replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••'}
          </div>
          <small>Numéro de wallet</small>
        </div>

        <div className="row">
          <div className="col-8">
            <div className="mb-2">
              <div className="fw-bold text-uppercase">
                {userData?.prenom} {userData?.nom}
              </div>
              <small>Titulaire de la carte</small>
            </div>
          </div>
          <div className="col-4">
            <div className="mb-2">
              <div className="fw-bold">
                {(new Date().getMonth() + 1).toString().padStart(2, '0')}/{(new Date().getFullYear() + 2).toString().slice(-2)}
              </div>
              <small>Expire</small>
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <div className="bg-white rounded p-2 d-inline-block">
            <div className="text-dark small">
              <i className="fas fa-qrcode fa-2x mb-1"></i>
              <div>Scan pour P2P</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Alert variant="info" className="mb-3">
          <i className="fas fa-info-circle me-2"></i>
          Votre numéro de téléphone fait office de numéro de carte Visa.
          Utilisez-le pour les transactions P2P.
        </Alert>

        <Row>
          <Col md={6}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="fw-bold">
                  <i className="fas fa-mobile-alt me-2"></i>
                  Wallet Mobile Money
                </h6>
                <p className="mb-1 small">Numéro: {walletData?.phone}</p>
                <p className="mb-0 small">Solde: {parseFloat(walletData?.balance || 0).toLocaleString('fr-FR')} XAF</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="fw-bold">
                  <i className="fas fa-qrcode me-2"></i>
                  QR Code P2P
                </h6>
                <p className="mb-0 small">
                  Scannez ce QR code pour recevoir des paiements directement
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;