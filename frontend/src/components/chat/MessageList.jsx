import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button, Spinner, Dropdown, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/chat';

const MessageList = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadMessages();
    // Rejoindre la conversation socket (à implémenter)
    // joinConversation(conversation.id);
    
    return () => {
      // Quitter la conversation socket (à implémenter)
      // leaveConversation(conversation.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (loadMore = false) => {
    if (loadMore && !hasMoreMessages) return;
    
    const currentPage = loadMore ? page + 1 : 1;
    
    try {
      const response = await chatAPI.getMessages(conversation.id, { 
        page: currentPage, 
        limit: 20 
      });
      
      const newMessages = response.data.messages;
      
      if (loadMore) {
        setMessages(prev => [...newMessages, ...prev]);
        setPage(currentPage);
      } else {
        setMessages(newMessages);
        setPage(1);
      }
      
      // Vérifier s'il y a plus de messages à charger
      setHasMoreMessages(newMessages.length === 20);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      const response = await chatAPI.sendMessage(conversation.id, {
        content: newMessage.trim(),
        message_type: 'text'
      });

      // Ajouter le nouveau message à la liste
      const sentMessage = response.data.message;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

      // Arrêter l'indicateur de frappe
      handleStopTyping();

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    // Émettre l'événement de frappe (à implémenter avec socket)
    // socket.emit('typing_start', { conversationId: conversation.id, userId: user.id });
    
    // Réinitialiser le timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    // Émettre l'arrêt de frappe (à implémenter avec socket)
    // socket.emit('typing_stop', { conversationId: conversation.id, userId: user.id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleLoadMore = () => {
    loadMessages(true);
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (isYesterday) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.created_at).toDateString();
    const previousDate = new Date(previousMessage.created_at).toDateString();
    
    return currentDate !== previousDate;
  };

  const formatDateSeparator = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const getConversationTitle = () => {
    if (conversation.title) return conversation.title;
    
    const otherParticipants = conversation.participants?.filter(p => p.id !== user.id) || [];
    if (otherParticipants.length === 1) {
      return `${otherParticipants[0].prenom} ${otherParticipants[0].nom}`;
    } else if (otherParticipants.length > 1) {
      return `${otherParticipants.length} participants`;
    }
    
    return 'Conversation';
  };

  const getParticipantStatus = (participant) => {
    // Simuler le statut en ligne (à intégrer avec socket)
    return Math.random() > 0.5 ? 'En ligne' : 'Hors ligne';
  };

  const markMessagesAsRead = (messageIds) => {
    // Marquer les messages comme lus (à implémenter avec socket)
    // socket.emit('mark_as_read', { conversationId: conversation.id, messageIds });
    
    // Mettre à jour localement
    setMessages(prev => prev.map(msg => 
      messageIds.includes(msg.id) 
        ? { ...msg, read: true }
        : msg
    ));
  };

  // Simuler la réception de messages en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && messages.length > 0) {
        const otherParticipants = conversation.participants?.filter(p => p.id !== user.id) || [];
        if (otherParticipants.length > 0) {
          const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
          const mockMessages = [
            "Bonjour ! Comment puis-je vous aider ?",
            "Merci pour votre message !",
            "Je vais vérifier cela pour vous.",
            "Avez-vous d'autres questions ?",
            "Nous sommes là pour vous aider !"
          ];
          
          const mockMessage = {
            id: Date.now(),
            sender_id: randomParticipant.id,
            nom: randomParticipant.nom,
            prenom: randomParticipant.prenom,
            content: mockMessages[Math.floor(Math.random() * mockMessages.length)],
            created_at: new Date().toISOString(),
            message_type: 'text',
            is_read: false
          };
          
          setMessages(prev => [...prev, mockMessage]);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [conversation, messages.length, user.id]);

  return (
    <div className="d-flex flex-column h-100">
      {/* En-tête de la conversation */}
      <div className="p-3 border-bottom bg-light">
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={onBack}
            className="p-0 me-3 text-muted"
            title="Retour aux conversations"
          >
            <i className="fas fa-arrow-left fa-lg"></i>
          </Button>
          
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                {conversation.type === 'support' ? (
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-headset"></i>
                  </div>
                ) : conversation.participants?.filter(p => p.id !== user.id).length === 1 ? (
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-user"></i>
                  </div>
                ) : (
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                       style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-users"></i>
                  </div>
                )}
              </div>
              
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0">{getConversationTitle()}</h6>
                <div className="text-muted small">
                  {conversation.participants?.length || 0} participant(s)
                  {typingUsers.length > 0 && (
                    <span className="text-primary ms-2">
                      <i className="fas fa-pencil-alt me-1"></i>
                      {typingUsers.map(u => u.prenom).join(', ')} est en train d'écrire...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Dropdown>
            <Dropdown.Toggle variant="link" className="text-muted p-0 border-0">
              <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <i className="fas fa-info-circle me-2"></i>
                Détails de la conversation
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="fas fa-bell me-2"></i>
                Paramètres de notification
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <i className="fas fa-times-circle me-2"></i>
                Quitter la conversation
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Liste des messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow-1 overflow-auto p-3 bg-chat"
        style={{ background: '#f8f9fa' }}
        onScroll={(e) => {
          // Charger plus de messages quand on scroll en haut
          if (e.target.scrollTop === 0 && hasMoreMessages && !loading) {
            handleLoadMore();
          }
        }}
      >
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {loading && messages.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className="text-primary mb-3">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="text-muted">Chargement des messages...</p>
          </div>
        ) : (
          <>
            {/* Bouton charger plus de messages */}
            {hasMoreMessages && (
              <div className="text-center mb-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    <i className="fas fa-history me-2"></i>
                  )}
                  Charger plus de messages
                </Button>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user.id;
              const previousMessage = messages[index - 1];
              const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
              const showSenderInfo = !previousMessage || 
                previousMessage.sender_id !== message.sender_id || 
                shouldShowDateSeparator(message, previousMessage);

              return (
                <div key={message.id}>
                  {/* Séparateur de date */}
                  {showDateSeparator && (
                    <div className="text-center my-4">
                      <Badge bg="light" text="dark" className="px-3 py-2">
                        {formatDateSeparator(message.created_at)}
                      </Badge>
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`d-flex mb-3 ${
                      isOwnMessage ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`position-relative ${
                        isOwnMessage 
                          ? 'bg-primary text-white' 
                          : 'bg-white border text-dark'
                      } rounded-3 p-3`}
                      style={{ 
                        maxWidth: '70%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Infos expéditeur */}
                      {!isOwnMessage && showSenderInfo && (
                        <div className="small fw-bold mb-1">
                          {message.prenom} {message.nom}
                        </div>
                      )}
                      
                      {/* Contenu du message */}
                      <div className="mb-1" style={{ 
                        wordWrap: 'break-word',
                        lineHeight: '1.4'
                      }}>
                        {message.content}
                      </div>
                      
                      {/* Métadonnées du message */}
                      <div className={`d-flex justify-content-between align-items-center ${
                        isOwnMessage ? 'text-white-50' : 'text-muted'
                      }`} style={{ fontSize: '0.75rem' }}>
                        <span>{formatMessageTime(message.created_at)}</span>
                        
                        {isOwnMessage && (
                          <span className="ms-2">
                            {message.is_read ? (
                              <i className="fas fa-check-double" title="Message lu"></i>
                            ) : message.id > 0 ? (
                              <i className="fas fa-check" title="Message envoyé"></i>
                            ) : (
                              <i className="fas fa-clock" title="Envoi en cours..."></i>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Indicateur de statut d'envoi */}
                      {message.isSending && (
                        <div className="position-absolute top-0 end-0 translate-middle">
                          <Spinner animation="border" size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicateur de frappe */}
            {typingUsers.length > 0 && (
              <div className="d-flex justify-content-start mb-3">
                <div className="bg-light border rounded-3 p-3">
                  <div className="d-flex align-items-center">
                    <div className="typing-indicator me-2">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <small className="text-muted">
                      {typingUsers.map(u => u.prenom).join(', ')} écrit...
                    </small>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Formulaire d'envoi */}
      <div className="p-3 border-top bg-white">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Button variant="outline-secondary" title="Ajouter un fichier">
              <i className="fas fa-paperclip"></i>
            </Button>
            
            <Form.Control
              type="text"
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={sending}
              style={{ 
                borderLeft: 'none', 
                borderRight: 'none',
                resize: 'none'
              }}
            />
            
            <Button 
              variant="outline-secondary" 
              title="Émoticônes"
            >
              <i className="far fa-smile"></i>
            </Button>
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              title="Envoyer le message"
            >
              {sending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </InputGroup>
          
          <div className="mt-2">
            <small className="text-muted">
              <i className="fas fa-shield-alt me-1"></i>
              Messages sécurisés et chiffrés
            </small>
          </div>
        </Form>
      </div>

      {/* Styles pour l'indicateur de frappe */}
      <style>
        {`
          .typing-indicator {
            display: inline-flex;
            align-items: center;
            height: 20px;
          }
          .typing-indicator span {
            height: 8px;
            width: 8px;
            background: #6c757d;
            border-radius: 50%;
            display: block;
            margin: 0 1px;
            animation: typing 1s infinite ease-in-out;
          }
          .typing-indicator span:nth-child(1) { animation-delay: 0.2s; }
          .typing-indicator span:nth-child(2) { animation-delay: 0.4s; }
          .typing-indicator span:nth-child(3) { animation-delay: 0.6s; }
          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .bg-chat {
            background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
          }
        `}
      </style>
    </div>
  );
};

export default MessageList;