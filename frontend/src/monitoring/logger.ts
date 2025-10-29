/**
 * Structured Logging Service
 *
 * Client-side logging with PHI sanitization and log shipping
 */

import { sanitizeObject, sanitizeString } from './utils/phi-sanitizer';
import type { LogEntry, LogLevel } from './types';

// Log storage
const logQueue: LogEntry[] = [];
let logLevel: LogLevel = 'info';
let enableConsole = true;
let enableRemote = true;

// Log level hierarchy
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/**
 * Initialize logger
 */
export function initLogger(config: {
  level?: LogLevel;
  enableConsole?: boolean;
  enableRemote?: boolean;
}): void {
  logLevel = config.level || 'info';
  enableConsole = config.enableConsole !== false;
  enableRemote = config.enableRemote !== false;

  // Auto-flush logs periodically
  if (typeof window !== 'undefined' && enableRemote) {
    setInterval(flushLogs, 30000); // Flush every 30 seconds

    // Flush on page unload
    window.addEventListener('beforeunload', flushLogs);
  }
}

/**
 * Create log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: Error
): LogEntry {
  return {
    level,
    message: sanitizeString(message),
    timestamp: new Date(),
    context: context ? sanitizeObject(context, { strictMode: true }) : undefined,
    error: error ? sanitizeObject(error, { strictMode: true }) as Error : undefined,
    sessionId: getSessionId(),
    traceId: getTraceId(),
  };
}

/**
 * Check if log level should be logged
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[logLevel];
}

/**
 * Log message with specified level
 */
function log(
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: Error
): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context, error);
  logQueue.push(entry);

  // Console output
  if (enableConsole) {
    logToConsole(entry);
  }

  // Auto-flush critical errors
  if (level === 'fatal' || level === 'error') {
    flushLogs();
  }
}

/**
 * Debug level logging
 */
export function debug(message: string, context?: Record<string, any>): void {
  log('debug', message, context);
}

/**
 * Info level logging
 */
export function info(message: string, context?: Record<string, any>): void {
  log('info', message, context);
}

/**
 * Warning level logging
 */
export function warn(message: string, context?: Record<string, any>): void {
  log('warn', message, context);
}

/**
 * Error level logging
 */
export function error(message: string, errorObj?: Error, context?: Record<string, any>): void {
  log('error', message, context, errorObj);
}

/**
 * Fatal level logging
 */
export function fatal(message: string, errorObj?: Error, context?: Record<string, any>): void {
  log('fatal', message, context, errorObj);
}

/**
 * Log to console with proper formatting
 */
function logToConsole(entry: LogEntry): void {
  const timestamp = entry.timestamp.toISOString();
  const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

  switch (entry.level) {
    case 'debug':
      console.debug(prefix, entry.message, entry.context || '');
      break;
    case 'info':
      console.info(prefix, entry.message, entry.context || '');
      break;
    case 'warn':
      console.warn(prefix, entry.message, entry.context || '');
      break;
    case 'error':
    case 'fatal':
      console.error(prefix, entry.message, entry.error || '', entry.context || '');
      break;
  }
}

/**
 * Get current session ID
 */
function getSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
}

/**
 * Get or create trace ID for request correlation
 */
function getTraceId(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  // Try to get from current request context
  const traceId = (window as any).__traceId;
  return traceId || undefined;
}

/**
 * Set trace ID for request correlation
 */
export function setTraceId(traceId: string): void {
  if (typeof window !== 'undefined') {
    (window as any).__traceId = traceId;
  }
}

/**
 * Clear trace ID
 */
export function clearTraceId(): void {
  if (typeof window !== 'undefined') {
    delete (window as any).__traceId;
  }
}

/**
 * Get all logs
 */
export function getLogs(): LogEntry[] {
  return [...logQueue];
}

/**
 * Get logs by level
 */
export function getLogsByLevel(level: LogLevel): LogEntry[] {
  return logQueue.filter((entry) => entry.level === level);
}

/**
 * Get logs by time range
 */
export function getLogsByTimeRange(start: Date, end: Date): LogEntry[] {
  return logQueue.filter(
    (entry) => entry.timestamp >= start && entry.timestamp <= end
  );
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  logQueue.length = 0;
}

/**
 * Flush logs to backend
 */
export async function flushLogs(): Promise<void> {
  if (!enableRemote || logQueue.length === 0) return;

  const logs = [...logQueue];
  logQueue.length = 0;

  try {
    const response = await fetch('/api/monitoring/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs }),
    });

    if (!response.ok) {
      console.error('Failed to send logs:', response.statusText);
      // Re-add logs to queue
      logQueue.push(...logs);
    }
  } catch (err) {
    console.error('Error sending logs:', err);
    // Re-add logs to queue
    logQueue.push(...logs);
  }
}

/**
 * Export logs as JSON
 */
export function exportLogs(): string {
  return JSON.stringify(logQueue, null, 2);
}

/**
 * Import logs from JSON
 */
export function importLogs(json: string): void {
  try {
    const logs = JSON.parse(json);
    if (Array.isArray(logs)) {
      logQueue.push(...logs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp),
      })));
    }
  } catch (err) {
    console.error('Failed to import logs:', err);
  }
}

/**
 * Create child logger with context
 */
export function createChildLogger(context: Record<string, any>) {
  const sanitizedContext = sanitizeObject(context, { strictMode: true });

  return {
    debug: (message: string, additionalContext?: Record<string, any>) =>
      debug(message, { ...sanitizedContext, ...additionalContext }),

    info: (message: string, additionalContext?: Record<string, any>) =>
      info(message, { ...sanitizedContext, ...additionalContext }),

    warn: (message: string, additionalContext?: Record<string, any>) =>
      warn(message, { ...sanitizedContext, ...additionalContext }),

    error: (message: string, errorObj?: Error, additionalContext?: Record<string, any>) =>
      error(message, errorObj, { ...sanitizedContext, ...additionalContext }),

    fatal: (message: string, errorObj?: Error, additionalContext?: Record<string, any>) =>
      fatal(message, errorObj, { ...sanitizedContext, ...additionalContext }),
  };
}

/**
 * Healthcare-specific logging
 */
export const healthcare = {
  /**
   * Log medication administration
   */
  medicationAdministered: (medicationId: string, success: boolean) => {
    info('Medication administered', {
      category: 'healthcare',
      medication_id: medicationId,
      success,
    });
  },

  /**
   * Log medication error
   */
  medicationError: (medicationId: string, errorType: string, errorObj?: Error) => {
    error('Medication administration error', errorObj, {
      category: 'healthcare',
      medication_id: medicationId,
      error_type: errorType,
    });
  },

  /**
   * Log PHI access
   */
  phiAccessed: (resourceType: string, resourceId: string, action: string) => {
    info('PHI accessed', {
      category: 'security',
      resource_type: resourceType,
      resource_id: resourceId,
      action,
    });
  },

  /**
   * Log health record update
   */
  healthRecordUpdated: (recordId: string, recordType: string, fields: string[]) => {
    info('Health record updated', {
      category: 'healthcare',
      record_id: recordId,
      record_type: recordType,
      fields_updated: fields,
    });
  },

  /**
   * Log compliance violation
   */
  complianceViolation: (violationType: string, severity: string) => {
    warn('Compliance violation detected', {
      category: 'security',
      violation_type: violationType,
      severity,
    });
  },

  /**
   * Log emergency alert
   */
  emergencyAlert: (alertType: string, severity: string) => {
    error('Emergency alert triggered', undefined, {
      category: 'healthcare',
      alert_type: alertType,
      severity,
    });
  },
};

export default {
  initLogger,
  debug,
  info,
  warn,
  error,
  fatal,
  setTraceId,
  clearTraceId,
  getLogs,
  getLogsByLevel,
  getLogsByTimeRange,
  clearLogs,
  flushLogs,
  exportLogs,
  importLogs,
  createChildLogger,
  healthcare,
};
