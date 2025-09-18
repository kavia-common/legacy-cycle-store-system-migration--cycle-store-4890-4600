const { recipients } = require('../repositories/memoryStore');

// PUBLIC_INTERFACE
function addRecipient(r) {
  /** Adds a new recipient. */
  if (!r.recipientId || !r.type) {
    throw Object.assign(new Error('recipientId and type required'), { status: 400 });
  }
  recipients.set(r.recipientId, r);
  return r;
}

// PUBLIC_INTERFACE
function updateRecipient(recipientId, r) {
  /** Updates an existing recipient. */
  if (!recipients.has(recipientId)) throw Object.assign(new Error('Not found'), { status: 404 });
  const updated = { ...(recipients.get(recipientId) || {}), ...r, recipientId };
  recipients.set(recipientId, updated);
  return updated;
}

// PUBLIC_INTERFACE
function deleteRecipient(recipientId) {
  /** Deletes recipient. */
  if (!recipients.has(recipientId)) throw Object.assign(new Error('Not found'), { status: 404 });
  recipients.delete(recipientId);
  return true;
}

// PUBLIC_INTERFACE
function getRecipient(recipientId) {
  /** Get one recipient. */
  return recipients.get(recipientId) || null;
}

// PUBLIC_INTERFACE
function listRecipients() {
  /** List all recipients. */
  return Array.from(recipients.values());
}

module.exports = {
  addRecipient,
  updateRecipient,
  deleteRecipient,
  getRecipient,
  listRecipients
};
