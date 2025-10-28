/**
 * LOC: D79D503133
 * WC-GEN-316 | logger.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - auditLogService.ts (services/audit/auditLogService.ts)
 *   - auditQueryService.ts (services/audit/auditQueryService.ts)
 *   - auditStatisticsService.ts (services/audit/auditStatisticsService.ts)
 *   - auditUtilsService.ts (services/audit/auditUtilsService.ts)
 *   - complianceReportingService.ts (services/audit/complianceReportingService.ts)
 *   - ... and 12 more
 */

/**
 * WC-GEN-316 | logger.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: winston
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import * as winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // If there's a stack trace, include it
    if (stack) {
      log += `\n${stack}`;
    }
    
    // If there's additional metadata, include it
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'white-cross-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  baseLogger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Create a custom logger wrapper with proper error handling
export const logger = {
  info: baseLogger.info.bind(baseLogger),
  warn: baseLogger.warn.bind(baseLogger),
  debug: baseLogger.debug.bind(baseLogger),
  error: (message: string, error?: Error | unknown) => {
    if (error instanceof Error) {
      baseLogger.error(message, { error: error.message, stack: error.stack });
    } else if (error && typeof error === 'object') {
      baseLogger.error(message, { error: JSON.stringify(error) });
    } else if (error) {
      baseLogger.error(`${message} ${error}`);
    } else {
      baseLogger.error(message);
    }
  }
};

export default logger;
