import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';

const VisaCardGenerator = () => {
  const { user } = useAuth();
  const [showCard, setShowCard] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateVisaCard = () => {
    setGenerating(true);
    
    // Simuler la génération
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Fond de la carte
      doc.setFillColor(30, 50, 100);
      doc.rect(20, 20, pageWidth - 40, 80, 'F');
      
      // Logo ZouDou-Souk
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('ZouDou-Souk', 30, 35);
      
      // Type de carte
      doc.setFontSize(10);
      doc.text('Carte Visa Virtuelle', 30, 45);
      
      // Numéro de carte (formaté à partir du téléphone)
      const cardNumber = user.phone.replace(/\D/g, '').padEnd(16, '0');
      const formattedCardNumber = cardNumber.match(/.{1,4}/g).join(' ');
      
      doc.setFontSize(14);
      doc.setFont('courier', 'bold');
      doc.text(formattedCardNumber, 30, 60);
      
      // Nom du titulaire
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${user.prenom} ${user.nom}`.toUpperCase(), 30, 75);
      
      // Date d'expiration (2 ans)
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 2);
      const expireText = `${(expireDate.getMonth() + 1).toString().padStart(2, '0')}/${expireDate.getFullYear().toString().slice(-2)}`;
      
      doc.text(`EXP: ${expireText}`, pageWidth - 50, 75);
      
      // QR Code placeholder
      doc.setFillColor(255, 255, 255);
      doc.rect(pageWidth - 40, 45, 25, 25, 'F');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('QR CODE', pageWidth - 37, 58);
      
      // Informations supplémentaires
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`Wallet: ${user.phone}`, 30, 85);
      doc.text('www.zoudousouk.td', pageWidth - 50, 85);
      
      // Sauvegarder le PDF
      doc.save(`carte-visa-${user.phone}.pdf`);
      setGenerating(false);
      setShowCard(true);
    }, 1000);
  };

  const downloadCard = () => {
    generateVisaCard();
  };

  return (
    <div className="visa-card-generator">
      <Card className="border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <i className="fas fa-credit-card fa-3x text-primary mb-3"></i>
            <h4 className="fw-bold">Ma Carte Visa Virtuelle</h4>
            <p className="text-muted">
              Téléchargez votre carte visa virtuelle ZouDou-Souk
            </p>
          </div>

          <Row className="align-items-center">
            <Col md={6}>
              <div className="bg-primary text-white rounded p-4 text-center">
                <div className="visa-card-preview mb-3">
                  <div className="card-chip"></div>
                  <div className="card-number">
                    {user.phone.replace(/\D/g, '').slice(0, 16).padEnd(16, '•').match(/.{1,4}/g).join(' ')}
                  </div>
                  <div className="card-holder">
                    {user.prenom} {user.nom}
                  </div>
                  <div className="card-expiry">••/••</div>
                  <div className="visa-logo">VISA</div>
                </div>
                <small>Prévisualisation de votre carte</small>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="ps-md-4">
                <h6 className="fw-bold mb-3">Caractéristiques de la carte:</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Numéro de wallet: {user.phone}
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    QR Code personnel intégré
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Valide 2 ans
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Acceptée sur toute la plateforme
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    Téléchargeable en PDF
                  </li>
                </ul>
                
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={downloadCard}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Génération...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download me-2"></i>
                      Télécharger ma carte Visa
                    </>
                  )}
                </Button>
                
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1"></i>
                    Carte sécurisée et personnalisée
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal de confirmation */}
      <Modal show={showCard} onHide={() => setShowCard(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Carte Visa Générée</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h5>Votre carte Visa a été générée avec succès!</h5>
            <p className="text-muted">
              Le fichier PDF a été téléchargé. Vous pouvez l'imprimer ou le sauvegarder.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCard(false)}>
            Compris
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .visa-card-preview {
          background: linear-gradient(135deg, #1a237e, #283593);
          border-radius: 12px;
          padding: 20px;
          color: white;
          position: relative;
          height: 180px;
          font-family: 'Courier New', monospace;
        }
        
        .card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .card-number {
          font-size: 18px;
          letter-spacing: 2px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .card-holder {
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        
        .card-expiry {
          font-size: 12px;
          position: absolute;
          bottom: 20px;
          left: 20px;
        }
        
        .visa-logo {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-weight: bold;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default VisaCardGenerator;