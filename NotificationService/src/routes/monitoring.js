const express = require('express');
const controller = require('../controllers/monitoring');

const router = express.Router();

router.get('/', controller.health);
router.get('/metrics', controller.metrics);

module.exports = router;
