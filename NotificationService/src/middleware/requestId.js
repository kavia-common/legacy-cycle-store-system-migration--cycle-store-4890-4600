'use strict';

const { randomUUID } = require('crypto');

module.exports = function requestId() {
  return (req, _res, next) => {
    req.requestId = req.header('x-request-id') || randomUUID();
    next();
  };
};
