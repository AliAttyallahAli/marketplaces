import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { servicesAPI } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const AddServiceForm = () => {
  const { user, isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [serviceData, setServiceData] = useState({
    nom: '',
    type: 'autre',
    entreprise_nom: '',
    chef_nom: '',
    chef_phone: '',
    chef_email: '',
    description: '',
    logo: '',
    website: '',
    api_endpoint: '',
    commission_rate: '0',
    categories: [],
    zones_couvertes: [],
    documents: []
  });

  const serviceTypes = [
    { value: 'ZIZ', label: 'Électricité (ZIZ)' },
    { value: 'STE', label: 'Eau (STE)' },
    { value: 'TAXE', label: 'Taxes Communales' },
    { value: 'telecom', label: 'Télécommunications' },
    { value: 'transport', label: 'Transport' },
    { value: 'education', label: 'Éducation' },
    { value: 'sante', label: 'Santé' },
    { value: 'autre', label: 'Autre Service' }
  ];

  const provincesTchad = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis', 'Toutes les provinces'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'categories' || name === 'zones_couvertes') {
        const updatedArray = checked 
          ? [...serviceData[name], value]
          : serviceData[name].filter(item => item !== value);
        setServiceData(prev => ({ ...prev, [name]: updatedArray }));
      }
    } else {
      setServiceData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Simuler l'upload des fichiers
    const fileUrls = files.map(file => URL.createObjectURL(file));
    
    if (e.target.name === 'logo') {
      setServiceData(prev => ({ ...prev, logo: fileUrls[0] }));
    } else if (e.target.name === 'documents') {
      setServiceData(prev => ({ ...prev, documents: fileUrls }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await servicesAPI.create(serviceData);
      setSuccess('Service partenaire ajouté avec succès!');
      setServiceData({
        nom: '',
        type: 'autre',
        entreprise_nom: '',
        chef_nom: '',
        chef_phone: '',
        chef_email: '',
        description: '',
        logo: '',
        website: '',
        api_endpoint: '',
        commission_rate: '0',
        categories: [],
        zones_couvertes: [],
        documents: []
      });
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de l\'ajout du service');
    } finally {
      setLoading(false);
    }
  };

  const ServiceTypeInfo = ({ type }) => {
    const info = {
      ZIZ: { icon: 'fas fa-bolt', color: 'warning', description: 'Service d\'électricité' },
      STE: { icon: 'fas fa-tint', color: 'info', description: 'Service d\'eau potable' },
      TAXE: { icon: 'fas fa-landmark', color: 'success', description: 'Services fiscaux' },
      telecom: { icon: 'fas fa-wifi', color: 'primary', description: 'Télécommunications' },
      transport: { icon: 'fas fa-bus', color: 'secondary', description: 'Transport et mobilité' },
      education: { icon: 'fas fa-graduation-cap', color: 'info', description: 'Services éducatifs' },
      sante: { icon: 'fas fa-heartbeat', color: 'danger', description: 'Services de santé' },
      autre: { icon: 'fas fa-cog', color: 'dark', description: 'Autre type de service' }
    };

    const serviceInfo = info[type] || info.autre;

    return (
      <div className={`d-flex align-items-center p-3 bg-${serviceInfo.color} bg-opacity-10 rounded`}>
        <i className={`${serviceInfo.icon} fa-2x text-${serviceInfo.color} me-3`}></i>
        <div>
          <strong className={`text-${serviceInfo.color}`}>{serviceInfo.description}</strong>
          <br />
          <small className="text-muted">Sélectionnez ce type pour les services {serviceInfo.description.toLowerCase()}</small>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      {isAdmin ? (
        <Button 
          variant="success" 
          onClick={() => setShowModal(true)}
          className="mb-3"
        >
          <i className="fas fa-plus-circle me-2"></i>
          Ajouter un Service Partenaire
        </Button>
      ) : (
        <Card className="border-dashed bg-light mb-4">
          <Card.Body className="text-center p-5">
            <i className="fas fa-building fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">Vous êtes une entreprise de service?</h4>
            <p className="text-muted mb-4">
              Rejoignez ZouDou-Souk et proposez vos services à des milliers d'utilisateurs
            </p>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              size="lg"
            >
              <i className="fas fa-handshake me-2"></i>
              Devenir Partenaire
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Modal d'ajout de service */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-handshake me-2 text-primary"></i>
            {isAdmin ? 'Ajouter un Service Partenaire' : 'Devenir Partenaire ZouDou-Souk'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Informations de Base */}
            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Informations de Base
              </h5>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom du Service *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      value={serviceData.nom}
                      onChange={handleChange}
                      placeholder="Ex: MonService Tchad"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type de Service *</Form.Label>
                    <Form.Select
                      name="type"
                      value={serviceData.type}
                      onChange={handleChange}
                      required
                    >
                      {serviceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <ServiceTypeInfo type={serviceData.type} />

              <Form.Group className="mb-3">
                <Form.Label>Description du Service *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={serviceData.description}
                  onChange={handleChange}
                  placeholder="Décrivez en détail les services proposés..."
                  required
                />
              </Form.Group>
            </div>

            {/* Informations de l'Entreprise */}
            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3">
                <i className="fas fa-building me-2 text-primary"></i>
                Informations de l'Entreprise
              </h5>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom de l'Entreprise *</Form.Label>
                    <Form.Control
                      type="text"
                      name="entreprise_nom"
                      value={serviceData.entreprise_nom}
                      onChange={handleChange}
                      placeholder="Raison sociale de l'entreprise"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Web</Form.Label>
                    <Form.Control
                      type="url"
                      name="website"
                      value={serviceData.website}
                      onChange={handleChange}
                      placeholder="https://www.votre-entreprise.td"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Logo de l'Entreprise</Form.Label>
                <Form.Control
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Form.Text className="text-muted">
                  Format recommandé: PNG ou JPG, max 2MB
                </Form.Text>
                {serviceData.logo && (
                  <div className="mt-2">
                    <img 
                      src={serviceData.logo} 
                      alt="Logo preview" 
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                      className="border rounded p-1"
                    />
                  </div>
                )}
              </Form.Group>
            </div>

            {/* Contact du Responsable */}
            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3">
                <i className="fas fa-user-tie me-2 text-primary"></i>
                Contact du Responsable
              </h5>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom du Responsable *</Form.Label>
                    <Form.Control
                      type="text"
                      name="chef_nom"
                      value={serviceData.chef_nom}
                      onChange={handleChange}
                      placeholder="Nom et prénom"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Téléphone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="chef_phone"
                      value={serviceData.chef_phone}
                      onChange={handleChange}
                      placeholder="+235 XX XX XX XX"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="chef_email"
                      value={serviceData.chef_email}
                      onChange={handleChange}
                      placeholder="responsable@entreprise.td"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Configuration Technique */}
            {isAdmin && (
              <div className="mb-4">
                <h5 className="fw-bold border-bottom pb-2 mb-3">
                  <i className="fas fa-cogs me-2 text-primary"></i>
                  Configuration Technique
                </h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Endpoint API</Form.Label>
                      <Form.Control
                        type="url"
                        name="api_endpoint"
                        value={serviceData.api_endpoint}
                        onChange={handleChange}
                        placeholder="https://api.votre-service.td"
                      />
                      <Form.Text className="text-muted">
                        URL pour l'intégration technique avec votre système
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Taux de Commission (%)</Form.Label>
                      <Form.Control
                        type="number"
                        name="commission_rate"
                        value={serviceData.commission_rate}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        step="0.1"
                      />
                      <Form.Text className="text-muted">
                        Pourcentage reversé à ZouDou-Souk sur chaque transaction
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {/* Zones de Couverture */}
            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                Zones de Couverture
              </h5>
              
              <Form.Label>Sélectionnez les provinces couvertes *</Form.Label>
              <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Row>
                  {provincesTchad.map(province => (
                    <Col md={6} key={province}>
                      <Form.Check
                        type="checkbox"
                        name="zones_couvertes"
                        value={province}
                        checked={serviceData.zones_couvertes.includes(province)}
                        onChange={handleChange}
                        label={province}
                        className="mb-2"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>

            {/* Documents Requis */}
            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3">
                <i className="fas fa-file-contract me-2 text-primary"></i>
                Documents Contractuels
              </h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Documents de Partenariat</Form.Label>
                <Form.Control
                  type="file"
                  name="documents"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Form.Text className="text-muted">
                  Contrat de partenariat, certificats, agréments, etc. (PDF, Word, Images)
                </Form.Text>
                
                {serviceData.documents.length > 0 && (
                  <div className="mt-2">
                    <strong>Documents sélectionnés:</strong>
                    <ul className="mb-0">
                      {serviceData.documents.map((doc, index) => (
                        <li key={index}>
                          <small>Document {index + 1}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
            </div>

            {/* Informations importantes */}
            <div className="alert alert-info">
              <h6 className="fw-bold">
                <i className="fas fa-info-circle me-2"></i>
                Informations importantes
              </h6>
              <ul className="mb-0 small">
                <li>Tous les champs marqués d'un * sont obligatoires</li>
                <li>Notre équipe étudiera votre demande sous 48 heures</li>
                <li>Vous recevrez une confirmation par email</li>
                <li>Une réunion de lancement sera programmée</li>
              </ul>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Traitement...
                </>
              ) : isAdmin ? (
                'Ajouter le Service'
              ) : (
                'Soumettre la Demande'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddServiceForm;