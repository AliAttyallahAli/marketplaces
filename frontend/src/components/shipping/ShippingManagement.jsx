import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';

const ShippingManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    // Données mock des livraisons
    const mockShipments = [
      {
        id: 'SHIP-001',
        orderId: 'CMD-1234',
        customer: 'Fatime Hassan',
        address: 'Rue du Marché, N°45, N\'Djamena',
        status: 'delivered',
        carrier: 'ZouDou Express',
        trackingNumber: 'ZD123456789',
        createdAt: new Date('2024-01-15'),
        deliveredAt: new Date('2024-01-18'),
        items: ['iPhone 13 Pro', 'Coque protectrice']
      },
      {
        id: 'SHIP-002',
        orderId: 'CMD-1235',
        customer: 'Mahamat Ali',
        address: 'Quartier Farcha, Rue 45, N°12',
        status: 'in_transit',
        carrier: 'Tchad Logistique',
        trackingNumber: 'TL987654321',
        createdAt: new Date('2024-01-16'),
        estimatedDelivery: new Date('2024-01-20'),
        items: ['Sac artisanal', 'Tissu traditionnel']
      },
      {
        id: 'SHIP-003',
        orderId: 'CMD-1236',
        customer: 'Amina Ousmane',
        address: 'Avenue Charles de Gaulle, N°89',
        status: 'pending',
        carrier: 'ZouDou Express',
        trackingNumber: 'ZD234567890',
        createdAt: new Date('2024-01-17'),
        items: ['Riz local 25kg x2']
      },
      {
        id: 'SHIP-004',
        orderId: 'CMD-1237',
        customer: 'Ibrahim Djibrine',
        address: 'Quartier Moursal, Rue 34, N°67',
        status: 'cancelled',
        carrier: 'Tchad Logistique',
        trackingNumber: 'TL876543210',
        createdAt: new Date('2024-01-14'),
        cancelledAt: new Date('2024-01-15'),
        items: ['Powerbank 20000mAh']
      }
    ];

    setShipments(mockShipments);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'En attente' },
      confirmed: { variant: 'info', text: 'Confirmée' },
      in_transit: { variant: 'primary', text: 'En cours' },
      out_for_delivery: { variant: 'success', text: 'En livraison' },
      delivered: { variant: 'success', text: 'Livrée' },
      cancelled: { variant: 'danger', text: 'Annulée' },
      returned: { variant: 'secondary', text: 'Retournée' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleTrackShipment = (shipment) => {
    setSelectedShipment(shipment);
    setShowTrackingModal(true);
  };

  const updateShipmentStatus = (shipmentId, newStatus) => {
    setShipments(prev => 
      prev.map(shipment => 
        shipment.id === shipmentId 
          ? { ...shipment, status: newStatus }
          : shipment
      )
    );
  };

  const TrackingModal = () => {
    const trackingEvents = [
      { date: '2024-01-17 14:30', status: 'Commande préparée', location: 'Entrepôt principal' },
      { date: '2024-01-17 16:15', status: 'Prise en charge', location: 'Centre de tri' },
      { date: '2024-01-18 09:00', status: 'En cours de livraison', location: 'N\'Djamena' },
      { date: '2024-01-18 14:20', status: 'Livrée', location: 'Chez le client' }
    ];

    return (
      <Modal show={showTrackingModal} onHide={() => setShowTrackingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Suivi de Livraison - {selectedShipment?.trackingNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedShipment && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Informations de livraison</h6>
                  <p className="mb-1">
                    <strong>Client:</strong> {selectedShipment.customer}
                  </p>
                  <p className="mb-1">
                    <strong>Adresse:</strong> {selectedShipment.address}
                  </p>
                  <p className="mb-1">
                    <strong>Transporteur:</strong> {selectedShipment.carrier}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Statut actuel</h6>
                  <div className="mb-2">{getStatusBadge(selectedShipment.status)}</div>
                  {selectedShipment.estimatedDelivery && (
                    <p className="mb-1">
                      <strong>Livraison estimée:</strong><br />
                      {selectedShipment.estimatedDelivery.toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </Col>
              </Row>

              <h6 className="mb-3">Historique du suivi</h6>
              <div className="tracking-timeline">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="tracking-event d-flex mb-3">
                    <div className="timeline-marker me-3">
                      <div className="timeline-dot"></div>
                      {index < trackingEvents.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong>{event.status}</strong>
                        <small className="text-muted">
                          {new Date(event.date).toLocaleString('fr-FR')}
                        </small>
                      </div>
                      <p className="mb-0 text-muted">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTrackingModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="shipping-management">
      <Card className="border-0 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestion des Livraisons</h5>
          <Button variant="primary" size="sm">
            <i className="fas fa-plus me-2"></i>
            Nouvelle Expédition
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID Livraison</th>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Transporteur</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(shipment => (
                  <tr key={shipment.id}>
                    <td>
                      <strong>{shipment.id}</strong>
                      <br />
                      <small className="text-muted">{shipment.trackingNumber}</small>
                    </td>
                    <td>{shipment.orderId}</td>
                    <td>
                      <div>
                        <strong>{shipment.customer}</strong>
                        <br />
                        <small className="text-muted">
                          {shipment.items.slice(0, 2).join(', ')}
                          {shipment.items.length > 2 && '...'}
                        </small>
                      </div>
                    </td>
                    <td>{shipment.carrier}</td>
                    <td>{getStatusBadge(shipment.status)}</td>
                    <td>
                      <small>
                        {shipment.createdAt.toLocaleDateString('fr-FR')}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleTrackShipment(shipment)}
                        >
                          <i className="fas fa-truck"></i>
                        </Button>
                        <Button size="sm" variant="outline-success">
                          <i className="fas fa-edit"></i>
                        </Button>
                        {shipment.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => updateShipmentStatus(shipment.id, 'cancelled')}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <TrackingModal />

      <style>{`
        .tracking-timeline {
          position: relative;
        }
        
        .timeline-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .timeline-dot {
          width: 12px;
          height: 12px;
          background: #0d6efd;
          border-radius: 50%;
          z-index: 2;
        }
        
        .timeline-line {
          width: 2px;
          height: 40px;
          background: #dee2e6;
          margin-top: 4px;
        }
        
        .tracking-event:last-child .timeline-line {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ShippingManagement;