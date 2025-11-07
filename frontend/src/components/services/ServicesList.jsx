import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../../services/services';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type) => {
    const icons = {
      'ZIZ': 'fas fa-bolt',
      'STE': 'fas fa-tint',
      'TAXE': 'fas fa-landmark',
      'autre': 'fas fa-concierge-bell'
    };
    return icons[type] || 'fas fa-cog';
  };

  const getServiceColor = (type) => {
    const colors = {
      'ZIZ': 'warning',
      'STE': 'info',
      'TAXE': 'success',
      'autre': 'primary'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="services-list">
      <Row>
        {services.map(service => (
          <Col lg={4} md={6} key={service.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 service-card">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <div 
                    className={`icon-wrapper bg-${getServiceColor(service.type)} rounded-circle mx-auto mb-3`}
                    style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className={`${getServiceIcon(service.type)} fa-2x text-white`}></i>
                  </div>
                  
                  <Badge bg={getServiceColor(service.type)} className="mb-2">
                    {service.type}
                  </Badge>
                  
                  <Card.Title className="h5 mt-2">{service.nom}</Card.Title>
                  <Card.Text className="text-muted">
                    {service.description}
                  </Card.Text>
                </div>

                <div className="service-info mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">Entreprise:</small>
                    <small className="fw-bold">{service.entreprise_nom}</small>
                  </div>
                  {service.chef_nom && (
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">Responsable:</small>
                      <small>{service.chef_nom}</small>
                    </div>
                  )}
                  {service.chef_phone && (
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Contact:</small>
                      <small>{service.chef_phone}</small>
                    </div>
                  )}
                </div>

                <Button 
                  as={Link} 
                  to={`/services/payment/${service.type.toLowerCase()}`}
                  variant={getServiceColor(service.type)}
                  className="w-100"
                >
                  <i className="fas fa-file-invoice me-2"></i>
                  Payer une facture
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Ajouter un service (pour admin) */}
      <Row className="mt-4">
        <Col className="text-center">
          <Card className="border-dashed bg-light">
            <Card.Body className="p-5">
              <i className="fas fa-plus-circle fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">Ajouter un service</h5>
              <p className="text-muted mb-3">
                Vous êtes une entreprise de service? Rejoignez ZouDou-Souk
              </p>
              <Button variant="outline-primary">
                <i className="fas fa-building me-2"></i>
                Devenir partenaire
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServicesList;