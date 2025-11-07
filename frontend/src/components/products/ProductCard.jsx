import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const getEtatBadge = (etat) => {
    const variants = {
      'neuf': 'success',
      'occasion': 'warning',
      'sur_commande': 'info'
    };
    return variants[etat] || 'secondary';
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'alimentation': 'success',
      'habillement': 'primary',
      'electronique': 'info',
      'artisanat': 'warning',
      'agriculture': 'success'
    };
    return colors[categorie] || 'secondary';
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

  const reducedPrice = calculateReducedPrice();

  return (
    <Card className="h-100 product-card shadow-sm border-0">
      <div className="position-relative">
        {product.photos && product.photos.length > 0 ? (
          <Card.Img 
            variant="top" 
            src={product.photos[0]} 
            alt={product.nom}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: '200px' }}
          >
            <i className="fas fa-image fa-3x text-muted"></i>
          </div>
        )}
        
        <div className="position-absolute top-0 start-0 p-2">
          <Badge bg={getEtatBadge(product.etat)}>
            {product.etat?.replace('_', ' ')}
          </Badge>
        </div>
        
        {product.reduction > 0 && (
          <div className="position-absolute top-0 end-0 p-2">
            <Badge bg="danger">
              -{product.reduction}%
            </Badge>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg={getCategorieColor(product.categorie)} className="mb-2">
            {product.categorie}
          </Badge>
        </div>
        
        <Card.Title className="h6 mb-2" style={{ minHeight: '48px' }}>
          {product.nom}
        </Card.Title>
        
        <Card.Text className="text-muted small flex-grow-1">
          {product.description && product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              {reducedPrice ? (
                <>
                  <span className="text-danger fw-bold h5 mb-0">
                    {formatPrice(reducedPrice)}
                  </span>
                  <small className="text-muted text-decoration-line-through ms-2">
                    {formatPrice(product.prix)}
                  </small>
                </>
              ) : (
                <span className="fw-bold h5 text-primary mb-0">
                  {formatPrice(product.prix)}
                </span>
              )}
            </div>
            {product.livrable && (
              <Badge bg="outline-success" text="success" className="small">
                <i className="fas fa-truck me-1"></i>
                Livraison
              </Badge>
            )}
          </div>

          <div className="d-flex gap-2">
            <Button 
              as={Link} 
              to={`/marketplace/product/${product.id}`}
              variant="outline-primary" 
              size="sm" 
              className="flex-fill"
            >
              <i className="fas fa-eye me-1"></i>
              Voir
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              className="flex-fill"
            >
              <i className="fas fa-shopping-cart me-1"></i>
              Acheter
            </Button>
          </div>

          <div className="mt-2 text-center">
            <small className="text-muted">
              Par {product.vendeur_prenom} {product.vendeur_nom}
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;