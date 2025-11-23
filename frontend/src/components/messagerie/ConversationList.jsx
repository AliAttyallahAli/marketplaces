import React from 'react';
import { ListGroup, Badge, Form } from 'react-bootstrap';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, searchTerm, onSearchChange }) => {
  return (
    <div className="conversation-list">
      <div className="p-3 border-bottom">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Form.Group>
      </div>

      <ListGroup variant="flush">
        {conversations.map(conversation => (
          <ListGroup.Item
            key={conversation.id}
            action
            active={selectedConversation?.id === conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="d-flex w-100">
              <div className="position-relative me-3">
                <img
                  src={conversation.avatar || '/assets/default-avatar.png'}
                  alt={conversation.name}
                  className="rounded-circle"
                  style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                />
                {conversation.online && (
                  <span 
                    className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                    style={{ width: '12px', height: '12px' }}
                  ></span>
                )}
              </div>
              
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">{conversation.name}</h6>
                  <small className="text-muted">
                    {new Date(conversation.lastMessageTime).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
                
                <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '200px' }}>
                  {conversation.lastMessage}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <small className="text-muted">
                    {conversation.role && (
                      <Badge bg="secondary" className="me-1" style={{ fontSize: '0.6rem' }}>
                        {conversation.role}
                      </Badge>
                    )}
                  </small>
                  
                  {conversation.unreadCount > 0 && (
                    <Badge bg="primary" pill>
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {conversations.length === 0 && (
        <div className="text-center p-4 text-muted">
          <i className="fas fa-comments fa-2x mb-2"></i>
          <p>Aucune conversation</p>
        </div>
      )}
    </div>
  );
};

export default ConversationList;