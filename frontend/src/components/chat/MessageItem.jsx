import React from 'react';
import { ListGroup } from 'react-bootstrap';
//import { format } from 'date-fns';
//import { fr } from 'date-fns/locale';

const MessageItem = ({ message, isOwn }) => {
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch (error) {
      return '--:--';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <ListGroup.Item 
      className={`message-item ${isOwn ? 'own-message' : 'other-message'} border-0`}
    >
      <div className="message-content">
        <div className="message-bubble">
          <div className="message-text">
            {message.content || message.message}
          </div>
          {message.file_url && (
            <div className="message-file mt-2">
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="file-link"
              >
                <i className="fas fa-paperclip me-2"></i>
                Fichier joint
              </a>
            </div>
          )}
          <div className="message-time">
            <small className="text-muted" title={formatDate(message.created_at)}>
              {formatTime(message.created_at)}
            </small>
            {message.is_read && isOwn && (
              <i className="fas fa-check-double text-primary ms-2" title="Message lu"></i>
            )}
          </div>
        </div>
        
        {!isOwn && message.user && (
          <div className="message-sender">
            <small className="text-muted">
              {message.user.prenom} {message.user.nom}
            </small>
          </div>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default MessageItem;