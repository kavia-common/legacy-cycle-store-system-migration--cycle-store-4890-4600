const createError = require('http-errors');
const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isClient = status >= 400 && status < 500;
  const payload = {
    errorCode: err.code || (isClient ? 'BAD_REQUEST' : 'INTERNAL_ERROR'),
    message: err.message || 'Internal Server Error'
  };
  if (!isClient) {
    logger.error('Unhandled error: %o', err);
  }
  res.status(status).json(payload);
};

// Helper to create 404 for routes not found
module.exports.notFound = function notFound(req, res, next) {
  next(createError(404, 'Not Found'));
};
