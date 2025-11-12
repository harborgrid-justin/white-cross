/**
 * Type definitions for Enterprise Decorators
 */

import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Log levels for enterprise logging
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Cache TTL in seconds */
  ttl?: number;
  /** Cache key prefix */
  keyPrefix?: string;
  /** Whether to cache null values */
  cacheNulls?: boolean;
  /** Custom cache key generator */
  keyGenerator?: (context: ExecutionContext) => string;
}

/**
 * Validation options for enterprise validation
 */
export interface ValidationOptions {
  /** Whether to skip validation for certain conditions */
  skipValidation?: (context: ExecutionContext) => boolean;
  /** Custom error messages */
  errorMessages?: Record<string, string>;
  /** Validation groups */
  groups?: string[];
}

/**
 * Performance monitoring options
 */
export interface PerformanceOptions {
  /** Whether to log slow operations */
  logSlowOperations?: boolean;
  /** Slow operation threshold in milliseconds */
  slowThreshold?: number;
  /** Custom metrics tags */
  tags?: Record<string, string>;
}

/**
 * Transaction options for database operations
 */
export interface TransactionOptions {
  /** Transaction isolation level */
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
  /** Transaction timeout in milliseconds */
  timeout?: number;
  /** Whether to retry on deadlock */
  retryOnDeadlock?: boolean;
  /** Maximum retry attempts */
  maxRetries?: number;
}

/**
 * Audit logging options for HIPAA compliance
 */
export interface AuditOptions {
  /** Audit event type */
  eventType: string;
  /** Whether this operation contains PHI */
  containsPHI?: boolean;
  /** Custom audit data extractor */
  dataExtractor?: (context: ExecutionContext) => Record<string, any>;
  /** Audit log level */
  level?: LogLevel;
}

/**
 * Enhanced request interface with enterprise context
 */
export interface EnterpriseRequest extends Request {
  /** Correlation ID for request tracing */
  correlationId?: string;
  /** User context */
  userContext?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
  /** Request start time for performance monitoring */
  startTime?: number;
  /** Audit trail */
  auditTrail?: Array<{
    timestamp: Date;
    action: string;
    resource: string;
    details?: Record<string, any>;
  }>;
}

/**
 * Decorator metadata storage
 */
export interface DecoratorMetadata {
  logging?: {
    level: LogLevel;
    includeArgs: boolean;
    includeResult: boolean;
  };
  caching?: CacheOptions;
  validation?: ValidationOptions;
  performance?: PerformanceOptions;
  transaction?: TransactionOptions;
  audit?: AuditOptions;
}