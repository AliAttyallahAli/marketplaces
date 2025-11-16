import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import NewConversationModal from '../components/chat/NewConversationModal';

const ChatPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // Simulation de chargement des conversations
      const mockConversations = [
        {
          id: 1,
          type: 'support',
          title: 'Support ZouDou-Souk',
          last_message: 'Bonjour, comment puis-je vous aider ?',
          last_message_at: new Date().toISOString(),
          unread_count: 2,
          participants: [
            {
              id: 1,
              nom: 'Support',
              prenom: 'ZouDou-Souk',
              photo: null,
              role: 'admin'
            }
          ]
        },
        {
          id: 2,
          type: 'direct',
          title: 'Marie Client',
          last_message: 'Merci pour votre aide !',
          last_message_at: new Date(Date.now() - 3600000).toISOString(),
          unread_count: 0,
          participants: [
            {
              id: 2,
              nom: 'Client',
              prenom: 'Marie',
              photo: null,
              role: 'client'
            }
          ]
        }
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = (conversation) => {
    setConversations(prev => [conversation, ...prev]);
    setSelectedConversation(conversation);
    setShowNewConversation(false);
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Connectez-vous pour accéder au chat</h3>
          <p className="text-muted">
            Vous devez être connecté pour utiliser la messagerie
          </p>
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
              <h1 className="fw-bold">
                <i className="fas fa-comments me-2 text-primary"></i>
                Messagerie
              </h1>
              <p className="text-muted">
                Communiquez avec les autres utilisateurs et le support
              </p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowNewConversation(true)}
            >
              <i className="fas fa-edit me-2"></i>
              Nouvelle conversation
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Liste des conversations */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="fas fa-inbox me-2"></i>
                Conversations
                {conversations.some(c => c.unread_count > 0) && (
                  <span className="badge bg-primary ms-2">
                    {conversations.reduce((sum, c) => sum + c.unread_count, 0)}
                  </span>
                )}
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ConversationList
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                selectedConversation={selectedConversation}
                loading={loading}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Messages */}
        <Col lg={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="p-0">
              {selectedConversation ? (
                <MessageList
                  conversation={selectedConversation}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                  <i className="fas fa-comments fa-3x mb-3 opacity-50"></i>
                  <h4>Bienvenue dans la messagerie</h4>
                  <p className="text-center mb-4">
                    Sélectionnez une conversation ou démarrez-en une nouvelle<br />
                    pour commencer à discuter.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setShowNewConversation(true)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Démarrer une conversation
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal nouvelle conversation */}
      <NewConversationModal
        show={showNewConversation}
        onHide={() => setShowNewConversation(false)}
        onConversationCreated={handleNewConversation}
      />
    </Container>
  );
};

export default ChatPage;