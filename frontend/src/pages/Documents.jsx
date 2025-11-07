import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { documentsAPI } from '../services/documents';

const Documents = () => {
  const { isAuthenticated, user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDocuments();
    }
  }, [isAuthenticated]);

  const loadDocuments = async () => {
    try {
      // Simulation de données en attendant l'API
      const mockDocuments = [
        {
          id: 1,
          filename: 'carte_identite.pdf',
          type: 'identity',
          description: 'Carte NNI recto-verso',
          uploaded_at: new Date().toISOString(),
          status: 'approved',
          size: 2048576
        },
        {
          id: 2,
          filename: 'justificatif_domicile.jpg',
          type: 'proof',
          description: 'Facture électricité récente',
          uploaded_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
          size: 1548576
        }
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      // Simulation d'upload
      const newDocument = {
        id: documents.length + 1,
        filename: selectedFile.name,
        type: 'other',
        description: 'Document uploadé',
        uploaded_at: new Date().toISOString(),
        status: 'pending',
        size: selectedFile.size
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const downloadDocument = async (documentId, filename) => {
    try {
      // Simulation de téléchargement
      const blob = new Blob(['Contenu du document simulé'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      kyc: 'fas fa-id-card',
      kyb: 'fas fa-building',
      identity: 'fas fa-user-check',
      contract: 'fas fa-file-contract',
      invoice: 'fas fa-file-invoice',
      visa: 'fas fa-credit-card',
      proof: 'fas fa-home',
      other: 'fas fa-file'
    };
    return icons[type] || 'fas fa-file';
  };

  const getDocumentBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      expired: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Accès non autorisé</h3>
          <p className="text-muted">Veuillez vous connecter pour accéder à vos documents</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Mes Documents</h1>
              <p className="text-muted">Gérez tous vos documents et justificatifs</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload me-2"></i>
              Ajouter un document
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-folder me-2"></i>
                Documents ({documents.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {documents.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun document</h5>
                  <p className="text-muted">
                    {user?.role === 'client' 
                      ? 'Téléchargez vos documents KYC pour devenir vendeur'
                      : 'Commencez par ajouter vos premiers documents'
                    }
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Ajouter un document
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Type</th>
                        <th>Date d'ajout</th>
                        <th>Statut</th>
                        <th>Taille</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(document => (
                        <tr key={document.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`${getDocumentIcon(document.type)} text-primary me-3 fa-lg`}></i>
                              <div>
                                <strong>{document.filename}</strong>
                                {document.description && (
                                  <div>
                                    <small className="text-muted">{document.description}</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="outline-secondary" text="secondary">
                              {document.type}
                            </Badge>
                          </td>
                          <td>
                            {new Date(document.uploaded_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <Badge bg={getDocumentBadge(document.status)}>
                              {document.status}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {(document.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => downloadDocument(document.id, document.filename)}
                              >
                                <i className="fas fa-download"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
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
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section Documents Requis */}
      {user?.role === 'client' && (
        <Row className="mt-4">
          <Col>
            <Card className="border-warning">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Documents Requis pour Devenir Vendeur
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold">Documents d'Identité</h6>
                    <ul>
                      <li>Carte NNI recto-verso</li>
                      <li>Selfie avec pièce d'identité</li>
                      <li>Justificatif de domicile</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">Statut de Vérification</h6>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Vérification KYC:</span>
                      <Badge bg={user?.kyc_verified ? 'success' : 'warning'}>
                        {user?.kyc_verified ? 'Vérifié' : 'En attente'}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Statut vendeur:</span>
                      <Badge bg={user?.role === 'vendeur' ? 'success' : 'secondary'}>
                        {user?.role === 'vendeur' ? 'Actif' : 'Non actif'}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal d'upload */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un document</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFileUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Sélectionner un fichier</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Form.Text className="text-muted">
                Formats acceptés: PDF, JPG, PNG, DOC, DOCX (Max: 10MB)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type de document</Form.Label>
              <Form.Select>
                <option value="identity">Pièce d'identité</option>
                <option value="proof">Justificatif de domicile</option>
                <option value="contract">Contrat</option>
                <option value="other">Autre</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Description (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description du document..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={!selectedFile}
            >
              <i className="fas fa-upload me-2"></i>
              Téléverser
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Documents;