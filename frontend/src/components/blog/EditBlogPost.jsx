import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Alert, 
  Spinner,
  Badge
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { blogAPI } from '../../services/blog';

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    organisation_nom: '',
    contact: '',
    montant_publication: 0,
    categorie: 'general',
    fichier: null
  });

  const categories = [
    { value: 'partenariat', label: 'Partenariat' },
    { value: 'investissement', label: 'Investissement' },
    { value: 'pret', label: 'Prêt' },
    { value: 'subvention', label: 'Subvention' },
    { value: 'projet', label: 'Projet' },
    { value: 'emploi', label: 'Emploi' },
    { value: 'general', label: 'Général' }
  ];

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await blogAPI.getById(id);
      const postData = response.data.post || response.data;
      
      if (postData.auteur_id !== user.id && user.role !== 'admin') {
        setError('Vous n\'êtes pas autorisé à modifier cette publication');
        return;
      }

      setPost(postData);
      setFormData({
        titre: postData.titre,
        contenu: postData.contenu,
        organisation_nom: postData.organisation_nom || '',
        contact: postData.contact || '',
        montant_publication: postData.montant_publication || 0,
        categorie: postData.categorie || 'general',
        fichier: null
      });
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Erreur lors du chargement de la publication');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      await blogAPI.update(id, formData);
      setSuccess('Publication modifiée avec succès!');
      setTimeout(() => {
        navigate(`/blog/${id}`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        fichier: file
      }));
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement de la publication...</p>
        </div>
      </Container>
    );
  }

  if (error && !post) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Retour au blog
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="fw-bold text-primary">Modifier la publication</h1>
                  <p className="text-muted mb-0">
                    Modifiez les informations de votre publication
                  </p>
                </div>
                <Button variant="outline-secondary" onClick={() => navigate(`/blog/${id}`)}>
                  <i className="fas fa-arrow-left me-2"></i>
                  Retour
                </Button>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

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
                  <Form.Label>Catégorie *</Form.Label>
                  <Form.Select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Form.Select>
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

                <Form.Group className="mb-3">
                  <Form.Label>Changer le fichier (optionnel)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Form.Text className="text-muted">
                    Laissez vide pour conserver le fichier actuel
                  </Form.Text>
                  {post.fichier_url && !formData.fichier && (
                    <div className="mt-2">
                      <Badge bg="info">
                        Fichier actuel: {post.fichier_url.split('/').pop()}
                      </Badge>
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
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-grow-1"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Modification...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(`/blog/${id}`)}
                  >
                    Annuler
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditBlogPost;