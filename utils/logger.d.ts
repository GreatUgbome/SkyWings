export interface LogContext {
  [key: string]: any;
}

export interface Logger {
  error(message: string, error?: Error | null, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

declare const logger: Logger;

export = logger;
