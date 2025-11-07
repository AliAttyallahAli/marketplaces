const db = require('../config/database');
const bcrypt = require('bcryptjs');

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        // Table des utilisateurs
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nni TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('client', 'vendeur', 'admin')) DEFAULT 'client',
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            date_naissance TEXT,
            lieu_naissance TEXT,
            province TEXT,
            region TEXT,
            ville TEXT,
            quartier TEXT,
            photo TEXT,
            kyc_verified BOOLEAN DEFAULT 0,
            kyb_verified BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Erreur création table users:', err);
                reject(err);
                return;
            }
            console.log('✅ Table users créée');

            // Table des wallets
            db.run(`CREATE TABLE IF NOT EXISTS wallets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                phone TEXT UNIQUE NOT NULL,
                balance DECIMAL(15,2) DEFAULT 0.00,
                qr_code TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error('Erreur création table wallets:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Table wallets créée');

                // Table des produits
                db.run(`CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    vendeur_id INTEGER NOT NULL,
                    nom TEXT NOT NULL,
                    description TEXT,
                    prix DECIMAL(15,2) NOT NULL,
                    reduction DECIMAL(5,2) DEFAULT 0,
                    etat TEXT CHECK(etat IN ('neuf', 'occasion', 'sur_commande')) NOT NULL,
                    categorie TEXT NOT NULL,
                    livrable BOOLEAN DEFAULT 0,
                    adresse_livraison TEXT,
                    photos TEXT,
                    quantite INTEGER DEFAULT 1,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (vendeur_id) REFERENCES users (id) ON DELETE CASCADE
                )`, (err) => {
                    if (err) {
                        console.error('Erreur création table products:', err);
                        reject(err);
                        return;
                    }
                    console.log('✅ Table products créée');

                    // Table des transactions
                    db.run(`CREATE TABLE IF NOT EXISTS transactions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        from_user_id INTEGER NOT NULL,
                        to_user_id INTEGER NOT NULL,
                        from_wallet_phone TEXT NOT NULL,
                        to_wallet_phone TEXT NOT NULL,
                        amount DECIMAL(15,2) NOT NULL,
                        fee DECIMAL(15,2) DEFAULT 0.00,
                        type TEXT CHECK(type IN ('p2p', 'achat', 'facture', 'abonnement', 'publication')) NOT NULL,
                        service_type TEXT,
                        product_id INTEGER,
                        status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
                        qr_code_used BOOLEAN DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (from_user_id) REFERENCES users (id) ON DELETE CASCADE,
                        FOREIGN KEY (to_user_id) REFERENCES users (id) ON DELETE CASCADE,
                        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
                    )`, (err) => {
                        if (err) {
                            console.error('Erreur création table transactions:', err);
                            reject(err);
                            return;
                        }
                        console.log('✅ Table transactions créée');

                        // Table des services
                        db.run(`CREATE TABLE IF NOT EXISTS services (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         nom TEXT NOT NULL,
                         type TEXT CHECK(type IN ('ZIZ', 'STE', 'TAXE', 'telecom', 'transport', 'education', 'sante', 'autre')) NOT NULL,
                         entreprise_nom TEXT NOT NULL,
                         chef_nom TEXT,
                         chef_phone TEXT,
                         chef_email TEXT,
                         description TEXT,
                         logo TEXT,
                         website TEXT,
                         api_endpoint TEXT,
                         commission_rate DECIMAL(5,2) DEFAULT 0.00,
                         categories TEXT, -- JSON array
                         zones_couvertes TEXT, -- JSON array
                         documents TEXT, -- JSON array
                         is_active BOOLEAN DEFAULT 1,
                         created_by INTEGER,
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (created_by) REFERENCES users (id)
                        )`, (err) => {
                            if (err) {
                                console.error('Erreur création table services:', err);
                                reject(err);
                                return;
                            }
                            console.log('✅ Table services créée');

                            // Table des abonnements vendeurs
                            db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                vendeur_id INTEGER NOT NULL,
                                type TEXT CHECK(type IN ('mois', 'trimestre', 'semestre', 'annuel')) NOT NULL,
                                amount DECIMAL(15,2) NOT NULL,
                                start_date DATETIME NOT NULL,
                                end_date DATETIME NOT NULL,
                                status TEXT CHECK(status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (vendeur_id) REFERENCES users (id) ON DELETE CASCADE
                            )`, (err) => {
                                if (err) {
                                    console.error('Erreur création table subscriptions:', err);
                                    reject(err);
                                    return;
                                }
                                console.log('✅ Table subscriptions créée');
                                // Ajouter dans la fonction initDatabase()
db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nom TEXT,
  phone TEXT,
  user_id INTEGER,
  status TEXT CHECK(status IN ('active', 'inactive', 'unsubscribed')) DEFAULT 'active',
  subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribe_date DATETIME,
  preferences TEXT, -- JSON des préférences
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'default',
  status TEXT CHECK(status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')) DEFAULT 'draft',
  scheduled_for DATETIME,
  sent_at DATETIME,
  total_recipients INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS newsletter_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER,
  subscriber_id INTEGER,
  opened BOOLEAN DEFAULT 0,
  opened_at DATETIME,
  clicked BOOLEAN DEFAULT 0,
  clicked_at DATETIME,
  unsubscribed BOOLEAN DEFAULT 0,
  FOREIGN KEY (campaign_id) REFERENCES newsletter_campaigns (id),
  FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers (id)
)`);
// Ajouter dans la fonction initDatabase()
db.run(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('info', 'success', 'warning', 'error', 'transaction', 'system', 'promo')) DEFAULT 'info',
  category TEXT CHECK(category IN ('transaction', 'security', 'system', 'marketing', 'alert', 'message')) DEFAULT 'system',
  is_read BOOLEAN DEFAULT 0,
  is_archived BOOLEAN DEFAULT 0,
  action_url TEXT,
  action_label TEXT,
  image_url TEXT,
  data TEXT, -- JSON pour données supplémentaires
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS notification_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  email_notifications BOOLEAN DEFAULT 1,
  push_notifications BOOLEAN DEFAULT 1,
  sms_notifications BOOLEAN DEFAULT 0,
  categories TEXT, -- JSON des catégories activées
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

                                // Table des publications blog
                                db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    auteur_id INTEGER NOT NULL,
                                    titre TEXT NOT NULL,
                                    contenu TEXT NOT NULL,
                                    organisation_nom TEXT,
                                    contact TEXT,
                                    fichier_url TEXT,
                                    images TEXT,
                                    montant_publication DECIMAL(15,2) DEFAULT 0.00,
                                    is_published BOOLEAN DEFAULT 0,
                                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                    FOREIGN KEY (auteur_id) REFERENCES users (id) ON DELETE CASCADE
                                )`, (err) => {
                                    if (err) {
                                        console.error('Erreur création table blog_posts:', err);
                                        reject(err);
                                        return;
                                    }
                                    console.log('✅ Table blog_posts créée');

                                    // Créer l'admin principal
                                    createAdminUser()
                                        .then(() => {
                                            console.log('✅ Admin utilisateur créé');
                                            createDefaultServices()
                                                .then(() => {
                                                    console.log('✅ Services par défaut créés');
                                                    resolve();
                                                })
                                                .catch(err => reject(err));
                                        })
                                        .catch(err => reject(err));
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

const createAdminUser = () => {
    return new Promise((resolve, reject) => {
        const hashedPassword = bcrypt.hashSync('admin123', 10);

        db.run(`INSERT OR IGNORE INTO users (
            nni, phone, email, password, role, nom, prenom, kyc_verified, kyb_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            'ADMIN001', '+235600000000', 'admin@zoudousouk.td',
            hashedPassword, 'admin', 'Admin', 'System', 1, 1
        ], function (err) {
            if (err) {
                reject(err);
                return;
            }

            // Créer le wallet marketplace
            db.run(`INSERT OR IGNORE INTO wallets (user_id, phone, balance) VALUES (?, ?, ?)`, [
                this.lastID || 1, '+235600000001', 0.00
            ], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
};

const createDefaultServices = () => {
    return new Promise((resolve, reject) => {
        const services = [
            ['SNE', 'ZIZ', 'Société Nationale d\'Électricité', 'Directeur ZIZ', '+235600000002', 'Paiement des factures d\'électricité'],
            ['STE', 'STE', 'Société Tchadienne des Eaux', 'Directeur STE', '+235600000003', 'Paiement des factures d\'eau'],
            ['TAXE', 'TAXE', 'Commune de Mongo', 'Maire', '+235600000004', 'Paiement des taxes communales']
        ];

        let completed = 0;
        const total = services.length;

        if (total === 0) {
            resolve();
            return;
        }

        services.forEach(service => {
            db.run(`INSERT OR IGNORE INTO services (nom, type, entreprise_nom, chef_nom, chef_phone, description) VALUES (?, ?, ?, ?, ?, ?)`,
                service, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    completed++;
                    if (completed === total) {
                        resolve();
                    }
                });
        });
    });
};

// Exécuter l'initialisation
initDatabase()
    .then(() => {
        console.log('🎉 Base de données initialisée avec succès!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Erreur initialisation base de données:', err);
        process.exit(1);
    });