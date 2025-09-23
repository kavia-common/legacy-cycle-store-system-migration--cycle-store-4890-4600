'use strict';

const templateService = require('./templateService');
const logService = require('./logService');
const emailProvider = require('./providers/emailProvider');
const smsProvider = require('./providers/smsProvider');
const scheduler = require('./schedulerService');
const audit = require('./auditService');

function id() {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

class NotificationService {
  // PUBLIC_INTERFACE
  async send({ type, recipients, templateId, parameters }, { requestId, actor } = {}) {
    /** Send notification immediately via configured provider. */
    const notificationId = id();
    const createdAt = new Date().toISOString();
    const base = { notificationId, status: 'pending', createdAt, deliveredAt: null, error: null, type, recipients, templateId };
    logService.put(base);
    audit.record({ action: 'notifications.send', requestId, subject: actor, details: { type, templateId, recipientsCount: recipients?.length || 0 } });

    try {
      const rendered = templateService.render(templateId, parameters || {});
      if (type === 'email') {
        const to = recipients.map(r => r.email).filter(Boolean);
        const resp = await emailProvider.send({ to, subject: rendered.subject, body: rendered.body, requestId });
        const entry = { ...base, status: 'sent', deliveredAt: new Date().toISOString(), providerMessageId: resp.messageId };
        logService.put(entry);
        return entry;
      } else if (type === 'sms') {
        const to = recipients.map(r => r.phone).filter(Boolean);
        const resp = await smsProvider.send({ to, body: rendered.body, requestId });
        const entry = { ...base, status: 'sent', deliveredAt: new Date().toISOString(), providerMessageId: resp.messageId };
        logService.put(entry);
        return entry;
      }
      throw new Error('UnsupportedType');
    } catch (e) {
      const entry = { ...logService.get(notificationId), status: 'failed', error: e.message, deliveredAt: null };
      logService.put(entry);
      audit.record({ action: 'notifications.send.failed', requestId, subject: actor, details: { notificationId, error: e.message } });
      throw e;
    }
  }

  // PUBLIC_INTERFACE
  async schedule(reqBody, { requestId, actor } = {}) {
    /** Schedule a notification for future delivery. */
    if (!reqBody.scheduleAt) {
      throw new Error('Missing scheduleAt');
    }
    const notificationId = id();
    const createdAt = new Date().toISOString();
    const entry = { notificationId, status: 'scheduled', createdAt, deliveredAt: null, error: null, type: reqBody.type, recipients: reqBody.recipients, templateId: reqBody.templateId, scheduleAt: reqBody.scheduleAt };
    logService.put(entry);
    audit.record({ action: 'notifications.schedule', requestId, subject: actor, details: { notificationId, scheduleAt: reqBody.scheduleAt } });

    scheduler.schedule(notificationId, reqBody.scheduleAt, async () => {
      try {
        await this.send({ type: reqBody.type, recipients: reqBody.recipients, templateId: reqBody.templateId, parameters: reqBody.parameters }, { requestId, actor });
      } catch (e) {
        // already logged as failed
      }
    });

    return entry;
  }

  // PUBLIC_INTERFACE
  status(notificationId) {
    /** Retrieve status by ID. */
    return logService.get(notificationId);
  }

  // PUBLIC_INTERFACE
  logs(filters) {
    /** List logs by filters. */
    return logService.list(filters);
  }
}

module.exports = new NotificationService();
