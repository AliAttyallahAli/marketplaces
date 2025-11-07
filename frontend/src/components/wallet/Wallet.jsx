import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      // Simulation des données en attendant l'API
      const mockWallet = {
        balance: 150000,
        phone: user?.phone || '+235 XX XX XX XX',
        qr_code: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiMzMzMiPlpvdURvdS1Tb3VrPC90ZXh0Pjwvc3ZnPg=='
      };
      
      setWallet(mockWallet);
      setError('');
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError('Erreur lors du chargement du portefeuille. Données simulées affichées.');
      
      // Données de secours
      const fallbackWallet = {
        balance: 0,
        phone: user?.phone || '+235 XX XX XX XX',
        qr_code: null
      };
      setWallet(fallbackWallet);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(balance);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="wallet-component">
      {error && (
        <Alert variant="warning" className="mb-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Mon Portefeuille</h4>
                  <p className="text-muted mb-0">
                    Solde disponible pour vos transactions
                  </p>
                </div>
                <Badge bg="success" className="fs-6">
                  Actif
                </Badge>
              </div>

              <div className="text-center py-4">
                <div className="balance-display mb-3">
                  <h1 className="display-4 fw-bold text-primary">
                    {formatBalance(wallet?.balance || 0)}
                  </h1>
                </div>
                <p className="text-muted">
                  Solde actuel en FCFA (XAF)
                </p>
              </div>

              <Row className="text-center">
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <i className="fas fa-mobile-alt fa-2x text-primary mb-2"></i>
                    <h6 className="fw-bold">Numéro Wallet</h6>
                    <p className="mb-0 text-muted">{wallet?.phone}</p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <i className="fas fa-qrcode fa-2x text-success mb-2"></i>
                    <h6 className="fw-bold">QR Code</h6>
                    <p className="mb-0 text-muted">
                      {wallet?.qr_code ? 'Disponible' : 'Générer dans P2P'}
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="p-3 border rounded">
                    <i className="fas fa-shield-alt fa-2x text-warning mb-2"></i>
                    <h6 className="fw-bold">Sécurité</h6>
                    <p className="mb-0 text-muted">Protégé</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Actions Rapides</h5>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  href="/p2p"
                  className="mb-2"
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Envoyer de l'argent
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  href="/p2p?tab=receive"
                  className="mb-2"
                >
                  <i className="fas fa-qrcode me-2"></i>
                  Recevoir de l'argent
                </Button>

                <Button 
                  variant="outline-success" 
                  size="lg"
                  href="/services"
                  className="mb-2"
                >
                  <i className="fas fa-file-invoice me-2"></i>
                  Payer une facture
                </Button>

                <Button 
                  variant="outline-info" 
                  size="lg"
                  href="/profile?tab=transactions"
                >
                  <i className="fas fa-history me-2"></i>
                  Historique
                </Button>
              </div>

              <hr className="my-4" />

              <div className="security-info">
                <h6 className="fw-bold mb-3">
                  <i className="fas fa-info-circle me-2 text-info"></i>
                  Informations de sécurité
                </h6>
                <ul className="list-unstyled small text-muted">
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Votre numéro de téléphone est votre numéro de wallet
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Transactions sécurisées avec Mobile Money
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Frais de transaction: 1%
                  </li>
                  <li>
                    <i className="fas fa-check text-success me-2"></i>
                    Support 24/7 disponible
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Wallet;