import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input border-top p-3">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            style={{ resize: 'none' }}
          />
          <Button 
            variant="primary" 
            type="submit" 
            disabled={!message.trim() || disabled}
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </InputGroup>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" disabled={disabled}>
              <i className="fas fa-paperclip"></i>
            </Button>
            <Button variant="outline-secondary" size="sm" disabled={disabled}>
              <i className="fas fa-image"></i>
            </Button>
            <Button variant="outline-secondary" size="sm" disabled={disabled}>
              <i className="fas fa-smile"></i>
            </Button>
          </div>
          
          <small className="text-muted">
            Appuyez sur Entrée pour envoyer
          </small>
        </div>
      </Form>
    </div>
  );
};

export default MessageInput;