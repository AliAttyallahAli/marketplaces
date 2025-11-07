const User = require('../models/User');
const Wallet = require('../models/Wallet');

exports.getProfile = (req, res) => {
    const userId = req.user.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // Récupérer le wallet
        Wallet.findByUserId(userId, (err, wallet) => {
            if (err) return res.status(500).json({ error: 'Erreur récupération wallet' });

            const userProfile = {
                id: user.id,
                nni: user.nni,
                phone: user.phone,
                email: user.email,
                role: user.role,
                nom: user.nom,
                prenom: user.prenom,
                date_naissance: user.date_naissance,
                lieu_naissance: user.lieu_naissance,
                province: user.province,
                region: user.region,
                ville: user.ville,
                quartier: user.quartier,
                photo: user.photo,
                kyc_verified: user.kyc_verified,
                kyb_verified: user.kyb_verified,
                created_at: user.created_at,
                wallet: wallet ? {
                    balance: wallet.balance,
                    phone: wallet.phone,
                    qr_code: wallet.qr_code
                } : null
            };

            res.json({ user: userProfile });
        });
    });
};

exports.updateProfile = (req, res) => {
    const userId = req.user.id;
    const updateData = req.body;

    User.updateProfile(userId, updateData, (err) => {
        if (err) return res.status(500).json({ error: 'Erreur mise à jour profil' });

        res.json({ message: 'Profil mis à jour avec succès' });
    });
};

exports.getAllUsers = (req, res) => {
    User.getAllClients((err, clients) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération utilisateurs' });

        res.json({ users: clients });
    });
};

exports.getAllVendeurs = (req, res) => {
    User.getAllVendeurs((err, vendeurs) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération vendeurs' });

        res.json({ vendeurs });
    });
};

exports.getUserDetails = (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        Wallet.findByUserId(userId, (err, wallet) => {
            if (err) return res.status(500).json({ error: 'Erreur récupération wallet' });

            const userDetails = {
                ...user,
                wallet: wallet
            };

            res.json({ user: userDetails });
        });
    });
};

exports.verifyKYC = (req, res) => {
    const userId = req.params.id;

    User.verifyKYC(userId, (err) => {
        if (err) return res.status(500).json({ error: 'Erreur vérification KYC' });

        res.json({ message: 'KYC vérifié avec succès' });
    });
};

exports.verifyKYB = (req, res) => {
    const userId = req.params.id;

    User.verifyKYB(userId, (err) => {
        if (err) return res.status(500).json({ error: 'Erreur vérification KYB' });

        res.json({ message: 'KYB vérifié avec succès' });
    });
};