import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import P2PTransfer from '../components/wallet/P2PTransfer';
import TransactionHistory from '../components/wallet/TransactionHistory';

const P2P = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('send');

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="py-5">
              <i className="fas fa-lock fa-3x text-muted mb-3"></i>
              <h3 className="fw-bold">Accès non autorisé</h3>
              <p className="text-muted">
                Vous devez être connecté pour accéder aux transferts P2P
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="fw-bold">Transfert P2P</h1>
            <p className="text-muted">
              Envoyez et recevez de l'argent en toute sécurité avec ZouDou-Souk
            </p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xl={8}>
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4 justify-content-center"
          >
            <Tab eventKey="send" title={
              <span>
                <i className="fas fa-paper-plane me-2"></i>
                Envoyer de l'argent
              </span>
            }>
              <P2PTransfer />
            </Tab>
            
            <Tab eventKey="receive" title={
              <span>
                <i className="fas fa-qrcode me-2"></i>
                Recevoir de l'argent
              </span>
            }>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4 text-center">
                  <i className="fas fa-qrcode fa-4x text-primary mb-3"></i>
                  <h4 className="fw-bold mb-3">Votre QR Code Personnel</h4>
                  <p className="text-muted mb-4">
                    Partagez ce QR code pour recevoir des paiements instantanés
                  </p>
                  
                  <div className="bg-light p-4 rounded d-inline-block mb-4">
                    {/* QR Code à générer dynamiquement */}
                    <div className="bg-white p-3 rounded">
                      <div 
                        style={{ 
                          width: '200px', 
                          height: '200px', 
                          background: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        className="border rounded"
                      >
                        <span className="text-muted">QR Code</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary text-white rounded p-3 mb-4">
                    <h6 className="fw-bold mb-2">
                      <i className="fas fa-mobile-alt me-2"></i>
                      Votre numéro de wallet
                    </h6>
                    <p className="mb-0 fs-5">+235 XX XX XX XX</p>
                  </div>

                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-download me-2"></i>
                      Télécharger QR
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="fas fa-share-alt me-2"></i>
                      Partager
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="history" title={
              <span>
                <i className="fas fa-history me-2"></i>
                Historique
              </span>
            }>
              <TransactionHistory />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Informations importantes */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-shield-alt fa-2x text-success mb-2"></i>
                  <h6 className="fw-bold">Sécurisé</h6>
                  <p className="text-muted small mb-0">
                    Toutes les transactions sont chiffrées et sécurisées
                  </p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-bolt fa-2x text-warning mb-2"></i>
                  <h6 className="fw-bold">Instantané</h6>
                  <p className="text-muted small mb-0">
                    Les transferts sont effectués en temps réel
                  </p>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="fas fa-percentage fa-2x text-info mb-2"></i>
                  <h6 className="fw-bold">Frais bas</h6>
                  <p className="text-muted small mb-0">
                    Seulement 1% de frais de transaction
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default P2P;