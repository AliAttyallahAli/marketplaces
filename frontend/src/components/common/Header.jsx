import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationSystem from '../notifications/NotificationSystem'; // Chez corrigé

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="fas fa-store me-2"></i>
          ZouDou-Souk
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              <i className="fas fa-home me-1"></i>
              Accueil
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/marketplace"
              active={location.pathname === '/marketplace'}
            >
              <i className="fas fa-shopping-bag me-1"></i>
              Marketplace
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/p2p"
              active={location.pathname === '/p2p'}
            >
              <i className="fas fa-exchange-alt me-1"></i>
              P2P Transfert
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              active={location.pathname === '/services'}
            >
              <i className="fas fa-concierge-bell me-1"></i>
              Services
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/blog"
              active={location.pathname === '/blog'}
            >
              <i className="fas fa-newspaper me-1"></i>
              Blog & Partenariats
            </Nav.Link>
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="nav-item me-3">
                  <NotificationSystem />
                </div>

                {/* Chat */}
                <Nav.Link as={Link} to="/chat" className="me-2">
                  <i className="fas fa-comments"></i>
                </Nav.Link>

                {/* Documents */}
                <Nav.Link as={Link} to="/documents" className="me-2">
                  <i className="fas fa-file-alt"></i>
                </Nav.Link>

                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-warning me-2">
                    <i className="fas fa-cog me-1"></i>
                    Administration
                  </Nav.Link>
                )}

                {user?.role === 'vendeur' && (
                  <Nav.Link as={Link} to="/vendeur" className="text-success me-2">
                    <i className="fas fa-chart-line me-1"></i>
                    Dashboard Vendeur
                  </Nav.Link>
                )}

                {user?.role === 'client' && (
                  <Button
                    as={Link}
                    to="/profile?tab=upgrade"
                    variant="outline-light"
                    size="sm"
                    className="me-2"
                  >
                    <i className="fas fa-store me-1"></i>
                    Devenir Vendeur
                  </Button>
                )}

                <NavDropdown
                  title={
                    <span>
                      <i className="fas fa-user me-1"></i>
                      {user?.prenom} {user?.nom}
                      {user?.role === 'client' && (
                        <Badge bg="secondary" className="ms-1">Client</Badge>
                      )}
                      {user?.role === 'vendeur' && (
                        <Badge bg="success" className="ms-1">Vendeur</Badge>
                      )}
                      {user?.role === 'admin' && (
                        <Badge bg="warning" className="ms-1">Admin</Badge>
                      )}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="fas fa-id-card me-2"></i>
                    Mon Profil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile?tab=wallet">
                    <i className="fas fa-wallet me-2"></i>
                    Mon Portefeuille
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/documents">
                    <i className="fas fa-folder me-2"></i>
                    Mes Documents
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/statistics">
                    <i className="fas fa-chart-bar me-2"></i>
                    Mes Statistiques
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/settings">
                    <i className="fas fa-cog me-2"></i>
                    Paramètres
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Connexion
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="fas fa-user-plus me-1"></i>
                  Inscription
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;