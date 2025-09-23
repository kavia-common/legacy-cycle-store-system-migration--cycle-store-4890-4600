'use strict';

/**
 * Service for managing scheduled notifications
 * Note: In production, use a proper job queue system
 */
class SchedulerService {
  constructor() {
    this._tasks = new Map(); // notificationId -> timeout
  }

  /**
   * Schedule a notification for future delivery
   * @param {string} notificationId Notification ID
   * @param {string|Date} date Schedule date/time
   * @param {Function} fn Callback to execute
   */
  schedule(notificationId, date, fn) {
    // Calculate delay in milliseconds
    const scheduleTime = new Date(date).getTime();
    const now = Date.now();
    const delay = Math.max(0, scheduleTime - now);

    // Set timeout for execution
    const timeout = setTimeout(async () => {
      try {
        await fn();
      } catch (error) {
        console.error(`Scheduled task ${notificationId} failed:`, error);
      } finally {
        this._tasks.delete(notificationId);
      }
    }, delay);

    // Store for potential cancellation
    this._tasks.set(notificationId, timeout);
  }

  /**
   * Cancel a scheduled notification
   * @param {string} notificationId Notification ID
   */
  cancel(notificationId) {
    const timeout = this._tasks.get(notificationId);
    if (timeout) {
      clearTimeout(timeout);
      this._tasks.delete(notificationId);
    }
  }
}

module.exports = new SchedulerService();
