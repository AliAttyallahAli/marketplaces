import React, { useState, useEffect } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import QuickMessaging from './QuickMessaging';

const MessagingBadge = () => {
  const [showMessaging, setShowMessaging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Données simulées

  // Simulation de nouvelles messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Pour la démo, on alterne entre 0 et quelques messages non lus
      setUnreadCount(prev => prev > 0 ? 0 : Math.floor(Math.random() * 3) + 1);
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleShowMessaging = () => {
    setShowMessaging(true);
    // Réinitialiser le compteur quand on ouvre la messagerie
    setUnreadCount(0);
  };

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Messagerie rapide</Tooltip>}
      >
        <div 
          className="position-relative d-inline-block me-3"
          style={{ cursor: 'pointer' }}
          onClick={handleShowMessaging}
        >
          <i className="fas fa-comments fa-lg text-white"></i>
          {unreadCount > 0 && (
            <Badge 
              bg="danger" 
              pill 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.6rem' }}
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </OverlayTrigger>

      <QuickMessaging 
        show={showMessaging} 
        onHide={() => setShowMessaging(false)} 
      />
    </>
  );
};

export default MessagingBadge;