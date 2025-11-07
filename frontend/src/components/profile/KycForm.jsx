import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, ProgressBar } from 'react-bootstrap';

const KycForm = ({ onVerificationComplete }) => {
  const [formData, setFormData] = useState({
    piece_identite: null,
    photo_identite: null,
    selfie: null,
    justificatif_domicile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Pièce d\'identité', description: 'Document officiel' },
    { number: 2, title: 'Photo de la pièce', description: 'Photo claire du document' },
    { number: 3, title: 'Selfie avec pièce', description: 'Photo de vous avec le document' },
    { number: 4, title: 'Justificatif de domicile', description: 'Facture récente' }
  ];

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Validation de la taille
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 10MB');
        return;
      }

      // Validation du type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non supporté. Utilisez JPG, PNG ou PDF.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      setError('');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Vérifier que tous les documents sont fournis
    const requiredDocs = ['piece_identite', 'photo_identite', 'selfie'];
    const missingDocs = requiredDocs.filter(doc => !formData[doc]);

    if (missingDocs.length > 0) {
      setError('Veuillez fournir tous les documents obligatoires');
      setLoading(false);
      return;
    }

    // Simuler l'envoi des documents
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess('Vos documents ont été soumis avec succès. Ils seront vérifiés sous 24-48 heures.');
      onVerificationComplete?.();
    } catch (error) {
      setError('Erreur lors de la soumission des documents');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form.Group>
            <Form.Label>Pièce d'identité *</Form.Label>
            <Form.Control
              type="file"
              name="piece_identite"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              required
            />
            <Form.Text className="text-muted">
              Carte nationale d'identité, passeport ou permis de conduire valide
            </Form.Text>
          </Form.Group>
        );
      case 2:
        return (
          <Form.Group>
            <Form.Label>Photo de la pièce d'identité *</Form.Label>
            <Form.Control
              type="file"
              name="photo_identite"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              required
            />
            <Form.Text className="text-muted">
              Photo claire et lisible de votre pièce d'identité
            </Form.Text>
          </Form.Group>
        );
      case 3:
        return (
          <Form.Group>
            <Form.Label>Selfie avec pièce d'identité *</Form.Label>
            <Form.Control
              type="file"
              name="selfie"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              required
            />
            <Form.Text className="text-muted">
              Selfie où on voit clairement votre visage et votre pièce d'identité
            </Form.Text>
          </Form.Group>
        );
      case 4:
        return (
          <Form.Group>
            <Form.Label>Justificatif de domicile</Form.Label>
            <Form.Control
              type="file"
              name="justificatif_domicile"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <Form.Text className="text-muted">
              Facture d'électricité, d'eau ou de téléphone de moins de 3 mois
            </Form.Text>
          </Form.Group>
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className="border-0">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <i className="fas fa-id-card fa-3x text-primary mb-3"></i>
          <h4 className="fw-bold">Vérification KYC</h4>
          <p className="text-muted">
            Complétez votre vérification d'identité pour accéder à toutes les fonctionnalités
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Progression</small>
            <small className="fw-bold">{Math.round(progress)}%</small>
          </div>
          <ProgressBar now={progress} variant="primary" style={{ height: '8px' }} />
        </div>

        {/* Étapes */}
        <Row className="mb-4">
          {steps.map(step => (
            <Col key={step.number} className="text-center">
              <div className={`step-indicator ${currentStep >= step.number ? 'active' : ''}`}>
                <div className="step-number">{step.number}</div>
                <div className="step-info">
                  <small className="fw-bold d-block">{step.title}</small>
                  <small className="text-muted">{step.description}</small>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Form onSubmit={currentStep === steps.length ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {getStepContent()}

          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Précédent
            </Button>

            {currentStep === steps.length ? (
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Soumission...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Soumettre pour vérification
                  </>
                )}
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                Suivant
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            )}
          </div>
        </Form>

        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="fw-bold mb-3">
            <i className="fas fa-info-circle me-2 text-info"></i>
            Instructions importantes:
          </h6>
          <ul className="mb-0 small">
            <li>Tous les documents doivent être clairs et lisibles</li>
            <li>Les photos doivent être en couleur et de bonne qualité</li>
            <li>Les fichiers ne doivent pas dépasser 10MB chacun</li>
            <li>Le traitement prend généralement 24 à 48 heures</li>
            <li>Vous serez notifié par email une fois la vérification complétée</li>
          </ul>
        </div>
      </Card.Body>

      <style jsx>{`
        .step-indicator {
          position: relative;
        }
        
        .step-indicator.active .step-number {
          background: #0d6efd;
          color: white;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .step-info {
          font-size: 0.8rem;
        }
      `}</style>
    </Card>
  );
};

export default KycForm;