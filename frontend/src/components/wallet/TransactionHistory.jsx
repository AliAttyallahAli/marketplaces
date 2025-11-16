import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap';
import { walletAPI } from '../../services/api';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await walletAPI.getTransactions();
      setTransactions(response.data.transactions);
    } catch (error) {
      toast.error('Erreur chargement historique');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'p2p': return 'Transfert P2P';
      case 'achat': return 'Achat produit';
      case 'facture': return 'Paiement facture';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Historique des Transactions</h5>
        <Button variant="outline-primary" size="sm">
          <i className="fas fa-download me-2"></i>
          Exporter PDF
        </Button>
      </div>

      <Card className="border-0">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Destinataire/Expéditeur</th>
                  <th>Montant</th>
                  <th>Frais</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </td>
                    <td>
                      {transaction.from_nom === 'Vous' ? (
                        <span className="text-danger">
                          À: {transaction.to_nom} {transaction.to_prenom}
                        </span>
                      ) : (
                        <span className="text-success">
                          De: {transaction.from_nom} {transaction.from_prenom}
                        </span>
                      )}
                    </td>
                    <td className="fw-bold">
                      {parseFloat(transaction.amount).toLocaleString('fr-FR')} XAF
                    </td>
                    <td className="text-muted">
                      {parseFloat(transaction.fee).toLocaleString('fr-FR')} XAF
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(transaction.status)}>
                        {transaction.status === 'completed' ? 'Terminé' :
                         transaction.status === 'pending' ? 'En attente' : 'Échoué'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-history fa-3x text-muted mb-3"></i>
              <p className="text-muted">Aucune transaction pour le moment</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TransactionHistory;