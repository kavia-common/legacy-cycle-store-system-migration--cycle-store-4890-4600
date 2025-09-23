# NotificationService – Local Integration Notes

- Recommended dev port: 4003 (set PORT=4003; default in server will use process.env.PORT or 3000)
- OpenAPI docs: GET /docs
- Base path for secured API: /api/v1

Exposed endpoints:
- POST /api/v1/notifications/send
- POST /api/v1/notifications/schedule
- GET  /api/v1/notifications/status/{notificationId}
- GET  /api/v1/notifications/logs
- POST /api/v1/recipients
- PUT  /api/v1/recipients/{recipientId}
- DELETE /api/v1/recipients/{recipientId}
- GET  /api/v1/templates
- GET  /api/v1/templates/{templateId}

Security:
- All endpoints (except health "/") require Bearer token. Current implementation accepts any non-empty token for development only; integrate with your JWT/IdP in production.

Implementation notes:
- Providers are stubs (email/SMS). Replace in src/services/providers/* with real integrations (SMTP/SES/SendGrid/Twilio).
- Logs and audit are in-memory for now; replace with persistent storage to satisfy audit/compliance.

Environment variables:
- PORT: Port to run the service on (e.g., 4003)
- HOST: Host to bind (default 0.0.0.0)
- EMAIL_PROVIDER: stub or your provider name
- SMS_PROVIDER: stub or your provider name
- PROVIDER_*: future provider configs (SMTP, SMS), to be defined securely in .env (not in code)

Usage example (send email):
curl -X POST http://localhost:4003/api/v1/notifications/send \
  -H "Authorization: Bearer dev" -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipients": [{"recipientId":"u1","type":"user","email":"user@example.com","name":"Ada"}],
    "templateId": "welcome_email",
    "parameters": {"name":"Ada"}
  }'
