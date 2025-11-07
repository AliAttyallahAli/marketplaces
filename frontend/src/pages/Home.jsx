import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/products';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import NewsletterSubscription from '../components/newsletter/NewsletterSubscription';
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(8);
      setFeaturedProducts(response.data.products);
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

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Bienvenue sur ZouDou-Souk
              </h1>
              <p className="lead mb-4">
                La première marketplace tchadienne qui connecte artisans, commerçants 
                et consommateurs. Achetez, vendez et payez vos factures en toute sécurité 
                avec le mobile money.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {!isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      <i className="fas fa-user-plus me-2"></i>
                      Créer un compte
                    </Button>
                    <Button as={Link} to="/marketplace" variant="outline-light" size="lg">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Découvrir la marketplace
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/marketplace" variant="light" size="lg">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Explorer les produits
                    </Button>
                    {user?.role === 'client' && (
                      <Button as={Link} to="/profile?tab=upgrade" variant="outline-light" size="lg">
                        <i className="fas fa-store me-2"></i>
                        Devenir vendeur
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img 
                  src="/assets/hero-marketplace.svg" 
                  alt="Marketplace Tchad" 
                  className="img-fluid"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold">Nos Services</h2>
              <p className="text-center text-muted">
                Découvrez tous les services disponibles sur ZouDou-Souk
              </p>
            </Col>
          </Row>
          <Row>
            {services.map((service, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="text-center p-4">
                    <div className={`icon-wrapper bg-${service.color} rounded-circle mx-auto mb-3`} 
                         style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`${service.icon} fa-2x text-white`}></i>
                    </div>
                    <Card.Title className="h5">{service.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {service.description}
                    </Card.Text>
                    <Button as={Link} to={service.link} variant={service.color}>
                      Accéder au service
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold">Produits Populaires</h2>
              <p className="text-center text-muted">
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
              </Col>
            </Row>
          ) : (
            <Row>
              {featuredProducts.slice(0, 4).map(product => (
                <Col lg={3} md={6} key={product.id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}

          <Row className="mt-4">
            <Col className="text-center">
              <Button as={Link} to="/marketplace" variant="primary" size="lg">
                Voir tous les produits
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">500+</h3>
                <p className="mb-0">Utilisateurs actifs</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">1,000+</h3>
                <p className="mb-0">Produits disponibles</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">5,000+</h3>
                <p className="mb-0">Transactions sécurisées</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">23</h3>
                <p className="mb-0">Provinces couvertes</p>
              </div>
            </Col>
          </Row>
          // Ajouter avant la fermeture du Container
<section className="py-5 bg-dark text-white">
  <Container>
    <Row className="justify-content-center">
      <Col lg={8}>
        <div className="text-center">
          <h3 className="fw-bold mb-3">Restez Connecté avec ZouDou-Souk</h3>
          <p className="lead mb-4">
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités, 
            promotions exclusives et conseils pour développer votre business.
          </p>
          <NewsletterSubscription type="detailed" />
        </div>
      </Col>
    </Row>
  </Container>
</section>
        </Container>
      </section>
    </div>
  );
};

export default Home;