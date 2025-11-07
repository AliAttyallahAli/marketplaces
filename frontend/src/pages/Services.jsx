import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // AJOUTER CET IMPORT
import { useAuth } from '../context/AuthContext';
import ServicesList from '../components/services/ServicesList';
import ZIZPayment from '../components/services/ZIZPayment';
import STEPayment from '../components/services/STEPayment';
import TaxPayment from '../components/services/TaxPayment';
import AddServiceForm from '../components/services/AddServiceForm';

const Services = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // ... reste du code
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="py-5">
              <i className="fas fa-lock fa-3x text-muted mb-3"></i>
              <h3 className="fw-bold">Accès non autorisé</h3>
              <p className="text-muted">
                Vous devez être connecté pour accéder aux services de paiement
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="fw-bold">Services de Paiement</h1>
            <p className="text-muted">
              Payez vos factures de services en toute sécurité avec Mobile Money
            </p>
          </div>
        </Col>
      </Row>

      {/* Section Devenir Partenaire */}
      <Row className="mb-4">
        <Col>
          <AddServiceForm />
        </Col>
      </Row>

      {isAdmin && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info">
              <i className="fas fa-cog me-2"></i>
              <strong>Mode Administrateur</strong> - Vous pouvez gérer tous les services depuis le{' '}
              <a href="/admin?tab=services" className="alert-link">dashboard administrateur</a>
            </Alert>
          </Col>
        </Row>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
        fill
      >
        <Tab eventKey="all" title={
          <span>
            <i className="fas fa-th me-2"></i>
            Tous les services
          </span>
        }>
          <ServicesList />
        </Tab>

        <Tab eventKey="ziz" title={
          <span>
            <i className="fas fa-bolt me-2"></i>
            ZIZ - Électricité
          </span>
        }>
          <Row className="justify-content-center">
            <Col lg={8}>
              <ZIZPayment />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="ste" title={
          <span>
            <i className="fas fa-tint me-2"></i>
            STE - Eau
          </span>
        }>
          <Row className="justify-content-center">
            <Col lg={8}>
              <STEPayment />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="tax" title={
          <span>
            <i className="fas fa-landmark me-2"></i>
            Taxes Communales
          </span>
        }>
          <Row className="justify-content-center">
            <Col lg={8}>
              <TaxPayment />
            </Col>
          </Row>
        </Tab>

        {isAdmin && (
          <Tab eventKey="manage" title={
            <span>
              <i className="fas fa-cog me-2"></i>
              Gestion
            </span>
          }>
            <div className="text-center py-4">
              <i className="fas fa-cogs fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">Gestion des Services</h5>
              <p className="text-muted mb-3">
                Accédez au panneau d'administration complet pour gérer tous les services
              </p>
              <a href="/service-management" className="btn btn-primary">
                <i className="fas fa-external-link-alt me-2"></i>
                Ouvrir la Gestion des Services
              </a>
            </div>
          </Tab>
        )}
      </Tabs>

      {/* Informations importantes */}
      <Row className="mt-5">
        <Col>
          <div className="bg-primary text-white rounded p-4">
            <Row>
              <Col md={8}>
                <h5 className="fw-bold mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Comment ça marche?
                </h5>
                <ul className="mb-0">
                  <li>Sélectionnez le service que vous souhaitez payer</li>
                  <li>Renseignez les informations de votre facture</li>
                  <li>Confirmez le paiement avec votre mobile money</li>
                  <li>Recevez instantanément la confirmation de paiement</li>
                </ul>
              </Col>
              <Col md={4} className="text-center">
                <div className="bg-white text-primary rounded p-3">
                  <i className="fas fa-shield-alt fa-2x mb-2"></i>
                  <h6 className="fw-bold mb-0">Paiement Sécurisé</h6>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;