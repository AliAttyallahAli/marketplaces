import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              {/* En-tête */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-primary">Politique de Confidentialité</h1>
                <p className="text-muted">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                <div className="alert alert-info">
                  <i className="fas fa-shield-alt me-2"></i>
                  Nous protégeons vos données personnelles avec la plus grande attention.
                </div>
              </div>

              {/* Introduction */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">1. Introduction</h2>
                <p>
                  Chez ZouDou-Souk, nous prenons la protection de vos données personnelles très au sérieux. 
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                </p>
              </section>

              {/* Données Collectées */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">2. Données que Nous Collectons</h2>
                
                <h5 className="fw-bold mb-2">2.1 Informations d'Inscription</h5>
                <ul>
                  <li>Nom et prénom</li>
                  <li>Numéro NNI (Carte d'identité)</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse email</li>
                  <li>Date et lieu de naissance</li>
                  <li>Adresse (province, région, ville, quartier)</li>
                </ul>

                <h5 className="fw-bold mb-2">2.2 Données de Transaction</h5>
                <ul>
                  <li>Historique des achats et ventes</li>
                  <li>Détails des transferts P2P</li>
                  <li>Paiements de factures</li>
                  <li>Soldes de wallet</li>
                </ul>

                <h5 className="fw-bold mb-2">2.3 Données Techniques</h5>
                <ul>
                  <li>Adresse IP</li>
                  <li>Type de navigateur et appareil</li>
                  <li>Logs d'activité</li>
                  <li>Cookies et technologies similaires</li>
                </ul>
              </section>

              {/* Utilisation des Données */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">3. Utilisation de Vos Données</h2>
                
                <h5 className="fw-bold mb-2">3.1 Finalités</h5>
                <p>Nous utilisons vos données pour :</p>
                <ul>
                  <li>Fournir et améliorer nos services</li>
                  <li>Vérifier votre identité (KYC/KYB)</li>
                  <li>Traiter les transactions et paiements</li>
                  <li>Prévenir la fraude et assurer la sécurité</li>
                  <li>Vous envoyer des notifications importantes</li>
                  <li>Respecter nos obligations légales</li>
                </ul>

                <h5 className="fw-bold mb-2">3.2 Base Légale</h5>
                <p>
                  Le traitement de vos données est basé sur :
                </p>
                <ul>
                  <li>Votre consentement explicite</li>
                  <li>L'exécution d'un contrat</li>
                  <li>Nos obligations légales</li>
                  <li>Nos intérêts légitimes</li>
                </ul>
              </section>

              {/* Partage des Données */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">4. Partage de Vos Données</h2>
                
                <h5 className="fw-bold mb-2">4.1 Avec qui nous partageons</h5>
                <p>Nous pouvons partager vos données avec :</p>
                <ul>
                  <li>
                    <strong>Prestataires de services</strong> : Opérateurs Mobile Money, hébergeurs, services de sécurité
                  </li>
                  <li>
                    <strong>Autorités légales</strong> : Lorsque requis par la loi
                  </li>
                  <li>
                    <strong>Partenaires commerciaux</strong> : Uniquement avec votre consentement
                  </li>
                </ul>

                <h5 className="fw-bold mb-2">4.2 Transferts Internationaux</h5>
                <p>
                  Vos données sont stockées et traitées au Tchad. Nous ne transférons pas vos données en dehors 
                  du territoire tchadien sans votre consentement explicite.
                </p>
              </section>

              {/* Sécurité des Données */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">5. Sécurité des Données</h2>
                
                <h5 className="fw-bold mb-2">5.1 Mesures de Sécurité</h5>
                <p>Nous mettons en œuvre :</p>
                <ul>
                  <li>Chiffrement des données sensibles</li>
                  <li>Contrôles d'accès stricts</li>
                  <li>Surveillance continue de la sécurité</li>
                  <li>Formation du personnel à la protection des données</li>
                  <li>Sauvegardes régulières</li>
                </ul>

                <h5 className="fw-bold mb-2">5.2 Conservation des Données</h5>
                <p>
                  Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services et 
                  respecter nos obligations légales.
                </p>
              </section>

              {/* Vos Droits */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">6. Vos Droits</h2>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit d'Accès</h6>
                      <p className="small">Vous pouvez accéder à vos données personnelles.</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit de Rectification</h6>
                      <p className="small">Vous pouvez corriger vos données inexactes.</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit à l'Effacement</h6>
                      <p className="small">Vous pouvez demander la suppression de vos données.</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit d'Opposition</h6>
                      <p className="small">Vous pouvez vous opposer à certains traitements.</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit à la Portabilité</h6>
                      <p className="small">Vous pouvez récupérer vos données dans un format lisible.</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="fw-bold">Droit de Limitation</h6>
                      <p className="small">Vous pouvez limiter le traitement de vos données.</p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning mt-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Pour exercer vos droits, contactez notre délégué à la protection des données.
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">7. Cookies et Technologies Similaires</h2>
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser 
                  le contenu. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
                </p>
              </section>

              {/* Protection des Enfants */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">8. Protection des Enfants</h2>
                <p>
                  Notre plateforme n'est pas destinée aux enfants de moins de 18 ans. Nous ne collectons pas 
                  sciemment de données personnelles d'enfants.
                </p>
              </section>

              {/* Modifications */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">9. Modifications de cette Politique</h2>
                <p>
                  Nous pouvons mettre à jour cette politique. Les modifications significatives seront 
                  communiquées par email ou via une notification sur la plateforme.
                </p>
              </section>

              {/* Contact DPO */}
              <section className="mb-4">
                <h2 className="h4 fw-bold mb-3">10. Contact</h2>
                <p>
                  Pour toute question concernant la protection de vos données :
                  <br />
                  <strong>Délégué à la Protection des Données :</strong>
                  <br />
                  <strong>Email :</strong> dpo@zoudousouk.td
                  <br />
                  <strong>Téléphone :</strong> +235 XX XX XX XX
                  <br />
                  <strong>Adresse :</strong> N'Djamena, Tchad
                </p>
                
                <div className="alert alert-success mt-3">
                  <i className="fas fa-clock me-2"></i>
                  Nous nous engageons à répondre à vos demandes dans un délai de 30 jours.
                </div>
              </section>

              <div className="border-top pt-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Votre vie privée est notre priorité.
                  </small>
                  <Link to="/" className="btn btn-primary">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;