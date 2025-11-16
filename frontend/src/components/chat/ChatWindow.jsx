import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, InputGroup, Tab, Nav, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/chat';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import NewConversationModal from './NewConversationModal';

const ChatWindow = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    loadConversations();
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    // Simulation de connexion socket
    // En production, vous utiliserez socket.io-client
    console.log('Initializing socket connection...');
  };

  const loadConversations = async () => {
    setLoading(true);
    setError('');
    
    try {
      // En production, utilisez l'API réelle :
      // const response = await chatAPI.getConversations();
      
      // Simulation de données
      setTimeout(() => {
        const mockConversations = [
          {
            id: 1,
            type: 'support',
            title: 'Support ZouDou-Souk',
            last_message: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
            last_message_at: new Date().toISOString(),
            unread_count: 2,
            participants: [
              {
                id: 999,
                nom: 'Support',
                prenom: 'ZouDou-Souk',
                photo: null,
                role: 'admin'
              },
              {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                photo: user.photo,
                role: user.role
              }
            ]
          },
          {
            id: 2,
            type: 'direct',
            title: null,
            last_message: 'Merci pour votre achat ! N\'hésitez pas si vous avez des questions.',
            last_message_at: new Date(Date.now() - 3600000).toISOString(),
            unread_count: 0,
            participants: [
              {
                id: 888,
                nom: 'Vendeur',
                prenom: 'Example',
                photo: null,
                role: 'vendeur'
              },
              {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                photo: user.photo,
                role: user.role
              }
            ]
          },
          {
            id: 3,
            type: 'group',
            title: 'Marketplace Tchad',
            last_message: 'Nouveaux produits disponibles cette semaine !',
            last_message_at: new Date(Date.now() - 86400000).toISOString(),
            unread_count: 5,
            participants: [
              {
                id: 777,
                nom: 'Admin',
                prenom: 'Marketplace',
                photo: null,
                role: 'admin'
              },
              {
                id: 888,
                nom: 'Vendeur',
                prenom: 'Example',
                photo: null,
                role: 'vendeur'
              },
              {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                photo: user.photo,
                role: user.role
              }
            ]
          }
        ];
        setConversations(mockConversations);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError('Erreur lors du chargement des conversations');
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setActiveTab('messages');
    
    // Marquer comme lu si il y a des messages non lus
    if (conversation.unread_count > 0) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    }
  };

  const handleNewMessage = () => {
    setShowNewConversation(true);
  };

  const handleConversationCreated = (newConversation) => {
    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setActiveTab('messages');
  };

  const handleBackToConversations = () => {
    setActiveTab('conversations');
    setSelectedConversation(null);
  };

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unread_count, 0);
  };

  return (
    <Card 
      className="shadow-lg border-0"
      style={{ 
        width: '400px', 
        height: '600px',
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        zIndex: 1049
      }}
    >
      {/* En-tête */}
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center">
          <i className="fas fa-comments me-2"></i>
          <strong>Messages</strong>
          {getUnreadCount() > 0 && (
            <Badge bg="light" text="dark" className="ms-2">
              {getUnreadCount()}
            </Badge>
          )}
        </div>
        <div>
          <Button
            variant="light"
            size="sm"
            className="me-1"
            onClick={handleNewMessage}
            title="Nouvelle conversation"
          >
            <i className="fas fa-edit"></i>
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={onClose}
            title="Fermer"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0 d-flex flex-column">
        {error && (
          <Alert variant="danger" className="m-2 mb-0 py-2" dismissible onClose={() => setError('')}>
            <small>
              <i className="fas fa-exclamation-triangle me-1"></i>
              {error}
            </small>
          </Alert>
        )}

        <Tab.Container activeKey={activeTab}>
          <Nav variant="tabs" className="px-3 pt-2">
            <Nav.Item>
              <Nav.Link 
                eventKey="conversations"
                onClick={() => setActiveTab('conversations')}
                className="py-2"
              >
                <i className="fas fa-inbox me-1"></i>
                Conversations
                {getUnreadCount() > 0 && (
                  <Badge bg="danger" className="ms-1">
                    {getUnreadCount()}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="messages"
                onClick={() => selectedConversation && setActiveTab('messages')}
                disabled={!selectedConversation}
                className="py-2"
              >
                <i className="fas fa-comment me-1"></i>
                Messages
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="flex-grow-1 d-flex">
            {/* Liste des conversations */}
            <Tab.Pane eventKey="conversations" className="h-100">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <Spinner animation="border" role="status" className="text-primary mb-2">
                      <span className="visually-hidden">Chargement...</span>
                    </Spinner>
                    <p className="text-muted small">Chargement des conversations...</p>
                  </div>
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={() => setShowNewConversation(true)}
                  refreshConversations={loadConversations}
                />
              )}
            </Tab.Pane>

            {/* Messages */}
            <Tab.Pane eventKey="messages" className="h-100">
              {selectedConversation ? (
                <MessageList
                  conversation={selectedConversation}
                  onBack={handleBackToConversations}
                  onMessageSent={() => {
                    // Recharger les conversations pour mettre à jour le dernier message
                    loadConversations();
                  }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <div className="text-center">
                    <i className="fas fa-comments fa-2x mb-2"></i>
                    <p>Sélectionnez une conversation</p>
                  </div>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>

      {/* Modal nouvelle conversation */}
      <NewConversationModal
        show={showNewConversation}
        onHide={() => setShowNewConversation(false)}
        onConversationCreated={handleConversationCreated}
      />
    </Card>
  );
};

export default ChatWindow;