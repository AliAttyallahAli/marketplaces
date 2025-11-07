const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  static generateVisaCard(user, wallet, outputPath) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [400, 250],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Fond de la carte
      doc.rect(0, 0, 400, 250)
         .fillLinearGradient(0, 0, 400, 250)
         .stop(0, '#1a237e')
         .stop(1, '#283593')
         .fill();

      // Logo ZouDou-Souk
      doc.fillColor('white')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('ZouDou-Souk', 30, 30);

      // Type de carte
      doc.fontSize(10)
         .text('Carte Visa Virtuelle', 30, 55);

      // Chip
      doc.rect(30, 85, 40, 30)
         .fillLinearGradient(30, 85, 70, 115)
         .stop(0, '#ffd700')
         .stop(1, '#ffed4e')
         .fill();

      // Numéro de carte (numéro de téléphone formaté)
      const cardNumber = user.phone.replace(/\D/g, '').padEnd(16, '0');
      const formattedNumber = cardNumber.match(/.{1,4}/g).join(' ');
      
      doc.font('Courier-Bold')
         .fontSize(14)
         .text(formattedNumber, 30, 130);

      // Nom du titulaire
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(`${user.prenom} ${user.nom}`.toUpperCase(), 30, 160);

      // Date d'expiration
      const expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 2);
      const expireText = `${(expireDate.getMonth() + 1).toString().padStart(2, '0')}/${expireDate.getFullYear().toString().slice(-2)}`;
      
      doc.text(`EXP: ${expireText}`, 30, 185);

      // Logo Visa
      doc.fontSize(16)
         .text('VISA', 320, 200);

      // QR Code placeholder
      doc.rect(320, 30, 60, 60)
         .fillColor('white')
         .fill();

      doc.fillColor('#1a237e')
         .fontSize(8)
         .text('QR CODE', 335, 60, { align: 'center' });

      // Informations supplémentaires
      doc.fontSize(7)
         .fillColor('white')
         .text(`Wallet: ${user.phone}`, 30, 210)
         .text('www.zoudousouk.td', 300, 210);

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  static generateTransactionReceipt(transaction, user, outputPath) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // En-tête
      doc.fillColor('#2c5530')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('ZouDou-Souk', 50, 50);

      doc.fillColor('#666666')
         .fontSize(12)
         .text('Reçu de Transaction', 50, 80);

      // Ligne séparatrice
      doc.moveTo(50, 100)
         .lineTo(550, 100)
         .strokeColor('#2c5530')
         .lineWidth(2)
         .stroke();

      // Informations de la transaction
      doc.fillColor('#333333')
         .fontSize(14)
         .text('DÉTAILS DE LA TRANSACTION', 50, 120);

      const details = [
        ['ID Transaction:', `#${transaction.id}`],
        ['Date:', new Date(transaction.created_at).toLocaleString('fr-FR')],
        ['Type:', transaction.type.toUpperCase()],
        ['Statut:', transaction.status],
        ['Montant:', `${parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA`],
        ['Frais:', `${parseFloat(transaction.fee).toLocaleString('fr-TD')} FCFA`],
        ['Net:', `${(parseFloat(transaction.amount) - parseFloat(transaction.fee)).toLocaleString('fr-TD')} FCFA`]
      ];

      let yPosition = 160;
      details.forEach(([label, value]) => {
        doc.font('Helvetica-Bold')
           .fillColor('#333333')
           .text(label, 50, yPosition);
        
        doc.font('Helvetica')
           .fillColor('#666666')
           .text(value, 200, yPosition);
        
        yPosition += 25;
      });

      // Informations des parties
      yPosition += 20;
      doc.font('Helvetica-Bold')
         .fillColor('#333333')
         .text('INFORMATIONS DES PARTIES', 50, yPosition);

      yPosition += 30;
      doc.font('Helvetica-Bold')
         .text('De:', 50, yPosition);
      doc.font('Helvetica')
         .text(`${transaction.from_nom} ${transaction.from_prenom}`, 50, yPosition + 20)
         .text(transaction.from_wallet_phone, 50, yPosition + 40);

      doc.font('Helvetica-Bold')
         .text('À:', 300, yPosition);
      doc.font('Helvetica')
         .text(`${transaction.to_nom} ${transaction.to_prenom}`, 300, yPosition + 20)
         .text(transaction.to_wallet_phone, 300, yPosition + 40);

      // Pied de page
      const footerY = 700;
      doc.moveTo(50, footerY)
         .lineTo(550, footerY)
         .strokeColor('#cccccc')
         .lineWidth(1)
         .stroke();

      doc.fontSize(10)
         .fillColor('#666666')
         .text('Merci d\'utiliser ZouDou-Souk', 50, footerY + 20)
         .text('www.zoudousouk.td - support@zoudousouk.td', 50, footerY + 40);

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }
  // Ajouter ces méthodes à la classe PDFGenerator existante

static generateProfileExport(userData, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // En-tête
    doc.fillColor('#2c5530')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('ZouDou-Souk - Export de Profil', 50, 50);

    doc.fillColor('#666666')
       .fontSize(12)
       .text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 50, 80);

    // Informations personnelles
    doc.fillColor('#333333')
       .fontSize(16)
       .text('INFORMATIONS PERSONNELLES', 50, 120);

    const personalInfo = [
      ['Nom:', userData.nom],
      ['Prénom:', userData.prenom],
      ['Email:', userData.email],
      ['Téléphone:', userData.phone],
      ['NNI:', userData.nni],
      ['Rôle:', userData.role],
      ['Date de naissance:', userData.date_naissance ? new Date(userData.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'],
      ['Lieu de naissance:', userData.lieu_naissance || 'Non renseigné'],
      ['Province:', userData.province || 'Non renseignée'],
      ['Ville:', userData.ville || 'Non renseignée'],
      ['Quartier:', userData.quartier || 'Non renseigné']
    ];

    let yPosition = 160;
    personalInfo.forEach(([label, value]) => {
      doc.font('Helvetica-Bold')
         .fillColor('#333333')
         .text(label, 50, yPosition);
      
      doc.font('Helvetica')
         .fillColor('#666666')
         .text(value || 'Non renseigné', 200, yPosition);
      
      yPosition += 20;
    });

    // Informations wallet
    yPosition += 30;
    doc.font('Helvetica-Bold')
       .fillColor('#333333')
       .text('INFORMATIONS WALLET', 50, yPosition);

    yPosition += 30;
    const walletInfo = [
      ['Numéro Wallet:', userData.wallet_phone],
      ['Solde:', `${parseFloat(userData.balance || 0).toLocaleString('fr-TD')} FCFA`]
    ];

    walletInfo.forEach(([label, value]) => {
      doc.font('Helvetica-Bold')
         .text(label, 50, yPosition);
      
      doc.font('Helvetica')
         .text(value, 200, yPosition);
      
      yPosition += 20;
    });

    // Statistiques
    yPosition += 30;
    doc.font('Helvetica-Bold')
       .fillColor('#333333')
       .text('STATISTIQUES', 50, yPosition);

    yPosition += 30;
    const stats = [
      ['Produits publiés:', userData.products_count || 0],
      ['Transactions:', userData.transactions_count || 0]
    ];

    stats.forEach(([label, value]) => {
      doc.font('Helvetica-Bold')
         .text(label, 50, yPosition);
      
      doc.font('Helvetica')
         .text(value.toString(), 200, yPosition);
      
      yPosition += 20;
    });

    // Statut vérification
    yPosition += 30;
    doc.font('Helvetica-Bold')
       .fillColor('#333333')
       .text('STATUT VÉRIFICATION', 50, yPosition);

    yPosition += 30;
    const verificationStatus = [
      ['KYC Vérifié:', userData.kyc_verified ? '✅ Oui' : '❌ Non'],
      ['KYB Vérifié:', userData.kyb_verified ? '✅ Oui' : '❌ Non']
    ];

    verificationStatus.forEach(([label, value]) => {
      doc.font('Helvetica-Bold')
         .text(label, 50, yPosition);
      
      doc.font('Helvetica')
         .text(value, 200, yPosition);
      
      yPosition += 20;
    });

    // Pied de page
    const footerY = 700;
    doc.moveTo(50, footerY)
       .lineTo(550, footerY)
       .strokeColor('#cccccc')
       .lineWidth(1)
       .stroke();

    doc.fontSize(10)
       .fillColor('#666666')
       .text('Document généré automatiquement par ZouDou-Souk', 50, footerY + 20)
       .text('Confidentiel - Usage personnel', 50, footerY + 40);

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

static generateTransactionsExport(transactions, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // En-tête
    doc.fillColor('#2c5530')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('ZouDou-Souk - Historique des Transactions', 50, 50);

    doc.fillColor('#666666')
       .fontSize(12)
       .text(`Généré le ${new Date().toLocaleDateString('fr-FR')} - ${transactions.length} transactions`, 50, 80);

    let yPosition = 120;

    transactions.forEach((transaction, index) => {
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      // En-tête transaction
      doc.fillColor('#333333')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text(`Transaction #${transaction.id}`, 50, yPosition);

      yPosition += 20;

      // Détails transaction
      const details = [
        ['Type:', transaction.type],
        ['Montant:', `${parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA`],
        ['Frais:', `${parseFloat(transaction.fee || 0).toLocaleString('fr-TD')} FCFA`],
        ['Date:', new Date(transaction.created_at).toLocaleString('fr-FR')],
        ['Statut:', transaction.status]
      ];

      details.forEach(([label, value]) => {
        doc.font('Helvetica-Bold')
           .fillColor('#333333')
           .text(label, 50, yPosition);
        
        doc.font('Helvetica')
           .fillColor('#666666')
           .text(value, 150, yPosition);
        
        yPosition += 15;
      });

      yPosition += 10;
      
      // Séparateur
      if (index < transactions.length - 1) {
        doc.moveTo(50, yPosition)
           .lineTo(550, yPosition)
           .strokeColor('#eeeeee')
           .lineWidth(1)
           .stroke();
        yPosition += 20;
      }
    });

    // Résumé
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalFees = transactions.reduce((sum, t) => sum + parseFloat(t.fee || 0), 0);

    doc.addPage();
    yPosition = 50;

    doc.fillColor('#333333')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('RÉSUMÉ DES TRANSACTIONS', 50, yPosition);

    yPosition += 40;

    const summary = [
      ['Total des transactions:', transactions.length],
      ['Montant total:', `${totalAmount.toLocaleString('fr-TD')} FCFA`],
      ['Frais totaux:', `${totalFees.toLocaleString('fr-TD')} FCFA`],
      ['Montant net:', `${(totalAmount - totalFees).toLocaleString('fr-TD')} FCFA`]
    ];

    summary.forEach(([label, value]) => {
      doc.font('Helvetica-Bold')
         .fillColor('#333333')
         .text(label, 50, yPosition);
      
      doc.font('Helvetica')
         .fillColor('#666666')
         .text(typeof value === 'number' ? value.toLocaleString('fr-TD') : value.toString(), 250, yPosition);
      
      yPosition += 25;
    });

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}
}

module.exports = PDFGenerator;