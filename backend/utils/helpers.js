const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class Helpers {
    static generateVisaCard(user, wallet) {
        const doc = new PDFDocument();
        const filename = `visa_${user.phone}_${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../temp', filename);

        // Créer le dossier temp s'il n'existe pas
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        doc.pipe(fs.createWriteStream(filepath));

        // Design de la carte Visa
        doc.rect(50, 50, 350, 200).fill('#1a237e'); // Fond bleu
        
        // Logo ZouDou-Souk
        doc.fillColor('white')
           .fontSize(16)
           .text('ZouDou-Souk', 70, 70);

        // Type de carte
        doc.fillColor('white')
           .fontSize(12)
           .text('Carte Visa Virtuelle', 70, 95);

        // Numéro de carte (numéro de téléphone formaté)
        const cardNumber = user.phone.replace(/\+/g, '').replace(/\s/g, '');
        const formattedCardNumber = cardNumber.match(/.{1,4}/g).join(' ');
        
        doc.fillColor('white')
           .fontSize(18)
           .font('Courier-Bold')
           .text(formattedCardNumber, 70, 130);

        // Nom du titulaire
        doc.fillColor('white')
           .fontSize(14)
           .text(`${user.prenom} ${user.nom}`.toUpperCase(), 70, 170);

        // Date d'expiration (2 ans à partir d'aujourd'hui)
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 2);
        const expireText = `${(expireDate.getMonth() + 1).toString().padStart(2, '0')}/${expireDate.getFullYear().toString().slice(-2)}`;
        
        doc.fillColor('white')
           .fontSize(12)
           .text(`EXP: ${expireText}`, 250, 170);

        // QR Code (simplifié - texte)
        doc.fillColor('white')
           .fontSize(10)
           .text('QR: zoudousouk:p2p', 70, 200)
           .text(`Tel: ${user.phone}`, 70, 215);

        doc.end();

        return filename;
    }

    static formatPhoneNumber(phone) {
        // Format standard Tchad
        return phone.replace(/\s/g, '').replace(/^0/, '+235');
    }

    static calculateFees(amount) {
        return {
            amount: amount,
            fee: amount * 0.01, // 1%
            netAmount: amount * 0.99,
            total: amount
        };
    }

    static validateNNI(nni) {
        // Validation basique NNI Tchad (8 chiffres)
        return /^\d{8}$/.test(nni);
    }

    static generateTransactionReference() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}

module.exports = Helpers;