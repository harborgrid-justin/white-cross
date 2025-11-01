/**
 * Logger - Structured logging infrastructure with PHI sanitization
 *
 * Provides enterprise-grade logging with:
 * - Multiple log levels
 * - Structured output
 * - PHI sanitization (HIPAA compliant)
 * - Remote log shipping
 * - Local console in development
 * - Context preservation
 * - Performance tracking
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: LogContext;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LogContext {
  userId?: string; // Anonymized
  sessionId?: string; // Anonymized
  operation?: string;
  resource?: string;
  correlationId?: string;
  environment?: string;
  version?: string;
}

export interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  remoteApiKey?: string;
  batchSize: number;
  flushInterval: number; // ms
  maxBufferSize: number;
  sanitizePHI: boolean;
}

export interface LogTransport {
  name: string;
  log: (entry: LogEntry) => void | Promise<void>;
}

/**
 * Logger - Centralized logging service
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private context: LogContext = {};
  private transports: LogTransport[] = [];

  // Log level hierarchy
  private readonly levelPriority: Record<LogLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
  };

  // PHI field patterns
  private readonly phiPatterns = [
    /name/i,
    /email/i,
    /phone/i,
    /ssn/i,
    /dob/i,
    /date.*birth/i,
    /address/i,
    /student/i,
    /patient/i,
    /medical/i,
    /diagnosis/i,
    /medication/i,
    /health.*record/i,
    /prescription/i,
    /insurance/i,
  ];

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      level: config.level ?? 'INFO',
      enableConsole: config.enableConsole ?? true,
      enableRemote: config.enableRemote ?? false,
      remoteEndpoint: config.remoteEndpoint,
      remoteApiKey: config.remoteApiKey,
      batchSize: config.batchSize ?? 100,
      flushInterval: config.flushInterval ?? 30000, // 30 seconds
      maxBufferSize: config.maxBufferSize ?? 1000,
      sanitizePHI: config.sanitizePHI ?? true,
    };

    this.context = {
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
    };

    this.setupTransports();

    if (this.config.enabled && this.config.enableRemote) {
      this.startFlushTimer();
    }
  }

  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Set up logging transports
   */
  private setupTransports(): void {
    // Console transport
    if (this.config.enableConsole) {
      this.addTransport({
        name: 'console',
        log: (entry: LogEntry) => {
          const formatted = this.formatConsoleLog(entry);
          switch (entry.level) {
            case 'DEBUG':
              console.debug(formatted);
              break;
            case 'INFO':
              console.info(formatted);
              break;
            case 'WARN':
              console.warn(formatted);
              break;
            case 'ERROR':
            case 'FATAL':
              console.error(formatted);
              break;
          }
        },
      });
    }

    // Remote transport
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.addTransport({
        name: 'remote',
        log: (entry: LogEntry) => {
          this.bufferLog(entry);
        },
      });
    }
  }

  /**
   * Add a custom transport
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport
   */
  public removeTransport(name: string): void {
    this.transports = this.transports.filter((t) => t.name !== name);
  }

  /**
   * Set logging context
   */
  public setContext(context: Partial<LogContext>): void {
    // Anonymize user and session IDs
    if (context.userId) {
      context.userId = this.hashValue(context.userId);
    }
    if (context.sessionId) {
      context.sessionId = this.hashValue(context.sessionId);
    }

    this.context = {
      ...this.context,
      ...context,
    };
  }

  /**
   * Clear context
   */
  public clearContext(): void {
    this.context = {
      environment: this.config.level,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
    };
  }

  /**
   * Create a child logger with additional context
   */
  public createChild(context: Partial<LogContext>): Logger {
    const child = new Logger(this.config);
    child.setContext({
      ...this.context,
      ...context,
    });
    return child;
  }

  // ============================================================================
  // Logging Methods
  // ============================================================================

  public debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('DEBUG', message, metadata);
  }

  public info(message: string, metadata?: Record<string, unknown>): void {
    this.log('INFO', message, metadata);
  }

  public warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('WARN', message, metadata);
  }

  public error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('ERROR', message, metadata, error);
  }

  public fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('FATAL', message, metadata, error);
    this.flush(); // Immediately flush fatal errors
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.config.enabled) return;

    // Check if log level is enabled
    if (this.levelPriority[level] < this.levelPriority[this.config.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message: this.config.sanitizePHI ? this.sanitizeString(message) : message,
      context: { ...this.context },
      metadata: metadata
        ? this.config.sanitizePHI
          ? this.sanitizeObject(metadata)
          : metadata
        : undefined,
      error: error
        ? {
            name: error.name,
            message: this.config.sanitizePHI ? this.sanitizeString(error.message) : error.message,
            stack: this.config.sanitizePHI
              ? this.sanitizeString(error.stack || '')
              : error.stack,
          }
        : undefined,
    };

    // Send to all transports
    this.transports.forEach((transport) => {
      try {
        transport.log(entry);
      } catch (err) {
        console.error(`Failed to log to ${transport.name}:`, err);
      }
    });
  }

  /**
   * Log a structured event
   */
  public event(
    eventName: string,
    properties?: Record<string, unknown>,
    level: LogLevel = 'INFO'
  ): void {
    this.log(level, `Event: ${eventName}`, properties);
  }

  /**
   * Log a performance metric
   */
  public performance(operation: string, durationMs: number, metadata?: Record<string, unknown>): void {
    this.log('INFO', `Performance: ${operation}`, {
      ...metadata,
      durationMs,
      operation,
    });
  }

  /**
   * Log API request
   */
  public apiRequest(method: string, endpoint: string, statusCode: number, durationMs: number): void {
    const level: LogLevel = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';

    this.log(level, `API ${method} ${endpoint}`, {
      method,
      endpoint: this.sanitizeEndpoint(endpoint),
      statusCode,
      durationMs,
    });
  }

  /**
   * Log security event
   */
  public security(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details?: Record<string, unknown>
  ): void {
    const level: LogLevel = severity === 'critical' ? 'FATAL' : severity === 'high' ? 'ERROR' : 'WARN';

    this.log(level, `Security: ${event}`, {
      ...details,
      severity,
      category: 'security',
    });
  }

  /**
   * Log audit event
   */
  public audit(
    action: string,
    resource: string,
    result: 'success' | 'failure',
    details?: Record<string, unknown>
  ): void {
    this.log('INFO', `Audit: ${action} on ${resource}`, {
      ...details,
      action,
      resource,
      result,
      category: 'audit',
    });
  }

  // ============================================================================
  // Sanitization Methods
  // ============================================================================

  /**
   * Sanitize object to remove PHI
   */
  private sanitizeObject(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeValue(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const isPHI = this.phiPatterns.some((pattern) => pattern.test(key));
      sanitized[key] = isPHI ? '[REDACTED]' : this.sanitizeValue(value);
    }
    return sanitized;
  }

  /**
   * Sanitize a value
   */
  private sanitizeValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  /**
   * Sanitize string to remove PHI
   */
  private sanitizeString(str: string): string {
    if (!str) return str;

    // Remove email addresses
    let sanitized = str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');

    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

    // Remove SSN
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');

    // Remove dates (potential DOB)
    sanitized = sanitized.replace(
      /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-]\d{4}\b/g,
      '[DATE]'
    );

    // Remove credit card numbers
    sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]');

    return sanitized;
  }

  /**
   * Sanitize API endpoint to remove IDs
   */
  private sanitizeEndpoint(endpoint: string): string {
    // Replace numeric IDs with placeholder
    return endpoint.replace(/\/\d+/g, '/:id');
  }

  /**
   * Hash a value for anonymization
   */
  private hashValue(value: string): string {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // ============================================================================
  // Remote Logging
  // ============================================================================

  /**
   * Buffer log entry for remote shipping
   */
  private bufferLog(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Auto-flush if buffer is full
    if (this.logBuffer.length >= this.config.batchSize) {
      this.flush();
    }

    // Prevent buffer overflow
    if (this.logBuffer.length > this.config.maxBufferSize) {
      this.logBuffer.shift(); // Remove oldest entry
    }
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Flush logs to remote endpoint
   */
  public async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.remoteApiKey && {
            Authorization: `Bearer ${this.config.remoteApiKey}`,
          }),
        },
        body: JSON.stringify({
          logs: logsToFlush,
          metadata: {
            environment: this.context.environment,
            version: this.context.version,
            timestamp: Date.now(),
          },
        }),
      });

      if (!response.ok) {
        console.error('Failed to ship logs:', response.statusText);
        // Re-buffer failed logs
        this.logBuffer.unshift(...logsToFlush);
      }
    } catch (error) {
      console.error('Error shipping logs:', error);
      // Re-buffer failed logs
      this.logBuffer.unshift(...logsToFlush);
    }
  }

  // ============================================================================
  // Formatting
  // ============================================================================

  /**
   * Format log entry for console output
   */
  private formatConsoleLog(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.padEnd(5);
    const context = entry.context?.operation
      ? `[${entry.context.operation}]`
      : entry.context?.resource
      ? `[${entry.context.resource}]`
      : '';

    let output = `${timestamp} ${level} ${context} ${entry.message}`;

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      output += `\n  ${JSON.stringify(entry.metadata, null, 2)}`;
    }

    if (entry.error) {
      output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack) {
        output += `\n  ${entry.error.stack}`;
      }
    }

    return output;
  }

  /**
   * Get logs in JSON format
   */
  public getLogsJSON(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  /**
   * Get current buffer size
   */
  public getBufferSize(): number {
    return this.logBuffer.length;
  }

  /**
   * Clear log buffer
   */
  public clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Cleanup on shutdown
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush
    this.logBuffer = [];
    this.transports = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions
export const log = {
  debug: (msg: string, meta?: Record<string, unknown>) => logger.debug(msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => logger.info(msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => logger.warn(msg, meta),
  error: (msg: string, err?: Error, meta?: Record<string, unknown>) => logger.error(msg, err, meta),
  fatal: (msg: string, err?: Error, meta?: Record<string, unknown>) => logger.fatal(msg, err, meta),
  event: (name: string, props?: Record<string, unknown>) => logger.event(name, props),
  performance: (op: string, duration: number, meta?: Record<string, unknown>) =>
    logger.performance(op, duration, meta),
  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, unknown>) =>
    logger.security(event, severity, details),
  audit: (action: string, resource: string, result: 'success' | 'failure', details?: Record<string, unknown>) =>
    logger.audit(action, resource, result, details),
};
