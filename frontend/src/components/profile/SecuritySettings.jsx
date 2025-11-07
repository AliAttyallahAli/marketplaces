import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Simuler le changement de mot de passe
    setTimeout(() => {
      setMessage('Mot de passe changé avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="security-settings">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">Changer le mot de passe</h5>
        </Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe actuel</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Sécurité du compte</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold">Authentification à deux facteurs</h6>
              <p className="text-muted mb-0">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
            </div>
            <Form.Check 
              type="switch"
              id="2fa-switch"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="fw-bold">Sessions actives</h6>
              <p className="text-muted mb-0">
                Gérer les appareils connectés à votre compte
              </p>
            </div>
            <Button variant="outline-primary" size="sm">
              Voir les sessions
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SecuritySettings;