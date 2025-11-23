import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { blogAPI } from '../../services/blog';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadPostDetail();
  }, [id]);

  const loadPostDetail = async () => {
    try {
      const response = await blogAPI.getById(id);
      setPost(response.data.post);
    } catch (error) {
      console.error('Error loading blog post:', error);
      setError('Erreur lors du chargement de la publication');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await blogAPI.delete(id);
      setSuccess('Publication supprimée avec succès');
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
    } catch (error) {
      setError('Erreur lors de la suppression');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDownload = async () => {
    if (!post.fichier_url) return;
    
    setDownloading(true);
    try {
      const response = await fetch(post.fichier_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `document-${post.titre}.${post.fichier_url.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess('Fichier téléchargé avec succès');
    } catch (error) {
      setError('Erreur lors du téléchargement');
    } finally {
      setDownloading(false);
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setError('Veuillez vous connecter pour effectuer un paiement');
      return;
    }

    try {
      const paymentData = {
        montant: post.montant_publication,
        post_id: post.id,
        type: 'publication_blog'
      };

      const response = await blogAPI.processPayment(paymentData);
      
      if (response.data.success) {
        setSuccess('Paiement effectué avec succès! La publication est maintenant mise en avant');
        loadPostDetail();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors du paiement');
    }
  };

  const EditPostModal = () => {
    const [formData, setFormData] = useState({
      titre: post?.titre || '',
      contenu: post?.contenu || '',
      organisation_nom: post?.organisation_nom || '',
      contact: post?.contact || '',
      montant_publication: post?.montant_publication || 0
    });
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUpdating(true);
      setError('');

      try {
        await blogAPI.update(id, formData);
        setSuccess('Publication modifiée avec succès!');
        setShowEditModal(false);
        loadPostDetail();
      } catch (error) {
        setError(error.response?.data?.error || 'Erreur lors de la modification');
      } finally {
        setUpdating(false);
      }
    };

    return (
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifier la publication</Modal.Title>
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
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenu *</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={formData.contenu}
                onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                required
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
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Montant de publication (FCFA)</Form.Label>
              <Form.Control
                type="number"
                value={formData.montant_publication}
                onChange={(e) => setFormData({...formData, montant_publication: parseFloat(e.target.value) || 0})}
                min="0"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Modification en cours...
                </>
              ) : (
                'Modifier la publication'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const DeleteConfirmationModal = () => (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Êtes-vous sûr de vouloir supprimer cette publication ?</p>
        <p className="fw-bold">"{post?.titre}"</p>
        <p className="text-danger">
          <small>Cette action est irréversible.</small>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <i className="fas fa-trash me-2"></i>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement de la publication...</p>
        </div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Publication non trouvée</h4>
          <p>La publication que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Retour au blog
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" onClick={() => navigate('/blog')} className="mb-3">
            <i className="fas fa-arrow-left me-2"></i>
            Retour au blog
          </Button>

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

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <h1 className="fw-bold text-primary me-3">{post.titre}</h1>
                    {post.montant_publication > 0 && (
                      <Badge bg="warning" className="fs-6">
                        {post.montant_publication} FCFA
                      </Badge>
                    )}
                  </div>
                  
                  <div className="d-flex flex-wrap align-items-center text-muted gap-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-user me-2"></i>
                      <span>{post.auteur_prenom} {post.auteur_nom}</span>
                    </div>
                    
                    {post.organisation_nom && (
                      <div className="d-flex align-items-center">
                        <i className="fas fa-building me-2"></i>
                        <span>{post.organisation_nom}</span>
                      </div>
                    )}
                    
                    <div className="d-flex align-items-center">
                      <i className="fas fa-calendar me-2"></i>
                      <span>{new Date(post.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>

                {(user?.id === post.auteur_id || user?.role === 'admin') && (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Modifier
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="fas fa-trash me-1"></i>
                    </Button>
                  </div>
                )}
              </div>

              {post.contact && (
                <Alert variant="info" className="mb-4">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-envelope me-2"></i>
                    <div>
                      <strong>Contact : </strong>
                      {post.contact}
                    </div>
                  </div>
                </Alert>
              )}

              <div className="mb-4">
                <div 
                  className="blog-content"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontSize: '1.1rem'
                  }}
                >
                  {post.contenu}
                </div>
              </div>

              {post.fichier_url && (
                <Card className="mb-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-paperclip fa-2x text-muted me-3"></i>
                        <div>
                          <h6 className="mb-1">Document joint</h6>
                          <small className="text-muted">
                            Taille: ~10MB • Format: {post.fichier_url.split('.').pop().toUpperCase()}
                          </small>
                        </div>
                      </div>
                      <Button 
                        variant="primary" 
                        onClick={handleDownload}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-download me-2"></i>
                            Télécharger
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {post.montant_publication > 0 && user?.id !== post.auteur_id && (
                <div className="text-center mt-4 p-4 bg-light rounded">
                  <h5 className="mb-3">Soutenir cette publication</h5>
                  <p className="text-muted mb-3">
                    En payant {post.montant_publication} FCFA, vous soutenez l'auteur 
                    et rendez cette publication plus visible dans le fil d'actualité.
                  </p>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={!isAuthenticated}
                  >
                    <i className="fas fa-mobile-alt me-2"></i>
                    Payer {post.montant_publication} FCFA avec Mobile Money
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-danger mt-2">
                      <small>Vous devez être connecté pour effectuer un paiement</small>
                    </p>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EditPostModal />
      <DeleteConfirmationModal />
    </Container>
  );
};

export default BlogDetail;