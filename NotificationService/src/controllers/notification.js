const notificationService = require('../services/notification');

class NotificationController {
  // PUBLIC_INTERFACE
  async send(req, res) {
    /** Trigger an email or SMS notification.
     * Body: { type: 'email'|'sms', recipients: [{...}], templateId: string, parameters?: object, scheduleAt?: iso-string }
     * Returns: { notificationId, status }
     */
    try {
      const { type, recipients, templateId, parameters, scheduleAt } = req.body || {};
      if (!type || !['email', 'sms'].includes(type)) {
        return res.status(400).json({ errorCode: 'INVALID_TYPE', message: 'type must be email or sms' });
      }
      if (!Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ errorCode: 'INVALID_RECIPIENTS', message: 'recipients array is required' });
      }
      if (!templateId || typeof templateId !== 'string') {
        return res.status(400).json({ errorCode: 'INVALID_TEMPLATE', message: 'templateId is required' });
      }
      let scheduleDate = null;
      if (scheduleAt) {
        const d = new Date(scheduleAt);
        if (isNaN(d.getTime())) {
          return res.status(400).json({ errorCode: 'INVALID_SCHEDULE', message: 'scheduleAt must be a valid ISO date string' });
        }
        scheduleDate = d;
      }

      const result = await notificationService.trigger({
        type,
        recipients,
        templateId,
        parameters: parameters || {},
        scheduleAt: scheduleDate,
      });

      return res.status(200).json({ notificationId: result.notificationId, status: result.status });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Notification send error:', err);
      return res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Failed to trigger notification' });
    }
  }

  // PUBLIC_INTERFACE
  async status(req, res) {
    /** Get status for the notificationId.
     * Path params: { notificationId }
     * Returns status object with attempts and timestamps.
     */
    const { notificationId } = req.params || {};
    const status = notificationService.getStatus(notificationId);
    if (!status) {
      return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Notification not found' });
    }
    return res.status(200).json(status);
  }

  // PUBLIC_INTERFACE
  async logs(req, res) {
    /** List logs with optional filters: recipientId, status, from, to */
    const { recipientId, status, from, to } = req.query || {};
    const logs = notificationService.getLogs({
      recipientId,
      status,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    return res.status(200).json(logs);
  }
}

module.exports = new NotificationController();
