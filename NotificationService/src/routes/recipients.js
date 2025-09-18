const express = require('express');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const controller = require('../controllers/recipients');

const router = express.Router();

router.get('/', auth, rateLimiter, controller.list);
router.post('/', auth, rateLimiter, controller.addValidators, controller.add);
router.put('/:recipientId', auth, rateLimiter, controller.updateValidators, controller.update);
router.delete('/:recipientId', auth, rateLimiter, controller.deleteValidators, controller.remove);

module.exports = router;
