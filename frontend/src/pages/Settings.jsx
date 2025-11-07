import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // États pour les différents formulaires
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    date_naissance: '',
    lieu_naissance: '',
    province: '',
    region: '',
    ville: '',
    quartier: ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_transactions: true,
    email_promotions: false,
    sms_transactions: true,
    sms_important: true,
    push_notifications: true,
    newsletter: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profile_public: false,
    show_phone: false,
    show_email: false,
    data_analytics: true,
    marketing_emails: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        phone: user.phone || '',
        date_naissance: user.date_naissance || '',
        lieu_naissance: user.lieu_naissance || '',
        province: user.province || '',
        region: user.region || '',
        ville: user.ville || '',
        quartier: user.quartier || ''
      });
    }
  }, [user]);

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(profileData);
      setSuccess('Profil mis à jour avec succès');
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setSaving(false);
      return;
    }

    // Simuler la mise à jour du mot de passe
    setTimeout(() => {
      setSuccess('Mot de passe mis à jour avec succès');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSaving(false);
    }, 2000);
  };

  const handleNotificationChange = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAccountDeletion = () => {
    // Logique de suppression de compte
    setShowDeleteModal(false);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Paramètres</h1>
          <p className="text-muted">
            Gérez vos préférences et paramètres de compte
          </p>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {/* Profil */}
        <Tab eventKey="profile" title={
          <span>
            <i className="fas fa-user me-2"></i>
            Profil
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Informations Personnelles</h5>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form onSubmit={handleProfileSave}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nom *</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.nom}
                            onChange={(e) => setProfileData({...profileData, nom: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prénom *</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.prenom}
                            onChange={(e) => setProfileData({...profileData, prenom: e.target.value})}
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
                            value={profileData.email}
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
                            value={profileData.phone}
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
                          <Form.Label>Date de Naissance</Form.Label>
                          <Form.Control
                            type="date"
                            value={profileData.date_naissance}
                            onChange={(e) => setProfileData({...profileData, date_naissance: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Lieu de Naissance</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.lieu_naissance}
                            onChange={(e) => setProfileData({...profileData, lieu_naissance: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Province</Form.Label>
                          <Form.Select
                            value={profileData.province}
                            onChange={(e) => setProfileData({...profileData, province: e.target.value})}
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
                            value={profileData.region}
                            onChange={(e) => setProfileData({...profileData, region: e.target.value})}
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
                            value={profileData.ville}
                            onChange={(e) => setProfileData({...profileData, ville: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quartier</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.quartier}
                            onChange={(e) => setProfileData({...profileData, quartier: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Photo de Profil</h5>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="mb-3">
                    {user?.photo ? (
                      <img 
                        src={user.photo} 
                        alt="Profile" 
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                        style={{ width: '150px', height: '150px' }}
                      >
                        <i className="fas fa-user fa-3x"></i>
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      PNG, JPG max 2MB
                    </Form.Text>
                  </Form.Group>
                  <Button variant="outline-primary" className="w-100">
                    <i className="fas fa-camera me-2"></i>
                    Changer la photo
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Sécurité */}
        <Tab eventKey="security" title={
          <span>
            <i className="fas fa-shield-alt me-2"></i>
            Sécurité
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Mot de Passe</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSecuritySave}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mot de Passe Actuel</Form.Label>
                      <Form.Control
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nouveau Mot de Passe</Form.Label>
                      <Form.Control
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmer le Nouveau Mot de Passe</Form.Label>
                      <Form.Control
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        required
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? 'Mise à jour...' : 'Changer le mot de passe'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">Sécurité du Compte</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Authentification à Deux Facteurs</h6>
                      <p className="text-muted mb-0">
                        Ajoutez une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Activer
                    </Button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Sessions Actives</h6>
                      <p className="text-muted mb-0">
                        Gérer les appareils connectés
                      </p>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Voir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Notifications */}
        <Tab eventKey="notifications" title={
          <span>
            <i className="fas fa-bell me-2"></i>
            Notifications
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Préférences de Notification</h5>
                </Card.Header>
                <Card.Body>
                  <h6 className="fw-bold mb-3">Notifications par Email</h6>
                  {Object.entries(notificationSettings)
                    .filter(([key]) => key.startsWith('email'))
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="switch"
                        id={key}
                        label={key.replace('email_', '').replace('_', ' ')}
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="mb-3"
                      />
                    ))}

                  <h6 className="fw-bold mb-3 mt-4">Notifications SMS</h6>
                  {Object.entries(notificationSettings)
                    .filter(([key]) => key.startsWith('sms'))
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="switch"
                        id={key}
                        label={key.replace('sms_', '').replace('_', ' ')}
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="mb-3"
                      />
                    ))}

                  <h6 className="fw-bold mb-3 mt-4">Autres</h6>
                  {Object.entries(notificationSettings)
                    .filter(([key]) => !key.startsWith('email') && !key.startsWith('sms'))
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="switch"
                        id={key}
                        label={key.replace('_', ' ')}
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="mb-3"
                      />
                    ))}

                  <Button variant="primary" className="mt-3">
                    Sauvegarder les Préférences
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Confidentialité */}
        <Tab eventKey="privacy" title={
          <span>
            <i className="fas fa-lock me-2"></i>
            Confidentialité
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Paramètres de Confidentialité</h5>
                </Card.Header>
                <Card.Body>
                  <h6 className="fw-bold mb-3">Visibilité du Profil</h6>
                  {Object.entries(privacySettings)
                    .filter(([key]) => key.startsWith('profile') || key.startsWith('show'))
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="switch"
                        id={key}
                        label={key.replace(/_/g, ' ')}
                        checked={value}
                        onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                        className="mb-3"
                      />
                    ))}

                  <h6 className="fw-bold mb-3 mt-4">Données et Analytics</h6>
                  {Object.entries(privacySettings)
                    .filter(([key]) => !key.startsWith('profile') && !key.startsWith('show'))
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="switch"
                        id={key}
                        label={key.replace(/_/g, ' ')}
                        checked={value}
                        onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                        className="mb-3"
                      />
                    ))}

                  <div className="mt-4">
                    <h6 className="fw-bold mb-2">Télécharger vos données</h6>
                    <p className="text-muted mb-3">
                      Téléchargez une copie de vos données personnelles
                    </p>
                    <Button variant="outline-primary">
                      <i className="fas fa-download me-2"></i>
                      Télécharger mes données
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mt-4 border-danger">
                <Card.Header className="bg-danger text-white">
                  <h5 className="mb-0">Zone de Danger</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-danger mb-1">Supprimer le Compte</h6>
                      <p className="text-muted mb-0">
                        Cette action est irréversible. Toutes vos données seront supprimées.
                      </p>
                    </div>
                    <Button 
                      variant="outline-danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Supprimer le Compte
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Modal de suppression de compte */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Supprimer le Compte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
          <div className="alert alert-danger">
            <strong>Attention :</strong> Cette action est définitive. Toutes vos données, 
            transactions, et historiques seront supprimés et ne pourront pas être récupérés.
          </div>
          <Form.Group className="mb-3">
            <Form.Label>
              Tapez <strong>SUPPRIMER</strong> pour confirmer
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="SUPPRIMER"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleAccountDeletion}>
            Supprimer Définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Settings;