const { getMetrics } = require('../utils/metrics');

// PUBLIC_INTERFACE
function health(req, res) {
  /** Health and readiness endpoint. */
  return res.status(200).json({
    status: 'ok',
    message: 'Notification Service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}

// PUBLIC_INTERFACE
function metrics(req, res) {
  /** Metrics endpoint (basic JSON). */
  if (String(process.env.METRICS_ENABLED || 'true') !== 'true') {
    return res.status(404).json({ errorCode: 'DISABLED', message: 'Metrics disabled' });
  }
  return res.status(200).json(getMetrics());
}

module.exports = { health, metrics };
