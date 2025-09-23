'use strict';

/**
 * Simple Bearer token auth middleware.
 * In production integrate with your IdP/JWT verification.
 */
module.exports = function authMiddleware(req, res, next) {
  const auth = req.header('authorization') || req.header('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ errorCode: 'Unauthorized', message: 'Missing bearer token' });
  }

  // For now accept any non-empty token; attach to req for audit.
  req.auth = { token, subject: 'internal-service', scopes: ['notifications:write', 'notifications:read'] };
  next();
};
