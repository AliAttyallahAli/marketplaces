import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { servicesAPI } from '../../services/services';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    entreprise_nom: '',
    chef_nom: '',
    chef_phone: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services || []);
    } catch (error) {
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
        setSuccess('Service mis à jour avec succès');
      } else {
        await servicesAPI.create(formData);
        setSuccess('Service créé avec succès');
      }
      
      setShowModal(false);
      setEditingService(null);
      setFormData({
        nom: '',
        type: '',
        entreprise_nom: '',
        chef_nom: '',
        chef_phone: '',
        description: '',
        logo: ''
      });
      loadServices();
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      nom: service.nom,
      type: service.type,
      entreprise_nom: service.entreprise_nom,
      chef_nom: service.chef_nom || '',
      chef_phone: service.chef_phone || '',
      description: service.description || '',
      logo: service.logo || ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      nom: '',
      type: '',
      entreprise_nom: '',
      chef_nom: '',
      chef_phone: '',
      description: '',
      logo: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service?')) {
      try {
        await servicesAPI.delete(serviceId);
        setSuccess('Service supprimé avec succès');
        loadServices();
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const getServiceTypeBadge = (type) => {
    const variants = {
      'ZIZ': 'warning',
      'STE': 'info',
      'TAXE': 'success',
      'autre': 'secondary'
    };
    return variants[type] || 'secondary';
  };

  return (
    <div className="service-management">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestion des Services</h5>
          <Button variant="primary" onClick={handleCreate}>
            <i className="fas fa-plus me-2"></i>
            Ajouter un Service
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Entreprise</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.nom}</strong>
                      {service.description && (
                        <div>
                          <small className="text-muted">
                            {service.description.substring(0, 50)}...
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge bg={getServiceTypeBadge(service.type)}>
                        {service.type}
                      </Badge>
                    </td>
                    <td>{service.entreprise_nom}</td>
                    <td>
                      {service.chef_nom && (
                        <div>
                          <small>{service.chef_nom}</small>
                          <br />
                          <small className="text-muted">{service.chef_phone}</small>
                        </div>
                      )}
                    </td>
                    <td>
                      {service.is_active ? (
                        <Badge bg="success">Actif</Badge>
                      ) : (
                        <Badge bg="danger">Inactif</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(service)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(service.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal d'édition/création */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingService ? 'Modifier le Service' : 'Nouveau Service'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du service *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de service *</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="ZIZ">ZIZ - Électricité</option>
                    <option value="STE">STE - Eau</option>
                    <option value="TAXE">TAXE - Taxes</option>
                    <option value="autre">Autre service</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nom de l'entreprise *</Form.Label>
              <Form.Control
                type="text"
                value={formData.entreprise_nom}
                onChange={(e) => setFormData({...formData, entreprise_nom: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du responsable</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.chef_nom}
                    onChange={(e) => setFormData({...formData, chef_nom: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone du responsable</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.chef_phone}
                    onChange={(e) => setFormData({...formData, chef_phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Logo (URL)</Form.Label>
              <Form.Control
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingService ? 'Mettre à jour' : 'Créer le service'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;