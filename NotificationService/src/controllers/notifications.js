const { body, param, query, validationResult } = require('express-validator');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorCode: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });
  }
  return null;
};

const sendValidators = [
  body('type').isIn(['email', 'sms']).withMessage('type must be email or sms'),
  body('recipients').isArray({ min: 1 }),
  body('recipients.*.recipientId').isString().notEmpty(),
  body('templateId').isString().notEmpty(),
  body('parameters').optional().isObject()
];

const scheduleValidators = [
  ...sendValidators,
  body('scheduleAt').isISO8601().withMessage('scheduleAt must be ISO date-time')
];

// PUBLIC_INTERFACE
async function send(req, res, next) {
  /** Trigger a new notification (email/SMS) */
  try {
    if (validate(req, res)) return;
    const { type, recipients, templateId, parameters } = req.body;
    const result = await notificationService.send({ type, recipients, templateId, parameters });
    return res.status(200).json({
      notificationId: result.notificationId,
      status: result.status,
      deliveredAt: result.deliveredAt || null,
      error: result.error || null
    });
  } catch (err) {
    logger.error('send notification error: %o', err);
    next(err);
  }
}

// PUBLIC_INTERFACE
async function schedule(req, res, next) {
  /** Schedule a notification for future delivery */
  try {
    if (validate(req, res)) return;
    const { type, recipients, templateId, parameters, scheduleAt } = req.body;
    const result = notificationService.schedule({ type, recipients, templateId, parameters, scheduleAt });
    return res.status(200).json({
      notificationId: result.notificationId,
      status: result.status,
      deliveredAt: null,
      error: null
    });
  } catch (err) {
    next(err);
  }
}

const statusValidators = [param('notificationId').isString().notEmpty()];

// PUBLIC_INTERFACE
function getStatus(req, res, next) {
  /** Retrieve delivery status of a notification */
  try {
    if (validate(req, res)) return;
    const { notificationId } = req.params;
    const result = notificationService.getStatus(notificationId);
    if (!result) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Notification not found' });
    return res.status(200).json({
      notificationId: result.notificationId,
      status: result.status,
      deliveredAt: result.deliveredAt || null,
      error: result.error || null
    });
  } catch (err) {
    next(err);
  }
}

const logsValidators = [
  query('recipientId').optional().isString(),
  query('status').optional().isString(),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601()
];

// PUBLIC_INTERFACE
function listLogs(req, res, next) {
  /** List/filter notification logs */
  try {
    if (validate(req, res)) return;
    const items = notificationService.listLogs({
      recipientId: req.query.recipientId,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to
    });
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendValidators,
  scheduleValidators,
  statusValidators,
  logsValidators,
  send,
  schedule,
  getStatus,
  listLogs
};
