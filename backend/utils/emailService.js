const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      // Configuration SMTP (à adapter selon votre fournisseur)
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: '"ZouDou-Souk" <noreply@zoudousouk.td>',
      to: user.email,
      subject: 'Bienvenue sur ZouDou-Souk !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">Bienvenue sur ZouDou-Souk !</h2>
          <p>Bonjour ${user.prenom} ${user.nom},</p>
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
          <ul>
            <li>Explorer la marketplace</li>
            <li>Effectuer des transactions P2P</li>
            <li>Payer vos factures en ligne</li>
            <li>Et bien plus encore...</li>
          </ul>
          <p>Votre numéro de wallet : <strong>${user.phone}</strong></p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              <strong>Conseil de sécurité :</strong><br>
              - Ne partagez jamais votre mot de passe<br>
              - Vérifiez toujours les informations du destinataire avant un transfert<br>
              - Contactez le support en cas de problème
            </p>
          </div>
          <p>Cordialement,<br>L'équipe ZouDou-Souk</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email de bienvenue envoyé à:', user.email);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  async sendTransactionNotification(user, transaction) {
    const isDebit = transaction.from_user_id === user.id;
    const amountPrefix = isDebit ? '-' : '+';

    const mailOptions = {
      from: '"ZouDou-Souk" <noreply@zoudousouk.td>',
      to: user.email,
      subject: `Notification de transaction - ${transaction.type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">Notification de Transaction</h2>
          <p>Bonjour ${user.prenom} ${user.nom},</p>
          <p>Une nouvelle transaction a été effectuée sur votre compte :</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Type:</strong> ${transaction.type}</p>
            <p><strong>Montant:</strong> ${amountPrefix} ${parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA</p>
            <p><strong>Date:</strong> ${new Date(transaction.created_at).toLocaleString('fr-FR')}</p>
            <p><strong>Statut:</strong> ${transaction.status}</p>
            <p><strong>Référence:</strong> #${transaction.id}</p>
          </div>
          <p>Votre solde actuel sera mis à jour dans votre portefeuille.</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Sécurité :</strong><br>
              Si vous ne reconnaissez pas cette transaction, contactez immédiatement le support.
            </p>
          </div>
          <p>Cordialement,<br>L'équipe ZouDou-Souk</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur envoi notification transaction:', error);
    }
  }

  async sendKYCNotification(user, status) {
    const mailOptions = {
      from: '"ZouDou-Souk" <noreply@zoudousouk.td>',
      to: user.email,
      subject: `Statut de vérification KYC - ${status === 'approved' ? 'Approuvé' : 'Rejeté'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">Statut de Vérification KYC</h2>
          <p>Bonjour ${user.prenom} ${user.nom},</p>
          <p>Votre demande de vérification d'identité (KYC) a été <strong>${
            status === 'approved' ? 'approuvée' : 'rejetée'
          }</strong>.</p>
          ${
            status === 'approved' 
              ? '<p>✅ Félicitations ! Votre compte est maintenant vérifié et vous avez accès à toutes les fonctionnalités.</p>'
              : '<p>❌ Votre demande a été rejetée. Veuillez soumettre à nouveau vos documents avec des informations claires et valides.</p>'
          }
          <p>Cordialement,<br>L'équipe ZouDou-Souk</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erreur envoi notification KYC:', error);
    }
  }
}

module.exports = new EmailService();