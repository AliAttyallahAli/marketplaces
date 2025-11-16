import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card, Badge } from 'react-bootstrap';
import { blogAPI } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const BlogForm = ({ onSuccess, initialData, isEdit = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState(initialData || {
    titre: '',
    contenu: '',
    organisation_nom: '',
    contact: '',
    type_publication: 'information',
    montant_publication: '0',
    images: [],
    fichier_url: '',
    is_public: true
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const publicationTypes = [
    { value: 'information', label: 'Information', icon: 'fas fa-info-circle', color: 'info' },
    { value: 'promotion', label: 'Promotion', icon: 'fas fa-percentage', color: 'success' },
    { value: 'partenariat', label: 'Partenariat', icon: 'fas fa-handshake', color: 'primary' },
    { value: 'appel_projet', label: 'Appel à projet', icon: 'fas fa-bullhorn', color: 'warning' },
    { value: 'offre_emploi', label: 'Offre d\'emploi', icon: 'fas fa-briefcase', color: 'secondary' },
    { value: 'investissement', label: 'Investissement', icon: 'fas fa-chart-line', color: 'dark' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limiter à 3 images maximum
    if (uploadedImages.length + files.length > 3) {
      setError('Maximum 3 images autorisées');
      return;
    }

    const newImages = files.map(file => {
      return {
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      };
    });

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      });
    }
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données pour l'API
      const submitData = {
        ...formData,
        montant_publication: parseFloat(formData.montant_publication) || 0,
        images: uploadedImages.map(img => img.url), // Dans un vrai projet, uploader vers un serveur
        fichier_url: uploadedFile ? uploadedFile.url : ''
      };

      if (isEdit) {
        await blogAPI.update(initialData.id, submitData);
        setSuccess('Article mis à jour avec succès!');
      } else {
        await blogAPI.create(submitData);
        setSuccess('Article publié avec succès!');
      }

      // Réinitialiser le formulaire après succès
      if (!isEdit) {
        setFormData({
          titre: '',
          contenu: '',
          organisation_nom: '',
          contact: '',
          type_publication: 'information',
          montant_publication: '0',
          images: [],
          fichier_url: '',
          is_public: true
        });
        setUploadedImages([]);
        setUploadedFile(null);
      }

      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.error || `Erreur lors de ${isEdit ? 'la mise à jour' : 'la publication'}`);
    } finally {
      setLoading(false);
    }
  };

  const getPublicationTypeInfo = (type) => {
    const typeInfo = publicationTypes.find(t => t.value === type) || publicationTypes[0];
    return typeInfo;
  };

  const currentType = getPublicationTypeInfo(formData.type_publication);

  return (
    <div className="blog-form">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Type de publication */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-tag me-2"></i>
              Type de publication
            </h6>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                name="type_publication"
                value={formData.type_publication}
                onChange={handleChange}
                required
              >
                {publicationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className={`alert alert-${currentType.color} d-flex align-items-center`}>
              <i className={`${currentType.icon} fa-2x me-3`}></i>
              <div>
                <strong>{currentType.label}</strong>
                <div className="small">
                  {formData.type_publication === 'information' && 'Partagez des informations avec la communauté'}
                  {formData.type_publication === 'promotion' && 'Promouvez vos produits ou services'}
                  {formData.type_publication === 'partenariat' && 'Proposez des opportunités de partenariat'}
                  {formData.type_publication === 'appel_projet' && 'Lancez un appel à projets ou collaborations'}
                  {formData.type_publication === 'offre_emploi' && 'Publiez une offre d\'emploi ou de stage'}
                  {formData.type_publication === 'investissement' && 'Recherchez des investisseurs ou financements'}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Informations de base */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-edit me-2"></i>
              Contenu de l'article
            </h6>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Titre *</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Titre accrocheur de votre article"
                required
                maxLength={200}
              />
              <Form.Text className="text-muted">
                {formData.titre.length}/200 caractères
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenu *</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                placeholder="Rédigez votre article ici... Vous pouvez utiliser des paragraphes, des listes, etc."
                required
                maxLength={5000}
              />
              <Form.Text className="text-muted">
                {formData.contenu.length}/5000 caractères
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Informations de contact */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-building me-2"></i>
              Informations de l'organisation
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'organisation</Form.Label>
                  <Form.Control
                    type="text"
                    name="organisation_nom"
                    value={formData.organisation_nom}
                    onChange={handleChange}
                    placeholder="Votre entreprise ou organisation"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Email, téléphone, ou autre moyen de contact"
                    maxLength={100}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Médias */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-images me-2"></i>
              Médias
            </h6>
          </Card.Header>
          <Card.Body>
            {/* Images */}
            <Form.Group className="mb-4">
              <Form.Label>
                Images {uploadedImages.length > 0 && `(${uploadedImages.length}/3)`}
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadedImages.length >= 3}
              />
              <Form.Text className="text-muted">
                Formats acceptés: JPG, PNG, WEBP. Maximum 3 images, 5MB par image.
              </Form.Text>

              {/* Aperçu des images */}
              {uploadedImages.length > 0 && (
                <div className="mt-3">
                  <Row>
                    {uploadedImages.map((image, index) => (
                      <Col xs={6} md={4} key={index} className="mb-3">
                        <div className="position-relative">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="img-thumbnail w-100"
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0"
                            style={{ transform: 'translate(50%, -50%)' }}
                            onClick={() => removeImage(index)}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Form.Group>

            {/* Fichier joint */}
            <Form.Group className="mb-3">
              <Form.Label>Fichier joint (optionnel)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
              />
              <Form.Text className="text-muted">
                Formats acceptés: PDF, Word, Excel, PowerPoint. Maximum 10MB.
              </Form.Text>

              {uploadedFile && (
                <div className="mt-2">
                  <Badge bg="info" className="p-2">
                    <i className="fas fa-file me-2"></i>
                    {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={removeFile}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </Badge>
                </div>
              )}
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Publication payante */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="fas fa-credit-card me-2"></i>
              Options de publication
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication payante (FCFA)</Form.Label>
                  <Form.Control
                    type="number"
                    name="montant_publication"
                    value={formData.montant_publication}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    placeholder="0"
                  />
                  <Form.Text className="text-muted">
                    Mettez un prix pour une publication premium (optionnel)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visibilité</Form.Label>
                  <div>
                    <Form.Check
                      type="checkbox"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleChange}
                      label="Rendre cet article public"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {parseFloat(formData.montant_publication) > 0 && (
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Publication payante</strong><br />
                Les utilisateurs devront payer {parseFloat(formData.montant_publication).toLocaleString('fr-TD')} FCFA 
                pour accéder à cet article. Le montant sera crédité sur votre wallet.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Boutons d'action */}
        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFormData({
                titre: '',
                contenu: '',
                organisation_nom: '',
                contact: '',
                type_publication: 'information',
                montant_publication: '0',
                images: [],
                fichier_url: '',
                is_public: true
              });
              setUploadedImages([]);
              setUploadedFile(null);
            }}
            disabled={loading}
          >
            <i className="fas fa-undo me-2"></i>
            Réinitialiser
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {isEdit ? 'Mise à jour...' : 'Publication...'}
              </>
            ) : (
              <>
                <i className={`fas ${isEdit ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                {isEdit ? 'Mettre à jour' : 'Publier l\'article'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BlogForm;