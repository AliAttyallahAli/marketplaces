import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { statisticsAPI } from '../services/statistics';

const Statistics = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadStatistics();
    }
  }, [isAuthenticated]);

  const loadStatistics = async () => {
    try {
      // Simulation de données en attendant l'API
      const mockStats = user?.role === 'vendeur' 
        ? {
            active_products: 12,
            total_sales: 45,
            monthly_revenue: 1250000,
            active_customers: 23,
            monthly_growth: 15
          }
        : {
            total_purchases: 8,
            total_spent: 450000,
            paid_bills: 3,
            p2p_transfers: 5,
            monthly_growth: 8
          };

      const mockTransactions = [
        {
          id: 1,
          type: 'achat',
          description: 'Achat produit électronique',
          amount: -25000,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          type: 'p2p',
          description: 'Transfert à Jean Dupont',
          amount: -15000,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setStats(mockStats);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificStats = () => {
    if (user?.role === 'vendeur') {
      return [
        { title: 'Produits Actifs', value: stats.active_products || 0, icon: 'fas fa-box', color: 'primary' },
        { title: 'Ventes Total', value: stats.total_sales || 0, icon: 'fas fa-shopping-cart', color: 'success' },
        { title: 'Revenus Mensuels', value: `${stats.monthly_revenue?.toLocaleString('fr-TD') || 0} FCFA`, icon: 'fas fa-money-bill-wave', color: 'warning' },
        { title: 'Clients Actifs', value: stats.active_customers || 0, icon: 'fas fa-users', color: 'info' }
      ];
    }

    // Stats pour clients
    return [
      { title: 'Achats Total', value: stats.total_purchases || 0, icon: 'fas fa-shopping-bag', color: 'primary' },
      { title: 'Dépenses Total', value: `${stats.total_spent?.toLocaleString('fr-TD') || 0} FCFA`, icon: 'fas fa-wallet', color: 'success' },
      { title: 'Factures Payées', value: stats.paid_bills || 0, icon: 'fas fa-file-invoice', color: 'warning' },
      { title: 'Transferts Effectués', value: stats.p2p_transfers || 0, icon: 'fas fa-exchange-alt', color: 'info' }
    ];
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Accès non autorisé</h3>
          <p className="text-muted">Veuillez vous connecter pour voir vos statistiques</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Mes Statistiques</h1>
              <p className="text-muted">
                {user?.role === 'vendeur' 
                  ? 'Analysez vos performances commerciales' 
                  : 'Suivez votre activité sur ZouDou-Souk'
                }
              </p>
            </div>
            <Badge bg="primary" className="fs-6">
              {user?.role === 'vendeur' ? 'Vendeur' : 'Client'}
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Cartes de statistiques */}
      <Row className="mb-4">
        {getRoleSpecificStats().map((stat, index) => (
          <Col xl={3} lg={6} key={index} className="mb-3">
            <Card className="border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold text-primary">{stat.value}</h4>
                    <p className="text-muted mb-0">{stat.title}</p>
                  </div>
                  <div className={`bg-${stat.color} bg-opacity-10 rounded p-3`}>
                    <i className={`${stat.icon} fa-2x text-${stat.color}`}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs defaultActiveKey="overview" className="mb-4">
        <Tab eventKey="overview" title="Aperçu Général">
          <Row>
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Activité Récente</h5>
                </Card.Header>
                <Card.Body>
                  {transactions.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-chart-line fa-2x text-muted mb-3"></i>
                      <p className="text-muted">Aucune activité récente</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Montant</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map(transaction => (
                            <tr key={transaction.id}>
                              <td>
                                <small>
                                  {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                                </small>
                              </td>
                              <td>
                                <Badge bg={
                                  transaction.type === 'achat' ? 'success' :
                                  transaction.type === 'p2p' ? 'primary' :
                                  transaction.type === 'facture' ? 'warning' : 'secondary'
                                }>
                                  {transaction.type}
                                </Badge>
                              </td>
                              <td>
                                <small>
                                  {transaction.description || 'Transaction'}
                                </small>
                              </td>
                              <td>
                                <strong className={
                                  transaction.amount < 0 ? 'text-danger' : 'text-success'
                                }>
                                  {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)?.toLocaleString('fr-TD')} FCFA
                                </strong>
                              </td>
                              <td>
                                <Badge bg={
                                  transaction.status === 'completed' ? 'success' :
                                  transaction.status === 'pending' ? 'warning' : 'danger'
                                }>
                                  {transaction.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Statistiques supplémentaires */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Performance Mensuelle</h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <i className="fas fa-chart-bar fa-2x text-primary mb-3"></i>
                    <h4>{stats.monthly_growth || 0}%</h4>
                    <p className="text-muted">Croissance ce mois</p>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h6 className="mb-0">Objectifs</h6>
                </Card.Header>
                <Card.Body>
                  {user?.role === 'vendeur' ? (
                    <>
                      <div className="mb-3">
                        <small className="text-muted">Ventes mensuelles</small>
                        <div className="progress mb-1">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${Math.min((stats.monthly_sales || 0) / 50 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <small>{stats.monthly_sales || 0} / 50 ventes</small>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">Revenus mensuels</small>
                        <div className="progress mb-1">
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${Math.min((stats.monthly_revenue || 0) / 100000 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <small>{(stats.monthly_revenue || 0).toLocaleString('fr-TD')} / 100,000 FCFA</small>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <i className="fas fa-trophy fa-2x text-warning mb-3"></i>
                      <p className="text-muted">Continuez vos achats pour débloquer des avantages!</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="details" title="Détails Complets">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Historique Détaillé</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5">
                <i className="fas fa-chart-pie fa-3x text-primary mb-3"></i>
                <h5 className="text-primary">Fonctionnalité Premium</h5>
                <p className="text-muted">
                  Les statistiques détaillées et graphiques avancés sont disponibles 
                  dans la version premium de ZouDou-Souk.
                </p>
                <button className="btn btn-primary">
                  <i className="fas fa-crown me-2"></i>
                  Passer à Premium
                </button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Statistics;