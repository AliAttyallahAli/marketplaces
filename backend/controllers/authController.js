const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const JWT_SECRET = process.env.JWT_SECRET || 'zoudousouk_secret_key';

exports.register = async (req, res) => {
    try {
        console.log('Données reçues:', req.body);
        
        const { nni, phone, email, password, nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier } = req.body;

        // Validation des champs requis
        if (!nni || !phone || !email || !password || !nom || !prenom) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingEmail = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (existingEmail) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }

        const existingPhone = await new Promise((resolve, reject) => {
            User.findByPhone(phone, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (existingPhone) {
            return res.status(400).json({ error: 'Numéro de téléphone déjà utilisé' });
        }

        const existingNNI = await new Promise((resolve, reject) => {
            User.findByNNI(nni, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (existingNNI) {
            return res.status(400).json({ error: 'NNI déjà utilisé' });
        }

        // Créer l'utilisateur
        const userId = await new Promise((resolve, reject) => {
            User.create({
                nni, phone, email, password, role: 'client', nom, prenom,
                date_naissance, lieu_naissance, province, region, ville, quartier
            }, (err, id) => {
                if (err) reject(err);
                else resolve(id);
            });
        });

        // Créer le wallet
        await new Promise((resolve, reject) => {
            Wallet.create(userId, phone, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.status(201).json({ 
            message: 'Utilisateur créé avec succès',
            userId 
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Tentative de login:', req.body);
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Trouver l'utilisateur
        const user = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                phone: user.phone 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retourner la réponse sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Connexion réussie',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
};

exports.upgradeToVendeur = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier } = req.body;

        await new Promise((resolve, reject) => {
            User.upgradeToVendeur(userId, {
                nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier
            }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ message: 'Profil mis à jour avec succès, vous êtes maintenant vendeur' });

    } catch (error) {
        console.error('Erreur upgrade vendeur:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
};