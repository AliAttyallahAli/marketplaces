import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Spinner, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/chat';
import MessageItem from '../chat/MessageItem';
import './styles/MessageList.css';

const MessageList = ({ conversationId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Utiliser getConversation qui inclut les messages
      const response = await chatAPI.getConversation(conversationId);
      
      if (response.data.success) {
        // Les messages peuvent être dans response.data.conversation.messages
        // ou response.data.messages selon votre API
        const messagesData = response.data.conversation?.messages || 
                            response.data.messages || 
                            response.data.conversation?.messages_list || 
                            [];
        
        setMessages(messagesData);
      } else {
        setError('Erreur lors du chargement des messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(error.response?.data?.error || 'Erreur lors du chargement des messages');
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