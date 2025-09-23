'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'notification-service-dev-secret';

/**
 * Middleware for JWT authentication and authorization
 */
module.exports = function authMiddleware(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      errorCode: 'Unauthorized',
      message: 'Missing bearer token'
    });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach auth info to request
    req.auth = {
      subject: decoded.sub || 'unknown',
      scopes: decoded.scopes || [],
      token
    };

    next();
  } catch (error) {
    return res.status(401).json({
      errorCode: 'Unauthorized',
      message: 'Invalid token'
    });
  }
};
