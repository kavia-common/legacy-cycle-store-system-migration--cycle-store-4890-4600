const metrics = {
  counters: {},
  gauges: {},
  histograms: {},
  startedAt: new Date().toISOString()
};

function incCounter(name, value = 1) {
  metrics.counters[name] = (metrics.counters[name] || 0) + value;
}
function setGauge(name, value) {
  metrics.gauges[name] = value;
}
function observeHistogram(name, value) {
  if (!metrics.histograms[name]) {
    metrics.histograms[name] = [];
  }
  metrics.histograms[name].push(value);
}

// PUBLIC_INTERFACE
function getMetrics() {
  /** Return shallow copy of metrics for safe read. */
  return {
    ...metrics,
    counters: { ...metrics.counters },
    gauges: { ...metrics.gauges },
    histograms: Object.fromEntries(
      Object.entries(metrics.histograms).map(([k, v]) => [k, [...v]])
    ),
    now: new Date().toISOString()
  };
}

module.exports = {
  incCounter,
  setGauge,
  observeHistogram,
  getMetrics
};
