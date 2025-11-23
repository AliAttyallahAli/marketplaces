import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  InputGroup, 
  Badge,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/chat';

const MessageList = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    if (!conversation?.id) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await chatAPI.getMessages(conversation.id);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation?.id) return;

    setSending(true);
    setError('');
    try {
      const response = await chatAPI.sendMessage(conversation.id, {
        content: newMessage.trim(),
        type: 'text'
      });

      // Ajouter le nouveau message à la liste
      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');

      // Simulation réponse automatique pour le support
      if (conversation.type === 'support') {
        simulateSupportResponse();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'envoi du message';
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const simulateSupportResponse = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      const supportResponse = {
        id: Date.now(),
        sender_id: 1, // ID du support
        content: 'Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.',
        type: 'text',
        created_at: new Date().toISOString(),
        nom: 'Support',
        prenom: 'ZouDou-Souk',
        photo: null
      };
      
      setMessages(prev => [...prev, supportResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const participant = conversation?.participants?.find(p => p.id !== user.id) || conversation?.participants?.[0];

  if (!conversation) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center text-muted">
          <div className="text-center">
            <i className="fas fa-comments fa-3x mb-3"></i>
            <p>Aucune conversation sélectionnée</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      {/* En-tête de la conversation */}
      <Card.Header className="bg-light d-flex align-items-center">
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={onBack}
          className="me-2 d-lg-none"
        >
          <i className="fas fa-arrow-left"></i>
        </Button>
        
        <div className="d-flex align-items-center flex-grow-1">
          <img
            src={participant?.photo || '/assets/default-avatar.png'}
            alt={conversation.title}
            className="rounded-circle me-3"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
          <div>
            <h6 className="mb-0">{conversation.title}</h6>
            <div className="d-flex align-items-center gap-2">
              <Badge 
                bg={
                  participant?.role === 'admin' ? 'warning' :
                  participant?.role === 'vendeur' ? 'success' : 'secondary'
                }
              >
                {participant?.role}
              </Badge>
              <small className="text-muted">
                {conversation.type === 'support' ? 'Support 24/7' : 'Utilisateur'}
              </small>
            </div>
          </div>
        </div>
      </Card.Header>

      {/* Zone des messages */}
      <Card.Body className="d-flex flex-column p-0">
        <div 
          className="flex-grow-1 p-3"
          style={{ 
            overflowY: 'auto', 
            maxHeight: '400px',
            background: '#f8f9fa'
          }}
        >
          {error && (
            <Alert variant="danger" className="py-2">
              <small>{error}</small>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Chargement des messages...</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex mb-3 ${message.sender_id === user.id ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div 
                    className={`p-3 rounded ${
                      message.sender_id === user.id 
                        ? 'bg-primary text-white' 
                        : 'bg-white border'
                    }`}
                    style={{ 
                      maxWidth: '70%',
                      borderRadius: message.sender_id === user.id 
                        ? '18px 18px 4px 18px' 
                        : '18px 18px 18px 4px'
                    }}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <small className={`d-block mt-1 ${
                      message.sender_id === user.id ? 'text-white-50' : 'text-muted'
                    }`}>
                      {formatTime(message.created_at)}
                    </small>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white border rounded p-3">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Zone de saisie */}
        <div className="border-top bg-white p-3">
          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
                style={{ resize: 'none' }}
              />
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </Button>
            </InputGroup>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MessageList;