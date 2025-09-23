'use strict';

class SchedulerService {
  constructor() {
    this._tasks = new Map(); // id -> timeout
  }

  schedule(id, date, fn) {
    const delay = Math.max(0, new Date(date).getTime() - Date.now());
    const to = setTimeout(async () => {
      try {
        await fn();
      } finally {
        this._tasks.delete(id);
      }
    }, delay);
    this._tasks.set(id, to);
  }

  cancel(id) {
    const to = this._tasks.get(id);
    if (to) {
      clearTimeout(to);
      this._tasks.delete(id);
    }
  }
}

module.exports = new SchedulerService();
