/**
 * Error Handler & Logger for DANETUDES
 * Centralised error management and logging
 */

(function() {
  'use strict';

  // Configuration
  const DEBUG_MODE = false; // Set to true for development
  const LOG_ENDPOINT = '/logs/submit'; // Optional: send logs to backend

  // Log levels
  const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
  };

  // Storage for logs
  let logs = [];
  const MAX_LOGS = 50; // Keep last 50 logs

  /**
   * Log a message
   */
  function log(message, level = 'INFO', data = null) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    logs.push(entry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    if (DEBUG_MODE || level === 'ERROR' || level === 'FATAL') {
      const style = getLogStyle(level);
      console.log(`%c[${level}] ${message}`, style, data || '');
    }

    return entry;
  }

  /**
   * Get console style for log level
   */
  function getLogStyle(level) {
    const styles = {
      DEBUG: 'color: gray; font-size: 12px;',
      INFO: 'color: blue; font-size: 12px;',
      WARN: 'color: orange; font-size: 12px; font-weight: bold;',
      ERROR: 'color: red; font-size: 14px; font-weight: bold;',
      FATAL: 'color: darkred; font-size: 16px; font-weight: bold; background: yellow;'
    };
    return styles[level] || styles.INFO;
  }

  /**
   * Global error handler
   */
  window.addEventListener('error', (event) => {
    log(`Uncaught error: ${event.message}`, 'ERROR', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  /**
   * Unhandled promise rejection
   */
  window.addEventListener('unhandledrejection', (event) => {
    log(`Unhandled promise rejection: ${event.reason}`, 'FATAL', event.reason);
  });

  /**
   * Network error handler
   */
  window.addEventListener('offline', () => {
    log('Network offline', 'WARN');
  });

  window.addEventListener('online', () => {
    log('Network online', 'INFO');
  });

  /**
   * Send logs to server (optional)
   */
  function sendLogs() {
    if (!LOG_ENDPOINT || logs.length === 0) return;

    // Only send errors and above
    const criticalLogs = logs.filter(l => 
      LOG_LEVELS[l.level] >= LOG_LEVELS.WARN
    );

    if (criticalLogs.length === 0) return;

    try {
      fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: criticalLogs })
      }).catch(e => console.error('Failed to send logs:', e));
    } catch (e) {
      console.error('Error sending logs:', e);
    }
  }

  /**
   * Send logs on page unload
   */
  window.addEventListener('beforeunload', sendLogs);

  /**
   * Performance monitoring
   */
  function monitorPerformance() {
    if (!window.performance) return;

    window.addEventListener('load', () => {
      const perf = window.performance.timing;
      const loadTime = perf.loadEventEnd - perf.navigationStart;
      log(`Page load time: ${loadTime}ms`, 'INFO');

      // Check if load time is too high
      if (loadTime > 3000) {
        log(`Slow page load detected: ${loadTime}ms`, 'WARN');
      }
    });
  }

  /**
   * Public API
   */
  window.Logger = {
    debug: (msg, data) => log(msg, 'DEBUG', data),
    info: (msg, data) => log(msg, 'INFO', data),
    warn: (msg, data) => log(msg, 'WARN', data),
    error: (msg, data) => log(msg, 'ERROR', data),
    fatal: (msg, data) => log(msg, 'FATAL', data),
    getLogs: () => [...logs],
    clearLogs: () => { logs = []; },
    sendLogs: sendLogs
  };

  // Initialize
  log('Logger initialized', 'DEBUG');
  monitorPerformance();
})();
