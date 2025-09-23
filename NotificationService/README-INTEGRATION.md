# NotificationService – Local Integration Notes

- Recommended dev port: 4003 (set PORT=4003; default in server will use process.env.PORT or 3000)
- Exposed endpoints (bootstrap):
  - POST /notifications/send
  - GET /notifications/logs

The service currently simulates sending and records logs in memory. Replace with real provider integrations (SMTP, SMS gateway) and persistent storage for audit.

Environment variables:
- PORT: Port to run the service on (e.g., 4003)
- HOST: Host to bind (default 0.0.0.0)
- PROVIDER_*: future provider configs (SMTP, SMS), to be defined securely in .env (not in code)
