import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { walletAPI } from '../../services/wallet';
import { useAuth } from '../../context/AuthContext';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    date_from: '',
    date_to: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (searchFilters = {}) => {
    try {
      const response = await walletAPI.getTransactions();
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setLoading(true);
    loadTransactions(filters);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      date_from: '',
      date_to: ''
    });
    setLoading(true);
    loadTransactions();
  };

  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'success',
      'pending': 'warning',
      'failed': 'danger',
      'cancelled': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getTypeBadge = (type) => {
    const variants = {
      'p2p': 'primary',
      'achat': 'success',
      'facture': 'warning',
      'abonnement': 'info',
      'publication': 'secondary'
    };
    return variants[type] || 'secondary';
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('fr-TD') + ' FCFA';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-0">
        <div className="p-4 border-bottom">
          <h5 className="fw-bold mb-0">Historique des Transactions</h5>
        </div>

        {/* Filtres */}
        <div className="p-4 bg-light">
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">Type de transaction</Form.Label>
                <Form.Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les types</option>
                  <option value="p2p">Transfert P2P</option>
                  <option value="achat">Achat produit</option>
                  <option value="facture">Paiement facture</option>
                  <option value="abonnement">Abonnement</option>
                  <option value="publication">Publication</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">Date de début</Form.Label>
                <Form.Control
                  type="date"
                  name="date_from"
                  value={filters.date_from}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">Date de fin</Form.Label>
                <Form.Control
                  type="date"
                  name="date_to"
                  value={filters.date_to}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <div className="d-flex gap-2" style={{ marginTop: '28px' }}>
                <Button variant="primary" onClick={handleSearch} size="sm">
                  <i className="fas fa-search me-1"></i>
                  Filtrer
                </Button>
                <Button variant="outline-secondary" onClick={handleReset} size="sm">
                  <i className="fas fa-times me-1"></i>
                  Réinitialiser
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Tableau des transactions */}
        <div className="p-4">
          {transactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">Aucune transaction</h5>
              <p className="text-muted">
                Vos transactions apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Frais</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => {
                    const isDebit = transaction.from_user_id === user.id;
                    const amountClass = isDebit ? 'text-danger' : 'text-success';
                    const amountPrefix = isDebit ? '-' : '+';

                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div>
                            <small className="text-muted">
                              {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                            </small>
                            <br />
                            <small className="text-muted">
                              {new Date(transaction.created_at).toLocaleTimeString('fr-FR')}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getTypeBadge(transaction.type)}>
                            {transaction.type}
                          </Badge>
                          {transaction.service_type && (
                            <small className="d-block text-muted">
                              {transaction.service_type}
                            </small>
                          )}
                        </td>
                        <td>
                          <div>
                            <strong>
                              {isDebit ? 'À: ' : 'De: '}
                              {isDebit 
                                ? `${transaction.to_nom} ${transaction.to_prenom}`
                                : `${transaction.from_nom} ${transaction.from_prenom}`
                              }
                            </strong>
                            {transaction.product_nom && (
                              <small className="d-block text-muted">
                                Produit: {transaction.product_nom}
                              </small>
                            )}
                            <small className="d-block text-muted">
                              Ref: #{transaction.id}
                            </small>
                          </div>
                        </td>
                        <td>
                          <strong className={amountClass}>
                            {amountPrefix} {formatAmount(transaction.amount)}
                          </strong>
                        </td>
                        <td>
                          {transaction.fee > 0 && (
                            <span className="text-danger">
                              -{formatAmount(transaction.fee)}
                            </span>
                          )}
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          {/* Résumé */}
          {transactions.length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <Row className="text-center">
                <Col>
                  <small className="text-muted">Total transactions</small>
                  <div className="fw-bold">{transactions.length}</div>
                </Col>
                <Col>
                  <small className="text-muted">Dernière transaction</small>
                  <div className="fw-bold">
                    {transactions.length > 0 
                      ? new Date(transactions[0].created_at).toLocaleDateString('fr-FR')
                      : '-'
                    }
                  </div>
                </Col>
                <Col>
                  <small className="text-muted">Solde total échangé</small>
                  <div className="fw-bold text-primary">
                    {formatAmount(transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0))}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionHistory;