import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert,
  Spinner,
  Dropdown
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { blogAPI } from '../../services/blog';

const MyBlogPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      const response = await blogAPI.getMyPosts();
      setPosts(response.data.posts || response.data || []);
    } catch (error) {
      console.error('Error loading my posts:', error);
      setError('Erreur lors du chargement de vos publications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${postTitle}" ?`)) {
      return;
    }

    try {
      await blogAPI.delete(postId);
      setSuccess('Publication supprimée avec succès');
      loadMyPosts();
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      actif: { variant: 'success', label: 'Actif' },
      inactif: { variant: 'secondary', label: 'Inactif' },
      en_attente: { variant: 'warning', label: 'En attente' }
    };
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement de vos publications...</p>
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
              <h1 className="fw-bold text-primary">Mes Publications</h1>
              <p className="text-muted">
                Gérez vos publications et suivez leurs performances
              </p>
            </div>
            <Button variant="primary" onClick={() => navigate('/blog')}>
              <i className="fas fa-arrow-left me-2"></i>
              Retour au blog
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <i className="fas fa-edit fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Aucune publication</h5>
            <p className="text-muted mb-4">
              Vous n'avez pas encore créé de publication
            </p>
            <Button variant="primary" onClick={() => navigate('/blog')}>
              <i className="fas fa-plus me-2"></i>
              Créer une publication
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {posts.map(post => (
            <Col lg={6} key={post.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {getStatusBadge(post.statut)}
                        {post.montant_publication > 0 && (
                          <Badge bg="warning">{post.montant_publication} FCFA</Badge>
                        )}
                      </div>
                      <h5 className="fw-bold text-primary">{post.titre}</h5>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-basic" />
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/blog/${post.id}`)}>
                          <i className="fas fa-eye me-2"></i>
                          Voir
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate(`/blog/edit/${post.id}`)}>
                          <i className="fas fa-edit me-2"></i>
                          Modifier
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => handleDelete(post.id, post.titre)}
                          className="text-danger"
                        >
                          <i className="fas fa-trash me-2"></i>
                          Supprimer
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <Card.Text className="text-muted mb-3">
                    {post.contenu.length > 120 
                      ? `${post.contenu.substring(0, 120)}...` 
                      : post.contenu}
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        {formatDate(post.created_at)}
                      </small>
                      {post.soutiens_count > 0 && (
                        <small className="text-success ms-2">
                          <i className="fas fa-heart me-1"></i>
                          {post.soutiens_count} soutien(s)
                        </small>
                      )}
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Détails
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBlogPosts;