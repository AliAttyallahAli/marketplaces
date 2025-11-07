import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { blogAPI } from '../services/blog';

const Blog = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getAll();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setError('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const CreatePostModal = () => {
    const [formData, setFormData] = useState({
      titre: '',
      contenu: '',
      organisation_nom: '',
      contact: '',
      montant_publication: 0,
      fichier_url: '',
      images: []
    });
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);
      setError('');

      try {
        await blogAPI.create(formData);
        setSuccess('Publication créée avec succès!');
        setShowCreateModal(false);
        setFormData({
          titre: '',
          contenu: '',
          organisation_nom: '',
          contact: '',
          montant_publication: 0,
          fichier_url: '',
          images: []
        });
        loadPosts();
      } catch (error) {
        setError(error.response?.data?.error || 'Erreur lors de la création');
      } finally {
        setCreating(false);
      }
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simuler l'upload du fichier
        const fileUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          fichier_url: fileUrl
        }));
      }
    };

    return (
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Créer une publication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre *</Form.Label>
              <Form.Control
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                required
                placeholder="Titre de votre publication"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenu *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={formData.contenu}
                onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                required
                placeholder="Décrivez votre projet, opportunité ou demande de partenariat..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'organisation</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.organisation_nom}
                    onChange={(e) => setFormData({...formData, organisation_nom: e.target.value})}
                    placeholder="Votre entreprise ou organisation"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="Email ou téléphone"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Fichier joint (max 10MB)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Form.Text className="text-muted">
                Vous pouvez joindre un document PDF, Word ou des images
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Montant de publication (FCFA)</Form.Label>
              <Form.Control
                type="number"
                value={formData.montant_publication}
                onChange={(e) => setFormData({...formData, montant_publication: parseFloat(e.target.value) || 0})}
                min="0"
                placeholder="0 pour une publication gratuite"
              />
              <Form.Text className="text-muted">
                Un montant supérieur à 0 rendra votre publication plus visible
              </Form.Text>
            </Form.Group>

            {formData.montant_publication > 0 && (
              <div className="alert alert-warning">
                <i className="fas fa-info-circle me-2"></i>
                Cette publication coûtera {formData.montant_publication} FCFA. 
                Le montant sera débité de votre portefeuille après confirmation.
              </div>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Publication en cours...
                </>
              ) : (
                'Publier'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des publications...</p>
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
              <h1 className="fw-bold">Blog & Partenariats</h1>
              <p className="text-muted">
                Découvrez les opportunités de partenariat et les actualités de la communauté
              </p>
            </div>
            {(isAuthenticated && (user.role === 'vendeur' || user.role === 'admin')) && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Nouvelle publication
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucune publication pour le moment</h5>
                <p className="text-muted mb-4">
                  Soyez le premier à partager une opportunité de partenariat ou une actualité
                </p>
                {(isAuthenticated && (user.role === 'vendeur' || user.role === 'admin')) && (
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <i className="fas fa-plus me-2"></i>
                    Créer la première publication
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {posts.map(post => (
            <Col lg={6} key={post.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold text-primary">{post.titre}</h5>
                      <div className="d-flex align-items-center text-muted small">
                        <span>
                          Par {post.auteur_prenom} {post.auteur_nom}
                        </span>
                        {post.organisation_nom && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.organisation_nom}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {post.montant_publication > 0 && (
                      <Badge bg="warning" className="fs-6">
                        {post.montant_publication} FCFA
                      </Badge>
                    )}
                  </div>

                  <Card.Text className="text-muted mb-3">
                    {post.contenu.length > 150 
                      ? `${post.contenu.substring(0, 150)}...` 
                      : post.contenu}
                  </Card.Text>

                  {post.contact && (
                    <div className="mb-3">
                      <small className="text-muted">Contact: </small>
                      <small className="fw-bold">{post.contact}</small>
                    </div>
                  )}

                  {post.fichier_url && (
                    <div className="mb-3">
                      <Button variant="outline-secondary" size="sm">
                        <i className="fas fa-download me-2"></i>
                        Télécharger le fichier
                      </Button>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {formatDate(post.created_at)}
                    </small>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        <i className="fas fa-eye me-1"></i>
                        Voir plus
                      </Button>
                      {(user?.id === post.auteur_id || user?.role === 'admin') && (
                        <Button variant="outline-danger" size="sm">
                          <i className="fas fa-trash me-1"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <CreatePostModal />
    </Container>
  );
};

export default Blog;