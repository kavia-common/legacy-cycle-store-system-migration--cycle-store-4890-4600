const express = require('express');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const controller = require('../controllers/notifications');

const router = express.Router();

/**
 * Notification routes
 */
router.post('/send', auth, rateLimiter, controller.sendValidators, controller.send);
router.post('/schedule', auth, rateLimiter, controller.scheduleValidators, controller.schedule);
router.get('/status/:notificationId', auth, controller.statusValidators, controller.getStatus);
router.get('/logs', auth, controller.logsValidators, controller.listLogs);

module.exports = router;
