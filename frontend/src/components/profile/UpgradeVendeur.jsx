import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { PROVINCES_TCHAD } from '../../utils/constants';

const UpgradeVendeur = () => {
  const { user, upgradeToVendeur } = useAuth();
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    date_naissance: user?.date_naissance || '',
    lieu_naissance: user?.lieu_naissance || '',
    province: user?.province || '',
    region: user?.region || '',
    ville: user?.ville || '',
    quartier: user?.quartier || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await upgradeToVendeur(formData);
    
    if (result.success) {
      setSuccess('Félicitations! Vous êtes maintenant vendeur sur ZouDou-Souk.');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Card className="border-0">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <i className="fas fa-store fa-3x text-primary mb-3"></i>
          <h4 className="fw-bold">Devenir Vendeur</h4>
          <p className="text-muted">
            Complétez votre profil pour commencer à vendre sur ZouDou-Souk
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
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

          <div className="bg-light p-3 rounded mb-4">
            <h6 className="fw-bold mb-3">Avantages de devenir vendeur:</h6>
            <ul className="mb-0">
              <li>Vendez vos produits à toute la communauté Tchadienne</li>
              <li>Gérez votre boutique en ligne facilement</li>
              <li>Acceptez les paiements Mobile Money sécurisés</li>
              <li>Bénéficiez de la visibilité de la plateforme</li>
              <li>Accédez aux statistiques de vos ventes</li>
            </ul>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Traitement...
              </>
            ) : (
              <>
                <i className="fas fa-rocket me-2"></i>
                Devenir vendeur
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpgradeVendeur;