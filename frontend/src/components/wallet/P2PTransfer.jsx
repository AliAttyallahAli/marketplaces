import React, { useState, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';

const P2PTransfer = () => {
  const [transferData, setTransferData] = useState({
    to_phone: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const qrScannerRef = useRef(null);

  const { user } = useAuth();

  const handleChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!transferData.to_phone || !transferData.amount) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (parseFloat(transferData.amount) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    try {
      const response = await walletAPI.p2pTransfer({
        to_phone: transferData.to_phone,
        amount: parseFloat(transferData.amount)
      });

      setSuccess(`Transfert de ${transferData.amount} FCFA effectué avec succès!`);
      setTransferData({
        to_phone: '',
        amount: '',
        description: ''
      });
      setShowConfirmation(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors du transfert');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (result) => {
    if (result) {
      // Extraire le numéro de téléphone du QR code
      const phoneMatch = result.match(/phone=([^&]+)/);
      if (phoneMatch) {
        setTransferData(prev => ({
          ...prev,
          to_phone: phoneMatch[1]
        }));
      }
      setShowQRScanner(false);
    }
  };

  const openQRScanner = () => {
    setShowQRScanner(true);
    // Implémentation du scanner QR à ajouter
  };

  return (
    <>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <i className="fas fa-paper-plane fa-3x text-primary mb-3"></i>
            <h4 className="fw-bold">Transfert d'argent</h4>
            <p className="text-muted">
              Envoyez de l'argent à un autre utilisateur ZouDou-Souk
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-3">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Numéro du destinataire <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="tel"
                  name="to_phone"
                  value={transferData.to_phone}
                  onChange={handleChange}
                  placeholder="+235 XX XX XX XX"
                  required
                />
                <Button 
                  variant="outline-primary" 
                  onClick={openQRScanner}
                  type="button"
                >
                  <i className="fas fa-qrcode"></i>
                </Button>
              </div>
              <Form.Text className="text-muted">
                Le numéro de téléphone doit être enregistré sur ZouDou-Souk
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Montant (FCFA) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="1"
                step="0.01"
                required
              />
              <Form.Text className="text-muted">
                Frais de transaction: 1% du montant
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={transferData.description}
                onChange={handleChange}
                placeholder="Ajoutez une description pour cette transaction..."
              />
            </Form.Group>

            <div className="bg-light p-3 rounded mb-4">
              <Row>
                <Col>
                  <small className="text-muted">Montant à envoyer:</small>
                  <div className="fw-bold">
                    {transferData.amount ? parseFloat(transferData.amount).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
                <Col>
                  <small className="text-muted">Frais (1%):</small>
                  <div className="fw-bold text-danger">
                    {transferData.amount ? (parseFloat(transferData.amount) * 0.01).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
                <Col>
                  <small className="text-muted">Montant reçu:</small>
                  <div className="fw-bold text-success">
                    {transferData.amount ? (parseFloat(transferData.amount) * 0.99).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
              </Row>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2"
              disabled={loading || !transferData.to_phone || !transferData.amount}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Transfert en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Effectuer le transfert
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal de confirmation */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer le transfert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir effectuer ce transfert?</p>
          <div className="bg-light p-3 rounded">
            <strong>Destinataire:</strong> {transferData.to_phone}<br/>
            <strong>Montant:</strong> {parseFloat(transferData.amount).toLocaleString('fr-TD')} FCFA<br/>
            <strong>Frais:</strong> {(parseFloat(transferData.amount) * 0.01).toLocaleString('fr-TD')} FCFA<br/>
            <strong>Total débité:</strong> {parseFloat(transferData.amount).toLocaleString('fr-TD')} FCFA
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={confirmTransfer} disabled={loading}>
            {loading ? 'Transfert...' : 'Confirmer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Scanner QR */}
      <Modal show={showQRScanner} onHide={() => setShowQRScanner(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Scanner QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div 
              ref={qrScannerRef}
              style={{ width: '100%', height: '300px', background: '#f8f9fa' }}
              className="d-flex align-items-center justify-content-center border rounded"
            >
              <p className="text-muted">
                Fonctionnalité de scan QR à implémenter
              </p>
            </div>
            <p className="text-muted mt-3">
              Scannez le QR code du destinataire pour remplir automatiquement son numéro
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default P2PTransfer;