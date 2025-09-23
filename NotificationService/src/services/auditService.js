'use strict';

/**
 * In-memory audit logger. Replace with persistent storage (e.g., DB) in production.
 */
class AuditService {
  constructor() {
    this._events = [];
  }

  // PUBLIC_INTERFACE
  record(event) {
    /** Record an audit event. */
    const payload = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    this._events.push(payload);
    return payload.id;
  }

  list({ from, to, action, subject } = {}) {
    let out = [...this._events];
    if (from) out = out.filter(e => new Date(e.timestamp) >= new Date(from));
    if (to) out = out.filter(e => new Date(e.timestamp) <= new Date(to));
    if (action) out = out.filter(e => e.action === action);
    if (subject) out = out.filter(e => e.subject === subject);
    return out;
  }
}

module.exports = new AuditService();
