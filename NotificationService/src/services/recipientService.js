'use strict';

class RecipientService {
  constructor() {
    this._recipients = new Map();
  }

  // PUBLIC_INTERFACE
  add(recipient) {
    /** Add a recipient record. */
    if (!recipient || !recipient.recipientId || !recipient.type) {
      throw new Error('InvalidRecipient');
    }
    this._recipients.set(recipient.recipientId, recipient);
    return recipient;
  }

  // PUBLIC_INTERFACE
  update(recipientId, recipient) {
    /** Update a recipient record. */
    if (!this._recipients.has(recipientId)) throw new Error('RecipientNotFound');
    const merged = { ...this._recipients.get(recipientId), ...recipient, recipientId };
    this._recipients.set(recipientId, merged);
    return merged;
  }

  // PUBLIC_INTERFACE
  remove(recipientId) {
    /** Delete a recipient. */
    if (!this._recipients.has(recipientId)) throw new Error('RecipientNotFound');
    this._recipients.delete(recipientId);
  }

  // PUBLIC_INTERFACE
  get(recipientId) {
    /** Get a recipient by ID. */
    return this._recipients.get(recipientId) || null;
  }
}

module.exports = new RecipientService();
