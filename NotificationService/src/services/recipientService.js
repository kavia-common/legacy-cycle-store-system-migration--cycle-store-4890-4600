'use strict';

/**
 * Service for managing notification recipients
 * Note: In production, replace with persistent storage (e.g., database)
 */
class RecipientService {
  constructor() {
    this._recipients = new Map();
  }

  /**
   * PUBLIC_INTERFACE
   * Add a new recipient
   * @param {Object} recipient Recipient details
   * @returns {Object} Created recipient
   */
  add(recipient) {
    if (!recipient?.recipientId || !recipient?.type) {
      throw new Error('Invalid recipient: recipientId and type required');
    }

    if (this._recipients.has(recipient.recipientId)) {
      throw new Error('RecipientExists');
    }

    this._recipients.set(recipient.recipientId, recipient);
    return recipient;
  }

  /**
   * PUBLIC_INTERFACE
   * Update a recipient
   * @param {string} recipientId Recipient ID
   * @param {Object} recipient Updated details
   * @returns {Object} Updated recipient
   */
  update(recipientId, recipient) {
    if (!this._recipients.has(recipientId)) {
      throw new Error('RecipientNotFound');
    }

    const existing = this._recipients.get(recipientId);
    const merged = { ...existing, ...recipient, recipientId };
    this._recipients.set(recipientId, merged);
    return merged;
  }

  /**
   * PUBLIC_INTERFACE
   * Remove a recipient
   * @param {string} recipientId Recipient ID
   */
  remove(recipientId) {
    if (!this._recipients.has(recipientId)) {
      throw new Error('RecipientNotFound');
    }
    this._recipients.delete(recipientId);
  }

  /**
   * PUBLIC_INTERFACE
   * Get a recipient by ID
   * @param {string} recipientId Recipient ID
   * @returns {Object|null} Recipient if found
   */
  get(recipientId) {
    return this._recipients.get(recipientId) || null;
  }

  /**
   * PUBLIC_INTERFACE
   * List all recipients
   * @returns {Array<Object>} List of recipients
   */
  list() {
    return Array.from(this._recipients.values());
  }
}

module.exports = new RecipientService();
