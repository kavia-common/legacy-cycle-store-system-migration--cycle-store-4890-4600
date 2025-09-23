'use strict';

/**
 * Service for audit logging of notification activities
 * Note: In production, replace with persistent storage (e.g., database)
 */
class AuditService {
  constructor() {
    this._events = [];
  }

  /**
   * PUBLIC_INTERFACE
   * Record an audit event
   * @param {Object} event Event details
   * @returns {string} Event ID
   */
  record(event) {
    const payload = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...event
    };

    this._events.push(payload);
    return payload.id;
  }

  /**
   * PUBLIC_INTERFACE
   * List audit events with optional filters
   * @param {Object} filters Optional filter criteria
   * @returns {Array<Object>} Matching audit events
   */
  list({ from, to, action, subject } = {}) {
    let events = [...this._events];

    // Apply filters if provided
    if (from) {
      events = events.filter(e => new Date(e.timestamp) >= new Date(from));
    }
    if (to) {
      events = events.filter(e => new Date(e.timestamp) <= new Date(to));
    }
    if (action) {
      events = events.filter(e => e.action === action);
    }
    if (subject) {
      events = events.filter(e => e.subject === subject);
    }

    return events;
  }
}

module.exports = new AuditService();
