import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              {/* En-tête */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-primary">Conditions Générales d'Utilisation</h1>
                <p className="text-muted">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
              </div>

              {/* Introduction */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">1. Acceptation des Conditions</h2>
                <p>
                  En accédant et en utilisant la plateforme ZouDou-Souk, vous acceptez d'être lié par les présentes 
                  Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
                  notre plateforme.
                </p>
              </section>

              {/* Définitions */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">2. Définitions</h2>
                <ul>
                  <li><strong>Plateforme</strong> : Le site web et l'application mobile ZouDou-Souk</li>
                  <li><strong>Utilisateur</strong> : Toute personne accédant à la plateforme</li>
                  <li><strong>Client</strong> : Utilisateur effectuant des achats sur la plateforme</li>
                  <li><strong>Vendeur</strong> : Utilisateur vendant des produits ou services sur la plateforme</li>
                  <li><strong>Services</strong> : Les fonctionnalités de paiement (ZIZ, STE, TAXE)</li>
                  <li><strong>Wallet</strong> : Portefeuille électronique intégré à la plateforme</li>
                </ul>
              </section>

              {/* Inscription et Compte */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">3. Inscription et Compte Utilisateur</h2>
                <h5 className="fw-bold mb-2">3.1 Création de Compte</h5>
                <p>
                  Pour utiliser certaines fonctionnalités, vous devez créer un compte en fournissant des informations 
                  exactes et complètes incluant votre NNI, numéro de téléphone et adresse email.
                </p>

                <h5 className="fw-bold mb-2">3.2 Confidentialité du Compte</h5>
                <p>
                  Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les 
                  activités sur votre compte.
                </p>

                <h5 className="fw-bold mb-2">3.3 Vérification d'Identité</h5>
                <p>
                  ZouDou-Souk se réserve le droit de vérifier votre identité via le processus KYC (Know Your Customer) 
                  pour certaines transactions.
                </p>
              </section>

              {/* Services de la Plateforme */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">4. Services de la Plateforme</h2>
                
                <h5 className="fw-bold mb-2">4.1 Marketplace</h5>
                <p>
                  La plateforme permet la vente et l'achat de produits locaux. ZouDou-Souk agit comme intermédiaire 
                  et n'est pas partie aux transactions entre vendeurs et acheteurs.
                </p>

                <h5 className="fw-bold mb-2">4.2 Services de Paiement</h5>
                <p>
                  Paiement sécurisé des factures d'électricité (ZIZ), d'eau (STE) et des taxes communales via 
                  Mobile Money.
                </p>

                <h5 className="fw-bold mb-2">4.3 Transferts P2P</h5>
                <p>
                  Transfert d'argent entre utilisateurs avec un système de frais de 1% par transaction.
                </p>
              </section>

              {/* Transactions et Paiements */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">5. Transactions et Paiements</h2>
                
                <h5 className="fw-bold mb-2">5.1 Frais de Service</h5>
                <p>
                  Une commission de 1% est appliquée sur chaque transaction effectuée sur la plateforme.
                </p>

                <h5 className="fw-bold mb-2">5.2 Paiements Mobile Money</h5>
                <p>
                  Tous les paiements sont sécurisés via les systèmes Mobile Money disponibles au Tchad.
                </p>

                <h5 className="fw-bold mb-2">5.3 Remboursements</h5>
                <p>
                  Les demandes de remboursement sont traitées au cas par cas selon notre politique de remboursement.
                </p>
              </section>

              {/* Obligations des Utilisateurs */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">6. Obligations des Utilisateurs</h2>
                
                <h5 className="fw-bold mb-2">6.1 Conformité Légale</h5>
                <p>
                  Vous vous engagez à respecter toutes les lois et réglementations tchadiennes applicables.
                </p>

                <h5 className="fw-bold mb-2">6.2 Contenu Interdit</h5>
                <p>
                  Il est interdit de publier du contenu illégal, frauduleux, diffamatoire ou contraire aux bonnes mœurs.
                </p>

                <h5 className="fw-bold mb-2">6.3 Sécurité</h5>
                <p>
                  Vous ne devez pas tenter de contourner les mesures de sécurité de la plateforme.
                </p>
              </section>

              {/* Propriété Intellectuelle */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">7. Propriété Intellectuelle</h2>
                <p>
                  ZouDou-Souk détient tous les droits de propriété intellectuelle sur la plateforme. Les utilisateurs 
                  conservent les droits sur leur contenu mais accordent une licence pour son utilisation sur la plateforme.
                </p>
              </section>

              {/* Limitation de Responsabilité */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">8. Limitation de Responsabilité</h2>
                <p>
                  ZouDou-Souk n'est pas responsable des disputes entre utilisateurs, de la qualité des produits vendus 
                  ou des erreurs dans les paiements de factures dues à des informations incorrectes fournies par l'utilisateur.
                </p>
              </section>

              {/* Modification des Conditions */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">9. Modification des Conditions</h2>
                <p>
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront 
                  informés des changements significatifs.
                </p>
              </section>

              {/* Loi Applicable */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">10. Loi Applicable et Juridiction</h2>
                <p>
                  Ces conditions sont régies par les lois de la République du Tchad. Tout litige sera soumis aux 
                  tribunaux compétents de N'Djamena.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-4">
                <h2 className="h4 fw-bold mb-3">11. Contact</h2>
                <p>
                  Pour toute question concernant ces conditions, contactez-nous à :
                  <br />
                  <strong>Email :</strong> legal@zoudousouk.td
                  <br />
                  <strong>Téléphone :</strong> +235 XX XX XX XX
                </p>
              </section>

              <div className="border-top pt-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    En utilisant ZouDou-Souk, vous acceptez ces conditions d'utilisation.
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

export default TermsOfService;