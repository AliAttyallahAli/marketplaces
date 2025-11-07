import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Tabs, Tab, Badge, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const MyStatistics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  // Données simulées
  const mockStats = {
    general: {
      totalTransactions: 47,
      montantTotal: 1250000,
      produitsVendus: 23,
      clientsActifs: 15
    },
    transactions: [
      { mois: 'Jan 2024', ventes: 8, revenus: 450000, croissance: '+12%' },
      { mois: 'Déc 2023', ventes: 7, revenus: 400000, croissance: '+8%' },
      { mois: 'Nov 2023', ventes: 6, revenus: 370000, croissance: '+5%' },
      { mois: 'Oct 2023', ventes: 5, revenus: 350000, croissance: '+3%' },
      { mois: 'Sep 2023', ventes: 4, revenus: 340000, croissance: '-2%' },
      { mois: 'Aoû 2023', ventes: 4, revenus: 350000, croissance: '+15%' }
    ],
    produitsPopulaires: [
      { nom: 'Miel Naturel', ventes: 8, revenu: 120000, rating: 4.8 },
      { nom: 'Artisanat Cuir', ventes: 5, revenu: 75000, rating: 4.9 },
      { nom: 'Café Local', ventes: 4, revenu: 60000, rating: 4.7 },
      { nom: 'Vêtements Traditionnels', ventes: 3, revenu: 45000, rating: 4.6 },
      { nom: 'Produits Cosmétiques', ventes: 2, revenu: 30000, rating: 4.5 }
    ],
    performance: {
      tauxConversion: '3.2%',
      panierMoyen: 5434,
      satisfaction: '4.7/5',
      tempsReponse: '2.3h'
    }
  };

  useEffect(() => {
    // Simuler le chargement des statistiques
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1500);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TD', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth.startsWith('+')) return 'success';
    if (growth.startsWith('-')) return 'danger';
    return 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2 text-muted">Chargement de vos statistiques...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Mes Statistiques</h1>
              <p className="text-muted">
                Analysez votre performance et suivez votre croissance
              </p>
            </div>
            <Form.Select 
              style={{ width: 'auto' }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Cartes de statistiques générales */}
      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.general?.totalTransactions}</h4>
                  <p className="mb-0">Transactions</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-exchange-alt fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{formatCurrency(stats.general?.montantTotal)}</h4>
                  <p className="mb-0">Chiffre d'Affaires</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-chart-line fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-warning text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.general?.produitsVendus}</h4>
                  <p className="mb-0">Produits Vendus</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-shopping-cart fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.general?.clientsActifs}</h4>
                  <p className="mb-0">Clients Actifs</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="overview" className="mb-4">
        <Tab eventKey="overview" title={
          <span>
            <i className="fas fa-chart-bar me-2"></i>
            Aperçu Général
          </span>
        }>
          <Row>
            <Col lg={8}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Évolution des Ventes</h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Période</th>
                          <th>Ventes</th>
                          <th>Revenus</th>
                          <th>Croissance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.transactions?.map((transaction, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{transaction.mois}</strong>
                            </td>
                            <td>
                              <Badge bg="primary">{transaction.ventes}</Badge>
                            </td>
                            <td>
                              <strong>{formatCurrency(transaction.revenus)}</strong>
                            </td>
                            <td>
                              <Badge bg={getGrowthColor(transaction.croissance)}>
                                {transaction.croissance}
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
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Performance</h5>
                </Card.Header>
                <Card.Body>
                  <div className="performance-stats">
                    {stats.performance && Object.entries(stats.performance).map(([key, value]) => (
                      <div key={key} className="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
                        <div>
                          <strong className="text-capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </strong>
                        </div>
                        <Badge bg="primary">{value}</Badge>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="products" title={
          <span>
            <i className="fas fa-box me-2"></i>
            Produits Populaires
          </span>
        }>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Top Produits</h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Ventes</th>
                          <th>Revenu Total</th>
                          <th>Évaluation</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.produitsPopulaires?.map((produit, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{produit.nom}</strong>
                            </td>
                            <td>
                              <Badge bg="success">{produit.ventes}</Badge>
                            </td>
                            <td>
                              <strong>{formatCurrency(produit.revenu)}</strong>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="text-warning me-1">
                                  <i className="fas fa-star"></i>
                                </span>
                                <span>{produit.rating}</span>
                              </div>
                            </td>
                            <td>
                              <div className="progress" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  style={{ width: `${(produit.ventes / stats.produitsPopulaires[0].ventes) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="analytics" title={
          <span>
            <i className="fas fa-chart-pie me-2"></i>
            Analytics Détaillés
          </span>
        }>
          <Row>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Répartition par Catégorie</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                    <p className="text-muted">
                      Graphique de répartition des ventes par catégorie
                    </p>
                    <div className="d-flex justify-content-around flex-wrap">
                      <div className="text-center mb-3">
                        <div className="bg-primary rounded-circle mx-auto mb-2" style={{width: '50px', height: '50px'}}></div>
                        <small>Alimentation</small>
                        <div className="fw-bold">35%</div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="bg-success rounded-circle mx-auto mb-2" style={{width: '50px', height: '50px'}}></div>
                        <small>Artisanat</small>
                        <div className="fw-bold">25%</div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="bg-warning rounded-circle mx-auto mb-2" style={{width: '50px', height: '50px'}}></div>
                        <small>Textile</small>
                        <div className="fw-bold">20%</div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="bg-info rounded-circle mx-auto mb-2" style={{width: '50px', height: '50px'}}></div>
                        <small>Services</small>
                        <div className="fw-bold">20%</div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Tendances Mensuelles</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                    <p className="text-muted">
                      Graphique d'évolution des ventes sur 6 mois
                    </p>
                    <div className="trend-bars">
                      {stats.transactions?.slice().reverse().map((transaction, index) => (
                        <div key={index} className="d-flex align-items-end mb-2">
                          <div className="me-2" style={{width: '30px'}}>
                            <small>{transaction.mois.split(' ')[0]}</small>
                          </div>
                          <div 
                            className="bg-primary rounded"
                            style={{
                              height: `${(transaction.ventes / 10) * 100}px`,
                              width: '20px'
                            }}
                          ></div>
                          <div className="ms-2 small">
                            {transaction.ventes} ventes
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Insights et Recommandations */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">
                <i className="fas fa-lightbulb me-2 text-warning"></i>
                Insights et Recommandations
              </h5>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold text-success">
                      <i className="fas fa-arrow-up me-1"></i>
                      Points Forts
                    </h6>
                    <ul className="small mb-0">
                      <li>Croissance constante de 8% ce mois-ci</li>
                      <li>Excellent taux de satisfaction client (4.7/5)</li>
                      <li>Produits "Miel Naturel" très populaires</li>
                    </ul>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary">
                      <i className="fas fa-bullseye me-1"></i>
                      Recommandations
                    </h6>
                    <ul className="small mb-0">
                      <li>Augmentez le stock des produits populaires</li>
                      <li>Diversifiez avec des produits similaires</li>
                      <li>Améliorez les photos des produits moins vendus</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyStatistics;