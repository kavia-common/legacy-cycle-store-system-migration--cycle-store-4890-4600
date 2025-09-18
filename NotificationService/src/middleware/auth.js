/**
 * Simple token-based authentication middleware.
 * Expects 'Authorization: Bearer <token>' header to match AUTH_TOKEN env.
 */
module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid or missing token'
    });
  }
  return next();
};
