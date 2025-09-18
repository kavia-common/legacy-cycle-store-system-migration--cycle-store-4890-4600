/**
 * Naive in-memory store for recipients, templates, and notifications.
 * Replace with a database in production.
 */
const recipients = new Map(); // recipientId -> recipient
const templates = new Map(); // templateId -> template
const notifications = new Map(); // notificationId -> record

module.exports = {
  recipients,
  templates,
  notifications
};
