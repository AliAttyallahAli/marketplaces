import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Spinner, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/chat';
import MessageItem from './MessageItem';
import './MessageList.css';

const MessageList = ({ conversationId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await chatAPI.getMessages(conversationId);
      
      if (response.data.success) {
        setMessages(response.data.messages || []);
      } else {
        setError('Erreur lors du chargement des messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Erreur lors du chargement des messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  if (!conversationId) {
    return (
      <Card className="text-center border-0 bg-light m-3">
        <Card.Body className="py-5">
          <i className="fas fa-comments fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">Sélectionnez une conversation</h5>
          <p className="text-muted">
            Choisissez une conversation pour voir les messages
          </p>
        </Card.Body>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="message-list-loading">
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list-error">
        <Alert variant="danger" className="m-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-2">
            <Button variant="outline-primary" size="sm" onClick={loadMessages}>
              <i className="fas fa-redo me-1"></i>
              Réessayer
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="message-list-container">
      {messages.length === 0 ? (
        <Card className="text-center border-0 bg-light m-3">
          <Card.Body className="py-5">
            <i className="fas fa-comments fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Aucun message</h5>
            <p className="text-muted">
              Envoyez le premier message pour démarrer la conversation
            </p>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup variant="flush" className="message-list">
          {messages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isOwn={message.user_id === user.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
      )}
    </div>
  );
};

export default MessageList;