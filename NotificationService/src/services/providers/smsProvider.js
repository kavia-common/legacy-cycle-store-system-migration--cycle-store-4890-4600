'use strict';

/**
 * SMS provider abstraction. Replace with Twilio/MessageBird integration.
 * Uses environment variables:
 *  - SMS_PROVIDER: 'stub' | future values
 */
class SmsProvider {
  async send({ to, body, requestId }) {
    const provider = process.env.SMS_PROVIDER || 'stub';
    // eslint-disable-next-line no-console
    console.log(`[SmsProvider:${provider}] requestId=${requestId} to=${to.join(',')} body="${body.slice(0, 120)}"`);
    return { messageId: `sm-${Date.now()}` };
  }
}

module.exports = new SmsProvider();
