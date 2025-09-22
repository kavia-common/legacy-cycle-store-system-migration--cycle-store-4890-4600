/**
 * Base provider class for notification adapters.
 */
class BaseProvider {
  // PUBLIC_INTERFACE
  async send(payload) {
    /** Send a notification. Implement in subclass.
     * For email: { to, subject, html, text }
     * For sms: { to, body }
     * Return: { providerMessageId }
     */
    throw new Error('Not implemented');
  }
}

module.exports = BaseProvider;
