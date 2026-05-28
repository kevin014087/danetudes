/**
 * Configuration Centralisée DANETUDES
 * Point d'entrée pour toutes les constantes et configurations
 */

require('dotenv').config();

const config = {
  // ── Configuration Email ──────────────────────────────────────────────────
  email: {
    recipient: process.env.RECIPIENT_EMAIL || 'dkouassi0805@gmail.com',
    recipientName: process.env.RECIPIENT_NAME || 'DANETUDES',
    siteName: process.env.SITE_NAME || 'DANETUDES',
    siteUrl: process.env.SITE_URL || 'https://danetudes.ci',
  },

  // ── Configuration SMTP ───────────────────────────────────────────────────
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },

  // ── Configuration Sécurité ───────────────────────────────────────────────
  security: {
    maxMessageLength: 2000,
    rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '5'),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '3600'),
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['https://danetudes.ci', 'http://localhost:3000'],
  },

  // ── Configuration Langues ───────────────────────────────────────────────
  languages: {
    supported: (process.env.LANGUAGES || 'fr,en').split(','),
    default: process.env.DEFAULT_LANGUAGE || 'fr',
  },

  // ── Mode ────────────────────────────────────────────────────────────────
  debug: process.env.DEBUG_MODE === 'true',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

module.exports = config;
