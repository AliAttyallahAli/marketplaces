import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { productsAPI } from '../../services/products';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_CATEGORIES, PRODUCT_ETATS } from '../../utils/constants';

const ProductForm = ({ onSuccess, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialData || {
    nom: '',
    description: '',
    prix: '',
    reduction: '',
    etat: 'neuf',
    categorie: '',
    livrable: false,
    adresse_livraison: '',
    quantite: 1,
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await productsAPI.create(formData);
      onSuccess?.();
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom du produit *</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Nom du produit"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Catégorie *</Form.Label>
            <Form.Select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
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
          placeholder="Description détaillée du produit"
        />
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Prix (FCFA) *</Form.Label>
            <Form.Control
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              required
              min="1"
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
              {PRODUCT_ETATS.map(etat => (
                <option key={etat.value} value={etat.value}>
                  {etat.label}
                </option>
              ))}
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
                label="Proposez la livraison pour ce produit"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      {formData.livrable && (
        <Form.Group className="mb-3">
          <Form.Label>Adresse de livraison</Form.Label>
          <Form.Control
            type="text"
            name="adresse_livraison"
            value={formData.adresse_livraison}
            onChange={handleChange}
            placeholder="Adresse pour la livraison"
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
            // Gérer l'upload des photos
            const files = Array.from(e.target.files);
            // Simuler l'upload pour l'instant
            const photoUrls = files.map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, photos: photoUrls }));
          }}
        />
        <Form.Text className="text-muted">
          Vous pouvez sélectionner plusieurs photos. La première photo sera la photo principale.
        </Form.Text>
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer le produit'}
        </Button>
        <Button variant="outline-secondary" type="button">
          Annuler
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;