import React from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorAgreement = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              {/* En-tête */}
              <div className="text-center mb-5">
                <h1 className="fw-bold text-primary">Contrat Vendeur</h1>
                <p className="text-muted">Conditions spécifiques pour les vendeurs sur ZouDou-Souk</p>
                <Badge bg="success" className="fs-6">
                  Version 2.0 - {new Date().toLocaleDateString('fr-FR')}
                </Badge>
              </div>

              {/* Bannière pour les vendeurs */}
              {isAuthenticated && user?.role === 'vendeur' && (
                <div className="alert alert-success mb-5">
                  <i className="fas fa-check-circle me-2"></i>
                  <strong>Félicitations !</strong> Vous êtes vendeur certifié sur ZouDou-Souk.
                </div>
              )}

              {/* Introduction */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">1. Objet du Contrat</h2>
                <p>
                  Le présent contrat régit les relations entre ZouDou-Souk et les vendeurs utilisant la plateforme 
                  pour commercialiser leurs produits et services. En devenant vendeur, vous acceptez l'ensemble 
                  des conditions ci-dessous.
                </p>
              </section>

              {/* Conditions d'Eligibilité */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">2. Conditions d'Eligibilité</h2>
                
                <h5 className="fw-bold mb-2">2.1 Exigences Minimales</h5>
                <ul>
                  <li>Être majeur (18 ans ou plus)</li>
                  <li>Posséder un numéro NNI valide</li>
                  <li>Avoir un numéro de téléphone tchadien actif</li>
                  <li>Résider au Tchad</li>
                  <li>Compléter le processus de vérification KYC/KYB</li>
                </ul>

                <h5 className="fw-bold mb-2">2.2 Vérification d'Identité</h5>
                <p>
                  Tout vendeur doit fournir les documents suivants pour vérification :
                </p>
                <ul>
                  <li>Copie de la carte NNI</li>
                  <li>Justificatif de domicile</li>
                  <li>Photos des produits (pour certains articles)</li>
                  <li>Certificats d'authenticité si applicable</li>
                </ul>
              </section>

              {/* Engagements du Vendeur */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">3. Engagements du Vendeur</h2>
                
                <h5 className="fw-bold mb-2">3.1 Qualité des Produits</h5>
                <p>Le vendeur s'engage à :</p>
                <ul>
                  <li>Vendre uniquement des produits conformes aux descriptions</li>
                  <li>Respecter les normes de qualité et de sécurité</li>
                  <li>Ne pas vendre de produits contrefaits ou illégaux</li>
                  <li>Maintenir des stocks suffisants</li>
                </ul>

                <h5 className="fw-bold mb-2">3.2 Description des Produits</h5>
                <p>
                  Toute publication doit inclure :
                </p>
                <ul>
                  <li>Photos claires et réelles du produit</li>
                  <li>Description détaillée et honnête</li>
                  <li>Prix exact en FCFA</li>
                  <li>Conditions de livraison claires</li>
                  <li>Délais de traitement des commandes</li>
                </ul>

                <h5 className="fw-bold mb-2">3.3 Service Client</h5>
                <p>
                  Le vendeur doit répondre aux demandes des clients dans un délai de 24 heures et traiter 
                  les réclamations de manière professionnelle.
                </p>
              </section>

              {/* Commission et Paiements */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">4. Commission et Paiements</h2>
                
                <h5 className="fw-bold mb-2">4.1 Structure des Frais</h5>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Type de Transaction</th>
                      <th>Commission</th>
                      <th>Frais Mobile Money</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vente de produits</td>
                      <td>1% du montant de la vente</td>
                      <td>Inclus dans la commission</td>
                    </tr>
                    <tr>
                      <td>Transfert vers compte bancaire</td>
                      <td>0.5%</td>
                      <td>Frais opérateur applicables</td>
                    </tr>
                    <tr>
                      <td>Abonnement mensuel</td>
                      <td>5,000 FCFA/mois</td>
                      <td>Gratuit</td>
                    </tr>
                  </tbody>
                </Table>

                <h5 className="fw-bold mb-2">4.2 Paiement des Ventes</h5>
                <p>
                  Les fonds des ventes sont crédités sur votre wallet ZouDou-Souk après confirmation de la 
                  transaction. Les retraits sont traités sous 24-48 heures.
                </p>

                <h5 className="fw-bold mb-2">4.3 Facturation</h5>
                <p>
                  Des reçus électroniques sont générés pour chaque transaction. Les vendeurs professionnels 
                  peuvent demander des factures détaillées.
                </p>
              </section>

              {/* Politique de Retour et Remboursement */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">5. Politique de Retour et Remboursement</h2>
                
                <h5 className="fw-bold mb-2">5.1 Droit de Rétractation</h5>
                <p>
                  Les clients disposent d'un délai de 7 jours pour retourner un produit non conforme à sa 
                  description. Les frais de retour sont à la charge du vendeur en cas d'erreur de sa part.
                </p>

                <h5 className="fw-bold mb-2">5.2 Produits Non Retourables</h5>
                <ul>
                  <li>Produits personnalisés</li>
                  <li>Produits périssables</li>
                  <li>Produits numériques</li>
                  <li>Produits d'hygiène personnelle</li>
                </ul>

                <h5 className="fw-bold mb-2">5.3 Résolution des Litiges</h5>
                <p>
                  En cas de litige, ZouDou-Souk agit comme médiateur. La décision de la plateforme est 
                  finale en cas d'impasse.
                </p>
              </section>

              {/* Livraison */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">6. Livraison</h2>
                
                <h5 className="fw-bold mb-2">6.1 Options de Livraison</h5>
                <p>Les vendeurs peuvent proposer :</p>
                <ul>
                  <li>Retrait sur place</li>
                  <li>Livraison locale</li>
                  <li>Livraison nationale (via partenaires)</li>
                </ul>

                <h5 className="fw-bold mb-2">6.2 Délais de Livraison</h5>
                <p>
                  Les délais annoncés doivent être respectés. Tout retard significatif doit être communiqué 
                  au client avec une nouvelle date de livraison.
                </p>

                <h5 className="fw-bold mb-2">6.3 Frais de Livraison</h5>
                <p>
                  Les frais de livraison doivent être clairement indiqués lors de la publication. Aucun 
                  frais supplémentaire ne peut être demandé après la commande.
                </p>
              </section>

              {/* Classement et Évaluations */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">7. Classement et Évaluations</h2>
                
                <h5 className="fw-bold mb-2">7.1 Système d'Évaluation</h5>
                <p>
                  Les clients peuvent noter les vendeurs sur une échelle de 1 à 5 étoiles et laisser des 
                  commentaires. Les vendeurs sont encouragés à répondre aux évaluations.
                </p>

                <h5 className="fw-bold mb-2">7.2 Impact des Évaluations</h5>
                <p>
                  Le classement dans les résultats de recherche est influencé par les évaluations, le taux 
                  de réponse et le délai de livraison.
                </p>

                <h5 className="fw-bold mb-2">7.3 Évaluations Injustes</h5>
                <p>
                  Les vendeurs peuvent contester les évaluations manifestement injustes via le support client.
                </p>
              </section>

              {/* Responsabilités et Assurance */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">8. Responsabilités et Assurance</h2>
                
                <h5 className="fw-bold mb-2">8.1 Responsabilité du Vendeur</h5>
                <p>
                  Le vendeur est responsable de la qualité, de la sécurité et de la conformité légale de 
                  ses produits. ZouDou-Souk décline toute responsabilité en cas de problème avec un produit.
                </p>

                <h5 className="fw-bold mb-2">8.2 Assurance</h5>
                <p>
                  Les vendeurs professionnels sont encouragés à souscrire une assurance responsabilité civile 
                  pour couvrir d'éventuels dommages.
                </p>
              </section>

              {/* Suspension et Résiliation */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">9. Suspension et Résiliation</h2>
                
                <h5 className="fw-bold mb-2">9.1 Motifs de Suspension</h5>
                <p>Un compte vendeur peut être suspendu pour :</p>
                <ul>
                  <li>Violation répétée des conditions</li>
                  <li>Plaintes multiples de clients</li>
                  <li>Activité frauduleuse</li>
                  <li>Non-paiement des commissions</li>
                </ul>

                <h5 className="fw-bold mb-2">9.2 Procédure de Résiliation</h5>
                <p>
                  Les vendeurs peuvent résilier leur compte à tout moment. Les transactions en cours doivent 
                  être honorées avant la fermeture définitive.
                </p>
              </section>

              {/* Propriété Intellectuelle */}
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">10. Propriété Intellectuelle</h2>
                <p>
                  Le vendeur garantit détenir les droits nécessaires sur le contenu publié (photos, descriptions, 
                  marques). ZouDou-Souk peut utiliser ce contenu pour promouvoir la plateforme.
                </p>
              </section>

              {/* Contact Support Vendeur */}
              <section className="mb-4">
                <h2 className="h4 fw-bold mb-3">11. Support Vendeur</h2>
                <p>
                  Notre équipe dédiée aux vendeurs est disponible pour vous accompagner :
                  <br />
                  <strong>Email :</strong> vendeurs@zoudousouk.td
                  <br />
                  <strong>Téléphone :</strong> +235 XX XX XX XX
                  <br />
                  <strong>Horaires :</strong> Lundi - Vendredi, 8h - 18h
                </p>
                
                <div className="alert alert-info mt-3">
                  <i className="fas fa-graduation-cap me-2"></i>
                  <strong>Formation disponible :</strong> Nous proposons des sessions de formation gratuites 
                  pour optimiser votre présence sur la plateforme.
                </div>
              </section>

              {/* Signature */}
              <div className="border-top pt-4 mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Pour ZouDou-Souk</h6>
                    <p className="small text-muted">
                      <strong>Directeur Général</strong><br />
                      Fait à N'Djamena, le {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Pour le Vendeur</h6>
                    <p className="small text-muted">
                      <strong>Nom :</strong> ________________<br />
                      <strong>Date :</strong> ________________<br />
                      <strong>Signature :</strong> ________________
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <small className="text-muted">
                    En devenant vendeur, vous acceptez intégralement ce contrat.
                  </small>
                  <div>
                    <Link to="/" className="btn btn-outline-primary me-2">
                      Retour à l'accueil
                    </Link>
                    {!isAuthenticated && (
                      <Link to="/register" className="btn btn-primary">
                        Devenir vendeur
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorAgreement;