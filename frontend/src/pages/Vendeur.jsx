import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VendeurDashboard from '../components/dashboard/VendeurDashboard';
import ProductForm from '../components/products/ProductForm';

const VendeurProducts = () => {
  const handleSuccess = () => {
    // Rediriger ou afficher un message de succès
    window.location.href = '/vendeur';
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2>Publier un nouveau produit</h2>
          <ProductForm onSuccess={handleSuccess} />
        </Col>
      </Row>
    </Container>
  );
};

const VendeurLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-light vh-100 position-fixed">
          <div className="p-3">
            <h5 className="mb-4">Espace Vendeur</h5>
            <Nav className="flex-column">
              <Nav.Link 
                as={Link} 
                to="/vendeur/dashboard" 
                className={location.pathname === '/vendeur/dashboard' ? 'active fw-bold' : ''}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/vendeur/products" 
                className={location.pathname === '/vendeur/products' ? 'active fw-bold' : ''}
              >
                <i className="fas fa-plus me-2"></i>
                Nouveau produit
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/vendeur/my-products" 
                className={location.pathname === '/vendeur/my-products' ? 'active fw-bold' : ''}
              >
                <i className="fas fa-cube me-2"></i>
                Mes produits
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/vendeur/transactions" 
                className={location.pathname === '/vendeur/transactions' ? 'active fw-bold' : ''}
              >
                <i className="fas fa-history me-2"></i>
                Transactions
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={9} lg={10} className="ms-auto">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

const Vendeur = () => {
  const { user, isVendeur } = useAuth();

  // Rediriger si l'utilisateur n'est pas vendeur
  if (!isVendeur && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <VendeurLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/vendeur/dashboard" replace />} />
        <Route path="/dashboard" element={<VendeurDashboard />} />
        <Route path="/products" element={<VendeurProducts />} />
        {/* Ajouter d'autres routes vendeur ici */}
        <Route path="*" element={<Navigate to="/vendeur/dashboard" replace />} />
      </Routes>
    </VendeurLayout>
  );
};

export default Vendeur;