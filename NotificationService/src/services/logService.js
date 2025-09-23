'use strict';

/**
 * Service for managing notification logs and status
 * Note: In production, replace with persistent storage (e.g., database)
 */
class LogService {
  constructor() {
    this._entries = [];
    this._byId = new Map();
  }

  /**
   * PUBLIC_INTERFACE
   * List notification logs with optional filters
   * @param {Object} filters Optional filter criteria
   * @returns {Array<Object>} Matching log entries
   */
  list(filters = {}) {
    const { recipientId, status, from, to } = filters;
    let entries = [...this._entries];

    // Apply filters if provided
    if (recipientId) {
      entries = entries.filter(e => (e.recipients || []).some(r => r.recipientId === recipientId));
    }
    if (status) {
      entries = entries.filter(e => e.status === status);
    }
    if (from) {
      entries = entries.filter(e => new Date(e.createdAt) >= new Date(from));
    }
    if (to) {
      entries = entries.filter(e => new Date(e.createdAt) <= new Date(to));
    }

    return entries;
  }

  /**
   * PUBLIC_INTERFACE
   * Get notification status by ID
   * @param {string} notificationId Notification ID
   * @returns {Object|null} Log entry if found
   */
  get(notificationId) {
    return this._byId.get(notificationId) || null;
  }

  /**
   * PUBLIC_INTERFACE
   * Store a notification log entry
   * @param {Object} entry Log entry to store
   */
  put(entry) {
    if (!entry?.notificationId) {
      throw new Error('Missing notificationId');
    }

    const exists = this._byId.has(entry.notificationId);
    if (!exists) {
      this._entries.push(entry);
    }
    this._byId.set(entry.notificationId, entry);
  }
}

module.exports = new LogService();
