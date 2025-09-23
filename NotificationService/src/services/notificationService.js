'use strict';

const { v4: uuidv4 } = require('uuid');
const templateService = require('./templateService');
const logService = require('./logService');
const emailProvider = require('./providers/emailProvider');
const smsProvider = require('./providers/smsProvider');
const scheduler = require('./schedulerService');
const audit = require('./auditService');

/**
 * Generate unique notification ID
 */
function generateId() {
  return `n-${uuidv4()}`;
}

/**
 * Service for managing notification delivery and status
 */
class NotificationService {
  /**
   * PUBLIC_INTERFACE
   * Send a notification immediately
   * @param {Object} notification Notification request
   * @param {Object} options Request options
   * @returns {Promise<Object>} Notification status
   */
  async send(notification, { requestId, actor } = {}) {
    const { type, recipients, templateId, parameters } = notification;
    const notificationId = generateId();
    const createdAt = new Date().toISOString();

    // Create initial log entry
    const base = {
      notificationId,
      status: 'pending',
      createdAt,
      deliveredAt: null,
      error: null,
      type,
      recipients,
      templateId
    };
    logService.put(base);

    // Audit the attempt
    audit.record({
      action: 'notifications.send',
      requestId,
      subject: actor || 'system',
      details: { type, templateId, recipientsCount: recipients?.length || 0 }
    });

    try {
      // Render the template
      const rendered = templateService.render(templateId, parameters || {});
      let result;

      // Send via appropriate provider
      if (type === 'email') {
        const to = recipients.map(r => r.email).filter(Boolean);
        result = await emailProvider.send({
          to,
          subject: rendered.subject,
          body: rendered.body,
          requestId
        });
      } else if (type === 'sms') {
        const to = recipients.map(r => r.phone).filter(Boolean);
        result = await smsProvider.send({
          to,
          body: rendered.body,
          requestId
        });
      } else {
        throw new Error('Unsupported notification type');
      }

      // Update status on success
      const entry = {
        ...base,
        status: 'sent',
        deliveredAt: new Date().toISOString(),
        providerMessageId: result.messageId
      };
      logService.put(entry);
      return entry;

    } catch (error) {
      // Update status on failure
      const entry = {
        ...base,
        status: 'failed',
        error: error.message,
        deliveredAt: null
      };
      logService.put(entry);

      // Audit the failure
      audit.record({
        action: 'notifications.send.failed',
        requestId,
        subject: actor || 'system',
        details: { notificationId, error: error.message }
      });

      throw error;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Schedule a notification for future delivery
   * @param {Object} notification Notification request
   * @param {Object} options Request options
   * @returns {Promise<Object>} Schedule status
   */
  async schedule(notification, { requestId, actor } = {}) {
    if (!notification.scheduleAt) {
      throw new Error('scheduleAt is required');
    }

    const notificationId = generateId();
    const createdAt = new Date().toISOString();

    // Create schedule record
    const entry = {
      notificationId,
      status: 'scheduled',
      createdAt,
      deliveredAt: null,
      error: null,
      type: notification.type,
      recipients: notification.recipients,
      templateId: notification.templateId,
      scheduleAt: notification.scheduleAt
    };
    logService.put(entry);

    // Audit the schedule
    audit.record({
      action: 'notifications.schedule',
      requestId,
      subject: actor || 'system',
      details: { notificationId, scheduleAt: notification.scheduleAt }
    });

    // Schedule the send
    scheduler.schedule(notificationId, notification.scheduleAt, async () => {
      try {
        await this.send(notification, { requestId, actor });
      } catch (error) {
        console.error(`Failed to send scheduled notification ${notificationId}:`, error);
      }
    });

    return entry;
  }

  /**
   * PUBLIC_INTERFACE
   * Get notification status by ID
   * @param {string} notificationId Notification ID
   * @returns {Object|null} Status if found
   */
  status(notificationId) {
    return logService.get(notificationId);
  }

  /**
   * PUBLIC_INTERFACE
   * List notification logs with optional filters
   * @param {Object} filters Optional filter criteria
   * @returns {Array<Object>} Matching notification logs
   */
  logs(filters = {}) {
    return logService.list(filters);
  }
}

module.exports = new NotificationService();
