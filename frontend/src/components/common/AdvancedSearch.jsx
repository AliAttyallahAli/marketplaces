import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const AdvancedSearch = ({ onSearch, onReset, loading = false }) => {
  const [filters, setFilters] = useState({
    query: '',
    categorie: '',
    prix_min: '',
    prix_max: '',
    etat: '',
    livrable: '',
    province: '',
    ville: ''
  });

  const categories = [
    'alimentation', 'habillement', 'electronique', 'electricite',
    'artisanat', 'agriculture', 'sante', 'education', 'beaute',
    'cosmetique', 'logiciel', 'fruits', 'legumes', 'services'
  ];

  const provinces = [
    'Batha', 'Borkou', 'Chari-Baguirmi', 'Ennedi-Est', 'Ennedi-Ouest',
    'Guéra', 'Hadjer-Lamis', 'Kanem', 'Lac', 'Logone-Occidental',
    'Logone-Oriental', 'Mandoul', 'Mayo-Kebbi-Est', 'Mayo-Kebbi-Ouest',
    'Moyen-Chari', 'N\'Djamena', 'Ouaddaï', 'Salamat', 'Sila', 'Tandjilé',
    'Tibesti', 'Wadi Fira', 'Hadjar-Lamis'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      categorie: '',
      prix_min: '',
      prix_max: '',
      etat: '',
      livrable: '',
      province: '',
      ville: ''
    });
    onReset();
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Recherche texte */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Recherche</Form.Label>
                <Form.Control
                  type="text"
                  name="query"
                  value={filters.query}
                  onChange={handleChange}
                  placeholder="Rechercher un produit, un service..."
                />
              </Form.Group>
            </Col>

            {/* Catégorie et État */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Catégorie</Form.Label>
                <Form.Select
                  name="categorie"
                  value={filters.categorie}
                  onChange={handleChange}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>État</Form.Label>
                <Form.Select
                  name="etat"
                  value={filters.etat}
                  onChange={handleChange}
                >
                  <option value="">Tous les états</option>
                  <option value="neuf">Neuf</option>
                  <option value="occasion">Occasion</option>
                  <option value="sur_commande">Sur commande</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Prix min et max */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prix minimum (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_min"
                  value={filters.prix_min}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Prix maximum (FCFA)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix_max"
                  value={filters.prix_max}
                  onChange={handleChange}
                  placeholder="1000000"
                  min="0"
                />
              </Form.Group>
            </Col>

            {/* Localisation */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Select
                  name="province"
                  value={filters.province}
                  onChange={handleChange}
                >
                  <option value="">Toutes les provinces</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Ville</Form.Label>
                <Form.Control
                  type="text"
                  name="ville"
                  value={filters.ville}
                  onChange={handleChange}
                  placeholder="Nom de la ville"
                />
              </Form.Group>
            </Col>

            {/* Options de livraison */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Livraison</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    name="livrable"
                    value=""
                    checked={filters.livrable === ''}
                    onChange={handleChange}
                    label="Peu importe"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="livrable"
                    value="true"
                    checked={filters.livrable === 'true'}
                    onChange={handleChange}
                    label="Avec livraison"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="livrable"
                    value="false"
                    checked={filters.livrable === 'false'}
                    onChange={handleChange}
                    label="Sans livraison"
                  />
                </div>
              </Form.Group>
            </Col>

            {/* Boutons d'action */}
            <Col md={12}>
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <i className="fas fa-times me-1"></i>
                  Réinitialiser
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-1"></i>
                      Rechercher
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearch;