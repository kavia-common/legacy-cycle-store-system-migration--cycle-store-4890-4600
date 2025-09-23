'use strict';

const notificationService = require('../services/notificationService');
const templateService = require('../services/templateService');
const recipientService = require('../services/recipientService');

class MiscController {
  // PUBLIC_INTERFACE
  async logs(req, res) {
    /** List/filter notification logs. */
    const { recipientId, status, from, to } = req.query || {};
    const list = notificationService.logs({ recipientId, status, from, to });
    const dto = list.map(item => ({
      notificationId: item.notificationId,
      status: item.status,
      deliveredAt: item.deliveredAt,
      error: item.error || null,
    }));
    return res.status(200).json(dto);
  }

  // PUBLIC_INTERFACE
  async templatesList(_req, res) {
    /** List templates. */
    return res.status(200).json(templateService.list());
  }

  // PUBLIC_INTERFACE
  async templateGet(req, res) {
    /** Get template details. */
    const t = templateService.get(req.params.templateId);
    if (!t) return res.status(404).json({ errorCode: 'NotFound', message: 'Template not found' });
    return res.status(200).json(t);
  }

  // PUBLIC_INTERFACE
  async recipientAdd(req, res) {
    /** Create recipient. */
    try {
      const rec = recipientService.add(req.body);
      return res.status(201).json(rec);
    } catch (e) {
      return res.status(400).json({ errorCode: 'InvalidRequest', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async recipientUpdate(req, res) {
    /** Update recipient. */
    try {
      const rec = recipientService.update(req.params.recipientId, req.body);
      return res.status(200).json(rec);
    } catch (e) {
      if (e.message === 'RecipientNotFound') return res.status(404).json({ errorCode: 'NotFound', message: 'Recipient not found' });
      return res.status(400).json({ errorCode: 'InvalidRequest', message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async recipientDelete(req, res) {
    /** Delete recipient. */
    try {
      recipientService.remove(req.params.recipientId);
      return res.status(204).send();
    } catch (e) {
      if (e.message === 'RecipientNotFound') return res.status(404).json({ errorCode: 'NotFound', message: 'Recipient not found' });
      return res.status(400).json({ errorCode: 'InvalidRequest', message: e.message });
    }
  }
}

module.exports = new MiscController();
