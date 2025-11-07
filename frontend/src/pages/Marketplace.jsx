import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductList from '../components/products/ProductList';

const Marketplace = () => {
  const { isAuthenticated, isVendeur, user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { key: 'all', name: 'Tous les produits', icon: 'fas fa-th' },
    { key: 'alimentation', name: 'Alimentation', icon: 'fas fa-utensils' },
    { key: 'habillement', name: 'Habillement', icon: 'fas fa-tshirt' },
    { key: 'electronique', name: 'Électronique', icon: 'fas fa-laptop' },
    { key: 'artisanat', name: 'Artisanat', icon: 'fas fa-hands' },
    { key: 'agriculture', name: 'Agriculture', icon: 'fas fa-tractor' },
    { key: 'services', name: 'Services', icon: 'fas fa-concierge-bell' }
  ];

  return (
    <Container className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Marketplace</h1>
              <p className="text-muted mb-0">
                Découvrez tous les produits disponibles sur ZouDou-Souk
              </p>
            </div>
            {isAuthenticated && isVendeur && (
              <Button as={Link} to="/vendeur/products/new" variant="primary">
                <i className="fas fa-plus me-2"></i>
                Ajouter un produit
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Categories Tabs */}
      <Row className="mb-4">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-3"
            fill
          >
            {categories.map(category => (
              <Tab
                key={category.key}
                eventKey={category.key}
                title={
                  <span>
                    <i className={`${category.icon} me-2`}></i>
                    {category.name}
                  </span>
                }
              >
                <div className="mt-3">
                  <ProductList 
                    filters={activeTab !== 'all' ? { categorie: activeTab } : {}}
                    showSearch={true}
                  />
                </div>
              </Tab>
            ))}
          </Tabs>
        </Col>
      </Row>

      {/* Become Seller Banner */}
      {isAuthenticated && !isVendeur && (
        <Row className="mt-5">
          <Col>
            <div className="bg-primary text-white rounded p-4 text-center">
              <h4 className="fw-bold mb-3">
                <i className="fas fa-store me-2"></i>
                Devenez vendeur sur ZouDou-Souk
              </h4>
              <p className="mb-3">
                Vendez vos produits et services à toute la communauté Tchadienne. 
                Génez votre boutique en ligne et acceptez les paiements mobile money.
              </p>
              <Button 
                as={Link} 
                to="/profile?tab=upgrade" 
                variant="light" 
                size="lg"
              >
                <i className="fas fa-rocket me-2"></i>
                Devenir vendeur
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Marketplace;