const db = require('../config/database');

const fixChatData = () => {
  console.log('🔧 Fixing chat data...');

  // 1. Vérifier l'utilisateur connecté (généralement ID 2 pour le premier utilisateur après l'admin)
  const getUsersSql = 'SELECT id, email, nom, prenom FROM users ORDER BY id';
  
  db.all(getUsersSql, [], (err, users) => {
    if (err) {
      console.error('❌ Error fetching users:', err);
      return;
    }

    console.log('👥 All users:', users);

    // Prendre le premier utilisateur client (généralement ID 2)
    const clientUser = users.find(u => u.id !== 1) || users[0];
    console.log('🎯 Using client user:', clientUser);

    // 2. Vérifier les conversations existantes
    const getConversationsSql = 'SELECT id, type, title FROM conversations';
    
    db.all(getConversationsSql, [], (err, conversations) => {
      if (err) {
        console.error('❌ Error fetching conversations:', err);
        return;
      }

      console.log('📞 Existing conversations:', conversations);

      // 3. Vérifier les participants de la conversation 2
      const getParticipantsSql = `
        SELECT cp.conversation_id, cp.user_id, u.nom, u.prenom 
        FROM conversation_participants cp 
        JOIN users u ON cp.user_id = u.id 
        WHERE cp.conversation_id = 2
      `;
      
      db.all(getParticipantsSql, [], (err, participants) => {
        if (err) {
          console.error('❌ Error fetching participants:', err);
          return;
        }

        console.log('👥 Participants in conversation 2:', participants);

        // 4. Si l'utilisateur client n'est pas dans la conversation 2, l'ajouter
        const clientInConversation = participants.find(p => p.user_id === clientUser.id);
        
        if (!clientInConversation) {
          console.log('➕ Adding client user to conversation 2...');
          
          const addParticipantSql = 'INSERT OR IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)';
          
          db.run(addParticipantSql, [2, clientUser.id], function(err) {
            if (err) {
              console.error('❌ Error adding participant:', err);
            } else {
              console.log('✅ Client user added to conversation 2');
            }
            
            // 5. Créer une nouvelle conversation de test avec l'utilisateur actuel
            createTestConversation(clientUser);
          });
        } else {
          console.log('✅ Client user already in conversation 2');
          createTestConversation(clientUser);
        }
      });
    });
  });

  function createTestConversation(clientUser) {
    console.log('🆕 Creating test conversation for user:', clientUser.id);
    
    // Créer une nouvelle conversation de test
    const insertConversationSql = `
      INSERT INTO conversations (type, title, last_message, last_message_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(insertConversationSql, ['direct', 'Conversation de Test', 'Démarrage de la conversation'], function(err) {
      if (err) {
        console.error('❌ Error creating test conversation:', err);
        return;
      }

      const conversationId = this.lastID;
      console.log('✅ Test conversation created with ID:', conversationId);

      // Ajouter l'utilisateur client et le support comme participants
      const participants = [clientUser.id, 1]; // Client + Support
      
      let participantsAdded = 0;
      
      participants.forEach(userId => {
        const insertParticipantSql = 'INSERT OR IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)';
        
        db.run(insertParticipantSql, [conversationId, userId], (err) => {
          if (err) {
            console.error('❌ Error adding participant:', err);
          }
          
          participantsAdded++;
          console.log(`✅ Participant ${userId} added to conversation ${conversationId}`);
          
          if (participantsAdded === participants.length) {
            console.log('🎉 Chat data fixed successfully!');
            console.log(`📱 User ${clientUser.id} can now access conversation ${conversationId}`);
            
            // Afficher un résumé
            db.all(`
              SELECT c.id, c.title, GROUP_CONCAT(u.prenom || ' ' || u.nom) as participants
              FROM conversations c
              JOIN conversation_participants cp ON c.id = cp.conversation_id
              JOIN users u ON cp.user_id = u.id
              WHERE c.id IN (2, ?)
              GROUP BY c.id
            `, [conversationId], (err, results) => {
              if (err) {
                console.error('Error fetching summary:', err);
              } else {
                console.log('📊 Available conversations:');
                results.forEach(conv => {
                  console.log(`   - Conversation ${conv.id}: "${conv.title}" (Participants: ${conv.participants})`);
                });
              }
              
              db.close();
            });
          }
        });
      });
    });
  }
};

// Exécuter seulement si appelé directement
if (require.main === module) {
  fixChatData();
}

module.exports = fixChatData;