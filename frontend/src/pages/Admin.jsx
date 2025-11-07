import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, walletAPI } from '../services/auth';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        userAPI.getAllUsers(),
        walletAPI.searchTransactions({})
      ]);

      setUsers(usersRes.data.users || []);
      setTransactions(transactionsRes.data.transactions || []);

      // Calcul des statistiques
      const totalUsers = usersRes.data.users?.length || 0;
      const totalVendeurs = usersRes.data.users?.filter(u => u.role === 'vendeur').length || 0;
      const totalTransactions = transactionsRes.data.transactions?.length || 0;
      const totalRevenue = transactionsRes.data.transactions?.reduce((sum, t) => sum + parseFloat(t.fee || 0), 0) || 0;

      setStats({
        totalUsers,
        totalVendeurs,
        totalTransactions,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyKYC = async (userId) => {
    try {
      await userAPI.verifyKYC(userId);
      loadDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Error verifying KYC:', error);
    }
  };

  const handleVerifyKYB = async (userId) => {
    try {
      await userAPI.verifyKYB(userId);
      loadDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Error verifying KYB:', error);
    }
  };

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Accès non autorisé</h3>
          <p className="text-muted">
            Vous devez être administrateur pour accéder à cette page
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Dashboard Administrateur</h1>
          <p className="text-muted">Gestion complète de la plateforme ZouDou-Souk</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.totalUsers}</h4>
                  <p className="mb-0">Utilisateurs totaux</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-users fa-2x"></i>
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
                  <h4 className="fw-bold">{stats.totalVendeurs}</h4>
                  <p className="mb-0">Vendeurs actifs</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-store fa-2x"></i>
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
                  <h4 className="fw-bold">{stats.totalTransactions}</h4>
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
          <Card className="border-0 bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">
                    {stats.totalRevenue?.toLocaleString('fr-TD')} FCFA
                  </h4>
                  <p className="mb-0">Revenus totaux</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-chart-line fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="users" className="mb-4">
        <Tab eventKey="users" title={
          <span>
            <i className="fas fa-users me-2"></i>
            Utilisateurs
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gestion des Utilisateurs</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Statut KYC</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.prenom} {user.nom}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <Badge bg={
                            user.role === 'admin' ? 'warning' :
                            user.role === 'vendeur' ? 'success' : 'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          {user.kyc_verified ? (
                            <Badge bg="success">Vérifié</Badge>
                          ) : (
                            <Badge bg="warning">En attente</Badge>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button size="sm" variant="outline-primary">
                              <i className="fas fa-eye"></i>
                            </Button>
                            {!user.kyc_verified && (
                              <Button 
                                size="sm" 
                                variant="outline-success"
                                onClick={() => handleVerifyKYC(user.id)}
                              >
                                <i className="fas fa-check"></i> KYC
                              </Button>
                            )}
                            {user.role === 'vendeur' && !user.kyb_verified && (
                              <Button 
                                size="sm" 
                                variant="outline-info"
                                onClick={() => handleVerifyKYB(user.id)}
                              >
                                <i className="fas fa-check"></i> KYB
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="transactions" title={
          <span>
            <i className="fas fa-exchange-alt me-2"></i>
            Transactions
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Historique des Transactions</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>De</th>
                      <th>À</th>
                      <th>Montant</th>
                      <th>Frais</th>
                      <th>Date</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 10).map(transaction => (
                      <tr key={transaction.id}>
                        <td>
                          <small className="text-muted">#{transaction.id}</small>
                        </td>
                        <td>
                          <Badge bg={
                            transaction.type === 'p2p' ? 'primary' :
                            transaction.type === 'achat' ? 'success' :
                            transaction.type === 'facture' ? 'warning' : 'secondary'
                          }>
                            {transaction.type}
                          </Badge>
                        </td>
                        <td>
                          <small>{transaction.from_nom} {transaction.from_prenom}</small>
                        </td>
                        <td>
                          <small>{transaction.to_nom} {transaction.to_prenom}</small>
                        </td>
                        <td>
                          <strong>{parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA</strong>
                        </td>
                        <td>
                          <span className="text-danger">
                            {parseFloat(transaction.fee).toLocaleString('fr-TD')} FCFA
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                          </small>
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
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="services" title={
          <span>
            <i className="fas fa-concierge-bell me-2"></i>
            Services
          </span>
        }>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Gestion des Services Partenaires</h5>
                <Button 
                  as={Link} 
                  to="/service-management" 
                  variant="primary" 
                  size="sm"
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  Gérer les Services
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <p>Gérez tous les services partenaires de la plateforme</p>
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="bg-light p-3 rounded">
                    <i className="fas fa-bolt fa-2x text-warning mb-2"></i>
                    <h6>Services Énergie</h6>
                    <p className="mb-0">ZIZ et autres</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light p-3 rounded">
                    <i className="fas fa-tint fa-2x text-info mb-2"></i>
                    <h6>Services Eau</h6>
                    <p className="mb-0">STE et autres</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light p-3 rounded">
                    <i className="fas fa-landmark fa-2x text-success mb-2"></i>
                    <h6>Services Publics</h6>
                    <p className="mb-0">Taxes et impôts</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Admin;