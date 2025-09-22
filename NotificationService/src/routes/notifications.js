const express = require('express');
const notificationController = require('../controllers/notification');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Email and SMS notification endpoints
 */

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: Trigger a new notification (email/SMS)
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, recipients, templateId]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [email, sms]
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     recipientId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phone:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [user, admin]
 *               templateId:
 *                 type: string
 *               parameters:
 *                 type: object
 *                 additionalProperties: 
 *                   type: string
 *               scheduleAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Notification triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [notificationId, status]
 *               properties:
 *                 notificationId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, sent, failed, scheduled]
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal Server Error
 */
router.post('/send', notificationController.send.bind(notificationController));

/**
 * @swagger
 * /notifications/status/{notificationId}:
 *   get:
 *     summary: Retrieve delivery status of a notification
 *     tags: [Notifications]
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
 *               type: object
 *               properties:
 *                 notificationId: { type: string }
 *                 status: 
 *                   type: string
 *                   enum: [pending, sent, failed, scheduled]
 *                 attempts:
 *                   type: integer
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Notification not found
 */
router.get('/status/:notificationId', notificationController.status.bind(notificationController));

/**
 * @swagger
 * /notifications/logs:
 *   get:
 *     summary: List/filter notification logs
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: recipientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, sent, failed, scheduled]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   notificationId: { type: string }
 *                   type: { type: string, enum: [email, sms] }
 *                   recipients: 
 *                     type: array
 *                     items: { type: object }
 *                   status: { type: string }
 *                   createdAt: { type: string, format: date-time }
 *                   updatedAt: { type: string, format: date-time }
 */
router.get('/logs', notificationController.logs.bind(notificationController));

module.exports = router;
