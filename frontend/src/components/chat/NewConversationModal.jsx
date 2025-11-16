import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, ListGroup, InputGroup, Spinner } from 'react-bootstrap';
import { chatAPI } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';

const NewConversationModal = ({ show, onHide, onConversationCreated }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [conversationTitle, setConversationTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      // Simulation de recherche d'utilisateurs
      const mockUsers = [
        {
          id: 2,
          nom: 'Client',
          prenom: 'Test',
          email: 'client@test.td',
          photo: null,
          role: 'client'
        },
        {
          id: 3,
          nom: 'Vendeur',
          prenom: 'Example',
          email: 'vendeur@test.td',
          photo: null,
          role: 'vendeur'
        }
      ];
      setSearchResults(mockUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    setCreating(true);
    try {
      const participantIds = selectedUsers.map(u => u.id);
      
      // Simulation de création de conversation
      const mockConversation = {
        id: Date.now(),
        type: selectedUsers.length > 1 ? 'group' : 'direct',
        title: conversationTitle || `Conversation avec ${selectedUsers.map(u => u.prenom).join(', ')}`,
        participants: [
          {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            role: 'admin'
          },
          ...selectedUsers
        ],
        last_message: null,
        last_message_at: new Date().toISOString(),
        unread_count: 0
      };

      onConversationCreated(mockConversation);
      onHide();
      
      // Réinitialiser le formulaire
      setSelectedUsers([]);
      setConversationTitle('');
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-edit me-2"></i>
          Nouvelle Conversation
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Recherche d'utilisateurs */}
        <Form.Group className="mb-3">
          <Form.Label>Rechercher des utilisateurs</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Tapez le nom ou l'email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        {/* Résultats de recherche */}
        {loading && (
          <div className="text-center py-2">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {searchResults.length > 0 && (
          <ListGroup className="mb-3">
            {searchResults.map(user => (
              <ListGroup.Item
                key={user.id}
                action
                onClick={() => handleUserSelect(user)}
                className="d-flex align-items-center"
              >
                <div className="flex-shrink-0 me-3">
                  {user.photo ? (
                    <img 
                      src={user.photo} 
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <strong>{user.prenom} {user.nom}</strong>
                  <div className="text-muted small">{user.email}</div>
                </div>
                <Badge bg="secondary">{user.role}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {/* Utilisateurs sélectionnés */}
        {selectedUsers.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Participants sélectionnés ({selectedUsers.length})</Form.Label>
            <div className="border rounded p-2">
              {selectedUsers.map(user => (
                <Badge 
                  key={user.id}
                  bg="primary"
                  className="me-2 mb-2 p-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleUserRemove(user.id)}
                >
                  {user.prenom} {user.nom}
                  <i className="fas fa-times ms-2"></i>
                </Badge>
              ))}
            </div>
          </Form.Group>
        )}

        {/* Titre de la conversation (pour les groupes) */}
        {selectedUsers.length > 1 && (
          <Form.Group className="mb-3">
            <Form.Label>Titre de la conversation (optionnel)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Donnez un titre à votre groupe..."
              value={conversationTitle}
              onChange={(e) => setConversationTitle(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Aide */}
        <div className="alert alert-info">
          <small>
            <i className="fas fa-info-circle me-2"></i>
            Sélectionnez un ou plusieurs utilisateurs pour démarrer une conversation.
            Pour le support, contactez directement notre équipe.
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCreateConversation}
          disabled={creating || selectedUsers.length === 0}
        >
          {creating ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Création...
            </>
          ) : (
            <>
              <i className="fas fa-comments me-2"></i>
              Créer la conversation
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewConversationModal;