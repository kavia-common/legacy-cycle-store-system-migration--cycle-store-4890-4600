NotificationService integration:

- Endpoints:
  - POST /notifications/send
  - POST /notifications/schedule
  - GET  /notifications/status/:notificationId
- Env:
  - PORT=4012
  - PROVIDER_EMAIL_URL, PROVIDER_SMS_URL (optional)
- Notes:
  - Demo implementation stores statuses in-memory; replace providers and persistence in production.
