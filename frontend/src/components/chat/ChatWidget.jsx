import React, { useState, useEffect, useRef } from 'react';
import { Button, Badge, Overlay, Popover } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Simuler la réception de nouveaux messages
    const interval = setInterval(() => {
      // Dans une vraie application, vous recevriez ces données via WebSocket
      setUnreadCount(prev => {
        if (prev < 5 && Math.random() > 0.7) {
          return prev + 1;
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    // Afficher le popover au premier rendu
    const timer = setTimeout(() => {
      setShowPopover(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowPopover(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleChatToggle = () => {
    setShowChat(!showChat);
    setShowPopover(false);
    
    // Réinitialiser le compteur de messages non lus quand on ouvre le chat
    if (unreadCount > 0 && !showChat) {
      setUnreadCount(0);
    }
  };

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Bouton de chat flottant */}
      <div 
        className="position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 1050 }}
      >
        <Button
          ref={target}
          variant="primary"
          onClick={handleChatToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="rounded-circle shadow-lg chat-widget-btn"
          style={{ 
            width: '60px', 
            height: '60px',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        >
          <i className={`fas ${showChat ? 'fa-times' : 'fa-comments'} fa-lg`}></i>
          
          {unreadCount > 0 && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 start-100 translate-middle pulse"
              style={{ 
                fontSize: '0.7rem',
                animation: 'pulse 2s infinite'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        <Overlay
          target={target.current}
          show={showPopover}
          placement="left"
        >
          <Popover 
            id="chat-popover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Popover.Header as="h3" className="d-flex align-items-center">
              <i className="fas fa-comments me-2 text-primary"></i>
              Chat ZouDou-Souk
              {unreadCount > 0 && (
                <Badge bg="primary" className="ms-2">
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                </Badge>
              )}
            </Popover.Header>
            <Popover.Body>
              <div className="text-center">
                <p className="mb-2">👋 Bonjour {user?.prenom} !</p>
                <p className="small text-muted mb-2">
                  Besoin d'aide ? Notre équipe est là pour vous répondre !
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleChatToggle}
                >
                  <i className="fas fa-comments me-1"></i>
                  Ouvrir le chat
                </Button>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>

      {/* Fenêtre de chat */}
      {showChat && (
        <ChatWindow 
          onClose={() => setShowChat(false)}
          unreadCount={unreadCount}
        />
      )}

      {/* Styles CSS pour l'animation */}
      <style>
        {`
          .chat-widget-btn:hover {
            transform: scale(1.1);
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
            }
            70% {
              transform: scale(1.1);
              box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
            }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </>
  );
};

export default ChatWidget;