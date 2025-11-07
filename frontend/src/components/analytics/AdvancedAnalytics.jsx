import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Table, Badge } from 'react-bootstrap';

const AdvancedAnalytics = ({ userRole = 'client' }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState({});
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    // Données mock selon le rôle
    const mockStats = {
      client: {
        totalSpent: 125000,
        transactionsCount: 24,
        favoriteCategory: 'Électronique',
        savings: 15000,
        monthlyTrend: '+15%'
      },
      vendeur: {
        revenue: 450000,
        ordersCount: 89,
        conversionRate: '3.2%',
        averageOrder: 5056,
        growth: '+25%'
      },
      admin: {
        platformRevenue: 1250000,
        totalUsers: 1247,
        activeVendeurs: 89,
        transactionVolume: 45000000,
        growth: '+40%'
      }
    };

    const mockTopProducts = [
      { id: 1, name: 'iPhone 13 Pro', sales: 45, revenue: 2250000 },
      { id: 2, name: 'Sac artisanal', sales: 89, revenue: 890000 },
      { id: 3, name: 'Riz local 25kg', sales: 67, revenue: 335000 },
      { id: 4, name: 'Tissu traditionnel', sales: 34, revenue: 340000 },
      { id: 5, name: 'Powerbank 20000mAh', sales: 56, revenue: 840000 }
    ];

    setStats(mockStats[userRole] || mockStats.client);
    setTopProducts(mockTopProducts);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const getRoleSpecificCards = () => {
    switch (userRole) {
      case 'vendeur':
        return (
          <>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.revenue)}</h4>
                      <p className="mb-0">Chiffre d'affaires</p>
                    </div>
                    <i className="fas fa-chart-line fa-2x opacity-50"></i>
                  </div>
                  <div className="mt-2">
                    <Badge bg="light" text="dark">
                      {stats.growth} ce mois
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.ordersCount}</h4>
                      <p className="mb-0">Commandes</p>
                    </div>
                    <i className="fas fa-shopping-cart fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-warning text-dark">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.conversionRate}</h4>
                      <p className="mb-0">Taux de conversion</p>
                    </div>
                    <i className="fas fa-percentage fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.averageOrder)}</h4>
                      <p className="mb-0">Panier moyen</p>
                    </div>
                    <i className="fas fa-receipt fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        );
      
      case 'admin':
        return (
          <>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.platformRevenue)}</h4>
                      <p className="mb-0">Revenus plateforme</p>
                    </div>
                    <i className="fas fa-money-bill-wave fa-2x opacity-50"></i>
                  </div>
                  <div className="mt-2">
                    <Badge bg="light" text="dark">
                      {stats.growth} ce mois
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.totalUsers}</h4>
                      <p className="mb-0">Utilisateurs totaux</p>
                    </div>
                    <i className="fas fa-users fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-warning text-dark">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.activeVendeurs}</h4>
                      <p className="mb-0">Vendeurs actifs</p>
                    </div>
                    <i className="fas fa-store fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.transactionVolume)}</h4>
                      <p className="mb-0">Volume transactions</p>
                    </div>
                    <i className="fas fa-exchange-alt fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        );
      
      default: // client
        return (
          <>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-primary text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.totalSpent)}</h4>
                      <p className="mb-0">Total dépensé</p>
                    </div>
                    <i className="fas fa-wallet fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.transactionsCount}</h4>
                      <p className="mb-0">Transactions</p>
                    </div>
                    <i className="fas fa-receipt fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-warning text-dark">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{stats.favoriteCategory}</h4>
                      <p className="mb-0">Catégorie préférée</p>
                    </div>
                    <i className="fas fa-star fa-2x opacity-50"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={6} className="mb-3">
              <Card className="border-0 bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="fw-bold">{formatCurrency(stats.savings)}</h4>
                      <p className="mb-0">Économies réalisées</p>
                    </div>
                    <i className="fas fa-piggy-bank fa-2x opacity-50"></i>
                  </div>
                  <div className="mt-2">
                    <Badge bg="light" text="dark">
                      {stats.monthlyTrend} vs mois dernier
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        );
    }
  };

  return (
    <div className="advanced-analytics">
      {/* Filtres */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Analytics Avancées</h5>
            <Form.Select 
              style={{ width: 'auto' }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">3 derniers mois</option>
              <option value="1year">1 an</option>
            </Form.Select>
          </div>
        </Card.Body>
      </Card>

      {/* Cartes de statistiques */}
      <Row>
        {getRoleSpecificCards()}
      </Row>

      {/* Produits populaires */}
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">Produits les plus populaires</h6>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th className="text-end">Ventes</th>
                      <th className="text-end">Revenus</th>
                      <th className="text-center">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <i className="fas fa-box text-muted"></i>
                            </div>
                            <div>
                              <strong>{product.name}</strong>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          <strong>{product.sales}</strong>
                        </td>
                        <td className="text-end">
                          <strong>{formatCurrency(product.revenue)}</strong>
                        </td>
                        <td className="text-center">
                          <Badge 
                            bg={
                              product.sales > 50 ? 'success' : 
                              product.sales > 30 ? 'warning' : 'secondary'
                            }
                          >
                            {product.sales > 50 ? 'Excellent' : 
                             product.sales > 30 ? 'Bon' : 'Moyen'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="fw-bold mb-3">Aperçu rapide</h6>
              
              <div className="mb-4">
                <small className="text-muted d-block">Tendance des ventes</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-chart-line text-success me-2"></i>
                  <span className="fw-bold">+15.2%</span>
                  <small className="text-muted ms-2">vs mois dernier</small>
                </div>
              </div>
              
              <div className="mb-4">
                <small className="text-muted d-block">Satisfaction clients</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-star text-warning me-2"></i>
                  <span className="fw-bold">4.7/5</span>
                  <small className="text-muted ms-2">(128 avis)</small>
                </div>
              </div>
              
              <div className="mb-4">
                <small className="text-muted d-block">Taux de conversion</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-percentage text-primary me-2"></i>
                  <span className="fw-bold">3.8%</span>
                  <small className="text-muted ms-2">+0.5%</small>
                </div>
              </div>
              
              <div>
                <small className="text-muted d-block">Panier moyen</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-shopping-basket text-info me-2"></i>
                  <span className="fw-bold">{formatCurrency(5056)}</span>
                  <small className="text-muted ms-2">+12%</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedAnalytics;