import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { productsAPI } from '../../services/products';
import { toast } from 'react-toastify';

const ProductForm = ({ onSuccess, editProduct = null }) => {
  const [formData, setFormData] = useState({
    nom: editProduct?.nom || '',
    description: editProduct?.description || '',
    prix: editProduct?.prix || '',
    reduction: editProduct?.reduction || 0,
    etat: editProduct?.etat || 'neuf',
    categorie: editProduct?.categorie || '',
    livrable: editProduct?.livrable || false,
    adresse_livraison: editProduct?.adresse_livraison || '',
    quantite: editProduct?.quantite || 1,
    photos: editProduct?.photos || []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Santé', 'Éducation', 'Beauté', 'Cosmétique', 'Alimentation',
    'Habillement', 'Logiciel', 'Électronique', 'Électricité',
    'Fruit', 'Légume', 'Service'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editProduct) {
        // Mode édition
        await productsAPI.update(editProduct.id, formData);
        toast.success('Produit modifié avec succès!');
      } else {
        // Mode création
        await productsAPI.create(formData);
        toast.success('Produit créé avec succès!');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Erreur publication produit:', error);
      const message = error.response?.data?.error || 'Erreur lors de la publication';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-4">
          {editProduct ? 'Modifier le produit' : 'Publier un nouveau produit'}
        </h5>

        {error && (
          <Alert variant="danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nom du produit *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Nom descriptif du produit"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Catégorie *</Form.Label>
                <Form.Select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description détaillée du produit..."
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Prix (XAF) *</Form.Label>
                <Form.Control
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Réduction (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="reduction"
                  value={formData.reduction}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quantité *</Form.Label>
                <Form.Control
                  type="number"
                  name="quantite"
                  value={formData.quantite}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="1"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>État du produit *</Form.Label>
                <Form.Select
                  name="etat"
                  value={formData.etat}
                  onChange={handleChange}
                  required
                >
                  <option value="neuf">Neuf</option>
                  <option value="occasion">Occasion</option>
                  <option value="sur_commande">Sur commande</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Livraison</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    name="livrable"
                    checked={formData.livrable}
                    onChange={handleChange}
                    label="Proposer la livraison"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {formData.livrable && (
            <Form.Group className="mb-4">
              <Form.Label>Adresse de livraison</Form.Label>
              <Form.Control
                type="text"
                name="adresse_livraison"
                value={formData.adresse_livraison}
                onChange={handleChange}
                placeholder="Adresse pour la livraison..."
              />
            </Form.Group>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Photos du produit</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                // Gestion simplifiée des fichiers - à améliorer avec upload réel
                const files = Array.from(e.target.files);
                const photoUrls = files.map(file => URL.createObjectURL(file));
                setFormData(prev => ({
                  ...prev,
                  photos: [...prev.photos, ...photoUrls]
                }));
              }}
            />
            <Form.Text className="text-muted">
              Ajoutez des photos pour mieux présenter votre produit
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {editProduct ? 'Modification...' : 'Publication...'}
                </>
              ) : (
                <>
                  <i className={`fas ${editProduct ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                  {editProduct ? 'Modifier le produit' : 'Publier le produit'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;