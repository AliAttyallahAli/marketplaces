import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpgradeVendeur = ({ userData, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: userData?.nom || '',
    prenom: userData?.prenom || '',
    date_naissance: userData?.date_naissance || '',
    lieu_naissance: userData?.lieu_naissance || '',
    province: userData?.province || '',
    region: userData?.region || '',
    ville: userData?.ville || '',
    quartier: userData?.quartier || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.date_naissance) newErrors.date_naissance = 'La date de naissance est requise';
    if (!formData.lieu_naissance.trim()) newErrors.lieu_naissance = 'Le lieu de naissance est requis';
    if (!formData.province) newErrors.province = 'La province est requise';
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur upgrade vendeur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Alert variant="info" className="mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Devenez vendeur sur ZouDou-Souk et commencez à vendre vos produits et services 
        à travers tout le Tchad. Complétez les informations ci-dessous pour finaliser 
        votre inscription en tant que vendeur.
      </Alert>

      <Card className="border-0 bg-light mb-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">
            <i className="fas fa-gift me-2"></i>
            Avantages d'être Vendeur
          </h6>
          <Row>
            <Col md={6}>
              <ul className="mb-0">
                <li>Publication illimitée de produits</li>
                <li>Accès au dashboard vendeur</li>
                <li>Statistiques de ventes détaillées</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="mb-0">
                <li>Paiements sécurisés via mobile money</li>
                <li>Visibilité sur toute la plateforme</li>
                <li>Support client dédié</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <h5 className="fw-bold mb-4">Informations du Vendeur</h5>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nom *</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                isInvalid={!!errors.nom}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom}
              </Form.Control.Feedback>
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
                isInvalid={!!errors.prenom}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.prenom}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date de naissance *</Form.Label>
              <Form.Control
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                isInvalid={!!errors.date_naissance}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.date_naissance}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Lieu de naissance *</Form.Label>
              <Form.Control
                type="text"
                name="lieu_naissance"
                value={formData.lieu_naissance}
                onChange={handleChange}
                isInvalid={!!errors.lieu_naissance}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.lieu_naissance}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Province *</Form.Label>
              <Form.Select
                name="province"
                value={formData.province}
                onChange={handleChange}
                isInvalid={!!errors.province}
                required
              >
                <option value="">Sélectionnez une province</option>
                {provincesTchad.map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.province}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={4}>
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
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Ville *</Form.Label>
              <Form.Control
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                isInvalid={!!errors.ville}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.ville}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Quartier</Form.Label>
          <Form.Control
            type="text"
            name="quartier"
            value={formData.quartier}
            onChange={handleChange}
          />
        </Form.Group>

        <Alert variant="warning" className="mb-4">
          <h6 className="fw-bold">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Important
          </h6>
          <p className="mb-0">
            En devenant vendeur, vous acceptez les conditions générales de vente 
            et vous engagez à fournir des informations exactes. Une vérification 
            supplémentaire (KYB) pourra être requise pour certains types de produits.
          </p>
        </Alert>

        <div className="text-center">
          <Button 
            variant="success" 
            type="submit" 
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Traitement en cours...
              </>
            ) : (
              <>
                <i className="fas fa-store me-2"></i>
                Devenir Vendeur
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpgradeVendeur;