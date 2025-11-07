const db = require('../config/database');

class Chat {
  static createConversation(callback) {
    db.run('INSERT INTO conversations (last_message_at) VALUES (CURRENT_TIMESTAMP)', function(err) {
      callback(err, this.lastID);
    });
  }

  static addParticipant(conversationId, userId, callback) {
    db.run(
      'INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)',
      [conversationId, userId],
      callback
    );
  }

  static createMessage(messageData, callback) {
    const { conversation_id, sender_id, content, type = 'text' } = messageData;

    const sql = `
      INSERT INTO messages (conversation_id, sender_id, content, type)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [conversation_id, sender_id, content, type], function(err) {
      callback(err, this.lastID);
    });
  }

  static getConversationsByUser(userId, callback) {
    const sql = `
      SELECT 
        c.id,
        c.last_message,
        c.last_message_at,
        cp.unread_count,
        u.id as user_id,
        u.nom,
        u.prenom,
        u.photo,
        u.role
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN users u ON cp.user_id = u.id
      WHERE c.id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = ?
      ) AND cp.user_id != ?
      ORDER BY c.last_message_at DESC
    `;
    db.all(sql, [userId, userId], callback);
  }

  static getMessagesByConversation(conversationId, callback) {
    const sql = `
      SELECT 
        m.*,
        u.nom as sender_nom,
        u.prenom as sender_prenom
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `;
    db.all(sql, [conversationId], callback);
  }

  static markMessagesAsRead(conversationId, userId, callback) {
    db.run(
      'UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL',
      [conversationId, userId],
      callback
    );
  }

  static updateConversationLastMessage(conversationId, lastMessage, callback) {
    db.run(
      'UPDATE conversations SET last_message = ?, last_message_at = CURRENT_TIMESTAMP WHERE id = ?',
      [lastMessage, conversationId],
      callback
    );
  }
}

module.exports = Chat;