import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ProductForm from './ProductForm';

const AddProductButton = ({ onProductAdded, variant = 'primary', size = 'lg', className = '' }) => {
  const { isAuthenticated, isVendeur } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (!isAuthenticated || !isVendeur) {
    return null;
  }

  const handleProductAdded = () => {
    setShowModal(false);
    if (onProductAdded) {
      onProductAdded();
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
        <i className="fas fa-plus me-2"></i>
        Ajouter un produit
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-cube me-2"></i>
            Ajouter un nouveau produit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm onSuccess={handleProductAdded} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddProductButton;