import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  InputGroup, 
  Badge,
  Pagination,
  Dropdown,
  Modal,
  Alert
} from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categorie: searchParams.get('categorie') || '',
    etat: searchParams.get('etat') || '',
    prixMin: '',
    prixMax: '',
    livrable: ''
  });

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Catégories disponibles
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

  // États des produits
  const etats = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'occasion', label: 'Occasion' },
    { value: 'sur_commande', label: 'Sur commande' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  useEffect(() => {
    // Mettre à jour l'URL avec les filtres
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.categorie) params.categorie = filters.categorie;
    if (filters.etat) params.etat = filters.etat;
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll(100);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.categorie.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filters.categorie) {
      filtered = filtered.filter(product =>
        product.categorie === filters.categorie
      );
    }

    // Filtre par état
    if (filters.etat) {
      filtered = filtered.filter(product =>
        product.etat === filters.etat
      );
    }

    // Filtre par prix minimum
    if (filters.prixMin) {
      filtered = filtered.filter(product =>
        product.prix >= parseFloat(filters.prixMin)
      );
    }

    // Filtre par prix maximum
    if (filters.prixMax) {
      filtered = filtered.filter(product =>
        product.prix <= parseFloat(filters.prixMax)
      );
    }

    // Filtre par livraison
    if (filters.livrable !== '') {
      filtered = filtered.filter(product =>
        product.livrable === (filters.livrable === 'true')
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset à la première page après filtrage
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categorie: '',
      etat: '',
      prixMin: '',
      prixMax: '',
      livrable: ''
    });
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductCreated = () => {
    setShowProductModal(false);
    loadProducts(); // Recharger les produits
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">Marketplace</h1>
              <p className="text-muted mb-0">
                Découvrez {products.length} produits disponibles
                {filters.search && ` pour "${filters.search}"`}
                {filters.categorie && ` dans "${filters.categorie}"`}
              </p>
            </div>
            
            {isAuthenticated && user?.role === 'vendeur' && (
              <Button 
                variant="primary" 
                onClick={() => setShowProductModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Publier un produit
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        {/* Sidebar Filtres */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Filtres</h6>
                {getActiveFiltersCount() > 0 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-decoration-none p-0"
                  >
                    Tout effacer
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Recherche */}
              <Form.Group className="mb-3">
                <Form.Label>Recherche</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* Catégorie */}
              <Form.Group className="mb-3">
                <Form.Label>Catégorie</Form.Label>
                <Form.Select
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* État */}
              <Form.Group className="mb-3">
                <Form.Label>État</Form.Label>
                <Form.Select
                  value={filters.etat}
                  onChange={(e) => handleFilterChange('etat', e.target.value)}
                >
                  <option value="">Tous les états</option>
                  {etats.map(etat => (
                    <option key={etat.value} value={etat.value}>
                      {etat.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Prix */}
              <Form.Group className="mb-3">
                <Form.Label>Prix (XAF)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={filters.prixMin}
                      onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={filters.prixMax}
                      onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* Livraison */}
              <Form.Group className="mb-3">
                <Form.Label>Livraison</Form.Label>
                <Form.Select
                  value={filters.livrable}
                  onChange={(e) => handleFilterChange('livrable', e.target.value)}
                >
                  <option value="">Peu importe</option>
                  <option value="true">Avec livraison</option>
                  <option value="false">Sans livraison</option>
                </Form.Select>
              </Form.Group>

              {/* Résultats */}
              <div className="bg-light rounded p-3">
                <small className="text-muted d-block">Résultats trouvés</small>
                <strong className="text-primary">{filteredProducts.length}</strong>
                <small className="text-muted"> produits</small>
              </div>
            </Card.Body>
          </Card>

          {/* Catégories rapides */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-white border-0">
              <h6 className="fw-bold mb-0">Catégories populaires</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {categories.slice(0, 8).map(cat => (
                  <Badge
                    key={cat}
                    bg={filters.categorie === cat ? 'primary' : 'light'}
                    text={filters.categorie === cat ? 'white' : 'dark'}
                    className="cursor-pointer hover-lift"
                    onClick={() => handleFilterChange('categorie', filters.categorie === cat ? '' : cat)}
                    style={{ cursor: 'pointer' }}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Contenu principal */}
        <Col lg={9}>
          {/* Barre d'outils */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted">
                      {filteredProducts.length} produit(s) trouvé(s)
                    </span>
                    
                    {getActiveFiltersCount() > 0 && (
                      <Badge bg="primary" pill>
                        {getActiveFiltersCount()} filtre(s) actif(s)
                      </Badge>
                    )}
                  </div>
                </Col>
                
                <Col md={6} className="text-md-end">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <i className="fas fa-sort me-2"></i>
                      Trier par
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Prix croissant</Dropdown.Item>
                      <Dropdown.Item>Prix décroissant</Dropdown.Item>
                      <Dropdown.Item>Plus récents</Dropdown.Item>
                      <Dropdown.Item>Plus anciens</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Produits */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des produits...</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucun produit trouvé</h5>
                <p className="text-muted mb-4">
                  {getActiveFiltersCount() > 0 
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun produit n'est disponible pour le moment"
                  }
                </p>
                {getActiveFiltersCount() > 0 && (
                  <Button variant="primary" onClick={clearFilters}>
                    Effacer tous les filtres
                  </Button>
                )}
                {isAuthenticated && user?.role === 'vendeur' && (
                  <div className="mt-3">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowProductModal(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Publier le premier produit
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ) : (
            <>
              {/* Grille de produits */}
              <Row>
                {currentProducts.map(product => (
                  <Col xl={3} lg={4} md={6} key={product.id} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                    />
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Modal de publication de produit */}
      <Modal 
        show={showProductModal} 
        onHide={() => setShowProductModal(false)} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Publier un nouveau produit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm 
            onSuccess={handleProductCreated}
            onCancel={() => setShowProductModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Marketplace;