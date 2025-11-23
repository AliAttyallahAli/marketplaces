import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Modal, 
  Form, 
  Alert,
  InputGroup,
  FormControl,
  Dropdown,
  Spinner
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { blogAPI } from '../../services/blog';

const Blog = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'partenariat', label: 'Partenariat' },
    { value: 'investissement', label: 'Investissement' },
    { value: 'pret', label: 'Prêt' },
    { value: 'subvention', label: 'Subvention' },
    { value: 'projet', label: 'Projet' },
    { value: 'emploi', label: 'Emploi' },
    { value: 'general', label: 'Général' }
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setPosts(response.data.posts || response.data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setError('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.organisation_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.categorie === selectedCategory);
    }

    // Tri
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.soutiens_count || 0) - (a.soutiens_count || 0));
        break;
      case 'expensive':
        filtered.sort((a, b) => (b.montant_publication || 0) - (a.montant_publication || 0));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la publication "${postTitle}" ?`)) {
      return;
    }

    try {
      await blogAPI.delete(postId);
      setSuccess('Publication supprimée avec succès');
      loadPosts();
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  const CreatePostModal = () => {
    const [formData, setFormData] = useState({
      titre: '',
      contenu: '',
      organisation_nom: '',
      contact: '',
      montant_publication: 0,
      categorie: 'general',
      fichier: null
    });
    const [creating, setCreating] = useState(false);
    const [filePreview, setFilePreview] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);
      setError('');

      try {
        await blogAPI.create(formData);
        setSuccess('Publication créée avec succès!');
        setShowCreateModal(false);
        resetForm();
        loadPosts();
      } catch (error) {
        setError(error.response?.data?.error || 'Erreur lors de la création');
      } finally {
        setCreating(false);
      }
    };

    const resetForm = () => {
      setFormData({
        titre: '',
        contenu: '',
        organisation_nom: '',
        contact: '',
        montant_publication: 0,
        categorie: 'general',
        fichier: null
      });
      setFilePreview('');
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          fichier: file
        }));
        setFilePreview(URL.createObjectURL(file));
      }
    };

    return (
      <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); resetForm(); }} size="lg">
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
              <Form.Label>Catégorie *</Form.Label>
              <Form.Select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                required
              >
                {categories.filter(cat => cat.value !== 'all').map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Form.Select>
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
                Formats acceptés: PDF, Word, JPG, PNG
              </Form.Text>
              {filePreview && (
                <div className="mt-2">
                  <Badge bg="info">Fichier sélectionné: {formData.fichier?.name}</Badge>
                </div>
              )}
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
              <Alert variant="warning">
                <i className="fas fa-info-circle me-2"></i>
                Cette publication coûtera {formData.montant_publication} FCFA. 
                Le montant sera débité de votre portefeuille après confirmation.
              </Alert>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
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

  const getCategoryBadge = (category) => {
    const colors = {
      partenariat: 'primary',
      investissement: 'success',
      pret: 'warning',
      subvention: 'info',
      projet: 'secondary',
      emploi: 'dark',
      general: 'light'
    };
    return colors[category] || 'light';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des publications...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold text-primary">Blog & Partenariats</h1>
              <p className="text-muted mb-0">
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

          {/* Barre de recherche et filtres */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Rechercher une publication..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                    <option value="popular">Plus populaire</option>
                    <option value="expensive">Plus cher</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess('')}>
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {filteredPosts.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucune publication trouvée</h5>
                <p className="text-muted mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Aucune publication ne correspond à vos critères de recherche' 
                    : 'Soyez le premier à partager une opportunité de partenariat ou une actualité'
                  }
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
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              {filteredPosts.length} publication{filteredPosts.length > 1 ? 's' : ''} trouvée{filteredPosts.length > 1 ? 's' : ''}
            </p>
          </div>

          <Row>
            {filteredPosts.map(post => (
              <Col lg={6} key={post.id} className="mb-4">
                <Card className="h-100 shadow-sm border-0 blog-card">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <Badge 
                          bg={getCategoryBadge(post.categorie)} 
                          className="mb-2"
                        >
                          {categories.find(cat => cat.value === post.categorie)?.label || post.categorie}
                        </Badge>
                        <h5 className="fw-bold text-primary mb-1">{post.titre}</h5>
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

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {formatDate(post.created_at)}
                        {post.soutiens_count > 0 && (
                          <span className="ms-2">
                            <i className="fas fa-heart text-danger me-1"></i>
                            {post.soutiens_count}
                          </span>
                        )}
                      </small>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate(`/blog/${post.id}`)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Voir plus
                        </Button>
                        {(user?.id === post.auteur_id || user?.role === 'admin') && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePost(post.id, post.titre)}
                          >
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
        </>
      )}

      <CreatePostModal />
    </Container>
  );
};

export default Blog;