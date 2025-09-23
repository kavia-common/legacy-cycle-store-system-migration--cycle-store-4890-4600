'use strict';

const notificationService = require('../services/notificationService');

// Basic validation helpers
function validateRequest(body, { requireScheduleAt = false } = {}) {
  const { type, recipients, templateId, scheduleAt } = body || {};
  if (!(type === 'email' || type === 'sms')) return 'type must be "email" or "sms"';
  if (!Array.isArray(recipients) || recipients.length === 0) return 'recipients must be a non-empty array';
  if (!templateId) return 'templateId is required';
  if (requireScheduleAt && !scheduleAt) return 'scheduleAt is required';
  return null;
}

class NotificationsController {
  // PUBLIC_INTERFACE
  async send(req, res) {
    /** Trigger a new notification (email/SMS). */
    const err = validateRequest(req.body);
    if (err) return res.status(400).json({ errorCode: 'InvalidRequest', message: err });
    try {
      const result = await notificationService.send(req.body, { requestId: req.requestId, actor: req.auth?.subject || 'unknown' });
      return res.status(200).json({
        notificationId: result.notificationId,
        status: result.status,
        deliveredAt: result.deliveredAt,
        error: result.error || null,
      });
    } catch (e) {
      return res.status(500).json({ errorCode: 'SendFailed', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async schedule(req, res) {
    /** Schedule a notification for future delivery. */
    const err = validateRequest(req.body, { requireScheduleAt: true });
    if (err) return res.status(400).json({ errorCode: 'InvalidRequest', message: err });
    try {
      const result = await notificationService.schedule(req.body, { requestId: req.requestId, actor: req.auth?.subject || 'unknown' });
      return res.status(200).json({
        notificationId: result.notificationId,
        status: result.status,
        deliveredAt: result.deliveredAt,
        error: result.error || null,
      });
    } catch (e) {
      return res.status(500).json({ errorCode: 'ScheduleFailed', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async status(req, res) {
    /** Retrieve delivery status of a notification. */
    const item = notificationService.status(req.params.notificationId);
    if (!item) return res.status(404).json({ errorCode: 'NotFound', message: 'Notification not found' });
    return res.status(200).json({
      notificationId: item.notificationId,
      status: item.status,
      deliveredAt: item.deliveredAt,
      error: item.error || null,
    });
    }
}

module.exports = new NotificationsController();
