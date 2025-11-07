import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { walletAPI } from '../../services/wallet';

const TaxPayment = () => {
  const [paymentData, setPaymentData] = useState({
    reference: '',
    amount: '',
    type_taxe: '',
    periode: '',
    contribuable_nom: '',
    contribuable_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const typesTaxes = [
    'Taxe foncière',
    'Taxe professionnelle',
    'Taxe de voirie',
    'Taxe de marché',
    'Autre taxe'
  ];

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!paymentData.reference || !paymentData.amount || !paymentData.type_taxe) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      const response = await walletAPI.payerFacture({
        service_type: 'TAXE',
        service_id: 3, // ID du service TAXE
        amount: parseFloat(paymentData.amount),
        reference: paymentData.reference
      });

      setSuccess(`Paiement de taxe de ${paymentData.amount} FCFA effectué avec succès!`);
      setPaymentData({
        reference: '',
        amount: '',
        type_taxe: '',
        periode: '',
        contribuable_nom: '',
        contribuable_phone: ''
      });
      setShowConfirmation(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div className="icon-wrapper bg-success rounded-circle mx-auto mb-3" 
                 style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-landmark fa-2x text-white"></i>
            </div>
            <h4 className="fw-bold">Paiement de Taxes Communales</h4>
            <p className="text-muted">
              Commune de Mongo - Service des Impôts
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
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Numéro de référence <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="reference"
                    value={paymentData.reference}
                    onChange={handleChange}
                    placeholder="Numéro d'avis d'imposition"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Type de taxe <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type_taxe"
                    value={paymentData.type_taxe}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez le type de taxe</option>
                    {typesTaxes.map(taxe => (
                      <option key={taxe} value={taxe}>{taxe}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Montant (FCFA) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={paymentData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Période</Form.Label>
                  <Form.Control
                    type="text"
                    name="periode"
                    value={paymentData.periode}
                    onChange={handleChange}
                    placeholder="Ex: Trimestre 1 2024"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du contribuable</Form.Label>
                  <Form.Control
                    type="text"
                    name="contribuable_nom"
                    value={paymentData.contribuable_nom}
                    onChange={handleChange}
                    placeholder="Nom du contribuable"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone du contribuable</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contribuable_phone"
                    value={paymentData.contribuable_phone}
                    onChange={handleChange}
                    placeholder="+235 XX XX XX XX"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="bg-light p-3 rounded mb-4">
              <h6 className="fw-bold mb-3">Résumé du paiement</h6>
              <Row>
                <Col>
                  <small className="text-muted">Montant taxe:</small>
                  <div className="fw-bold">
                    {paymentData.amount ? parseFloat(paymentData.amount).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
                <Col>
                  <small className="text-muted">Frais de service (1%):</small>
                  <div className="fw-bold text-danger">
                    {paymentData.amount ? (parseFloat(paymentData.amount) * 0.01).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
                <Col>
                  <small className="text-muted">Total à payer:</small>
                  <div className="fw-bold text-success">
                    {paymentData.amount ? (parseFloat(paymentData.amount) * 1.01).toLocaleString('fr-TD') : '0'} FCFA
                  </div>
                </Col>
              </Row>
            </div>

            <Button
              variant="success"
              type="submit"
              className="w-100 py-2"
              disabled={loading || !paymentData.reference || !paymentData.amount || !paymentData.type_taxe}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Paiement en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-landmark me-2"></i>
                  Payer la taxe
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal de confirmation */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer le paiement de taxe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir effectuer ce paiement?</p>
          <div className="bg-light p-3 rounded">
            <strong>Service:</strong> Taxes Communales<br/>
            <strong>Type de taxe:</strong> {paymentData.type_taxe}<br/>
            <strong>Référence:</strong> {paymentData.reference}<br/>
            <strong>Montant taxe:</strong> {parseFloat(paymentData.amount).toLocaleString('fr-TD')} FCFA<br/>
            <strong>Frais:</strong> {(parseFloat(paymentData.amount) * 0.01).toLocaleString('fr-TD')} FCFA<br/>
            <strong>Total:</strong> {(parseFloat(paymentData.amount) * 1.01).toLocaleString('fr-TD')} FCFA
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={confirmPayment} disabled={loading}>
            {loading ? 'Paiement...' : 'Confirmer le paiement'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaxPayment;