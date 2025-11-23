import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/products';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';

const VendeurDashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les produits du vendeur
      const productsResponse = await productsAPI.getByVendeur(user.id);
      setProducts(productsResponse.data.products || []);
      
      // Charger les transactions du vendeur
      const transactionsResponse = await walletAPI.getVendeurTransactions();
      setTransactions(transactionsResponse.data.transactions || []);
      
      // Calculer les statistiques
      calculateStats(productsResponse.data.products, transactionsResponse.data.transactions);
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (products, transactions) => {
    const totalProducts = products?.length || 0;
    
    const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
    const totalSales = completedTransactions.length;
    
    const totalRevenue = completedTransactions.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.amount) - parseFloat(transaction.fee || 0));
    }, 0);

    setStats({
      totalProducts,
      totalSales,
      totalRevenue
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement du dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Dashboard Vendeur</h1>
          <p className="text-muted">
            Gérez vos produits et suivez vos ventes
          </p>
        </Col>
      </Row>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <div className="text-primary">
                <i className="fas fa-cube fa-2x mb-3"></i>
                <h3>{stats.totalProducts}</h3>
              </div>
              <Card.Title>Produits en ligne</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <div className="text-success">
                <i className="fas fa-shopping-cart fa-2x mb-3"></i>
                <h3>{stats.totalSales}</h3>
              </div>
              <Card.Title>Ventes totales</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <div className="text-warning">
                <i className="fas fa-money-bill-wave fa-2x mb-3"></i>
                <h3>{formatPrice(stats.totalRevenue)}</h3>
              </div>
              <Card.Title>Chiffre d'affaires</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Produits */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mes Produits</h5>
              <Button as={Link} to="/vendeur/products" variant="primary" size="sm">
                <i className="fas fa-plus me-1"></i>
                Nouveau produit
              </Button>
            </Card.Header>
            <Card.Body>
              {products.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.photos && product.photos.length > 0 ? (
                                <img 
                                  src={product.photos[0]} 
                                  alt={product.nom}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded me-2"
                                />
                              ) : (
                                <div 
                                  className="bg-light rounded d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className="fas fa-image text-muted"></i>
                                </div>
                              )}
                              <span className="fw-semibold">{product.nom}</span>
                            </div>
                          </td>
                          <td>{formatPrice(product.prix)}</td>
                          <td>
                            <Badge bg={product.is_active ? 'success' : 'secondary'}>
                              {product.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-cube fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Aucun produit publié</p>
                  <Button as={Link} to="/vendeur/products" variant="primary">
                    Publier votre premier produit
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Transactions récentes */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Transactions Récentes</h5>
            </Card.Header>
            <Card.Body>
              {transactions.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map(transaction => (
                        <tr key={transaction.id}>
                          <td>
                            <small>
                              {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                            </small>
                          </td>
                          <td className="fw-semibold">
                            {formatPrice(transaction.amount)}
                          </td>
                          <td>
                            <Badge 
                              bg={
                                transaction.status === 'completed' ? 'success' :
                                transaction.status === 'pending' ? 'warning' : 'danger'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Aucune transaction</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actions rapides */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Actions Rapides</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/vendeur/products" variant="outline-primary">
                  <i className="fas fa-plus me-2"></i>
                  Ajouter un produit
                </Button>
                <Button as={Link} to="/vendeur/transactions" variant="outline-success">
                  <i className="fas fa-history me-2"></i>
                  Voir toutes les transactions
                </Button>
                <Button as={Link} to="/marketplace" variant="outline-info">
                  <i className="fas fa-store me-2"></i>
                  Voir la marketplace
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendeurDashboard;