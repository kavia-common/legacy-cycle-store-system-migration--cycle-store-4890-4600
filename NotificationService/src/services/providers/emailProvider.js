'use strict';

/**
 * Email provider abstraction. Replace with SMTP/SES/SendGrid integration.
 * Uses environment variables:
 *  - EMAIL_PROVIDER: 'stub' | future values
 */
class EmailProvider {
  async send({ to, subject, body, requestId }) {
    // Here integrate real provider; this is a stub that simulates success.
    const provider = process.env.EMAIL_PROVIDER || 'stub';
    // eslint-disable-next-line no-console
    console.log(`[EmailProvider:${provider}] requestId=${requestId} to=${to.join(',')} subject="${subject}"`);
    return { messageId: `em-${Date.now()}` };
  }
}

module.exports = new EmailProvider();
