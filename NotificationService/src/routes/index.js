const express = require('express');
const monitoringRoutes = require('./monitoring');
const notificationsRoutes = require('./notifications');
const templatesRoutes = require('./templates');
const recipientsRoutes = require('./recipients');

const router = express.Router();

// Root health
router.use('/', monitoringRoutes);

// Feature routes
router.use('/notifications', notificationsRoutes);
router.use('/templates', templatesRoutes);
router.use('/recipients', recipientsRoutes);

module.exports = router;
