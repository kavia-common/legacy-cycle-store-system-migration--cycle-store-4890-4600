# NotificationService Integration Guide

## Overview

The NotificationService provides APIs for sending and managing email and SMS notifications. It supports templating, recipient management, delivery status tracking, and scheduled notifications.

## Getting Started

1. Setup environment variables in `.env`:
   ```
   PORT=4012
   JWT_SECRET=your-secret-key
   EMAIL_PROVIDER=stub
   SMS_PROVIDER=stub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the service:
   ```bash
   npm start
   ```

## API Endpoints

### Notifications

- **POST /notifications/send**
  - Send immediate notification
  - Requires: type (email|sms), recipients, templateId
  - Optional: parameters (for template)

- **POST /notifications/schedule**
  - Schedule future notification
  - Additional field: scheduleAt (ISO date)

- **GET /notifications/status/:notificationId**
  - Check notification status

- **GET /notifications/logs**
  - List notification history
  - Query params: recipientId, status, from, to

### Templates

- **GET /templates**
  - List available templates

- **GET /templates/:templateId**
  - Get template details

### Recipients

- **POST /recipients**
  - Add recipient
  - Required: recipientId, type
  - Optional: name, email, phone

- **PUT /recipients/:recipientId**
  - Update recipient details

- **DELETE /recipients/:recipientId**
  - Remove recipient

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt-token>
```

## Environment Variables

See `.env.example` for all available configuration options.

## Monitoring

- **GET /**
  - Health check endpoint
  - Returns service status and component health

## Error Handling

All errors follow the format:
```json
{
  "errorCode": "string",
  "message": "string",
  "details": "string" (optional)
}
```

## Production Deployment

1. Set secure JWT_SECRET
2. Configure real email/SMS providers
3. Enable persistent storage for logs/audit
4. Set appropriate CORS_ORIGIN
5. Configure monitoring/alerting

## Example Usage

Send email notification:
```bash
curl -X POST http://localhost:4012/notifications/send \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipients": [{
      "recipientId": "user123",
      "email": "user@example.com",
      "type": "user"
    }],
    "templateId": "welcome_email",
    "parameters": {
      "name": "John Doe"
    }
  }'
```

## Support

For issues or questions, contact the development team.
