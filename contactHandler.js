/**
 * Module de gestion des emails - DANETUDES
 */

const nodemailer = require('nodemailer');
const config = require('./config');

// Cache en mémoire pour le rate limiting (en production, utiliser Redis)
const rateLimitCache = new Map();

/**
 * Crée un transporteur Nodemailer
 */
function createTransporter() {
  if (!config.smtp.auth.user || !config.smtp.auth.pass) {
    console.warn('⚠️ SMTP non configuré. Les emails ne seront pas envoyés.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.auth,
  });
}

/**
 * Obtient l'IP du client
 */
function getClientIP(req) {
  return (
    req.headers['x-client-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection.remoteAddress ||
    'unknown'
  );
}

/**
 * Vérifie le rate limiting
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const key = `rate_limit_${ip}`;

  if (rateLimitCache.has(key)) {
    const data = rateLimitCache.get(key);
    if (now < data.expires) {
      data.count++;
      if (data.count > config.security.rateLimitRequests) {
        return false;
      }
      return true;
    }
  }

  rateLimitCache.set(key, {
    count: 1,
    expires: now + config.security.rateLimitWindow * 1000,
  });

  return true;
}

/**
 * Nettoie les messages texte dangereux
 */
function sanitize(value) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, config.security.maxMessageLength);
}

/**
 * Valide une adresse email
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valide un numéro de téléphone
 */
function validatePhone(phone) {
  if (!phone) return true; // Optionnel
  const re = /^[\d\s\-+().,]+$/;
  return re.test(phone) && phone.length >= 5;
}

/**
 * Traite et envoie un message de contact
 */
async function handleContactForm(formData, req) {
  const clientIP = getClientIP(req);

  // Vérifier le rate limiting
  if (!checkRateLimit(clientIP)) {
    return {
      success: false,
      message: 'Trop de requêtes. Veuillez réessayer dans 1 heure.',
      code: 429,
    };
  }

  // Récupérer et valider les données
  const name = sanitize(formData.name || formData.nom || '');
  const email = sanitize(formData.email || '');
  const phone = sanitize(formData.phone || formData.telephone || '');
  const subject = sanitize(
    formData.subject || formData.sujet || 'Nouveau message DANETUDES'
  );
  let message = sanitize(formData.message || '');

  // Validations strictes
  if (!name || name.length < 2) {
    return {
      success: false,
      message: 'Le nom doit contenir au moins 2 caractères.',
      code: 422,
    };
  }

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: 'Adresse e-mail invalide.',
      code: 422,
    };
  }

  if (!message || message.length < 5) {
    return {
      success: false,
      message: 'Le message doit contenir au moins 5 caractères.',
      code: 422,
    };
  }

  if (phone && !validatePhone(phone)) {
    return {
      success: false,
      message: 'Format de téléphone invalide.',
      code: 422,
    };
  }

  // Construire le corps du message
  const referer = req.get('referer') || 'formulaire';
  const timestamp = new Date().toLocaleString('fr-FR');

  const emailBody = `Vous avez reçu un nouveau message via le formulaire de contact de ${config.email.siteName}.

═══════════════════════════════════════
NOM      : ${name}
EMAIL    : ${email}
${phone ? `TÉLÉPHONE: ${phone}\n` : ''}OBJET    : ${subject}
═══════════════════════════════════════

MESSAGE :
${message}

───────────────────────────────────────
Envoyé depuis : ${referer}
Date : ${timestamp}`;

  // Essayer d'envoyer l'email
  try {
    const transporter = createTransporter();

    if (!transporter) {
      // Si SMTP non configuré, au moins sauvegarder le contact
      console.log(`[CONTACT] ${name} (${email}) - Message non envoyé (SMTP non configuré)`);
      return {
        success: true,
        message:
          '✓ Votre message a été reçu. Nous vous répondons sous 24h.',
      };
    }

    await transporter.sendMail({
      from: `${config.email.siteName} <noreply@danetudes.ci>`,
      to: config.email.recipient,
      replyTo: `${name} <${email}>`,
      subject: `[${config.email.siteName}] ${subject}`,
      text: emailBody,
      headers: {
        'X-Mailer': 'Node.js/Nodemailer',
      },
    });

    console.log(
      `[CONTACT] Email envoyé avec succès depuis ${email} — ${timestamp}`
    );

    return {
      success: true,
      message: '✓ Message envoyé avec succès. Nous vous répondons sous 24h.',
    };
  } catch (error) {
    console.error('[CONTACT] Erreur envoi email :', error.message);
    return {
      success: false,
      message:
        'Une erreur est survenue. Veuillez nous contacter sur WhatsApp.',
      code: 503,
    };
  }
}

module.exports = {
  handleContactForm,
  getClientIP,
  checkRateLimit,
  sanitize,
  validateEmail,
  validatePhone,
};
