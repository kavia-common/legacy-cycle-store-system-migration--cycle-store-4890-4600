'use strict';

class LogService {
  constructor() {
    this._entries = [];
    this._byId = new Map();
  }

  // PUBLIC_INTERFACE
  list(filters = {}) {
    /** List/filter notification logs. */
    const { recipientId, status, from, to } = filters;
    let entries = [...this._entries];
    if (recipientId) entries = entries.filter(e => (e.recipients || []).some(r => r.recipientId === recipientId));
    if (status) entries = entries.filter(e => e.status === status);
    if (from) entries = entries.filter(e => new Date(e.createdAt) >= new Date(from));
    if (to) entries = entries.filter(e => new Date(e.createdAt) <= new Date(to));
    return entries;
  }

  // PUBLIC_INTERFACE
  get(notificationId) {
    /** Get single log/status by id. */
    return this._byId.get(notificationId) || null;
  }

  // PUBLIC_INTERFACE
  put(entry) {
    /** Insert/replace a log entry. */
    if (!entry.notificationId) throw new Error('Missing notificationId');
    const exists = this._byId.has(entry.notificationId);
    if (!exists) this._entries.push(entry);
    this._byId.set(entry.notificationId, entry);
  }
}

module.exports = new LogService();
