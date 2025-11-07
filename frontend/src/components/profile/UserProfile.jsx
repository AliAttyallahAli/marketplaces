import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge, Modal } from 'react-bootstrap';
import { userAPI } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profile);
      setSuccess('Profil mis à jour avec succès');
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simuler l'upload de la photo
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, photo: e.target.result }));
        setShowPhotoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      'admin': 'warning',
      'vendeur': 'success',
      'client': 'primary'
    };
    return variants[role] || 'secondary';
  };

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
    <div className="user-profile">
      <Row>
        <Col lg={4} className="mb-4">
          {/* Carte de profil */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="profile-avatar mb-3">
                {profile?.photo ? (
                  <img 
                    src={profile.photo} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <i className="fas fa-user fa-3x"></i>
                  </div>
                )}
              </div>
              
              <h4 className="fw-bold mb-1">{profile?.prenom} {profile?.nom}</h4>
              <Badge bg={getRoleBadge(profile?.role)} className="mb-2">
                {profile?.role?.toUpperCase()}
              </Badge>
              
              <p className="text-muted mb-2">{profile?.email}</p>
              <p className="text-muted mb-3">{profile?.phone}</p>

              {/* Statut de vérification */}
              <div className="verification-status mb-3">
                {profile?.kyc_verified ? (
                  <Badge bg="success" className="me-2">
                    <i className="fas fa-check me-1"></i>
                    KYC Vérifié
                  </Badge>
                ) : (
                  <Badge bg="warning" className="me-2">
                    <i className="fas fa-clock me-1"></i>
                    KYC En attente
                  </Badge>
                )}
                
                {profile?.kyb_verified && (
                  <Badge bg="success">
                    <i className="fas fa-check me-1"></i>
                    KYB Vérifié
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100 mb-2"
                onClick={() => setShowPhotoModal(true)}
              >
                <i className="fas fa-camera me-2"></i>
                Changer la photo
              </Button>
            </Card.Body>
          </Card>

          {/* Informations de compte */}
          <Card className="border-0 shadow-sm mt-3">
            <Card.Body>
              <h6 className="fw-bold mb-3">Informations de compte</h6>
              <div className="account-info">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Membre depuis:</small>
                  <small>{new Date(profile?.created_at).toLocaleDateString('fr-FR')}</small>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Dernière connexion:</small>
                  <small>Aujourd'hui</small>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Statut:</small>
                  <Badge bg="success" className="small">Actif</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Informations Personnelles</h5>
                <Badge bg="light" text="dark">
                  {profile?.kyc_verified ? 'Profil complet' : 'Profil incomplet'}
                </Badge>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSaveProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        value={profile?.nom || ''}
                        onChange={handleInputChange}
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
                        value={profile?.prenom || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={profile?.email || ''}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        L'email ne peut pas être modifié
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="tel"
                        value={profile?.phone || ''}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Le téléphone ne peut pas être modifié
                      </Form.Text>
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
                        value={profile?.date_naissance || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Lieu de naissance</Form.Label>
                      <Form.Control
                        type="text"
                        name="lieu_naissance"
                        value={profile?.lieu_naissance || ''}
                        onChange={handleInputChange}
                        placeholder="Ville de naissance"
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
                        value={profile?.province || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionnez votre province</option>
                        {provincesTchad.map(province => (
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
                        value={profile?.region || ''}
                        onChange={handleInputChange}
                        placeholder="Votre région"
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
                        value={profile?.ville || ''}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre ville"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quartier</Form.Label>
                      <Form.Control
                        type="text"
                        name="quartier"
                        value={profile?.quartier || ''}
                        onChange={handleInputChange}
                        placeholder="Votre quartier"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sauvegarde...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </Button>
                  <Button variant="outline-secondary" type="button">
                    Annuler
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de changement de photo */}
      <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer la photo de profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Choisir une photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <Form.Text className="text-muted">
              Formats supportés: JPG, PNG, GIF. Taille max: 5MB
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;