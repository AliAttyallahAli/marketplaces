const db = require('../config/database');

const chatController = {
  // Obtenir les conversations de l'utilisateur
  getConversations: (req, res) => {
    const userId = req.user.id;

    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM chat_messages cm 
         WHERE cm.conversation_id = c.id AND 
         (cm.read_by IS NULL OR cm.read_by NOT LIKE ?) AND 
         cm.sender_id != ?) as unread_count
      FROM chat_conversations c
      WHERE c.id IN (
        SELECT conversation_id FROM chat_participants 
        WHERE user_id = ? AND is_active = 1
      )
      AND c.is_active = 1
      ORDER BY c.last_message_at DESC
    `;

    db.all(query, [`%${userId}%`, userId, userId], (err, conversations) => {
      if (err) {
        console.error('Error fetching conversations:', err);
        return res.status(500).json({ error: 'Erreur base de données' });
      }

      // Récupérer les participants pour chaque conversation
      const conversationsWithParticipants = conversations.map(conversation => {
        return new Promise((resolve) => {
          db.all(`SELECT u.id, u.nom, u.prenom, u.photo, u.role, cp.role as participant_role
                  FROM chat_participants cp
                  JOIN users u ON cp.user_id = u.id
                  WHERE cp.conversation_id = ? AND cp.is_active = 1`,
            [conversation.id], (err, participants) => {
              if (err) {
                resolve({ ...conversation, participants: [] });
              } else {
                resolve({ ...conversation, participants });
              }
            }
          );
        });
      });

      Promise.all(conversationsWithParticipants)
        .then(conversations => res.json({ conversations }))
        .catch(error => {
          console.error('Error loading participants:', error);
          res.status(500).json({ error: 'Erreur chargement participants' });
        });
    });
  },

  // Obtenir les messages d'une conversation
  getMessages: (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Vérifier que l'utilisateur fait partie de la conversation
    db.get(`SELECT 1 FROM chat_participants 
            WHERE conversation_id = ? AND user_id = ? AND is_active = 1`,
      [conversationId, req.user.id], (err, participant) => {
        if (err || !participant) {
          return res.status(403).json({ error: 'Accès non autorisé' });
        }

        db.all(`SELECT cm.*, u.nom, u.prenom, u.photo, u.role
                FROM chat_messages cm
                JOIN users u ON cm.sender_id = u.id
                WHERE cm.conversation_id = ? AND cm.is_deleted = 0
                ORDER BY cm.created_at DESC
                LIMIT ? OFFSET ?`,
          [conversationId, limit, offset], (err, messages) => {
            if (err) {
              console.error('Error fetching messages:', err);
              return res.status(500).json({ error: 'Erreur base de données' });
            }

            res.json({ messages: messages.reverse() });
          }
        );
      }
    );
  },

  // Envoyer un message
  sendMessage: (req, res) => {
    const { conversationId } = req.params;
    const { content, messageType = 'text', fileUrl = null, fileName = null, fileSize = null } = req.body;
    const senderId = req.user.id;

    // Vérifier que l'utilisateur fait partie de la conversation
    db.get(`SELECT 1 FROM chat_participants 
            WHERE conversation_id = ? AND user_id = ? AND is_active = 1`,
      [conversationId, senderId], (err, participant) => {
        if (err || !participant) {
          return res.status(403).json({ error: 'Accès non autorisé' });
        }

        db.run(`INSERT INTO chat_messages 
                (conversation_id, sender_id, message_type, content, file_url, file_name, file_size) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [conversationId, senderId, messageType, content, fileUrl, fileName, fileSize],
          function(err) {
            if (err) {
              console.error('Error sending message:', err);
              return res.status(500).json({ error: 'Erreur envoi message' });
            }

            // Mettre à jour la dernière activité de la conversation
            db.run(`UPDATE chat_conversations 
                    SET last_message = ?, last_message_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`,
              [content.substring(0, 100), conversationId]
            );

            // Récupérer le message complet
            db.get(`SELECT cm.*, u.nom, u.prenom, u.photo, u.role
                    FROM chat_messages cm 
                    JOIN users u ON cm.sender_id = u.id 
                    WHERE cm.id = ?`, 
              [this.lastID], (err, message) => {
                if (err) {
                  return res.status(500).json({ error: 'Erreur récupération message' });
                }

                res.status(201).json({ 
                  message: 'Message envoyé',
                  message 
                });
              }
            );
          }
        );
      }
    );
  },

  // Créer une nouvelle conversation
  createConversation: (req, res) => {
    const { type = 'direct', title, participantIds } = req.body;
    const created_by = req.user.id;

    db.run(`INSERT INTO chat_conversations (type, title, created_by) VALUES (?, ?, ?)`,
      [type, title, created_by], function(err) {
        if (err) {
          console.error('Error creating conversation:', err);
          return res.status(500).json({ error: 'Erreur création conversation' });
        }

        const conversationId = this.lastID;

        // Ajouter le créateur comme participant
        const participants = [{ user_id: created_by, role: 'admin' }];
        
        // Ajouter les autres participants
        if (participantIds && participantIds.length > 0) {
          participantIds.forEach(participantId => {
            if (participantId !== created_by) {
              participants.push({ user_id: participantId, role: 'member' });
            }
          });
        }

        // Insérer tous les participants
        const placeholders = participants.map(() => '(?, ?, ?)').join(',');
        const values = participants.flatMap(p => [conversationId, p.user_id, p.role]);

        db.run(`INSERT INTO chat_participants (conversation_id, user_id, role) VALUES ${placeholders}`,
          values, function(err) {
            if (err) {
              console.error('Error adding participants:', err);
              return res.status(500).json({ error: 'Erreur ajout participants' });
            }

            // Récupérer la conversation créée avec ses participants
            db.get(`SELECT * FROM chat_conversations WHERE id = ?`, 
              [conversationId], (err, conversation) => {
                if (err) {
                  return res.status(500).json({ error: 'Erreur récupération conversation' });
                }

                res.status(201).json({ 
                  message: 'Conversation créée',
                  conversation 
                });
              }
            );
          }
        );
      }
    );
  }
};

module.exports = chatController;