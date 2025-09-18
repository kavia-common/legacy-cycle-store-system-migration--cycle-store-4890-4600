const express = require('express');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const controller = require('../controllers/templates');

const router = express.Router();

router.get('/', auth, rateLimiter, controller.list);
router.get('/:templateId', auth, rateLimiter, controller.getValidators, controller.get);
router.post('/', auth, rateLimiter, controller.upsertValidators, controller.upsert);

module.exports = router;
