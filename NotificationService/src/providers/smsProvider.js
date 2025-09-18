const logger = require('../utils/logger');

/**
 * SMS provider abstraction. Uses environment variables for Twilio-like configuration.
 * This is a stub implementation that logs instead of calling real Twilio to keep the service self-contained.
 */

// PUBLIC_INTERFACE
async function sendSMS({ to, body }) {
  /** Sends SMS using configured provider; this implementation logs for demo. */
  const provider = (process.env.SMS_PROVIDER || 'mock').toLowerCase();
  if (provider === 'twilio') {
    // In a real implementation, use twilio SDK:
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await twilio.messages.create({ from: process.env.TWILIO_FROM_NUMBER, to, body });
    logger.info('TWILIO STUB: sending SMS to %s: %s', to, body);
    return { sid: 'twilio-stub-sid' };
  }
  logger.info('MOCK SMS: to=%s body=%s', to, body);
  return { sid: 'mock-sid' };
}

module.exports = { sendSMS };
