import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';

const ChatSystem = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const messagesEndRef = useRef(null);

  // Données mock pour les conversations
  const mockConversations = [
    {
      id: 1,
      user: { id: 2, name: 'Ahmed Mahamat', role: 'vendeur', online: true },
      lastMessage: 'Bonjour, le produit est disponible',
      unread: 2,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      user: { id: 3, name: 'Support ZouDou-Souk', role: 'admin', online: false },
      lastMessage: 'Votre problème a été résolu',
      unread: 0,
      timestamp: new Date(Date.now() - 86400000)
    }
  ];

  // Messages mock
  const mockMessages = [
    {
      id: 1,
      conversationId: 1,
      senderId: 2,
      content: 'Bonjour, je suis intéressé par votre produit',
      timestamp: new Date(Date.now() - 3600000),
      type: 'received'
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 1, // Current user
      content: 'Bonjour, le produit est-il toujours disponible?',
      timestamp: new Date(Date.now() - 1800000),
      type: 'sent'
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 2,
      content: 'Oui, il est disponible. Livraison possible sous 24h',
      timestamp: new Date(Date.now() - 1200000),
      type: 'received'
    }
  ];

  useEffect(() => {
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setActiveConversation(mockConversations[0]);
      setMessages(mockMessages.filter(msg => msg.conversationId === mockConversations[0].id));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      conversationId: activeConversation.id,
      senderId: 1, // Current user
      content: newMessage,
      timestamp: new Date(),
      type: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simuler une réponse automatique après 2 secondes
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        conversationId: activeConversation.id,
        senderId: activeConversation.user.id,
        content: 'Merci pour votre message. Je vous répondrai rapidement.',
        timestamp: new Date(),
        type: 'received'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages(mockMessages.filter(msg => msg.conversationId === conversation.id));
  };

  return (
    <div className="chat-system">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="d-flex" style={{ height: '500px' }}>
            {/* Liste des conversations */}
            <div className="border-end" style={{ width: '300px' }}>
              <div className="p-3 border-bottom">
                <h6 className="fw-bold mb-0">Messages</h6>
              </div>
              <div className="conversation-list" style={{ height: '438px', overflowY: 'auto' }}>
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`conversation-item p-3 border-bottom ${
                      activeConversation?.id === conversation.id ? 'bg-light' : ''
                    }`}
                    onClick={() => selectConversation(conversation)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          {conversation.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {conversation.user.online && (
                          <div 
                            className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                            style={{ width: '12px', height: '12px' }}
                          ></div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="fw-bold mb-1">{conversation.user.name}</h6>
                          {conversation.unread > 0 && (
                            <Badge bg="primary" pill>{conversation.unread}</Badge>
                          )}
                        </div>
                        <p className="text-muted small mb-1 text-truncate" style={{ maxWidth: '200px' }}>
                          {conversation.lastMessage}
                        </p>
                        <small className="text-muted">
                          {formatTime(conversation.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-grow-1 d-flex flex-column">
              {activeConversation ? (
                <>
                  {/* En-tête de conversation */}
                  <div className="p-3 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {activeConversation.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{activeConversation.user.name}</h6>
                        <small className="text-muted">
                          {activeConversation.user.online ? 'En ligne' : 'Hors ligne'}
                          {activeConversation.user.role && ` • ${activeConversation.user.role}`}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div 
                    className="flex-grow-1 p-3"
                    style={{ height: '350px', overflowY: 'auto' }}
                  >
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`d-flex mb-3 ${
                          message.type === 'sent' ? 'justify-content-end' : 'justify-content-start'
                        }`}
                      >
                        <div
                          className={`message-bubble p-3 rounded ${
                            message.type === 'sent' 
                              ? 'bg-primary text-white' 
                              : 'bg-light border'
                          }`}
                          style={{ maxWidth: '70%' }}
                        >
                          <div className="message-content">{message.content}</div>
                          <div 
                            className={`message-time small mt-1 ${
                              message.type === 'sent' ? 'text-white-50' : 'text-muted'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input d'envoi */}
                  <div className="p-3 border-top">
                    <Form onSubmit={handleSendMessage}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Tapez votre message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button variant="primary" type="submit">
                          <i className="fas fa-paper-plane"></i>
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <div className="text-center">
                    <i className="fas fa-comments fa-3x mb-3"></i>
                    <p>Sélectionnez une conversation pour commencer à discuter</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatSystem;