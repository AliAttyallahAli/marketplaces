import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Modal, Alert } from 'react-bootstrap';
import { walletAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Wallet = ({ walletData, onUpdate }) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    to_phone: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await walletAPI.p2pTransfer(transferData);
      toast.success('Transfert effectué avec succès!');
      setShowTransferModal(false);
      setTransferData({ to_phone: '', amount: '' });
      onUpdate();
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors du transfert';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-4">Mon Portefeuille</h5>
      
      <Row>
        <Col md={6}>
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">Solde Disponible</h6>
                  <h2 className="fw-bold mb-0">
                    {parseFloat(walletData?.balance || 0).toLocaleString('fr-FR')} XAF
                  </h2>
                  <small>{walletData?.phone}</small>
                </div>
                <i className="fas fa-wallet fa-2x opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 bg-light h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <Button 
                variant="primary" 
                className="mb-2"
                onClick={() => setShowTransferModal(true)}
              >
                <i className="fas fa-paper-plane me-2"></i>
                Transfert P2P
              </Button>
              <Button variant="outline-primary" size="sm">
                <i className="fas fa-qrcode me-2"></i>
                Mon QR Code
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="border-0 text-center">
            <Card.Body>
              <i className="fas fa-mobile-alt fa-2x text-primary mb-2"></i>
              <h6>Mobile Money</h6>
              <small className="text-muted">Airtel, Tigo, etc.</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 text-center">
            <Card.Body>
              <i className="fas fa-shield-alt fa-2x text-success mb-2"></i>
              <h6>Sécurisé</h6>
              <small className="text-muted">Transactions cryptées</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 text-center">
            <Card.Body>
              <i className="fas fa-bolt fa-2x text-warning mb-2"></i>
              <h6>Instantanné</h6>
              <small className="text-muted">Transferts rapides</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de transfert */}
      <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Transfert P2P</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransfer}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Numéro du destinataire</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+235 XX XX XX XX"
                value={transferData.to_phone}
                onChange={(e) => setTransferData({...transferData, to_phone: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Montant (XAF)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={transferData.amount}
                onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                required
              />
              <Form.Text className="text-muted">
                Frais: 1% - Vous enverrez: {transferData.amount ? (transferData.amount * 0.99).toLocaleString('fr-FR') : 0} XAF
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Transfert...' : 'Transférer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Wallet;