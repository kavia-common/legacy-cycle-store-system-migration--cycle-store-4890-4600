'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const requestId = require('../middleware/requestId');
const notificationsController = require('../controllers/notificationsController');
const miscController = require('../controllers/miscController');

const router = express.Router();

// Apply middleware
router.use(requestId());
router.use(auth);

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Send a notification immediately
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       200:
 *         description: Notification sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationStatus'
 *       400:
 *         description: Invalid request
 */
router.post('/notifications/send', notificationsController.send.bind(notificationsController));

/**
 * @swagger
 * /notifications/schedule:
 *   post:
 *     summary: Schedule a notification for future delivery
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationRequest'
 *     responses:
 *       200:
 *         description: Notification scheduled
 */
router.post('/notifications/schedule', notificationsController.schedule.bind(notificationsController));

/**
 * @swagger
 * /notifications/status/{notificationId}:
 *   get:
 *     summary: Get notification status
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: notificationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification status
 *       404:
 *         description: Not found
 */
router.get('/notifications/status/:notificationId', notificationsController.status.bind(notificationsController));

/**
 * @swagger
 * /notifications/logs:
 *   get:
 *     summary: List notification logs
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Notification logs
 */
router.get('/notifications/logs', miscController.logs.bind(miscController));

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: List notification templates
 *     tags: [Templates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Templates list
 */
router.get('/templates', miscController.templatesList.bind(miscController));

/**
 * @swagger
 * /templates/{templateId}:
 *   get:
 *     summary: Get template details
 *     tags: [Templates]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template details
 *       404:
 *         description: Not found
 */
router.get('/templates/:templateId', miscController.templateGet.bind(miscController));

/**
 * @swagger
 * /recipients:
 *   post:
 *     summary: Create recipient
 *     tags: [Recipients]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipient'
 *     responses:
 *       201:
 *         description: Recipient created
 */
router.post('/recipients', miscController.recipientAdd.bind(miscController));

/**
 * @swagger
 * /recipients/{recipientId}:
 *   put:
 *     summary: Update recipient
 *     tags: [Recipients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: recipientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipient updated
 *   delete:
 *     summary: Delete recipient
 *     tags: [Recipients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: recipientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Recipient deleted
 */
router.put('/recipients/:recipientId', miscController.recipientUpdate.bind(miscController));
router.delete('/recipients/:recipientId', miscController.recipientDelete.bind(miscController));

module.exports = router;
