import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card, Badge } from 'react-bootstrap'; // Ajouter Badge
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';


const UserProfile = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    nom: userData?.nom || '',
    prenom: userData?.prenom || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    date_naissance: userData?.date_naissance || '',
    lieu_naissance: userData?.lieu_naissance || '',
    province: userData?.province || '',
    region: userData?.region || '',
    ville: userData?.ville || '',
    quartier: userData?.quartier || '',
    photo: userData?.photo || ''
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
    
    // Clear error when user starts typing
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
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    
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
      await userAPI.updateProfile(formData);
      toast.success('Profil mis à jour avec succès!');
      onUpdate(); // Recharger les données
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simuler l'upload de photo
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Informations Personnelles</h5>
        <div>
          <Badge bg={userData?.kyc_verified ? 'success' : 'warning'} className="me-2">
            KYC: {userData?.kyc_verified ? 'Vérifié' : 'En attente'}
          </Badge>
          {userData?.role === 'vendeur' && (
            <Badge bg={userData?.kyb_verified ? 'success' : 'warning'}>
              KYB: {userData?.kyb_verified ? 'Vérifié' : 'En attente'}
            </Badge>
          )}
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Photo de profil */}
          <Col md={3} className="text-center mb-4">
            <div className="mb-3">
              {formData.photo ? (
                <img 
                  src={formData.photo} 
                  alt="Profile" 
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '150px', height: '150px' }}
                >
                  <i className="fas fa-user fa-3x"></i>
                </div>
              )}
            </div>
            <Form.Group>
              <Form.Label className="btn btn-outline-primary btn-sm cursor-pointer">
                <i className="fas fa-camera me-1"></i>
                Changer photo
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="d-none"
                />
              </Form.Label>
            </Form.Group>
          </Col>

          <Col md={9}>
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
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez une province</option>
                    {provincesTchad.map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </Form.Select>
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
                  <Form.Label>Ville</Form.Label>
                  <Form.Control
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                  />
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

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Enregistrer les modifications
                  </>
                )}
              </Button>
              
              <Button variant="outline-secondary" type="button">
                <i className="fas fa-times me-2"></i>
                Annuler
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Informations système */}
      <Card className="mt-4 border-0 bg-light">
        <Card.Body>
          <h6 className="fw-bold mb-3">
            <i className="fas fa-info-circle me-2"></i>
            Informations Système
          </h6>
          <Row>
            <Col md={4}>
              <small className="text-muted d-block">NNI</small>
              <strong>{userData?.nni}</strong>
            </Col>
            <Col md={4}>
              <small className="text-muted d-block">Rôle</small>
              <strong>
                {userData?.role === 'admin' ? 'Administrateur' :
                 userData?.role === 'vendeur' ? 'Vendeur' : 'Client'}
              </strong>
            </Col>
            <Col md={4}>
              <small className="text-muted d-block">Membre depuis</small>
              <strong>
                {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </strong>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserProfile;