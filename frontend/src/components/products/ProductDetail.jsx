import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Modal } from 'react-bootstrap';
import { productsAPI } from '../../services/products';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Produit non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setPurchasing(true);
    setError('');

    try {
      const response = await walletAPI.achatProduit({
        product_id: product.id,
        quantity: quantity
      });

      setSuccess('Achat effectué avec succès!');
      setShowPurchaseModal(false);
      // Recharger le produit pour mettre à jour la quantité
      loadProduct();
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de l\'achat');
    } finally {
      setPurchasing(false);
    }
  };

  const getEtatBadge = (etat) => {
    const variants = {
      'neuf': 'success',
      'occasion': 'warning',
      'sur_commande': 'info'
    };
    return variants[etat] || 'secondary';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  const calculateReducedPrice = () => {
    if (product.reduction > 0) {
      return product.prix * (1 - product.reduction / 100);
    }
    return null;
  };

  if (loading) {
    return <LoadingSpinner centered text="Chargement du produit..." />;
  }

  if (!product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Produit non trouvé</h3>
          <Button variant="primary" onClick={() => navigate('/marketplace')}>
            Retour à la marketplace
          </Button>
        </div>
      </Container>
    );
  }

  const reducedPrice = calculateReducedPrice();
  const totalPrice = reducedPrice ? reducedPrice * quantity : product.prix * quantity;

  return (
    <Container className="py-4">
      <Row>
        <Col lg={6} className="mb-4">
          {/* Galerie d'images */}
          <Card className="border-0">
            <Card.Body className="p-0">
              {product.photos && product.photos.length > 0 ? (
                <div>
                  <img 
                    src={product.photos[0]} 
                    alt={product.nom}
                    className="img-fluid rounded"
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                  {product.photos.length > 1 && (
                    <div className="d-flex mt-3 gap-2">
                      {product.photos.slice(0, 4).map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`${product.nom} ${index + 1}`}
                          className="img-thumbnail"
                          style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="bg-light d-flex align-items-center justify-content-center rounded"
                  style={{ height: '400px' }}
                >
                  <i className="fas fa-image fa-3x text-muted"></i>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 h-100">
            <Card.Body className="p-4">
              {/* En-tête du produit */}
              <div className="mb-3">
                <Badge bg={getEtatBadge(product.etat)} className="mb-2">
                  {product.etat?.replace('_', ' ')}
                </Badge>
                <Badge bg="secondary" className="ms-2">
                  {product.categorie}
                </Badge>
                {product.reduction > 0 && (
                  <Badge bg="danger" className="ms-2">
                    -{product.reduction}%
                  </Badge>
                )}
              </div>

              <h1 className="h2 fw-bold mb-3">{product.nom}</h1>

              {/* Prix */}
              <div className="mb-4">
                {reducedPrice ? (
                  <div>
                    <span className="text-danger h3 fw-bold me-2">
                      {formatPrice(reducedPrice)}
                    </span>
                    <span className="text-muted text-decoration-line-through h5">
                      {formatPrice(product.prix)}
                    </span>
                  </div>
                ) : (
                  <span className="h3 fw-bold text-primary">
                    {formatPrice(product.prix)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted">{product.description}</p>
              </div>

              {/* Informations du vendeur */}
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-store me-2"></i>
                    Informations du vendeur
                  </h6>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <strong>{product.vendeur_prenom} {product.vendeur_nom}</strong>
                      <div className="text-muted small">Vendeur vérifié</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Options d'achat */}
              <div className="border-top pt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row className="align-items-center mb-3">
                  <Col sm={4}>
                    <Form.Label className="fw-bold">Quantité</Form.Label>
                    <Form.Select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      disabled={product.quantite <= 0}
                    >
                      {[...Array(Math.min(product.quantite, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col sm={8}>
                    <div className="text-end">
                      <div className="h5 fw-bold text-primary">
                        Total: {formatPrice(totalPrice)}
                      </div>
                      <small className="text-muted">
                        Frais de service: {formatPrice(totalPrice * 0.01)} (1%)
                      </small>
                    </div>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  {product.quantite > 0 ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setShowPurchaseModal(true)}
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? (
                        <>
                          <i className="fas fa-shopping-cart me-2"></i>
                          Acheter maintenant
                        </>
                      ) : (
                        'Connectez-vous pour acheter'
                      )}
                    </Button>
                  ) : (
                    <Button variant="secondary" size="lg" disabled>
                      <i className="fas fa-times me-2"></i>
                      Produit en rupture de stock
                    </Button>
                  )}

                  <Button variant="outline-primary">
                    <i className="fas fa-heart me-2"></i>
                    Ajouter aux favoris
                  </Button>
                </div>

                {/* Informations de livraison */}
                {product.livrable && (
                  <div className="mt-3 text-center">
                    <Badge bg="outline-success" text="success">
                      <i className="fas fa-truck me-1"></i>
                      Livraison disponible
                    </Badge>
                    {product.adresse_livraison && (
                      <small className="d-block text-muted mt-1">
                        {product.adresse_livraison}
                      </small>
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de confirmation d'achat */}
      <Modal show={showPurchaseModal} onHide={() => setShowPurchaseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l'achat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir acheter ce produit?</p>
          <div className="bg-light p-3 rounded">
            <strong>Produit:</strong> {product.nom}<br/>
            <strong>Quantité:</strong> {quantity}<br/>
            <strong>Prix unitaire:</strong> {formatPrice(reducedPrice || product.prix)}<br/>
            <strong>Total:</strong> {formatPrice(totalPrice)}<br/>
            <strong>Frais de service:</strong> {formatPrice(totalPrice * 0.01)}<br/>
            <strong>Total débité:</strong> {formatPrice(totalPrice)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handlePurchase} disabled={purchasing}>
            {purchasing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Achat en cours...
              </>
            ) : (
              'Confirmer l\'achat'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetail;