import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import { servicesAPI } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from '../components/services/AddServiceForm';

const ServiceManagement = () => {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleStatusChange = async (serviceId, newStatus) => {
    try {
      await servicesAPI.update(serviceId, { is_active: newStatus });
      loadServices(); // Recharger la liste
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const getServiceIcon = (type) => {
    const icons = {
      'ZIZ': 'fas fa-bolt',
      'STE': 'fas fa-tint',
      'TAXE': 'fas fa-landmark',
      'telecom': 'fas fa-wifi',
      'transport': 'fas fa-bus',
      'education': 'fas fa-graduation-cap',
      'sante': 'fas fa-heartbeat',
      'autre': 'fas fa-cog'
    };
    return icons[type] || 'fas fa-cog';
  };

  const getServiceColor = (type) => {
    const colors = {
      'ZIZ': 'warning',
      'STE': 'info',
      'TAXE': 'success',
      'telecom': 'primary',
      'transport': 'secondary',
      'education': 'info',
      'sante': 'danger',
      'autre': 'dark'
    };
    return colors[type] || 'secondary';
  };

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Accès réservé aux administrateurs</h3>
          <p className="text-muted">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Gestion des Services Partenaires</h1>
              <p className="text-muted">Administrez les services partenaires de ZouDou-Souk</p>
            </div>
            <AddServiceForm />
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-concierge-bell me-2"></i>
                Services Partenaires ({services.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-2 text-muted">Chargement des services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-concierge-bell fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun service partenaire</h5>
                  <p className="text-muted">Commencez par ajouter votre premier service partenaire</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Type</th>
                        <th>Entreprise</th>
                        <th>Contact</th>
                        <th>Zones</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => (
                        <tr key={service.id}>
                          <td onClick={() => handleServiceClick(service)} style={{ cursor: 'pointer' }}>
                            <div className="d-flex align-items-center">
                              {service.logo ? (
                                <img 
                                  src={service.logo} 
                                  alt={service.nom}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded me-3"
                                />
                              ) : (
                                <div 
                                  className={`bg-${getServiceColor(service.type)} text-white rounded d-flex align-items-center justify-content-center me-3`}
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className={getServiceIcon(service.type)}></i>
                                </div>
                              )}
                              <div>
                                <strong>{service.nom}</strong>
                                <br />
                                <small className="text-muted">
                                  {service.description?.substring(0, 50)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg={getServiceColor(service.type)}>
                              {service.type}
                            </Badge>
                          </td>
                          <td>
                            <strong>{service.entreprise_nom}</strong>
                          </td>
                          <td>
                            <small>
                              {service.chef_nom}
                              <br />
                              {service.chef_phone}
                            </small>
                          </td>
                          <td>
                            <small>
                              {service.zones_couvertes && service.zones_couvertes.length > 0 
                                ? `${service.zones_couvertes.length} province(s)`
                                : 'Non spécifié'
                              }
                            </small>
                          </td>
                          <td>
                            {service.is_active ? (
                              <Badge bg="success">Actif</Badge>
                            ) : (
                              <Badge bg="secondary">Inactif</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleServiceClick(service)}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button 
                                size="sm" 
                                variant={service.is_active ? "outline-warning" : "outline-success"}
                                onClick={() => handleStatusChange(service.id, !service.is_active)}
                              >
                                <i className={`fas fa-${service.is_active ? 'pause' : 'play'}`}></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de détails du service */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <div>
              <Row className="mb-3">
                <Col md={3}>
                  {selectedService.logo ? (
                    <img 
                      src={selectedService.logo} 
                      alt={selectedService.nom}
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div 
                      className={`bg-${getServiceColor(selectedService.type)} text-white rounded d-flex align-items-center justify-content-center`}
                      style={{ width: '100px', height: '100px' }}
                    >
                      <i className={`${getServiceIcon(selectedService.type)} fa-2x`}></i>
                    </div>
                  )}
                </Col>
                <Col md={9}>
                  <h4>{selectedService.nom}</h4>
                  <Badge bg={getServiceColor(selectedService.type)} className="mb-2">
                    {selectedService.type}
                  </Badge>
                  <p className="text-muted">{selectedService.description}</p>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h6 className="fw-bold">Entreprise</h6>
                  <p>{selectedService.entreprise_nom}</p>

                  <h6 className="fw-bold">Contact</h6>
                  <p>
                    {selectedService.chef_nom}<br />
                    {selectedService.chef_phone}<br />
                    {selectedService.chef_email}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold">Site Web</h6>
                  <p>
                    {selectedService.website ? (
                      <a href={selectedService.website} target="_blank" rel="noopener noreferrer">
                        {selectedService.website}
                      </a>
                    ) : 'Non spécifié'}
                  </p>

                  <h6 className="fw-bold">Statut</h6>
                  <p>
                    {selectedService.is_active ? (
                      <Badge bg="success">Actif</Badge>
                    ) : (
                      <Badge bg="secondary">Inactif</Badge>
                    )}
                  </p>
                </Col>
              </Row>

              {selectedService.zones_couvertes && selectedService.zones_couvertes.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-bold">Zones de Couverture</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {selectedService.zones_couvertes.map((zone, index) => (
                      <Badge key={index} bg="outline-primary" text="primary" className="me-1 mb-1">
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.api_endpoint && (
                <div className="mt-3">
                  <h6 className="fw-bold">Configuration API</h6>
                  <p>
                    <small className="text-muted">Endpoint:</small><br />
                    <code>{selectedService.api_endpoint}</code>
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </Button>
          <Button variant="primary">
            <i className="fas fa-edit me-2"></i>
            Modifier
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiceManagement;