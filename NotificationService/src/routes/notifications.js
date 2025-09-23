'use strict';

const express = require('express');
const auth = require('../middleware/auth');
const requestId = require('../middleware/requestId');
const notificationsController = require('../controllers/notificationsController');
const miscController = require('../controllers/miscController');

const router = express.Router();

router.use(requestId());
router.use(auth);

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Trigger a new notification (email/SMS)
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
 *         description: Notification triggered successfully
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationStatus'
 */
router.post('/notifications/schedule', notificationsController.schedule.bind(notificationsController));

/**
 * @swagger
 * /notifications/status/{notificationId}:
 *   get:
 *     summary: Retrieve delivery status of a notification
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationStatus'
 *       404:
 *         description: Notification not found
 */
router.get('/notifications/status/:notificationId', notificationsController.status.bind(notificationsController));

/**
 * @swagger
 * /notifications/logs:
 *   get:
 *     summary: List/filter notification logs
 *     tags: [Notifications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: recipientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Notification logs
 */
router.get('/notifications/logs', miscController.logs.bind(miscController));

/**
 * @swagger
 * /recipients:
 *   post:
 *     summary: Add a new recipient
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
 *     summary: Update recipient information
 *     tags: [Recipients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipient'
 *     responses:
 *       200:
 *         description: Recipient updated
 *   delete:
 *     summary: Remove a recipient
 *     tags: [Recipients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Recipient deleted
 */
router.put('/recipients/:recipientId', miscController.recipientUpdate.bind(miscController));
router.delete('/recipients/:recipientId', miscController.recipientDelete.bind(miscController));

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: List available notification templates
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
 *     summary: Retrieve template details
 *     tags: [Templates]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template details
 *       404:
 *         description: Template not found
 */
router.get('/templates/:templateId', miscController.templateGet.bind(miscController));

module.exports = router;
