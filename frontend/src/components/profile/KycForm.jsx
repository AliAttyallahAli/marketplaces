import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

const KycForm = ({ userData, onUpdate }) => {
  const [documents, setDocuments] = useState({
    piece_identite: null,
    selfie: null,
    justificatif_domicile: null
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (documentType, file) => {
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 10MB');
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté. Utilisez JPG, PNG ou PDF.');
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Vérifier que tous les documents sont fournis
    if (!documents.piece_identite || !documents.selfie || !documents.justificatif_domicile) {
      toast.error('Veuillez uploader tous les documents requis');
      setLoading(false);
      return;
    }

    try {
      // Simuler l'envoi des documents
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Documents KYC soumis avec succès! En attente de vérification.');
      onUpdate();
    } catch (error) {
      toast.error('Erreur lors de la soumission des documents');
    } finally {
      setLoading(false);
    }
  };

  const DocumentUpload = ({ title, documentType, required = true }) => (
    <Card className="border-0 bg-light h-100">
      <Card.Body className="text-center">
        <div className="mb-3">
          <i className="fas fa-file-upload fa-2x text-primary"></i>
        </div>
        <h6 className="fw-bold">{title}</h6>
        {required && <small className="text-muted">* Requis</small>}
        
        <div className="mt-3">
          {documents[documentType] ? (
            <div>
              <Badge bg="success" className="mb-2">
                <i className="fas fa-check me-1"></i>
                Fichier uploadé
              </Badge>
              <p className="small text-muted mb-2">
                {documents[documentType].name}
              </p>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setDocuments(prev => ({ ...prev, [documentType]: null }))}
              >
                <i className="fas fa-times me-1"></i>
                Supprimer
              </Button>
            </div>
          ) : (
            <Form.Group>
              <Form.Label className="btn btn-outline-primary btn-sm cursor-pointer">
                <i className="fas fa-upload me-1"></i>
                Choisir un fichier
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(documentType, e.target.files[0])}
                  className="d-none"
                />
              </Form.Label>
            </Form.Group>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      <Alert variant="info" className="mb-4">
        <i className="fas fa-info-circle me-2"></i>
        La vérification KYC (Know Your Customer) est obligatoire pour utiliser 
        tous les services de ZouDou-Souk. Tous les documents doivent être clairs et lisibles.
      </Alert>

      <div className="mb-4">
        <h5 className="fw-bold mb-3">Statut de Vérification</h5>
        <div className="d-flex gap-3">
          <Badge bg={userData?.kyc_verified ? 'success' : 'warning'} className="fs-6 p-2">
            <i className={`fas fa-${userData?.kyc_verified ? 'check' : 'clock'} me-2`}></i>
            KYC: {userData?.kyc_verified ? 'Vérifié' : 'En attente'}
          </Badge>
          
          {userData?.role === 'vendeur' && (
            <Badge bg={userData?.kyb_verified ? 'success' : 'warning'} className="fs-6 p-2">
              <i className={`fas fa-${userData?.kyb_verified ? 'check' : 'clock'} me-2`}></i>
              KYB: {userData?.kyb_verified ? 'Vérifié' : 'En attente'}
            </Badge>
          )}
        </div>
      </div>

      {!userData?.kyc_verified && (
        <Form onSubmit={handleSubmit}>
          <h5 className="fw-bold mb-4">Documents à Fournir</h5>
          
          <Row className="g-3 mb-4">
            <Col md={4}>
              <DocumentUpload
                title="Pièce d'Identité"
                documentType="piece_identite"
                required={true}
              />
            </Col>
            
            <Col md={4}>
              <DocumentUpload
                title="Selfie avec Pièce d'Identité"
                documentType="selfie"
                required={true}
              />
            </Col>
            
            <Col md={4}>
              <DocumentUpload
                title="Justificatif de Domicile"
                documentType="justificatif_domicile"
                required={true}
              />
            </Col>
          </Row>

          <Alert variant="warning" className="mb-4">
            <h6 className="fw-bold">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Instructions importantes:
            </h6>
            <ul className="mb-0">
              <li>Taille maximale par fichier: 10MB</li>
              <li>Formats acceptés: JPG, PNG, PDF</li>
              <li>La pièce d'identité doit être valide et lisible</li>
              <li>Le selfie doit montrer clairement votre visage avec la pièce d'identité</li>
              <li>Le justificatif de domicile doit être récent (moins de 3 mois)</li>
            </ul>
          </Alert>

          <div className="text-center">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading || userData?.kyc_verified}
              size="lg"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Soumission en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Soumettre pour vérification
                </>
              )}
            </Button>
          </div>
        </Form>
      )}

      {userData?.kyc_verified && (
        <Alert variant="success" className="mb-4">
          <h6 className="fw-bold">
            <i className="fas fa-check-circle me-2"></i>
            KYC Vérifié
          </h6>
          <p className="mb-0">
            Votre identité a été vérifiée avec succès. Vous avez maintenant accès 
            à tous les services de ZouDou-Souk.
          </p>
        </Alert>
      )}

      {userData?.role === 'vendeur' && !userData?.kyb_verified && (
        <Alert variant="info" className="mt-4">
          <h6 className="fw-bold">
            <i className="fas fa-store me-2"></i>
            Vérification KYB Requise
          </h6>
          <p className="mb-0">
            En tant que vendeur, vous devez compléter la vérification KYB (Know Your Business).
            Cette vérification supplémentaire sera disponible prochainement.
          </p>
        </Alert>
      )}
    </div>
  );
};

export default KycForm;