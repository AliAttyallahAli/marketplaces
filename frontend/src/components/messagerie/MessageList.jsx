import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="message-list flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: '400px' }}>
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`d-flex mb-3 ${message.senderId === currentUser.id ? 'justify-content-end' : 'justify-content-start'}`}
        >
          <div
            className={`message-bubble p-3 rounded ${
              message.senderId === currentUser.id 
                ? 'bg-primary text-white' 
                : 'bg-light'
            }`}
            style={{ maxWidth: '70%' }}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className={`message-time small mt-1 ${
              message.senderId === currentUser.id ? 'text-white-50' : 'text-muted'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;