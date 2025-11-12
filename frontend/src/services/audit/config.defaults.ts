/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Default Configuration
 *
 * This module provides the default configuration settings for the audit logging system,
 * defining operational parameters, security settings, and compliance requirements
 * for HIPAA-compliant healthcare data tracking.
 *
 * @module AuditConfig/Defaults
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * The default configuration manages:
 * - **Performance Tuning**: Batch sizes, intervals, and async operations
 * - **Storage Settings**: Local storage limits and retention policies
 * - **Retry Mechanisms**: Retry attempts, delays, and backoff strategies
 * - **Critical Events**: Actions requiring immediate processing
 * - **PHI Protection**: Automatic PHI detection and classification
 * - **Security Features**: Checksum generation and tamper detection
 * - **Development Support**: Debug logging and console output
 *
 * Key Configuration Areas:
 * - Batching and performance optimization for efficient network utilization
 * - Critical event identification for immediate HIPAA compliance logging
 * - PHI resource classification for proper data protection
 * - Retry mechanisms with exponential backoff for reliability
 * - Security features including checksums for tamper detection
 *
 * @example Basic Configuration Usage
 * ```typescript
 * import { DEFAULT_AUDIT_CONFIG } from './config.defaults';
 *
 * // Get default configuration
 * const config = DEFAULT_AUDIT_CONFIG;
 * console.log('Batch size:', config.batchSize); // 10
 * console.log('Retry delay:', config.retryDelay); // 2000ms
 * ```
 *
 * @example Custom Configuration Override
 * ```typescript
 * import { AuditService } from './AuditService';
 * import { DEFAULT_AUDIT_CONFIG } from './config.defaults';
 *
 * const customConfig = {
 *   ...DEFAULT_AUDIT_CONFIG,
 *   batchSize: 20,
 *   batchInterval: 3000,
 *   enableDebug: true
 * };
 *
 * const auditService = new AuditService(customConfig);
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires HIPAA Compliance Review
 * @requires Security Team Approval for Production Changes
 *
 * @see {@link AuditConfig} for configuration interface
 * @see {@link AuditService} for service implementation
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html|HIPAA Security Rule}
 */

import {
  AuditConfig,
  AuditAction,
  AuditResourceType,
  AuditSeverity,
} from './types';

/**
 * @constant {AuditConfig} DEFAULT_AUDIT_CONFIG
 * @description Default configuration for the audit service, optimized for HIPAA
 * compliance, performance, and security in healthcare environments.
 *
 * This configuration balances:
 * - **Performance**: Efficient batching to minimize backend calls
 * - **Compliance**: Immediate processing of critical events
 * - **Reliability**: Robust retry mechanisms with exponential backoff
 * - **Security**: Tamper detection and PHI protection
 * - **Development**: Debug support and console logging
 *
 * **Batching Strategy:**
 * - Batch size of 10 events for optimal network utilization
 * - 5-second interval to prevent indefinite queuing
 * - Critical events bypass batching for immediate compliance
 *
 * **Retry Strategy:**
 * - Up to 5 retry attempts with exponential backoff
 * - Starting delay of 2 seconds, doubling each retry
 * - Local storage backup for offline resilience
 *
 * **Security Features:**
 * - Checksum generation for tamper detection
 * - Automatic PHI classification
 * - Critical action identification
 *
 * @example Accessing Configuration
 * ```typescript
 * import { DEFAULT_AUDIT_CONFIG } from './config.defaults';
 *
 * console.log('Batch size:', DEFAULT_AUDIT_CONFIG.batchSize); // 10
 * console.log('Retry delay:', DEFAULT_AUDIT_CONFIG.retryDelay); // 2000ms
 * console.log('Debug enabled:', DEFAULT_AUDIT_CONFIG.enableDebug); // true in dev
 * ```
 *
 * @example Custom Configuration Override
 * ```typescript
 * import { AuditService } from './AuditService';
 * import { DEFAULT_AUDIT_CONFIG } from './config.defaults';
 *
 * const customConfig = {
 *   ...DEFAULT_AUDIT_CONFIG,
 *   batchSize: 25,        // Larger batches for high-volume
 *   batchInterval: 3000,  // More frequent flushes
 *   enableDebug: true     // Force debug in production
 * };
 *
 * const service = new AuditService(customConfig);
 * ```
 *
 * @since 1.0.0
 * @readonly
 * @see {@link AuditConfig} for configuration interface details
 * @see {@link AuditService} for service implementation
 */
export const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  // Batching Configuration
  batchSize: 10, // Send batch after 10 events
  batchInterval: 5000, // Or after 5 seconds, whichever comes first

  // Storage Configuration
  maxLocalStorage: 1000, // Store up to 1000 events locally
  localStorageKey: 'whitecross_audit_queue',

  // Retry Configuration
  maxRetries: 5, // Retry up to 5 times
  retryDelay: 2000, // Start with 2 second delay
  retryBackoff: 2, // Double the delay each retry (exponential backoff)

  // Critical Events - Must be logged immediately, never batched
  criticalActions: [
    // Deletions - must be logged immediately
    AuditAction.DELETE,
    AuditAction.DELETE_HEALTH_RECORD,
    AuditAction.DELETE_ALLERGY,
    AuditAction.DELETE_CHRONIC_CONDITION,
    AuditAction.DELETE_VACCINATION,
    AuditAction.DELETE_SCREENING,
    AuditAction.DELETE_GROWTH_MEASUREMENT,
    AuditAction.DELETE_VITAL_SIGNS,
    AuditAction.DELETE_MEDICATION,
    AuditAction.DELETE_STUDENT,

    // Exports - sensitive operations
    AuditAction.EXPORT,
    AuditAction.EXPORT_HEALTH_RECORDS,
    AuditAction.EXPORT_STUDENT_DATA,
    AuditAction.GENERATE_VACCINATION_REPORT,

    // Access denials - security events
    AuditAction.ACCESS_DENIED,

    // Medication administration - critical for patient safety
    AuditAction.ADMINISTER_MEDICATION,
    AuditAction.REPORT_ADVERSE_REACTION,

    // Sensitive mental health access
    AuditAction.VIEW_STUDENT_MENTAL_HEALTH,
  ],

  criticalSeverities: [
    AuditSeverity.CRITICAL,
    AuditSeverity.HIGH,
  ],

  // PHI Protection
  autoDetectPHI: true,
  phiResourceTypes: [
    AuditResourceType.HEALTH_RECORD,
    AuditResourceType.ALLERGY,
    AuditResourceType.CHRONIC_CONDITION,
    AuditResourceType.VACCINATION,
    AuditResourceType.SCREENING,
    AuditResourceType.GROWTH_MEASUREMENT,
    AuditResourceType.VITAL_SIGNS,
    AuditResourceType.MEDICATION,
    AuditResourceType.STUDENT_MEDICATION,
    AuditResourceType.MEDICATION_LOG,
    AuditResourceType.ADVERSE_REACTION,
    AuditResourceType.STUDENT,
  ],

  // Security
  enableChecksum: true, // Enable checksums for tamper detection
  enableSignature: false, // Signatures not implemented yet

  // Performance
  enableAsync: true, // Don't block the UI
  enableCompression: false, // Not implemented yet

  // Development
  enableDebug: process.env.NODE_ENV === 'development' || false,
  enableConsoleLog: process.env.NODE_ENV === 'development' || false,
};
