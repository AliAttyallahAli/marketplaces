import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const VisaCard = () => {
  const { user } = useAuth();

  const generateVisaCard = () => {
    // Générer une carte Visa virtuelle au format PDF
    alert('Génération de la carte Visa en cours...');
  };

  const formatCardNumber = (phone) => {
    if (!phone) return 'XXXX XXXX XXXX XXXX';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || 'XXXX XXXX XXXX XXXX';
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 2);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <Card className="border-0 shadow-sm visa-card">
      <Card.Body className="p-4 text-white" style={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #303f9f 100%)',
        borderRadius: '15px'
      }}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h6 className="mb-1">ZouDou-Souk</h6>
            <small>Carte Visa Virtuelle</small>
          </div>
          <div className="text-end">
            <i className="fab fa-cc-visa fa-2x"></i>
          </div>
        </div>

        <div className="mb-4">
          <div className="chip mb-3" style={{ 
            width: '50px', 
            height: '40px', 
            background: 'linear-gradient(45deg, #FFD700, #FFECB3)',
            borderRadius: '5px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#000',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              CHIP
            </div>
          </div>
          
          <h4 className="mb-3 font-monospace">
            {formatCardNumber(user?.phone)}
          </h4>
          
          <div className="d-flex justify-content-between">
            <div>
              <small>Titulaire</small>
              <div className="fw-bold">{user?.prenom} {user?.nom}</div>
            </div>
            <div>
              <small>Expire</small>
              <div className="fw-bold">{getExpiryDate()}</div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small>Votre wallet: {user?.phone}</small>
          <Button 
            variant="light" 
            size="sm"
            onClick={generateVisaCard}
          >
            <i className="fas fa-download me-1"></i>
            PDF
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VisaCard;