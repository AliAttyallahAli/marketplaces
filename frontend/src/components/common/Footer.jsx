import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto">
      {/* Section principale du footer */}
      <div className="py-5">
        <Container>
          <Row>
            {/* Colonne À propos */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-brand mb-3">
                <h5 className="fw-bold text-white">
                  <i className="fas fa-store me-2 text-primary"></i>
                  ZouDou-Souk
                </h5>
              </div>
              <p className="text-muted mb-3">
                La première marketplace tchadienne qui connecte artisans, commerçants et consommateurs. 
                Paiements sécurisés via mobile money et services intégrés.
              </p>
              <div className="social-links">
                <a href="#" className="text-muted me-3" title="Facebook">
                  <i className="fab fa-facebook-f fa-lg"></i>
                </a>
                <a href="#" className="text-muted me-3" title="Twitter">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="text-muted me-3" title="Instagram">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
                <a href="#" className="text-muted" title="LinkedIn">
                  <i className="fab fa-linkedin-in fa-lg"></i>
                </a>
              </div>
            </Col>

            {/* Colonne Navigation */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="fw-bold text-white mb-3">Navigation</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-muted text-decoration-none hover-text-primary">
                    Accueil
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/marketplace" className="text-muted text-decoration-none hover-text-primary">
                    Marketplace
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/services" className="text-muted text-decoration-none hover-text-primary">
                    Services
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/p2p" className="text-muted text-decoration-none hover-text-primary">
                    Transfert P2P
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/blog" className="text-muted text-decoration-none hover-text-primary">
                    Blog & Partenariats
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Colonne Services */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="fw-bold text-white mb-3">Services</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <span className="text-muted hover-text-primary">
                    <i className="fas fa-bolt me-2 text-warning"></i>
                    ZIZ - Électricité
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-muted hover-text-primary">
                    <i className="fas fa-tint me-2 text-info"></i>
                    STE - Eau
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-muted hover-text-primary">
                    <i className="fas fa-landmark me-2 text-success"></i>
                    Taxes Communales
                  </span>
                </li>
                <li className="mb-2">
                  <span className="text-muted hover-text-primary">
                    <i className="fas fa-exchange-alt me-2 text-primary"></i>
                    Transferts P2P
                  </span>
                </li>
                <li className="mb-2">
                  <Link to="/services" className="text-muted text-decoration-none hover-text-primary">
                    Voir tous les services
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Colonne Légal & Contact */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="fw-bold text-white mb-3">Légal</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/terms" className="text-muted text-decoration-none hover-text-primary">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy" className="text-muted text-decoration-none hover-text-primary">
                    Politique de confidentialité
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/vendor-agreement" className="text-muted text-decoration-none hover-text-primary">
                    Contrat vendeur
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Colonne Contact */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="fw-bold text-white mb-3">Contact</h6>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <i className="fas fa-phone me-2 text-primary"></i>
                  +235 XX XX XX XX
                </li>
                <li className="mb-2">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  contact@zoudousouk.td
                </li>
                <li className="mb-2">
                  <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                  N'Djamena, Tchad
                </li>
                <li className="mb-2">
                  <i className="fas fa-clock me-2 text-primary"></i>
                  Lun - Ven: 8h - 18h
                </li>
              </ul>
            </Col>
          </Row>

          {/* Section applications mobiles */}
          <Row className="mt-4 pt-4 border-top border-secondary">
            <Col lg={6} className="mb-3">
              <h6 className="fw-bold text-white mb-2">Téléchargez notre application</h6>
              <p className="text-muted small mb-3">
                Disponible bientôt sur iOS et Android
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-light btn-sm disabled" disabled>
                  <i className="fab fa-apple me-2"></i>
                  App Store
                </button>
                <button className="btn btn-outline-light btn-sm disabled" disabled>
                  <i className="fab fa-google-play me-2"></i>
                  Google Play
                </button>
              </div>
            </Col>
            <Col lg={6} className="mb-3">
              <h6 className="fw-bold text-white mb-2">Newsletter</h6>
              <p className="text-muted small mb-3">
                Restez informé des nouvelles fonctionnalités
              </p>
              <div className="d-flex">
                <input 
                  type="email" 
                  className="form-control form-control-sm me-2" 
                  placeholder="Votre email"
                  disabled
                />
                <button className="btn btn-primary btn-sm" disabled>
                  S'abonner
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Section copyright */}
      <div className="py-3 bg-dark border-top border-secondary">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="text-muted small mb-0">
                &copy; {currentYear} ZouDou-Souk. Tous droits réservés.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center">
                <span className="text-muted small me-3">Paiements sécurisés avec:</span>
                <div className="payment-methods">
                  <i className="fab fa-cc-visa text-muted me-2 fa-lg" title="Visa"></i>
                  <i className="fab fa-cc-mastercard text-muted me-2 fa-lg" title="Mastercard"></i>
                  <i className="fas fa-mobile-alt text-muted me-2 fa-lg" title="Mobile Money"></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;