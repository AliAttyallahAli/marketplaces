import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Notifications</h1>
          <p className="text-muted">Gérez vos préférences de notification</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Préférences de Notification</h5>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Notifications par email"
                    defaultChecked
                  />
                  <Form.Text className="text-muted">
                    Recevez des notifications importantes par email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Notifications SMS"
                    defaultChecked
                  />
                  <Form.Text className="text-muted">
                    Recevez des alertes importantes par SMS
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Notifications push"
                    defaultChecked
                  />
                  <Form.Text className="text-muted">
                    Recevez des notifications dans votre navigateur
                  </Form.Text>
                </Form.Group>

                <hr />

                <h6 className="fw-bold mb-3">Types de notifications</h6>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Transactions et paiements"
                    defaultChecked
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Promotions et offres"
                    defaultChecked
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Nouveaux produits"
                    defaultChecked
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Actualités et mises à jour"
                    defaultChecked
                  />
                </Form.Group>

                <Button variant="primary">Enregistrer les préférences</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationsPage;