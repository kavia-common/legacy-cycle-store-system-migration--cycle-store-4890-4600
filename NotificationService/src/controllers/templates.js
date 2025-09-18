const { param, body, validationResult } = require('express-validator');
const { listTemplates, getTemplate, upsertTemplate } = require('../services/templateService');

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorCode: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });
  }
  return null;
};

// PUBLIC_INTERFACE
function list(req, res) {
  /** List available notification templates */
  return res.status(200).json(listTemplates());
}

const getValidators = [param('templateId').isString().notEmpty()];

// PUBLIC_INTERFACE
function get(req, res) {
  /** Retrieve template details */
  if (validate(req, res)) return;
  const t = getTemplate(req.params.templateId);
  if (!t) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Template not found' });
  return res.status(200).json(t);
}

const upsertValidators = [
  body('templateId').isString().notEmpty(),
  body('name').optional().isString(),
  body('subject').optional().isString(),
  body('body').optional().isString(),
  body('type').isIn(['email', 'sms'])
];

// PUBLIC_INTERFACE
function upsert(req, res) {
  /** Create or update template */
  if (validate(req, res)) return;
  const t = upsertTemplate(req.body);
  return res.status(201).json(t);
}

module.exports = {
  list,
  get,
  getValidators,
  upsert,
  upsertValidators
};
