import React, { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { productsAPI } from '../../services/products';
import ProductCard from './ProductCard';

const ProductList = ({ filters = {}, showSearch = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');

  const categories = [
    'alimentation',
    'habillement',
    'electronique',
    'electricite',
    'artisanat',
    'agriculture',
    'sante',
    'education',
    'beaute',
    'cosmetique',
    'logiciel',
    'fruits',
    'legumes',
    'services'
  ];

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(50);
      setProducts(response.data.products);
    } catch (error) {
      setError('Erreur lors du chargement des produits');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.search(searchQuery, selectedCategorie);
      setProducts(response.data.products);
    } catch (error) {
      setError('Erreur lors de la recherche');
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategorie('');
    loadProducts();
  };

  const filteredProducts = products.filter(product => {
    if (filters.vendeur_id && product.vendeur_id !== parseInt(filters.vendeur_id)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2 text-muted">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {showSearch && (
        <div className="bg-light p-4 rounded mb-4">
          <Row className="g-3">
            <Col md={5}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleSearch} className="flex-fill">
                  Appliquer
                </Button>
                <Button variant="outline-secondary" onClick={handleReset}>
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">Aucun produit trouvé</h5>
          <p className="text-muted">
            {searchQuery || selectedCategorie 
              ? 'Essayez de modifier vos critères de recherche' 
              : 'Aucun produit disponible pour le moment'}
          </p>
          {(searchQuery || selectedCategorie) && (
            <Button variant="primary" onClick={handleReset}>
              Voir tous les produits
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </h6>
            <div className="text-muted small">
              Tri: Plus récents
            </div>
          </div>

          <Row>
            {filteredProducts.map(product => (
              <Col xl={3} lg={4} md={6} key={product.id} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductList;