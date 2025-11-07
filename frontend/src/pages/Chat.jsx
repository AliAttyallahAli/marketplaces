import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ChatSystem from '../components/chat/ChatSystem';

const Chat = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Accès non autorisé</h3>
          <p className="text-muted">
            Vous devez être connecté pour accéder à la messagerie
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Messagerie</h1>
        <p className="text-muted">
          Communiquez avec les vendeurs et le support
        </p>
      </div>
      <ChatSystem />
    </Container>
  );
};

export default Chat;