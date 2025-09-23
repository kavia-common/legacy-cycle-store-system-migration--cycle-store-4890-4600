'use strict';

const express = require('express');
const router = express.Router();

const logs = [];

// PUBLIC_INTERFACE
router.post('/notifications/send', (req, res) => {
  /** Accepts a notification request and returns status (bootstrap, no real provider). */
  const { type, recipients, templateId, parameters } = req.body || {};
  if (!type || !Array.isArray(recipients) || !templateId) {
    return res.status(400).json({ errorCode: 'InvalidRequest', message: 'type, recipients, templateId are required' });
  }
  const id = `n-${Date.now()}`;
  const entry = {
    notificationId: id,
    status: 'sent',
    deliveredAt: new Date().toISOString(),
    error: null,
    payload: { type, recipients, templateId, parameters }
  };
  logs.push(entry);
  res.status(200).json({ notificationId: id, status: 'sent', deliveredAt: entry.deliveredAt });
});

// PUBLIC_INTERFACE
router.get('/notifications/logs', (_req, res) => {
  /** Returns bootstrap logs list. */
  res.status(200).json(logs.map(({ payload, ...rest }) => rest));
});

module.exports = router;
