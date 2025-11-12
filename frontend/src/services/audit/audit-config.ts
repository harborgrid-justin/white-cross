/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Configuration Type Definitions
 *
 * This module provides the comprehensive configuration interface for the audit service,
 * defining operational parameters, security settings, and compliance requirements.
 *
 * @module AuditConfig
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The audit configuration interface defines:
 * - **Batching Configuration**: Performance optimization settings
 * - **Storage Configuration**: Local persistence parameters
 * - **Retry Configuration**: Fault tolerance mechanisms
 * - **Critical Events**: Immediate processing requirements
 * - **PHI Protection**: Automatic classification settings
 * - **Security**: Tamper detection and integrity features
 * - **Performance**: Async processing and optimization
 * - **Development**: Debug and logging support
 *
 * @example Production Configuration
 * ```typescript
 * import { AuditConfig } from './audit-config';
 *
 * const config: AuditConfig = {
 *   batchSize: 10,
 *   batchInterval: 5000,
 *   maxLocalStorage: 1000,
 *   enableChecksum: true,
 *   autoDetectPHI: true,
 *   enableDebug: false
 * };
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires TypeScript 4.5+
 * @requires HIPAA Compliance Review
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

import { AuditAction, AuditResourceType, AuditSeverity } from './action-types';

// ==========================================
// SERVICE CONFIGURATION
// ==========================================

/**
 * @interface AuditConfig
 * @description Comprehensive configuration for the audit service, defining operational
 * parameters, security settings, and compliance requirements.
 *
 * **Configuration Categories:**
 * - **Batching**: Performance optimization through event grouping
 * - **Storage**: Local persistence for offline capability
 * - **Retry**: Fault tolerance and reliability mechanisms
 * - **Critical Events**: Immediate processing for compliance
 * - **PHI Protection**: Automatic classification and handling
 * - **Security**: Tamper detection and data integrity
 * - **Performance**: Async processing and optimization
 * - **Development**: Debug and logging support
 *
 * @example Production Configuration
 * ```typescript
 * const productionConfig: AuditConfig = {
 *   batchSize: 10,
 *   batchInterval: 5000,
 *   maxLocalStorage: 1000,
 *   localStorageKey: 'audit_queue',
 *   maxRetries: 5,
 *   retryDelay: 2000,
 *   retryBackoff: 2,
 *   criticalActions: [AuditAction.DELETE_HEALTH_RECORD, ...],
 *   criticalSeverities: [AuditSeverity.CRITICAL, AuditSeverity.HIGH],
 *   autoDetectPHI: true,
 *   phiResourceTypes: [AuditResourceType.HEALTH_RECORD, ...],
 *   enableChecksum: true,
 *   enableSignature: false,
 *   enableAsync: true,
 *   enableCompression: false,
 *   enableDebug: false,
 *   enableConsoleLog: false
 * };
 * ```
 *
 * @example Development Configuration
 * ```typescript
 * const devConfig: AuditConfig = {
 *   ...productionConfig,
 *   batchSize: 5,          // Smaller batches for testing
 *   batchInterval: 2000,   // More frequent flushes
 *   enableDebug: true,     // Detailed logging
 *   enableConsoleLog: true // Console output
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link DEFAULT_AUDIT_CONFIG} for default configuration values
 */
export interface AuditConfig {
  // ==========================================
  // BATCHING CONFIGURATION
  // ==========================================

  /**
   * Number of events to accumulate before sending batch to backend.
   * Higher values reduce network calls but increase memory usage.
   * @default 10
   * @range 1-100
   */
  batchSize: number;

  /**
   * Maximum time (ms) to wait before sending batch, even if not full.
   * Prevents indefinite queuing of events in low-activity periods.
   * @default 5000
   * @range 1000-60000
   */
  batchInterval: number;

  // ==========================================
  // STORAGE CONFIGURATION
  // ==========================================

  /**
   * Maximum number of events to store in local storage for offline support.
   * Prevents unlimited storage growth. Oldest events are discarded when full.
   * @default 1000
   * @range 100-10000
   */
  maxLocalStorage: number;

  /**
   * LocalStorage key for persisting queued events.
   * Should be unique per application to avoid conflicts.
   * @default 'whitecross_audit_queue'
   */
  localStorageKey: string;

  // ==========================================
  // RETRY CONFIGURATION
  // ==========================================

  /**
   * Maximum number of retry attempts for failed batch submissions.
   * After max retries, events are persisted locally for later sync.
   * @default 5
   * @range 0-10
   */
  maxRetries: number;

  /**
   * Initial delay (ms) before first retry attempt.
   * Used with retryBackoff for exponential backoff strategy.
   * @default 2000
   * @range 500-10000
   */
  retryDelay: number;

  /**
   * Backoff multiplier for retry delays.
   * Each retry waits (retryDelay * retryBackoff^attemptNumber) ms.
   * @default 2
   * @range 1-5
   */
  retryBackoff: number;

  // ==========================================
  // CRITICAL EVENT CONFIGURATION
  // ==========================================

  /**
   * Actions that must be logged immediately, bypassing batch queue.
   * Critical for compliance and security (deletions, exports, denials).
   * @example [AuditAction.DELETE_HEALTH_RECORD, AuditAction.ACCESS_DENIED]
   */
  criticalActions: AuditAction[];

  /**
   * Severity levels that require immediate processing.
   * Events with these severities bypass normal batching.
   * @example [AuditSeverity.CRITICAL, AuditSeverity.HIGH]
   */
  criticalSeverities: AuditSeverity[];

  // ==========================================
  // PHI PROTECTION CONFIGURATION
  // ==========================================

  /**
   * Automatically detect and flag PHI resources based on resource type.
   * When true, uses phiResourceTypes map for classification.
   * @default true
   */
  autoDetectPHI: boolean;

  /**
   * Resource types that contain Protected Health Information.
   * Used for automatic PHI classification when autoDetectPHI is true.
   * @example [AuditResourceType.HEALTH_RECORD, AuditResourceType.STUDENT]
   */
  phiResourceTypes: AuditResourceType[];

  // ==========================================
  // SECURITY CONFIGURATION
  // ==========================================

  /**
   * Generate checksums for audit events to detect tampering.
   * Checksums are calculated from event data using SHA-256.
   * @default true
   * @compliance HIPAA requires audit log integrity
   */
  enableChecksum: boolean;

  /**
   * Generate digital signatures for audit events (if available).
   * Requires certificate configuration. Not yet implemented.
   * @default false
   * @future Planned feature
   */
  enableSignature: boolean;

  // ==========================================
  // PERFORMANCE CONFIGURATION
  // ==========================================

  /**
   * Use asynchronous logging to avoid blocking UI operations.
   * When true, log() returns immediately; events are queued.
   * @default true
   * @recommended true for production
   */
  enableAsync: boolean;

  /**
   * Compress batch payloads before sending to backend.
   * Reduces bandwidth usage for large batches. Not yet implemented.
   * @default false
   * @future Planned feature
   */
  enableCompression: boolean;

  // ==========================================
  // DEVELOPMENT CONFIGURATION
  // ==========================================

  /**
   * Enable detailed debug logging for troubleshooting.
   * Should be false in production to avoid performance impact.
   * @default false (true in development)
   */
  enableDebug: boolean;

  /**
   * Log audit events to browser console for development.
   * Should be false in production for security.
   * @default false (true in development)
   */
  enableConsoleLog: boolean;
}
