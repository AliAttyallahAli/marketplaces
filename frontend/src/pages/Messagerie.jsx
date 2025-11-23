import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Messagerie = () => {
  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">
                <i className="fas fa-comments me-2"></i>
                Messagerie
              </h1>
              <p className="text-muted mb-0">
                Gérez vos conversations avec les autres utilisateurs
              </p>
            </div>
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>
              Nouvelle conversation
            </Button>
          </div>

          <Row>
            <Col lg={8}>
              <Card>
                <Card.Body className="text-center py-5">
                  <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                  <h4>Messagerie complète bientôt disponible</h4>
                  <p className="text-muted mb-3">
                    La messagerie complète avec historique des conversations 
                    et fonctionnalités avancées sera disponible prochainement.
                  </p>
                  <p>
                    En attendant, utilisez la{' '}
                    <strong>messagerie rapide</strong> en cliquant sur l'icône 
                    <i className="fas fa-comments mx-2 text-primary"></i>
                    dans le header.
                  </p>
                  <div className="mt-4">
                    <Button as={Link} to="/" variant="outline-primary" className="me-2">
                      <i className="fas fa-home me-2"></i>
                      Retour à l'accueil
                    </Button>
                    <Button variant="primary">
                      <i className="fas fa-question-circle me-2"></i>
                      Aide & Support
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Fonctionnalités à venir
                  </h6>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Historique complet des messages
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Envoi de fichiers et images
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Conversations de groupe
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Notifications push
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Recherche dans les messages
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="fas fa-headset me-2"></i>
                    Support rapide
                  </h6>
                </Card.Header>
                <Card.Body>
                  <p className="small text-muted">
                    Besoin d'aide ? Contactez notre équipe de support directement via la messagerie.
                  </p>
                  <Button variant="outline-success" size="sm" className="w-100">
                    <i className="fas fa-comment-dots me-2"></i>
                    Contacter le support
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Messagerie;