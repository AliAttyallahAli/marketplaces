const db = require('../config/database');

exports.getConversations = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      c.id,
      c.last_message,
      c.last_message_at,
      c.unread_count,
      u.id as user_id,
      u.nom,
      u.prenom,
      u.photo,
      u.role,
      u.kyc_verified
    FROM conversations c
    JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
    JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
    JOIN users u ON cp2.user_id = u.id
    WHERE cp1.user_id = ? AND cp2.user_id != ?
    ORDER BY c.last_message_at DESC
  `;

  db.all(sql, [userId, userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur récupération conversations' });
    }
    res.json({ conversations: rows });
  });
};

exports.getMessages = (req, res) => {
  const conversationId = req.params.conversationId;
  const userId = req.user.id;

  // Vérifier que l'utilisateur participe à la conversation
  const checkSql = 'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?';
  
  db.get(checkSql, [conversationId, userId], (err, row) => {
    if (err || !row) {
      return res.status(403).json({ error: 'Accès non autorisé à cette conversation' });
    }

    const sql = `
      SELECT 
        m.id,
        m.content,
        m.type,
        m.created_at,
        m.read_at,
        u.id as sender_id,
        u.nom as sender_nom,
        u.prenom as sender_prenom
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `;

    db.all(sql, [conversationId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur récupération messages' });
      }

      // Marquer les messages comme lus
      db.run(
        'UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL',
        [conversationId, userId]
      );

      res.json({ messages: rows });
    });
  });
};

exports.sendMessage = (req, res) => {
  const conversationId = req.params.conversationId;
  const { content } = req.body;
  const senderId = req.user.id;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Le message ne peut pas être vide' });
  }

  // Vérifier que l'utilisateur participe à la conversation
  const checkSql = 'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?';
  
  db.get(checkSql, [conversationId, senderId], (err, row) => {
    if (err || !row) {
      return res.status(403).json({ error: 'Accès non autorisé à cette conversation' });
    }

    const sql = `
      INSERT INTO messages (conversation_id, sender_id, content, type)
      VALUES (?, ?, ?, 'text')
    `;

    db.run(sql, [conversationId, senderId, content.trim()], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur envoi message' });
      }

      // Mettre à jour la conversation
      db.run(
        'UPDATE conversations SET last_message = ?, last_message_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content.substring(0, 100), conversationId]
      );

      // Incrémenter le compteur de messages non lus pour les autres participants
      db.run(
        'UPDATE conversation_participants SET unread_count = unread_count + 1 WHERE conversation_id = ? AND user_id != ?',
        [conversationId, senderId]
      );

      res.status(201).json({ 
        message: 'Message envoyé avec succès',
        messageId: this.lastID 
      });
    });
  });
};

exports.createConversation = (req, res) => {
  const { participant_id } = req.body;
  const userId = req.user.id;

  if (userId === participant_id) {
    return res.status(400).json({ error: 'Impossible de créer une conversation avec soi-même' });
  }

  // Vérifier si une conversation existe déjà
  const checkSql = `
    SELECT c.id 
    FROM conversations c
    JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
    JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
    WHERE cp1.user_id = ? AND cp2.user_id = ?
  `;

  db.get(checkSql, [userId, participant_id], (err, existingConversation) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur vérification conversation' });
    }

    if (existingConversation) {
      return res.json({ 
        message: 'Conversation existante',
        conversationId: existingConversation.id 
      });
    }

    // Créer une nouvelle conversation
    db.run('INSERT INTO conversations (last_message_at) VALUES (CURRENT_TIMESTAMP)', function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur création conversation' });
      }

      const conversationId = this.lastID;

      // Ajouter les participants
      const participants = [userId, participant_id];
      let participantsAdded = 0;

      participants.forEach(participantId => {
        db.run(
          'INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)',
          [conversationId, participantId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Erreur ajout participant' });
            }
            participantsAdded++;

            if (participantsAdded === participants.length) {
              res.status(201).json({ 
                message: 'Conversation créée avec succès',
                conversationId 
              });
            }
          }
        );
      });
    });
  });
};