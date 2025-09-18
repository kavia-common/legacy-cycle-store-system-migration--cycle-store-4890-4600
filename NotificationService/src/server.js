const app = require('./app');
const logger = require('./utils/logger');
const { seed } = require('./bootstrap/seed');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Seed sample templates
seed();

const server = app.listen(PORT, HOST, () => {
  logger.info(`NotificationService running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
