import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import BlogForm from './BlogForm';

const AddBlogButton = ({ onBlogAdded, variant = 'primary', size = 'lg', className = '' }) => {
  const { isAuthenticated, isVendeur, isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Seuls les vendeurs et admin peuvent publier des blogs
  if (!isAuthenticated || (!isVendeur && !isAdmin)) {
    return null;
  }

  const handleBlogAdded = () => {
    setShowModal(false);
    if (onBlogAdded) {
      onBlogAdded();
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
      >
        <i className="fas fa-edit me-2"></i>
        Nouvel article
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-newspaper me-2"></i>
            Créer un nouvel article
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <BlogForm onSuccess={handleBlogAdded} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBlogButton;