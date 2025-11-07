import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';

const Analytics = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Accès non autorisé</h3>
          <p className="text-muted">
            Vous devez être connecté pour accéder aux statistiques
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Mes Statistiques</h1>
        <p className="text-muted">
          Analysez vos performances et votre activité
        </p>
      </div>
      <AdvancedAnalytics userRole={user.role} />
    </Container>
  );
};

export default Analytics;