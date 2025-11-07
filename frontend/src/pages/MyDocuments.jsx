import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const MyDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Données simulées - À remplacer par l'API réelle
  const mockDocuments = [
    {
      id: 1,
      nom: 'Carte Nationale d\'Identité',
      type: 'piece_identite',
      statut: 'approuvé',
      date_upload: '2024-01-15',
      date_expiration: '2030-01-15',
      fichier: 'cnj_12345678.pdf',
      taille: '2.5 MB'
    },
    {
      id: 2,
      nom: 'Justificatif de Domicile',
      type: 'domicile',
      statut: 'en_attente',
      date_upload: '2024-01-16',
      date_expiration: '2024-07-16',
      fichier: 'facture_electricite.pdf',
      taille: '1.8 MB'
    },
    {
      id: 3,
      nom: 'Photo avec Pièce d\'Identité',
      type: 'selfie',
      statut: 'rejeté',
      date_upload: '2024-01-14',
      commentaire: 'Photo floue, veuillez renvoyer une photo plus claire',
      fichier: 'selfie_id.jpg',
      taille: '3.2 MB'
    },
    {
      id: 4,
      nom: 'Contrat Vendeur Signé',
      type: 'contrat',
      statut: 'approuvé',
      date_upload: '2024-01-10',
      fichier: 'contrat_vendeur.pdf',
      taille: '1.5 MB'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des documents
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (statut) => {
    const variants = {
      'approuvé': 'success',
      'en_attente': 'warning',
      'rejeté': 'danger',
      'expiré': 'secondary'
    };
    return variants[statut] || 'secondary';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'piece_identite': 'fas fa-id-card',
      'domicile': 'fas fa-home',
      'selfie': 'fas fa-camera',
      'contrat': 'fas fa-file-contract',
      'kyc': 'fas fa-user-check',
      'kyb': 'fas fa-building'
    };
    return icons[type] || 'fas fa-file';
  };

  const handleUpload = async (files) => {
    setUploading(true);
    // Simuler l'upload
    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        nom: files[0].name,
        type: 'autre',
        statut: 'en_attente',
        date_upload: new Date().toISOString().split('T')[0],
        fichier: files[0].name,
        taille: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`
      };
      setDocuments(prev => [newDoc, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
    }, 2000);
  };

  const documentTypes = [
    { value: 'piece_identite', label: 'Pièce d\'Identité (NNI)' },
    { value: 'passeport', label: 'Passeport' },
    { value: 'permis_conduire', label: 'Permis de Conduire' },
    { value: 'domicile', label: 'Justificatif de Domicile' },
    { value: 'selfie', label: 'Selfie avec Pièce d\'Identité' },
    { value: 'contrat', label: 'Contrat Signé' },
    { value: 'rib', label: 'RIB' },
    { value: 'autre', label: 'Autre Document' }
  ];

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Mes Documents</h1>
              <p className="text-muted">
                Gérez vos documents personnels et professionnels
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload me-2"></i>
              Ajouter un Document
            </Button>
          </div>
        </Col>
      </Row>

      {/* Résumé des documents */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="text-center">
              <i className="fas fa-file-alt fa-2x mb-2"></i>
              <h4>{documents.length}</h4>
              <p className="mb-0">Documents Totaux</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-success text-white">
            <Card.Body className="text-center">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h4>{documents.filter(d => d.statut === 'approuvé').length}</h4>
              <p className="mb-0">Approuvés</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-warning text-white">
            <Card.Body className="text-center">
              <i className="fas fa-clock fa-2x mb-2"></i>
              <h4>{documents.filter(d => d.statut === 'en_attente').length}</h4>
              <p className="mb-0">En Attente</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 bg-danger text-white">
            <Card.Body className="text-center">
              <i className="fas fa-times-circle fa-2x mb-2"></i>
              <h4>{documents.filter(d => d.statut === 'rejeté').length}</h4>
              <p className="mb-0">Rejetés</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tableau des documents */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-folder me-2"></i>
                Liste des Documents
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-2 text-muted">Chargement de vos documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun document</h5>
                  <p className="text-muted mb-4">
                    Commencez par ajouter votre premier document
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="fas fa-upload me-2"></i>
                    Ajouter un Document
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Type</th>
                        <th>Statut</th>
                        <th>Date d'Upload</th>
                        <th>Taille</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(document => (
                        <tr key={document.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`${getTypeIcon(document.type)} text-primary me-3`}></i>
                              <div>
                                <strong>{document.nom}</strong>
                                {document.commentaire && (
                                  <div>
                                    <small className="text-danger">
                                      {document.commentaire}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="outline-secondary" text="dark">
                              {documentTypes.find(t => t.value === document.type)?.label || document.type}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(document.statut)}>
                              {document.statut}
                            </Badge>
                          </td>
                          <td>
                            {new Date(document.date_upload).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <small className="text-muted">{document.taille}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button size="sm" variant="outline-primary">
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button size="sm" variant="outline-success">
                                <i className="fas fa-download"></i>
                              </Button>
                              <Button size="sm" variant="outline-danger">
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

      {/* Informations importantes */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body>
              <h6 className="fw-bold mb-3">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Informations Importantes
              </h6>
              <Row>
                <Col md={6}>
                  <ul className="small mb-0">
                    <li>Tous les documents doivent être clairs et lisibles</li>
                    <li>Formats acceptés: PDF, JPG, PNG (max 10MB)</li>
                    <li>Les pièces d'identité doivent être valides</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="small mb-0">
                    <li>Traitement sous 24-48 heures pour la vérification</li>
                    <li>Vous serez notifié par email des changements de statut</li>
                    <li>Conservez vos documents à jour</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal d'upload */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Document</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          const files = Array.from(e.target.document.files);
          if (files.length > 0) {
            handleUpload(files);
          }
        }}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type de Document</Form.Label>
              <Form.Select name="type" required>
                <option value="">Sélectionnez le type</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fichier</Form.Label>
              <Form.Control
                type="file"
                name="document"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              <Form.Text className="text-muted">
                Taille maximale: 10MB. Formats: PDF, JPG, PNG, DOC
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date d'Expiration (optionnel)</Form.Label>
              <Form.Control
                type="date"
                name="expiration"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Upload...
                </>
              ) : (
                'Uploader le Document'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MyDocuments;