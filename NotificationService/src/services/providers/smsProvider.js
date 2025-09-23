'use strict';

/**
 * SMS provider service for handling outbound SMS notifications
 * Uses environment variables:
 *  - SMS_PROVIDER: 'stub' | 'twilio' | 'messagebird'
 *  - SMS_FROM: Default sender number/ID
 *  - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN (for Twilio provider)
 *  - MESSAGEBIRD_API_KEY (for MessageBird provider)
 */
class SmsProvider {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'stub';
    this.fromNumber = process.env.SMS_FROM || 'CYCLESTORE';
  }

  /**
   * PUBLIC_INTERFACE
   * Send an SMS notification
   * @param {Object} params Send parameters
   * @param {string[]} params.to Recipient phone numbers
   * @param {string} params.body Message content
   * @param {string} [params.requestId] Optional request ID for tracking
   * @returns {Promise<Object>} Send result with messageId
   */
  async send({ to, body, requestId }) {
    if (!Array.isArray(to) || to.length === 0) {
      throw new Error('Recipients required');
    }

    // Log the attempt for monitoring
    console.log(`[SmsProvider:${this.provider}] requestId=${requestId} to=${to.join(',')} body="${body.slice(0, 120)}"`);

    switch (this.provider) {
      case 'twilio':
        return this.sendTwilio({ to, body });
      case 'messagebird':
        return this.sendMessageBird({ to, body });
      case 'stub':
      default:
        return this.sendStub({ to, body });
    }
  }

  /**
   * Send via Twilio provider (mock implementation)
   */
  async sendTwilio({ to, body }) {
    // TODO: Implement actual Twilio API integration
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return { messageId: `sm-twilio-${Date.now()}` };
  }

  /**
   * Send via MessageBird provider (mock implementation)
   */
  async sendMessageBird({ to, body }) {
    // TODO: Implement actual MessageBird API integration
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return { messageId: `sm-messagebird-${Date.now()}` };
  }

  /**
   * Stub provider for testing/development
   */
  async sendStub({ to, body }) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate minimal delay
    return { messageId: `sm-stub-${Date.now()}` };
  }
}

module.exports = new SmsProvider();
