'use strict';

const emailProvider = require('./providers/emailProvider');
const smsProvider = require('./providers/smsProvider');

class HealthService {
  /**
   * PUBLIC_INTERFACE
   * Get service health status
   * @returns {Object} Health status information
   */
  getStatus() {
    return {
      status: 'ok',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      components: {
        email: {
          provider: emailProvider.provider,
          status: 'ok'
        },
        sms: {
          provider: smsProvider.provider,
          status: 'ok'
        }
      },
      version: process.env.npm_package_version || '1.0.0'
    };
  }

  /**
   * PUBLIC_INTERFACE
   * Check service readiness
   * @returns {boolean} true if ready
   */
  isReady() {
    // Add additional readiness checks as needed
    return true;
  }

  /**
   * PUBLIC_INTERFACE
   * Check service liveness
   * @returns {boolean} true if alive
   */
  isAlive() {
    // Add additional liveness checks as needed
    return true;
  }
}

module.exports = new HealthService();
