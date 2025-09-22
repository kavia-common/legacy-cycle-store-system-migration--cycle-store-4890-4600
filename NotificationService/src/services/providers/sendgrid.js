const sgMail = require('@sendgrid/mail');
const BaseProvider = require('./base');

class SendGridProvider extends BaseProvider {
  constructor() {
    super();
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.warn('[SendGridProvider] SENDGRID_API_KEY is not set. Emails will fail.');
    } else {
      sgMail.setApiKey(apiKey);
    }
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'no-reply@example.com';
  }

  // PUBLIC_INTERFACE
  async send({ to, subject, html, text }) {
    /** Send email using SendGrid */
    if (!to) throw new Error('Recipient email (to) is required');
    try {
      const msg = {
        to,
        from: this.fromEmail,
        subject: subject || 'Notification',
        html: html || '',
        text: text || '',
      };
      const [response] = await sgMail.send(msg);
      // Try to extract a message id from headers if available
      const providerMessageId =
        (response && response.headers && (response.headers['x-message-id'] || response.headers['x-sendgrid-message-id'])) ||
        `sg-${Date.now()}`;
      return { providerMessageId };
    } catch (err) {
      throw new Error(`SendGrid send error: ${err.message || 'unknown'}`);
    }
  }
}

module.exports = SendGridProvider;
