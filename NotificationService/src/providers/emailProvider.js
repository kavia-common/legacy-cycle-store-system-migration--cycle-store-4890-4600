const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email provider abstraction using nodemailer.
 * Supports SMTP explicitly; SendGrid can be used via nodemailer transport if desired.
 */

// Create transport based on env
function createTransport() {
  const provider = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();
  if (provider === 'smtp') {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
    });
    return { transporter, from: process.env.SMTP_FROM || 'no-reply@example.com' };
  }
  // Fallback mock transport logs only, useful for dev if provider unsupported
  logger.warn('Unsupported EMAIL_PROVIDER=%s, using mock transport', provider);
  const transporter = {
    sendMail: async (msg) => {
      logger.info('MOCK EMAIL sent: %j', msg);
      return { messageId: 'mock-message-id' };
    }
  };
  return { transporter, from: process.env.SENDGRID_FROM || 'no-reply@example.com' };
}

// PUBLIC_INTERFACE
async function sendEmail({ to, subject, html, text }) {
  /** Sends an email using configured transport */
  const { transporter, from } = createTransport();
  const mail = {
    from,
    to,
    subject,
    text: text || undefined,
    html: html || undefined
  };
  const start = Date.now();
  const info = await transporter.sendMail(mail);
  logger.info('Email sent to %s in %dms, id=%s', to, Date.now() - start, info.messageId || 'n/a');
  return info;
}

module.exports = { sendEmail };
