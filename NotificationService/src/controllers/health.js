'use strict';

const healthService = require('../services/health');

class HealthController {
  /**
   * PUBLIC_INTERFACE
   * Check service health
   */
  check(req, res) {
    const health = healthService.getStatus();
    return res.status(200).json(health);
  }

  /**
   * PUBLIC_INTERFACE
   * Kubernetes readiness probe
   */
  ready(req, res) {
    if (healthService.isReady()) {
      return res.status(200).json({ status: 'ready' });
    }
    return res.status(503).json({ status: 'not ready' });
  }

  /**
   * PUBLIC_INTERFACE
   * Kubernetes liveness probe
   */
  live(req, res) {
    if (healthService.isAlive()) {
      return res.status(200).json({ status: 'alive' });
    }
    return res.status(503).json({ status: 'not alive' });
  }
}

module.exports = new HealthController();
