# Notification Service

Express.js based service for sending Email and SMS notifications with:
- Token-based authentication (Bearer token)
- REST APIs to send and schedule notifications
- Templates and recipients management
- Status tracking and logs (in-memory)
- Basic logging and monitoring (metrics JSON)
- Swagger docs at /docs and OpenAPI generation

## Quick start
1. Copy .env.example to .env and fill values (AUTH_TOKEN, SMTP or providers).
2. Install and run:
   npm install
   npm run dev

Docs: http://localhost:3000/docs
Health: GET /
Metrics: GET /metrics

## Auth
All non-health endpoints require:
Authorization: Bearer <AUTH_TOKEN>

## Core endpoints
- POST /notifications/send
- POST /notifications/schedule
- GET /notifications/status/:notificationId
- GET /notifications/logs
- GET /templates
- GET /templates/:templateId
- POST /templates
- GET /recipients
- POST /recipients
- PUT /recipients/:recipientId
- DELETE /recipients/:recipientId

## Notes
- Storage is in-memory for recipients, templates, and notification logs to keep the service self-contained. Replace repositories with a database for production.
- Email provider uses nodemailer with SMTP. SMS provider is a stub that logs messages; integrate a real provider (e.g., Twilio) by replacing the stub.
