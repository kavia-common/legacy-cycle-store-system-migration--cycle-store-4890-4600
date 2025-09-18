const { v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule');
const { notifications } = require('../repositories/memoryStore');
const { renderTemplate } = require('./templateService');
const { getRecipient } = require('./recipientService');
const { sendEmail } = require('../providers/emailProvider');
const { sendSMS } = require('../providers/smsProvider');
const logger = require('../utils/logger');
const { incCounter, observeHistogram } = require('../utils/metrics');

const scheduledJobs = new Map(); // notificationId -> job

function resolveDeliveryTargets(recipients) {
  const targets = [];
  for (const r of recipients) {
    const existing = getRecipient(r.recipientId) || r; // allow ad-hoc recipients
    targets.push(existing);
  }
  return targets;
}

async function deliver(notification) {
  const start = Date.now();
  try {
    const targets = resolveDeliveryTargets(notification.recipients);
    const payload = renderTemplate(notification.templateId, notification.parameters || {});
    const deliveries = [];
    for (const r of targets) {
      if (notification.type === 'email') {
        const email = r.email;
        if (!email) throw Object.assign(new Error(`Recipient ${r.recipientId} missing email`), { status: 400 });
        const subject = payload.subject || 'Notification';
        await sendEmail({ to: email, subject, html: payload.body, text: payload.body });
      } else if (notification.type === 'sms') {
        const phone = r.phone;
        if (!phone) throw Object.assign(new Error(`Recipient ${r.recipientId} missing phone`), { status: 400 });
        await sendSMS({ to: phone, body: payload.body });
      }
      deliveries.push({ recipientId: r.recipientId, status: 'sent' });
    }
    notification.status = 'sent';
    notification.deliveredAt = new Date().toISOString();
    notification.deliveries = deliveries;
    incCounter('notifications_sent_total', 1);
    observeHistogram('notification_delivery_ms', Date.now() - start);
    logger.info('Notification %s delivered to %d recipients', notification.notificationId, deliveries.length);
  } catch (err) {
    notification.status = 'failed';
    notification.error = err.message || String(err);
    incCounter('notifications_failed_total', 1);
    logger.error('Notification %s failed: %s', notification.notificationId, notification.error);
  }
  notifications.set(notification.notificationId, notification);
  return notification;
}

// PUBLIC_INTERFACE
async function send({ type, recipients, templateId, parameters }) {
  /** Trigger immediate notification delivery. */
  const notification = {
    notificationId: uuidv4(),
    type,
    recipients,
    templateId,
    parameters,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  notifications.set(notification.notificationId, notification);
  incCounter('notifications_triggered_total', 1);
  return deliver(notification);
}

// PUBLIC_INTERFACE
function scheduleNotification({ type, recipients, templateId, parameters, scheduleAt }) {
  /** Schedule a notification for later delivery. */
  const when = new Date(scheduleAt);
  if (Number.isNaN(when.getTime())) {
    throw Object.assign(new Error('Invalid scheduleAt'), { status: 400 });
  }
  const notification = {
    notificationId: uuidv4(),
    type,
    recipients,
    templateId,
    parameters,
    status: 'scheduled',
    scheduleAt: when.toISOString(),
    createdAt: new Date().toISOString()
  };
  notifications.set(notification.notificationId, notification);
  incCounter('notifications_scheduled_total', 1);
  if (String(process.env.SCHEDULER_ENABLED || 'true') === 'true') {
    const job = schedule.scheduleJob(when, async () => {
      await deliver(notification);
      scheduledJobs.delete(notification.notificationId);
    });
    scheduledJobs.set(notification.notificationId, job);
  }
  return notification;
}

// PUBLIC_INTERFACE
function getStatus(notificationId) {
  /** Retrieve current status of notification. */
  return notifications.get(notificationId) || null;
}

// PUBLIC_INTERFACE
function listLogs({ recipientId, status, from, to }) {
  /** List notification records with simple filters (in-memory). */
  let items = Array.from(notifications.values());
  if (recipientId) {
    items = items.filter(n => (n.recipients || []).some(r => r.recipientId === recipientId));
  }
  if (status) {
    items = items.filter(n => n.status === status);
  }
  if (from) {
    const f = new Date(from).getTime();
    items = items.filter(n => new Date(n.createdAt).getTime() >= f);
  }
  if (to) {
    const t = new Date(to).getTime();
    items = items.filter(n => new Date(n.createdAt).getTime() <= t);
  }
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  send,
  schedule: scheduleNotification,
  getStatus,
  listLogs
};
