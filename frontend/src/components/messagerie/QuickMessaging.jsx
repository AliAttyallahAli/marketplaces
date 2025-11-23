import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Badge } from 'react-bootstrap';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../../context/AuthContext';

const QuickMessaging = ({ show, onHide }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Données simulées pour les conversations
  const mockConversations = [
    {
      id: 1,
      name: "Ahmed Saleh",
      avatar: "/assets/avatar1.jpg",
      role: "Vendeur",
      online: true,
      lastMessage: "Merci pour votre achat !",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2
    },
    {
      id: 2,
      name: "Marie Koundja",
      avatar: "/assets/avatar2.jpg",
      role: "Client",
      online: false,
      lastMessage: "Le produit est-il toujours disponible ?",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0
    },
    {
      id: 3,
      name: "Support ZouDou-Souk",
      avatar: "/assets/support-avatar.jpg",
      role: "Support",
      online: true,
      lastMessage: "Comment pouvons-nous vous aider ?",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 1
    }
  ];

  // Messages simulés
  const mockMessages = {
    1: [
      {
        id: 1,
        senderId: 1,
        content: "Bonjour ! Votre commande a été expédiée.",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        senderId: user.id,
        content: "Super, merci pour l'information !",
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        id: 3,
        senderId: 1,
        content: "Merci pour votre achat !",
        timestamp: new Date(Date.now() - 300000)
      }
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        content: "Bonjour, le produit est-il toujours disponible ?",
        timestamp: new Date(Date.now() - 3600000)
      }
    ],
    3: [
      {
        id: 1,
        senderId: 3,
        content: "Bienvenue sur ZouDou-Souk ! Comment pouvons-nous vous aider ?",
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    // Simulation chargement API
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 500);
  };

  const loadMessages = async (conversationId) => {
    setLoading(true);
    // Simulation chargement API
    setTimeout(() => {
      setMessages(mockMessages[conversationId] || []);
      setLoading(false);
    }, 300);
  };

  const handleSendMessage = async (messageContent) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulation envoi API
    setTimeout(() => {
      // Ajouter une réponse automatique pour la démo
      if (selectedConversation.id === 3) { // Support
        const autoReply = {
          id: Date.now() + 1,
          senderId: 3,
          content: "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.",
          timestamp: new Date(Date.now() + 1000)
        };
        setMessages(prev => [...prev, autoReply]);
      }
    }, 1000);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="fas fa-comments me-2"></i>
          Messagerie
          {totalUnread > 0 && (
            <Badge bg="light" text="dark" className="ms-2">
              {totalUnread}
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0" style={{ minHeight: '500px' }}>
        <Row className="h-100">
          {/* Liste des conversations */}
          <Col md={4} className="border-end">
            <ConversationList
              conversations={filteredConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </Col>

          {/* Zone de messages */}
          <Col md={8} className="d-flex flex-column">
            {selectedConversation ? (
              <>
                {/* En-tête de conversation */}
                <div className="conversation-header border-bottom p-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0">{selectedConversation.name}</h6>
                      <small className="text-muted">
                        {selectedConversation.online ? (
                          <span className="text-success">
                            <i className="fas fa-circle me-1" style={{ fontSize: '8px' }}></i>
                            En ligne
                          </span>
                        ) : (
                          <span>Hors ligne</span>
                        )}
                        {selectedConversation.role && (
                          <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.6rem' }}>
                            {selectedConversation.role}
                          </Badge>
                        )}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Liste des messages */}
                {loading ? (
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                ) : (
                  <MessageList
                    messages={messages}
                    currentUser={user}
                  />
                )}

                {/* Input pour envoyer des messages */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={loading}
                />
              </>
            ) : (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center text-muted">
                <div>
                  <i className="fas fa-comments fa-3x mb-3"></i>
                  <h5>Sélectionnez une conversation</h5>
                  <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickMessaging;