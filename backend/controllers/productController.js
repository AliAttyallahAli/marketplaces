const Product = require('../models/Product');

exports.createProduct = (req, res) => {
    const vendeur_id = req.user.id;
    const {
        nom, description, prix, reduction, etat,
        categorie, livrable, adresse_livraison, photos, quantite
    } = req.body;

    Product.create({
        vendeur_id, nom, description, prix, reduction, etat,
        categorie, livrable, adresse_livraison, photos, quantite
    }, (err, productId) => {
        if (err) return res.status(500).json({ error: 'Erreur création produit' });

        res.status(201).json({ 
            message: 'Produit créé avec succès',
            productId 
        });
    });
};

exports.getProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 50;

    Product.findAll(limit, (err, products) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération produits' });

        // Parser les photos JSON
        const formattedProducts = products.map(product => ({
            ...product,
            photos: product.photos ? JSON.parse(product.photos) : []
        }));

        res.json({ products: formattedProducts });
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;

    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération produit' });
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

        product.photos = product.photos ? JSON.parse(product.photos) : [];
        res.json({ product });
    });
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const vendeur_id = req.user.id;
    const updateData = req.body;

    // Vérifier que le produit appartient au vendeur
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
        if (product.vendeur_id !== vendeur_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Non autorisé à modifier ce produit' });
        }

        Product.update(productId, updateData, (err) => {
            if (err) return res.status(500).json({ error: 'Erreur mise à jour produit' });

            res.json({ message: 'Produit mis à jour avec succès' });
        });
    });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    const vendeur_id = req.user.id;

    // Vérifier que le produit appartient au vendeur
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
        if (product.vendeur_id !== vendeur_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Non autorisé à supprimer ce produit' });
        }

        Product.delete(productId, (err) => {
            if (err) return res.status(500).json({ error: 'Erreur suppression produit' });

            res.json({ message: 'Produit supprimé avec succès' });
        });
    });
};

exports.searchProducts = (req, res) => {
    const { q, categorie } = req.query;

    Product.search(q, categorie, (err, products) => {
        if (err) return res.status(500).json({ error: 'Erreur recherche produits' });

        const formattedProducts = products.map(product => ({
            ...product,
            photos: product.photos ? JSON.parse(product.photos) : []
        }));

        res.json({ products: formattedProducts });
    });
};