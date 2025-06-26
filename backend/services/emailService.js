const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'dapierre25@gmail.com',
                pass: process.env.EMAIL_PASS || 'iavr wlau pgvo lbbe'
            }
        });
    }

    async sendCandidatureConfirmation(candidatData, concoursData) {
        try {
            const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Confirmation de votre candidature - GABConcours</h2>
          <p>Bonjour <strong>${candidatData.prncan} ${candidatData.nomcan}</strong>,</p>
          <p>Votre candidature a été enregistrée avec succès !</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Informations de votre candidature</h3>
            <p><strong>Numéro de candidature (NUPCAN):</strong> ${candidatData.nupcan}</p>
            <p><strong>Concours:</strong> ${concoursData ? concoursData.libcnc : 'Non spécifié'}</p>
            <p><strong>Email:</strong> ${candidatData.maican}</p>
            <p><strong>Téléphone:</strong> ${candidatData.telcan}</p>
            <p><strong>Date de naissance:</strong> ${candidatData.dtncan}</p>
          </div>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">Étapes suivantes</h4>
            <ol style="color: #92400e;">
              <li>Déposez vos documents requis</li>
              <li>Effectuez le paiement des frais d'inscription</li>
              <li>Attendez la validation de votre dossier</li>
            </ol>
          </div>
          <p>Conservez précieusement votre numéro de candidature <strong>${candidatData.nupcan}</strong>, il vous sera demandé pour suivre l'état de votre dossier.</p>
          <p>Pour toute question, contactez-nous à gabconcours@contact.ga</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Cet email a été envoyé automatiquement par la plateforme GABConcours.<br>
            Ne répondez pas à cet email.
          </p>
        </div>
      `;

            const mailOptions = {
                from: '"GABConcours" <noreply@gabconcours.com>',
                to: candidatData.maican,
                subject: `Confirmation de candidature - ${candidatData.nupcan}`,
                html: emailTemplate
            };

            console.log('Envoi email à:', candidatData.maican);
            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email envoyé:', result.messageId);

            return {
                success: true,
                messageId: result.messageId
            };
        } catch (error) {
            console.error('Erreur envoi email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new EmailService();