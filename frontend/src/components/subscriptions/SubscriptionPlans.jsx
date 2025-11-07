import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge, Modal, Alert } from 'react-bootstrap';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const subscriptionPlans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      duration: '1 mois',
      price: 5000,
      features: [
        'Publication illimitée de produits',
        'Tableau de bord vendeur',
        'Statistiques de vente',
        'Support prioritaire',
        'Frais de transaction réduits à 0.8%'
      ],
      popular: false
    },
    {
      id: 'quarterly',
      name: 'Trimestriel',
      duration: '3 mois',
      price: 12000,
      originalPrice: 15000,
      features: [
        'Tous les avantages Mensuel',
        'Économie de 20%',
        'Badge "Vendeur Certifié"',
        'Mise en avant des produits',
        'Frais de transaction réduits à 0.7%'
      ],
      popular: true
    },
    {
      id: 'semester',
      name: 'Semestriel',
      duration: '6 mois',
      price: 20000,
      originalPrice: 30000,
      features: [
        'Tous les avantages Trimestriel',
        'Économie de 33%',
        'Page boutique personnalisée',
        'Analytics avancées',
        'Frais de transaction réduits à 0.6%'
      ],
      popular: false
    },
    {
      id: 'annual',
      name: 'Annuel',
      duration: '12 mois',
      price: 35000,
      originalPrice: 60000,
      features: [
        'Tous les avantages Semestriel',
        'Économie de 42%',
        'Formation e-commerce offerte',
        'Support dédié 24/7',
        'Frais de transaction réduits à 0.5%'
      ],
      popular: false
    }
  ];

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const confirmSubscription = async () => {
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      await walletAPI.payerFacture({
        service_type: 'abonnement',
        amount: selectedPlan.price,
        reference: `SUB_${selectedPlan.id}_${Date.now()}`
      });

      setMessage({
        type: 'success',
        text: `Abonnement ${selectedPlan.name} activé avec succès!`
      });
      setShowPaymentModal(false);
      setSelectedPlan(null);
      
      // Rediriger vers le dashboard vendeur après 2 secondes
      setTimeout(() => {
        window.location.href = '/vendeur';
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.error || 'Erreur lors de l\'abonnement'
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  return (
    <div className="subscription-plans">
      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <div className="text-center mb-5">
        <h2 className="fw-bold">Choisissez Votre Abonnement</h2>
        <p className="text-muted">
          Devenez vendeur sur ZouDou-Souk et développez votre business en ligne
        </p>
      </div>

      <Row className="g-4">
        {subscriptionPlans.map(plan => (
          <Col lg={3} md={6} key={plan.id}>
            <Card className={`h-100 border-0 shadow-sm ${plan.popular ? 'border-primary border-2' : ''}`}>
              {plan.popular && (
                <div className="position-absolute top-0 start-50 translate-middle">
                  <Badge bg="primary" className="px-3 py-2">
                    <i className="fas fa-crown me-1"></i>
                    Populaire
                  </Badge>
                </div>
              )}
              
              <Card.Body className="p-4 d-flex flex-column">
                <div className="text-center mb-4">
                  <h5 className="fw-bold">{plan.name}</h5>
                  <div className="my-3">
                    <span className="h2 fw-bold text-primary">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <small className="text-muted text-decoration-line-through ms-2">
                        {formatPrice(plan.originalPrice)}
                      </small>
                    )}
                  </div>
                  <small className="text-muted">{plan.duration}</small>
                </div>

                <ul className="list-unstyled mb-4 flex-grow-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <small>{feature}</small>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline-primary"}
                  className="w-100 mt-auto"
                  onClick={() => handleSubscribe(plan)}
                >
                  {user?.role === 'vendeur' ? 'Changer de plan' : 'Devenir Vendeur'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de confirmation de paiement */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l'abonnement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <>
              <p>Êtes-vous sûr de vouloir souscrire à l'abonnement {selectedPlan.name}?</p>
              <div className="bg-light p-3 rounded">
                <strong>Forfait:</strong> {selectedPlan.name}<br/>
                <strong>Durée:</strong> {selectedPlan.duration}<br/>
                <strong>Prix:</strong> {formatPrice(selectedPlan.price)}<br/>
                <strong>Frais de service (1%):</strong> {formatPrice(selectedPlan.price * 0.01)}<br/>
                <strong>Total à payer:</strong> {formatPrice(selectedPlan.price * 1.01)}
              </div>
              <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                <small className="text-warning">
                  <i className="fas fa-info-circle me-1"></i>
                  Votre abonnement sera activé immédiatement après paiement
                </small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={confirmSubscription} disabled={processing}>
            {processing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Traitement...
              </>
            ) : (
              'Confirmer et Payer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;