import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Déconnexion automatique lors du chargement de la page
    const performLogout = async () => {
      setTimeout(() => {
        logout();
      }, 2000); // Attendre 2 secondes pour montrer le message
    };

    performLogout();
  }, [logout]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow text-center">
            <Card.Body className="p-5">
              <div className="mb-4">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-sign-out-alt fa-2x text-warning"></i>
                </div>
                <h3 className="fw-bold text-warning">Déconnexion</h3>
              </div>

              <Spinner animation="border" variant="warning" className="mb-3" />
              
              <p className="text-muted mb-4">
                Déconnexion en cours...
                <br />
                <small>Redirection vers la page d'accueil</small>
              </p>

              <div className="progress mb-3">
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Logout;