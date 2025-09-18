const { param, body, validationResult } = require('express-validator');
const { addRecipient, updateRecipient, deleteRecipient, listRecipients } = require('../services/recipientService');

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorCode: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });
  }
  return null;
};

const addValidators = [
  body('recipientId').isString().notEmpty(),
  body('name').optional().isString(),
  body('email').optional().isString(),
  body('phone').optional().isString(),
  body('type').isIn(['user', 'admin'])
];

// PUBLIC_INTERFACE
function add(req, res, next) {
  /** Add recipient */
  try {
    if (validate(req, res)) return;
    const r = addRecipient(req.body);
    return res.status(201).json(r);
  } catch (err) {
    next(err);
  }
}

const updateValidators = [
  param('recipientId').isString().notEmpty(),
  body('name').optional().isString(),
  body('email').optional().isString(),
  body('phone').optional().isString(),
  body('type').optional().isIn(['user', 'admin'])
];

// PUBLIC_INTERFACE
function update(req, res, next) {
  /** Update recipient */
  try {
    if (validate(req, res)) return;
    const r = updateRecipient(req.params.recipientId, req.body);
    return res.status(200).json(r);
  } catch (err) {
    next(err);
  }
}

const deleteValidators = [param('recipientId').isString().notEmpty()];

// PUBLIC_INTERFACE
function remove(req, res, next) {
  /** Remove recipient */
  try {
    if (validate(req, res)) return;
    deleteRecipient(req.params.recipientId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// PUBLIC_INTERFACE
function list(req, res) {
  /** List recipients */
  return res.status(200).json(listRecipients());
}

module.exports = {
  add,
  addValidators,
  update,
  updateValidators,
  remove,
  deleteValidators,
  list
};
