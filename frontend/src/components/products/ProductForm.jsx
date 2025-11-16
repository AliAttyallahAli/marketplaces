import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { productsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    reduction: '0',
    etat: 'neuf',
    categorie: '',
    livrable: false,
    adresse_livraison: '',
    quantite: '1',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const categories = [
    'Alimentation',
    'Électronique',
    'Habillement',
    'Artisanat',
    'Agriculture',
    'Santé',
    'Éducation',
    'Beauté',
    'Cosmétique',
    'Logiciel',
    'Électricité',
    'Fruit',
    'Légume',
    'Service'
  ];

  const etats = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'occasion', label: 'Occasion' },
    { value: 'sur_commande', label: 'Sur commande' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingPhotos(true);

    // Simulation d'upload - en production, vous enverriez les fichiers au backend
    const newPhotos = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));

    setUploadingPhotos(false);
    toast.success(`${files.length} photo(s) ajoutée(s)`);
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom du produit est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.prix || parseFloat(formData.prix) <= 0) newErrors.prix = 'Le prix doit être supérieur à 0';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est requise';
    if (formData.livrable && !formData.adresse_livraison.trim()) {
      newErrors.adresse_livraison = 'L\'adresse de livraison est requise';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await productsAPI.create({
        ...formData,
        prix: parseFloat(formData.prix),
        reduction: parseFloat(formData.reduction),
        quantite: parseInt(formData.quantite)
      });
      
      toast.success('Produit publié avec succès!');
      onSuccess();
    } catch (error) {
      console.error('Erreur publication produit:', error);
      const message = error.response?.data?.error || 'Erreur lors de la publication';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const prixApresReduction = formData.prix && formData.reduction 
    ? (parseFloat(formData.prix) * (100 - parseFloat(formData.reduction))) / 100 
    : formData.prix;

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={8}>
          {/* Informations de base */}
          <Card className="border-0 mb-4">
            <Card.Header className="bg-white border-0">
              <h6 className="fw-bold mb-0">Informations du produit</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nom du produit *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  isInvalid={!!errors.nom}
                  placeholder="Ex: Sac artisanal en cuir"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nom}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                  placeholder="Décrivez votre produit en détail..."
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Prix (XAF) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      isInvalid={!!errors.prix}
                      min="0"
                      step="0.01"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.prix}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Réduction (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="reduction"
                      value={formData.reduction}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                    {formData.reduction > 0 && formData.prix && (
                      <Form.Text className="text-success">
                        Prix après réduction: {prixApresReduction.toLocaleString('fr-FR')} XAF
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantité *</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantite"
                      value={formData.quantite}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>État *</Form.Label>
                    <Form.Select
                      name="etat"
                      value={formData.etat}
                      onChange={handleChange}
                      required
                    >
                      {etats.map(etat => (
                        <option key={etat.value} value={etat.value}>
                          {etat.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Catégorie *</Form.Label>
                <Form.Select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  isInvalid={!!errors.categorie}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categorie}
                </Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Livraison */}
          <Card className="border-0 mb-4">
            <Card.Header className="bg-white border-0">
              <h6 className="fw-bold mb-0">Options de livraison</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="livrable"
                  checked={formData.livrable}
                  onChange={handleChange}
                  label="Proposer la livraison pour ce produit"
                />
              </Form.Group>

              {formData.livrable && (
                <Form.Group className="mb-3">
                  <Form.Label>Adresse de livraison *</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse_livraison"
                    value={formData.adresse_livraison}
                    onChange={handleChange}
                    isInvalid={!!errors.adresse_livraison}
                    placeholder="Adresse où la livraison est possible"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.adresse_livraison}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Indiquez les zones où vous pouvez livrer le produit
                  </Form.Text>
                </Form.Group>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Photos */}
          <Card className="border-0 mb-4">
            <Card.Header className="bg-white border-0">
              <h6 className="fw-bold mb-0">Photos du produit</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="btn btn-outline-primary w-100 cursor-pointer">
                  <i className="fas fa-camera me-2"></i>
                  Ajouter des photos
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="d-none"
                    disabled={uploadingPhotos}
                  />
                </Form.Label>
                <Form.Text className="text-muted">
                  Maximum 5 photos. Formats: JPG, PNG
                </Form.Text>
              </Form.Group>

              {/* Aperçu des photos */}
              <div className="d-flex flex-wrap gap-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      className="rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      style={{ transform: 'translate(50%, -50%)' }}
                      onClick={() => removePhoto(index)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                ))}
              </div>

              {uploadingPhotos && (
                <div className="text-center mt-2">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <small className="text-muted ms-2">Upload en cours...</small>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Aperçu du prix */}
          <Card className="border-0 bg-light">
            <Card.Body>
              <h6 className="fw-bold mb-3">Aperçu du prix</h6>
              
              <div className="mb-2">
                <small className="text-muted d-block">Prix de base</small>
                <strong>{formData.prix ? parseFloat(formData.prix).toLocaleString('fr-FR') : '0'} XAF</strong>
              </div>

              {formData.reduction > 0 && (
                <div className="mb-2">
                  <small className="text-muted d-block">Réduction</small>
                  <strong className="text-danger">-{formData.reduction}%</strong>
                </div>
              )}

              <div className="mb-3">
                <small className="text-muted d-block">Prix final</small>
                <h5 className="text-primary fw-bold">
                  {prixApresReduction ? prixApresReduction.toLocaleString('fr-FR') : '0'} XAF
                </h5>
              </div>

              <Alert variant="info" className="small">
                <i className="fas fa-info-circle me-2"></i>
                Les frais de transaction de 1% seront appliqués à chaque vente.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <div className="d-flex gap-2 justify-content-end border-top pt-4">
        <Button variant="outline-secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Publication...
            </>
          ) : (
            <>
              <i className="fas fa-check me-2"></i>
              Publier le produit
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;