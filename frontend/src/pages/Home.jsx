import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,  // AJOUTEZ CETTE LIGNE
  Form, 
  InputGroup 
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(12);
      const products = response.data.products;
      setFeaturedProducts(products.slice(0, 8));
      setPopularProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      title: 'ZIZ - Électricité',
      description: 'Paiement des factures d\'électricité en mobile money',
      icon: 'fas fa-bolt',
      link: '/services?type=ZIZ',
      color: 'warning'
    },
    {
      title: 'STE - Eau',
      description: 'Paiement des factures d\'eau potable',
      icon: 'fas fa-tint',
      link: '/services?type=STE',
      color: 'info'
    },
    {
      title: 'TAXE Communale',
      description: 'Paiement des taxes de la commune',
      icon: 'fas fa-landmark',
      link: '/services?type=TAXE',
      color: 'success'
    },
    {
      title: 'Transfert P2P',
      description: 'Envoi d\'argent entre utilisateurs',
      icon: 'fas fa-exchange-alt',
      link: '/p2p',
      color: 'primary'
    }
  ];

  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Paiements Sécurisés',
      description: 'Transactions cryptées et sécurisées via mobile money'
    },
    {
      icon: 'fas fa-shipping-fast',
      title: 'Livraison Rapide',
      description: 'Service de livraison disponible dans tout le Tchad'
    },
    {
      icon: 'fas fa-headset',
      title: 'Support 24/7',
      description: 'Équipe de support disponible pour vous aider'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile First',
      description: 'Plateforme optimisée pour mobile et desktop'
    }
  ];

  const categories = [
    { name: 'Alimentation', icon: 'fas fa-apple-alt', count: '150+ produits' },
    { name: 'Électronique', icon: 'fas fa-laptop', count: '80+ produits' },
    { name: 'Habillement', icon: 'fas fa-tshirt', count: '200+ produits' },
    { name: 'Artisanat', icon: 'fas fa-hands', count: '120+ produits' },
    { name: 'Agriculture', icon: 'fas fa-tractor', count: '90+ produits' },
    { name: 'Services', icon: 'fas fa-concierge-bell', count: '50+ services' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">
                <i className="fas fa-star me-1"></i>
                Marketplace N°1 au Tchad
              </Badge>
              
              <h1 className="display-4 fw-bold mb-4">
                Bienvenue sur 
                <span className="text-warning"> ZouDou-Souk</span>
              </h1>
              
              <p className="lead mb-4 fs-5">
                La première marketplace tchadienne qui connecte artisans, commerçants 
                et consommateurs. Achetez, vendez et payez vos factures en toute sécurité 
                avec le mobile money.
              </p>

              {/* Barre de recherche */}
              <div className="mb-4">
                <InputGroup size="lg">
                  <Form.Control
                    placeholder="Rechercher des produits, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0"
                  />
                  <Button 
                    variant="warning" 
                    as={Link} 
                    to={`/marketplace?search=${searchQuery}`}
                  >
                    <i className="fas fa-search"></i>
                  </Button>
                </InputGroup>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                {!isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register" variant="warning" size="lg" className="px-4">
                      <i className="fas fa-user-plus me-2"></i>
                      Créer un compte
                    </Button>
                    <Button as={Link} to="/marketplace" variant="outline-light" size="lg" className="px-4">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Découvrir la marketplace
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/marketplace" variant="warning" size="lg" className="px-4">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Explorer les produits
                    </Button>
                    {user?.role === 'client' && (
                      <Button as={Link} to="/profile?tab=upgrade" variant="outline-light" size="lg" className="px-4">
                        <i className="fas fa-store me-2"></i>
                        Devenir vendeur
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Stats rapides */}
              <Row className="mt-5 pt-3">
                <Col xs={4} className="text-center">
                  <div className="border-end border-light">
                    <h4 className="fw-bold mb-1">500+</h4>
                    <small>Utilisateurs</small>
                  </div>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="border-end border-light">
                    <h4 className="fw-bold mb-1">1K+</h4>
                    <small>Produits</small>
                  </div>
                </Col>
                <Col xs={4} className="text-center">
                  <h4 className="fw-bold mb-1">23</h4>
                  <small>Provinces</small>
                </Col>
              </Row>
            </Col>
            
            <Col lg={6}>
              <div className="text-center position-relative">
                <div className="hero-image-wrapper">
                  <img 
                    src="/assets/hero-marketplace.svg" 
                    alt="Marketplace Tchad" 
                    className="img-fluid floating-animation"
                    style={{ maxHeight: '500px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hero-placeholder" style={{display: 'none'}}>
                    <div className="bg-light rounded-3 p-5 text-dark">
                      <i className="fas fa-store fa-5x text-primary mb-3"></i>
                      <h4>ZouDou-Souk Marketplace</h4>
                      <p>Votre marché digital au Tchad</p>
                    </div>
                  </div>
                </div>
                
                {/* Badges flottants */}
                <div className="position-absolute top-0 start-0">
                  <Card className="border-0 shadow-sm bg-success text-white">
                    <Card.Body className="p-2">
                      <i className="fas fa-mobile-alt me-1"></i>
                      Mobile Money
                    </Card.Body>
                  </Card>
                </div>
                <div className="position-absolute top-0 end-0">
                  <Card className="border-0 shadow-sm bg-warning text-dark">
                    <Card.Body className="p-2">
                      <i className="fas fa-bolt me-1"></i>
                      Paiement ZIZ
                    </Card.Body>
                  </Card>
                </div>
                <div className="position-absolute bottom-0 start-0">
                  <Card className="border-0 shadow-sm bg-info text-white">
                    <Card.Body className="p-2">
                      <i className="fas fa-tint me-1"></i>
                      Paiement STE
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <Badge bg="primary" className="mb-3 px-3 py-2">
                Nos Services
              </Badge>
              <h2 className="fw-bold">Services Intégrés</h2>
              <p className="text-muted lead">
                Découvrez tous les services disponibles sur ZouDou-Souk
              </p>
            </Col>
          </Row>
          
          <Row>
            {services.map((service, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="h-100 shadow-sm border-0 service-card hover-lift">
                  <Card.Body className="text-center p-4">
                    <div className={`icon-wrapper bg-${service.color} rounded-circle mx-auto mb-3`} 
                         style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`${service.icon} fa-2x text-white`}></i>
                    </div>
                    <Card.Title className="h5 fw-bold">{service.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {service.description}
                    </Card.Text>
                    <Button as={Link} to={service.link} variant={service.color} className="mt-auto">
                      Accéder au service
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Catégories Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="fw-bold">Catégories Populaires</h2>
              <p className="text-muted">
                Explorez nos différentes catégories de produits et services
              </p>
            </Col>
          </Row>
          
          <Row>
            {categories.map((category, index) => (
              <Col lg={2} md={4} sm={6} key={index} className="mb-4">
                <Card 
                  as={Link} 
                  to={`/marketplace?categorie=${category.name}`}
                  className="h-100 border-0 text-decoration-none text-center category-card hover-lift"
                >
                  <Card.Body className="p-4">
                    <div className="icon-wrapper bg-light rounded-circle mx-auto mb-3" 
                         style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`${category.icon} fa-2x text-primary`}></i>
                    </div>
                    <Card.Title className="h6 fw-bold mb-1">{category.name}</Card.Title>
                    <small className="text-muted">{category.count}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Produits Populaires */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="fw-bold">Produits Populaires</h2>
              <p className="text-muted">
                Découvrez les produits les plus appréciés par notre communauté
              </p>
            </Col>
          </Row>
          
          {loading ? (
            <Row>
              <Col className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des produits...</p>
              </Col>
            </Row>
          ) : (
            <Row>
              {popularProducts.map(product => (
                <Col lg={3} md={6} key={product.id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          <Row className="mt-4">
            <Col className="text-center">
              <Button as={Link} to="/marketplace" variant="primary" size="lg" className="px-5">
                Voir tous les produits
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="fw-bold">Pourquoi Choisir ZouDou-Souk ?</h2>
              <p className="text-muted">
                Découvrez ce qui fait de nous la meilleure plateforme au Tchad
              </p>
            </Col>
          </Row>
          
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="h-100 border-0 text-center feature-card">
                  <Card.Body className="p-4">
                    <div className="icon-wrapper bg-primary rounded-circle mx-auto mb-3" 
                         style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`${feature.icon} fa-2x text-white`}></i>
                    </div>
                    <Card.Title className="h5 fw-bold">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h3 className="fw-bold mb-3">Prêt à commencer ?</h3>
              <p className="mb-0 lead">
                Rejoignez des milliers d'utilisateurs qui font confiance à ZouDou-Souk
              </p>
            </Col>
            <Col lg={4} className="text-lg-end">
              {!isAuthenticated ? (
                <div className="d-flex gap-2 justify-content-lg-end justify-content-center flex-wrap">
                  <Button as={Link} to="/register" variant="warning" size="lg">
                    <i className="fas fa-user-plus me-2"></i>
                    S'inscrire
                  </Button>
                  <Button as={Link} to="/login" variant="outline-light" size="lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Se connecter
                  </Button>
                </div>
              ) : (
                <Button as={Link} to="/marketplace" variant="warning" size="lg">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Commencer à shopper
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-warning">500+</h3>
                <p className="mb-0">Utilisateurs actifs</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-warning">1,000+</h3>
                <p className="mb-0">Produits disponibles</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-warning">5,000+</h3>
                <p className="mb-0">Transactions sécurisées</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-warning">23</h3>
                <p className="mb-0">Provinces couvertes</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;