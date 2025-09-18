const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Notification REST API',
      version: '1.0.0',
      description:
        'API for sending, managing, and monitoring outbound notifications (email, SMS). Includes templating, recipients, status tracking, and scheduling. Secured by token-based authentication.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Recipient: {
          type: 'object',
          properties: {
            recipientId: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            type: { type: 'string', enum: ['user', 'admin'] }
          },
          required: ['recipientId', 'type']
        },
        Template: {
          type: 'object',
          properties: {
            templateId: { type: 'string' },
            name: { type: 'string' },
            subject: { type: 'string' },
            body: { type: 'string' },
            type: { type: 'string', enum: ['email', 'sms'] }
          },
          required: ['templateId', 'name', 'type']
        },
        NotificationRequest: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['email', 'sms'] },
            recipients: { type: 'array', items: { $ref: '#/components/schemas/Recipient' } },
            templateId: { type: 'string' },
            parameters: { type: 'object', additionalProperties: { type: 'string' } },
            scheduleAt: { type: 'string', format: 'date-time' }
          },
          required: ['type', 'recipients', 'templateId']
        },
        NotificationStatus: {
          type: 'object',
          properties: {
            notificationId: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'sent', 'failed', 'scheduled'] },
            deliveredAt: { type: 'string', format: 'date-time' },
            error: { type: 'string', nullable: true }
          },
          required: ['notificationId', 'status']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            errorCode: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' }
          },
          required: ['errorCode', 'message']
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Service health and metrics' },
      { name: 'Notifications', description: 'Send and schedule notifications; check status and logs' },
      { name: 'Templates', description: 'Template management' },
      { name: 'Recipients', description: 'Recipient management' }
    ]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
