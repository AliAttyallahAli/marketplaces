import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { documentsAPI } from '../../services/documents';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await documentsAPI.getUserDocuments();
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      'kyc': 'fas fa-id-card',
      'kyb': 'fas fa-building',
      'identity': 'fas fa-user-check',
      'contract': 'fas fa-file-contract',
      'other': 'fas fa-file'
    };
    return icons[type] || 'fas fa-file';
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    };
    return variants[status] || 'secondary';
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Mes Documents</h5>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="fas fa-upload me-2"></i>
            Ajouter un document
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {documents.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Aucun document</h5>
            <p className="text-muted">Commencez par ajouter vos premiers documents</p>
          </div>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <i className={`${getDocumentIcon(doc.type)} text-primary me-2`}></i>
                    {doc.filename}
                  </td>
                  <td>
                    <Badge bg="outline-secondary" text="secondary">
                      {doc.type}
                    </Badge>
                  </td>
                  <td>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <Badge bg={getStatusBadge(doc.status)}>
                      {doc.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary">
                      <i className="fas fa-download"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* Modal d'upload */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Sélectionner un fichier</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type de document</Form.Label>
              <Form.Select>
                <option value="identity">Pièce d'identité</option>
                <option value="proof">Justificatif</option>
                <option value="other">Autre</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Annuler
          </Button>
          <Button variant="primary">Téléverser</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default DocumentsList;