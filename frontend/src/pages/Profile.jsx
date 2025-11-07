import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/profile/UserProfile';

const Profile = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Accès non autorisé</h3>
          <p className="text-muted">
            Vous devez être connecté pour accéder à votre profil
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <UserProfile />
    </Container>
  );
};

export default Profile;