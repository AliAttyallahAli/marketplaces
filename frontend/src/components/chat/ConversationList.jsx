import React from 'react';
import { ListGroup, Button, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ConversationList = ({ 
  conversations, 
  onSelectConversation, 
  selectedConversation,
  loading,
  onNewConversation 
}) => {
  const { user } = useAuth();

  const formatTime = (dateString) => {
    if (!dateString) return 'Jamais';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Maintenant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getConversationTitle = (conversation) => {
    if (conversation.title) return conversation.title;
    
    // Pour les conversations directes, afficher le nom des autres participants
    const otherParticipants = conversation.participants?.filter(p => p.id !== user.id) || [];
    if (otherParticipants.length === 1) {
      return `${otherParticipants[0].prenom} ${otherParticipants[0].nom}`;
    } else if (otherParticipants.length > 1) {
      return `${otherParticipants.length} participants`;
    }
    
    return 'Conversation';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'support') {
      return (
        <div 
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <i className="fas fa-headset"></i>
        </div>
      );
    }

    const otherParticipants = conversation.participants?.filter(p => p.id !== user.id) || [];
    if (otherParticipants.length === 1 && otherParticipants[0].photo) {
      return (
        <img 
          src={otherParticipants[0].photo} 
          alt="Avatar"
          className="rounded-circle"
          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
        />
      );
    }

    return (
      <div 
        className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: '40px', height: '40px' }}
      >
        <i className="fas fa-users"></i>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex flex-column h-100">
        <div className="p-3 border-bottom">
          <Button 
            variant="primary" 
            size="sm" 
            className="w-100"
            onClick={onNewConversation}
            disabled
          >
            <i className="fas fa-edit me-2"></i>
            Nouveau message
          </Button>
        </div>
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* En-tête */}
      <div className="p-3 border-bottom">
        <Button 
          variant="primary" 
          size="sm" 
          className="w-100"
          onClick={onNewConversation}
        >
          <i className="fas fa-edit me-2"></i>
          Nouveau message
        </Button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-grow-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="text-center p-4 text-muted">
            <i className="fas fa-comments fa-2x mb-3"></i>
            <p>Aucune conversation</p>
            <Button variant="outline-primary" size="sm" onClick={onNewConversation}>
              Démarrer une conversation
            </Button>
          </div>
        ) : (
          <ListGroup variant="flush">
            {conversations.map(conversation => (
              <ListGroup.Item
                key={conversation.id}
                action
                onClick={() => onSelectConversation(conversation)}
                className={`d-flex align-items-center py-3 ${
                  selectedConversation?.id === conversation.id ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 me-3">
                  {getConversationAvatar(conversation)}
                </div>

                {/* Contenu */}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <strong className="text-truncate me-2">
                      {getConversationTitle(conversation)}
                    </strong>
                    <small className="text-muted flex-shrink-0">
                      {formatTime(conversation.last_message_at)}
                    </small>
                  </div>
                  
                  <p className="text-muted small mb-0 text-truncate">
                    {conversation.last_message || 'Aucun message'}
                  </p>
                </div>

                {/* Badge messages non lus */}
                {conversation.unread_count > 0 && (
                  <Badge bg="primary" className="flex-shrink-0 ms-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Pied de page */}
      <div className="p-3 border-top bg-light">
        <div className="text-center">
          <small className="text-muted">
            <i className="fas fa-shield-alt me-1"></i>
            Conversations sécurisées
          </small>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;