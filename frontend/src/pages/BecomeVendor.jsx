import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BecomeVendor = () => {
  const { isAuthenticated, user } = useAuth();

  const benefits = [
    {
      icon: 'fas fa-users',
      title: 'Large Audience',
      description: 'Accédez à des milliers de clients potentiels au Tchad'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Paiements Sécurisés',
      description: 'Recevez vos paiements via Mobile Money en toute sécurité'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Croissance',
      description: 'Développez votre business avec nos outils analytics'
    },
    {
      icon: 'fas fa-headset',
      title: 'Support Dédié',
      description: 'Bénéficiez d\'un support prioritaire pour les vendeurs'
    }
  ];

  const requirements = [
    'Être majeur (18 ans ou plus)',
    'Avoir un NNI valide',
    'Résider au Tchad',
    'Avoir un numéro de téléphone local',
    'Accepter le contrat vendeur'
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* En-tête */}
          <div className="text-center mb-5">
            <h1 className="fw-bold display-4 mb-3">Devenez Vendeur sur ZouDou-Souk</h1>
            <p className="lead text-muted">
              Rejoignez la première marketplace tchadienne et développez votre business en ligne
            </p>
            {!isAuthenticated ? (
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button as={Link} to="/register" variant="primary" size="lg">
                  Créer un compte
                </Button>
                <Button as={Link} to="/vendor-agreement" variant="outline-primary" size="lg">
                  Voir le contrat
                </Button>
              </div>
            ) : user?.role === 'client' ? (
              <Button as={Link} to="/profile?tab=upgrade" variant="primary" size="lg">
                Devenir vendeur maintenant
              </Button>
            ) : (
              <Badge bg="success" className="fs-6 p-3">
                <i className="fas fa-check me-2"></i>
                Vous êtes déjà vendeur sur ZouDou-Souk
              </Badge>
            )}
          </div>

          {/* Bénéfices */}
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold mb-4">Pourquoi Devenir Vendeur ?</h2>
              <Row>
                {benefits.map((benefit, index) => (
                  <Col lg={6} key={index} className="mb-4">
                    <Card className="border-0 h-100 text-center">
                      <Card.Body className="p-4">
                        <div className="icon-wrapper bg-primary rounded-circle mx-auto mb-3" 
                             style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`${benefit.icon} fa-2x text-white`}></i>
                        </div>
                        <Card.Title className="h5">{benefit.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {benefit.description}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 bg-light">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">Conditions Requises</h3>
                  <ListGroup variant="flush">
                    {requirements.map((requirement, index) => (
                      <ListGroup.Item key={index} className="bg-transparent px-0">
                        <i className="fas fa-check text-success me-2"></i>
                        {requirement}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="border-0 bg-primary text-white">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">Commencez à Vendre</h3>
                  <p className="mb-4">
                    Rejoignez notre communauté de vendeurs et commencez à générer des revenus dès aujourd'hui.
                  </p>
                  
                  <div className="mb-4">
                    <h5 className="fw-bold">Étapes simples :</h5>
                    <ol className="ps-3">
                      <li>Créez votre compte</li>
                      <li>Complétez votre profil vendeur</li>
                      <li>Ajoutez vos produits</li>
                      <li>Commencez à vendre !</li>
                    </ol>
                  </div>

                  {isAuthenticated && user?.role === 'client' ? (
                    <Button 
                      as={Link} 
                      to="/profile?tab=upgrade" 
                      variant="light" 
                      size="lg" 
                      className="w-100"
                    >
                      Devenir vendeur
                    </Button>
                  ) : !isAuthenticated ? (
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="light" 
                      size="lg" 
                      className="w-100"
                    >
                      Créer un compte
                    </Button>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CTA Final */}
          <Row className="mt-5">
            <Col className="text-center">
              <Card className="border-0 bg-warning text-dark">
                <Card.Body className="p-5">
                  <h3 className="fw-bold mb-3">Prêt à Commencer ?</h3>
                  <p className="mb-4 fs-5">
                    Rejoignez des centaines de vendeurs qui développent leur business sur ZouDou-Souk
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Button as={Link} to="/vendor-agreement" variant="outline-dark" size="lg">
                      Lire le contrat
                    </Button>
                    {isAuthenticated && user?.role === 'client' ? (
                      <Button as={Link} to="/profile?tab=upgrade" variant="dark" size="lg">
                        Devenir vendeur
                      </Button>
                    ) : !isAuthenticated ? (
                      <Button as={Link} to="/register" variant="dark" size="lg">
                        S'inscrire maintenant
                      </Button>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default BecomeVendor;