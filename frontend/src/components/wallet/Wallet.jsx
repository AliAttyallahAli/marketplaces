import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { walletAPI } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import P2PTransfer from './P2PTransfer';
import TransactionHistory from './TransactionHistory';
import VisaCard from './VisaCard';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { user } = useAuth();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const response = await walletAPI.getBalance();
      setWallet(response.data);
    } catch (error) {
      setError('Erreur lors du chargement du portefeuille');
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(balance || 0);
  };

  const quickActions = [
    {
      title: 'Envoyer de l\'argent',
      description: 'Transfert P2P vers un autre utilisateur',
      icon: 'fas fa-paper-plane',
      color: 'primary',
      link: '/p2p'
    },
    {
      title: 'Recevoir de l\'argent',
      description: 'Générez un QR code pour recevoir des paiements',
      icon: 'fas fa-qrcode',
      color: 'success',
      link: '/p2p?tab=receive'
    },
    {
      title: 'Payer une facture',
      description: 'Électricité, eau, taxes communales',
      icon: 'fas fa-file-invoice',
      color: 'warning',
      link: '/services'
    },
    {
      title: 'Historique',
      description: 'Voir toutes vos transactions',
      icon: 'fas fa-history',
      color: 'info',
      link: '/profile?tab=wallet&view=history'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-component">
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        {/* Vue d'ensemble */}
        <Tab eventKey="overview" title="Vue d'ensemble">
          <Row>
            <Col lg={8}>
              {/* Carte principale du wallet */}
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h4 className="fw-bold mb-1">Mon Portefeuille</h4>
                      <p className="text-muted mb-0">
                        Solde disponible pour vos transactions
                      </p>
                    </div>
                    <Badge bg="success" className="fs-6">
                      <i className="fas fa-check-circle me-1"></i>
                      Actif
                    </Badge>
                  </div>

                  <div className="text-center py-4">
                    <div className="balance-display mb-3">
                      <h1 className="display-4 fw-bold text-primary">
                        {formatBalance(wallet?.balance)}
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
                        <p className="mb-0 text-muted">Disponible</p>
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

              {/* Actions rapides */}
              <Card className="shadow-sm border-0">
                <Card.Header>
                  <h5 className="mb-0">Actions Rapides</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {quickActions.map((action, index) => (
                      <Col lg={6} key={index} className="mb-3">
                        <Button
                          as={Link}
                          to={action.link}
                          variant="outline-primary"
                          className="w-100 h-100 text-start p-3"
                        >
                          <div className="d-flex align-items-center">
                            <div className={`bg-${action.color} bg-opacity-10 rounded p-2 me-3`}>
                              <i className={`${action.icon} fa-lg text-${action.color}`}></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1">{action.title}</h6>
                              <small className="text-muted">{action.description}</small>
                            </div>
                          </div>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Carte Visa Virtuelle */}
              <VisaCard />

              {/* Dernières transactions */}
              <Card className="shadow-sm border-0 mt-4">
                <Card.Header>
                  <h6 className="mb-0">Dernières Transactions</h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <i className="fas fa-exchange-alt fa-2x text-muted mb-3"></i>
                    <p className="text-muted small">
                      <Button 
                        variant="link" 
                        className="p-0"
                        onClick={() => setActiveTab('history')}
                      >
                        Voir l'historique complet
                      </Button>
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Informations de sécurité */}
              <Card className="shadow-sm border-0 mt-4">
                <Card.Body>
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Transfert P2P */}
        <Tab eventKey="transfer" title="Transfert P2P">
          <Row className="justify-content-center">
            <Col lg={8}>
              <P2PTransfer />
            </Col>
          </Row>
        </Tab>

        {/* Historique */}
        <Tab eventKey="history" title="Historique">
          <TransactionHistory />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Wallet;