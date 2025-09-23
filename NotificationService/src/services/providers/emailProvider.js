'use strict';

/**
 * Email provider service for handling outbound email notifications
 * Uses environment variables:
 *  - EMAIL_PROVIDER: 'stub' | 'smtp' | 'sendgrid'
 *  - EMAIL_FROM: Default sender address
 *  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (for SMTP provider)
 *  - SENDGRID_API_KEY (for SendGrid provider)
 */
class EmailProvider {
  constructor() {
    this.provider = process.env.EMAIL_PROVIDER || 'stub';
    this.fromAddress = process.env.EMAIL_FROM || 'notifications@cyclestore.com';
  }

  /**
   * PUBLIC_INTERFACE
   * Send an email notification
   * @param {Object} params Send parameters
   * @param {string[]} params.to Recipient email addresses 
   * @param {string} params.subject Email subject
   * @param {string} params.body Email body content
   * @param {string} [params.requestId] Optional request ID for tracking
   * @returns {Promise<Object>} Send result with messageId
   */
  async send({ to, subject, body, requestId }) {
    if (!Array.isArray(to) || to.length === 0) {
      throw new Error('Recipients required');
    }

    // Log the attempt for monitoring
    console.log(`[EmailProvider:${this.provider}] requestId=${requestId} to=${to.join(',')} subject="${subject}"`);

    switch (this.provider) {
      case 'smtp':
        return this.sendSmtp({ to, subject, body });
      case 'sendgrid':
        return this.sendSendGrid({ to, subject, body });
      case 'stub':
      default:
        return this.sendStub({ to, subject, body });
    }
  }

  /**
   * Send via SMTP provider (mock implementation)
   */
  async sendSmtp({ to, subject, body }) {
    // TODO: Implement actual SMTP sending logic
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return { messageId: `em-smtp-${Date.now()}` };
  }

  /**
   * Send via SendGrid provider (mock implementation) 
   */
  async sendSendGrid({ to, subject, body }) {
    // TODO: Implement actual SendGrid API integration
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return { messageId: `em-sendgrid-${Date.now()}` };
  }

  /**
   * Stub provider for testing/development
   */
  async sendStub({ to, subject, body }) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate minimal delay
    return { messageId: `em-stub-${Date.now()}` };
  }
}

module.exports = new EmailProvider();
