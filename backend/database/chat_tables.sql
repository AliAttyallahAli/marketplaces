-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('direct', 'group', 'support')) DEFAULT 'direct',
  title TEXT NOT NULL,
  last_message TEXT,
  last_message_at DATETIME,
  unread_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des participants aux conversations
CREATE TABLE IF NOT EXISTS conversation_participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE(conversation_id, user_id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK(type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conv ON conversation_participants(conversation_id);

-- Données initiales pour le support
INSERT OR IGNORE INTO users (id, nni, phone, email, password, role, nom, prenom, kyc_verified, kyb_verified)
VALUES (1, 'SUPPORT001', '+235600000000', 'support@zoudousouk.td', '$2a$10$supportpasswordhash', 'admin', 'Support', 'ZouDou-Souk', 1, 1);

-- Conversation de support par défaut
INSERT OR IGNORE INTO conversations (id, type, title, last_message, last_message_at) 
VALUES (1, 'support', 'Support ZouDou-Souk', 'Bonjour ! Comment pouvons-nous vous aider ?', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (1, 1);