const { v4: uuidv4 } = require('uuid');
const templateEngine = require('./templateEngine');
const templateStore = require('./templateStore');
const SendGridProvider = require('./providers/sendgrid');
const TwilioProvider = require('./providers/twilio');

// Simple in-memory store for statuses and logs.
// For production, replace with persistent storage (DB or queue + DB).
const notifications = new Map();
const logs = [];

// Choose providers via env configuration, defaulting to SendGrid/Twilio
const EMAIL_PROVIDER = (process.env.NOTIFICATION_PROVIDER_EMAIL || 'sendgrid').toLowerCase();
const SMS_PROVIDER = (process.env.NOTIFICATION_PROVIDER_SMS || 'twilio').toLowerCase();

function getEmailProvider() {
  switch (EMAIL_PROVIDER) {
    case 'sendgrid':
    default:
      return new SendGridProvider();
  }
}

function getSmsProvider() {
  switch (SMS_PROVIDER) {
    case 'twilio':
    default:
      return new TwilioProvider();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class NotificationService {
  constructor() {
    this.maxAttempts = 3;
    this.initialBackoffMs = 1000;
  }

  /**
   * Create or update the in-memory record and append to logs
   */
  upsertRecord(record) {
    notifications.set(record.notificationId, record);
    // Maintain a separate logs list for listing
    const logEntry = {
      notificationId: record.notificationId,
      type: record.type,
      recipients: record.recipients,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      templateId: record.templateId,
      attempts: record.attempts,
      error: record.error || null,
    };
    // Replace if exists in logs
    const idx = logs.findIndex((l) => l.notificationId === record.notificationId);
    if (idx >= 0) logs[idx] = logEntry;
    else logs.push(logEntry);
  }

  /**
   * Render template based on type and templateId
   */
  async renderTemplate(type, templateId, parameters) {
    const tpl = await templateStore.getTemplate(type, templateId); // { body: string, subject?: string }
    const body = templateEngine.render(tpl.body, parameters);
    const subject = tpl.subject ? templateEngine.render(tpl.subject, parameters) : (parameters.subject || 'Notification');
    return { subject, body };
  }

  /**
   * PUBLIC_INTERFACE
   * Trigger notification: send immediately or schedule
   */
  async trigger({ type, recipients, templateId, parameters, scheduleAt }) {
    const notificationId = uuidv4();
    const now = new Date();

    const record = {
      notificationId,
      type,
      recipients,
      templateId,
      parameters,
      scheduleAt: scheduleAt || null,
      status: scheduleAt && scheduleAt > now ? 'scheduled' : 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      attempts: 0,
      error: null,
      providerMessageIds: [],
    };

    this.upsertRecord(record);

    if (record.status === 'scheduled') {
      const delayMs = scheduleAt.getTime() - now.getTime();
      setTimeout(() => this._send(notificationId).catch(() => {}), delayMs);
    } else {
      // Fire and forget, track status in memory
      this._send(notificationId).catch(() => {});
    }

    return { notificationId, status: record.status };
  }

  /**
   * Retrieve status by ID
   */
  getStatus(notificationId) {
    return notifications.get(notificationId);
  }

  /**
   * List logs with optional filters
   */
  getLogs({ recipientId, status, from, to } = {}) {
    return logs.filter((l) => {
      if (recipientId) {
        const match = (l.recipients || []).some((r) => r && r.recipientId === recipientId);
        if (!match) return false;
      }
      if (status && l.status !== status) return false;
      if (from && new Date(l.createdAt) < from) return false;
      if (to && new Date(l.createdAt) > to) return false;
      return true;
    });
  }

  /**
   * Internal: orchestrate sending with retries and backoff.
   */
  async _send(notificationId) {
    const record = notifications.get(notificationId);
    if (!record) return;

    const now = new Date();
    record.status = 'pending';
    record.updatedAt = now.toISOString();
    this.upsertRecord(record);

    // Render template
    let rendered;
    try {
      rendered = await this.renderTemplate(record.type, record.templateId, record.parameters || {});
    } catch (err) {
      record.status = 'failed';
      record.error = `Template render error: ${err.message || 'unknown'}`;
      record.updatedAt = new Date().toISOString();
      this.upsertRecord(record);
      return;
    }

    // Choose provider
    const provider = record.type === 'email' ? getEmailProvider() : getSmsProvider();

    // For each recipient, attempt send with retries
    const perRecipientResults = [];
    for (const recipient of record.recipients) {
      const to = record.type === 'email' ? recipient.email : recipient.phone;
      if (!to) {
        perRecipientResults.push({ success: false, error: 'Missing recipient contact' });
        continue;
      }

      let attempt = 0;
      let success = false;
      let lastError = null;
      let providerMessageId = null;

      while (attempt < this.maxAttempts && !success) {
        attempt += 1;
        record.attempts += 1;
        try {
          if (record.type === 'email') {
            const result = await provider.send({
              to,
              subject: rendered.subject,
              html: rendered.body,
              text: rendered.body.replace(/<[^>]*>?/gm, ''), // crude text fallback
            });
            providerMessageId = result && result.providerMessageId ? result.providerMessageId : null;
          } else {
            const result = await provider.send({
              to,
              body: rendered.body,
            });
            providerMessageId = result && result.providerMessageId ? result.providerMessageId : null;
          }
          success = true;
        } catch (err) {
          lastError = err;
          // Exponential backoff
          const backoff = this.initialBackoffMs * Math.pow(2, attempt - 1);
          await sleep(backoff);
        }
      }

      if (success) {
        record.providerMessageIds.push(providerMessageId);
        perRecipientResults.push({ success: true, providerMessageId });
      } else {
        perRecipientResults.push({ success: false, error: lastError ? (lastError.message || 'send failed') : 'send failed' });
      }
    }

    // Aggregate result
    const anyFailed = perRecipientResults.some((r) => !r.success);
    record.status = anyFailed ? 'failed' : 'sent';
    record.error = anyFailed ? (perRecipientResults.find((r) => !r.success).error) : null;
    record.updatedAt = new Date().toISOString();
    this.upsertRecord(record);
  }
}

module.exports = new NotificationService();
