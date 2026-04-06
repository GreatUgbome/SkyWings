/**
 * Centralized logging utility for consistent log formatting
 */

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };
  return JSON.stringify(logEntry);
};

const logger = {
  error: (message, error = null, context = {}) => {
    const errorData = error
      ? {
        errorMessage: error.message,
        errorStack: error.stack,
        errorCode: error.code
      }
      : {};
    console.error(formatLog(logLevels.ERROR, message, { ...context, ...errorData }));
  },

  warn: (message, context = {}) => {
    console.warn(formatLog(logLevels.WARN, message, context));
  },

  info: (message, context = {}) => {
    // eslint-disable-next-line no-console
    console.log(formatLog(logLevels.INFO, message, context));
  },

  debug: (message, context = {}) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(formatLog(logLevels.DEBUG, message, context));
    }
  }
};

module.exports = logger;
