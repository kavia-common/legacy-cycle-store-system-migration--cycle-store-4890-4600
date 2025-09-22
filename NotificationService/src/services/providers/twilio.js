const twilio = require('twilio');
const BaseProvider = require('./base');

class TwilioProvider extends BaseProvider {
  constructor() {
    super();
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      // eslint-disable-next-line no-console
      console.warn('[TwilioProvider] TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN not set. SMS will fail.');
    }
    this.client = sid && token ? twilio(sid, token) : null;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || '+10000000000';
  }

  // PUBLIC_INTERFACE
  async send({ to, body }) {
    /** Send SMS using Twilio */
    if (!to) throw new Error('Recipient phone (to) is required');
    if (!this.client) throw new Error('Twilio client not initialized');
    try {
      const msg = await this.client.messages.create({
        body: body || '',
        from: this.fromNumber,
        to,
      });
      return { providerMessageId: msg.sid || `tw-${Date.now()}` };
    } catch (err) {
      throw new Error(`Twilio send error: ${err.message || 'unknown'}`);
    }
  }
}

module.exports = TwilioProvider;
