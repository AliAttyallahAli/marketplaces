import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({ variant = 'outline-danger', size = 'sm', className = '', showIcon = true }) => {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
      >
        {showIcon && <i className="fas fa-sign-out-alt me-2"></i>}
        Déconnexion
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-sign-out-alt text-warning me-2"></i>
            Confirmation de déconnexion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
          <div className="alert alert-warning mb-0">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Vous devrez vous reconnecter pour accéder à votre compte.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <i className="fas fa-times me-2"></i>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Se déconnecter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogoutButton;