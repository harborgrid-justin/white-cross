/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Type Definitions
 * 
 * This module provides comprehensive TypeScript type definitions for a HIPAA-compliant
 * audit logging system. It defines all interfaces, enums, and types needed to track
 * Protected Health Information (PHI) access and modifications in healthcare applications.
 *
 * @module AuditTypes
 * @version 1.0.0
 * @since 2025-10-21
 * 
 * @description
 * The audit logging system ensures HIPAA compliance by capturing:
 * - **WHO**: User identification and authentication details
 * - **WHAT**: Specific actions performed on resources
 * - **WHEN**: Precise timestamps for all operations
 * - **WHERE**: Device and location context
 * - **WHY**: Business justification and context
 * - **HOW**: Method of access and technical details
 * 
 * Key Features:
 * - Comprehensive audit action enumeration covering all PHI operations
 * - Tamper-evident logging with checksum validation
 * - Complete change tracking for data modifications
 * - Configurable severity levels and criticality handling
 * - Batch processing support for performance optimization
 * - Local storage backup for offline capability
 * - Extensive metadata capture for compliance reporting
 * 
 * @example Basic Usage
 * ```typescript
 * import { AuditEvent, AuditAction, AuditResourceType } from './types';
 * 
 * const event: AuditEvent = {
 *   userId: 'user123',
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   resourceId: 'record456',
 *   timestamp: new Date().toISOString(),
 *   status: AuditStatus.SUCCESS,
 *   isPHI: true,
 *   isHIPAACompliant: true,
 *   severity: AuditSeverity.MEDIUM
 * };
 * ```
 * 
 * @example Change Tracking
 * ```typescript
 * const changes: AuditChange[] = [
 *   {
 *     field: 'allergies',
 *     oldValue: ['Peanuts'],
 *     newValue: ['Peanuts', 'Shellfish'],
 *     type: 'UPDATE'
 *   }
 * ];
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
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html|HIPAA Privacy Rule}
 */

// ==========================================
// AUDIT ACTION TYPES
// ==========================================

/**
 * @enum {string} AuditAction
 * @description Comprehensive enumeration of all audit actions covering PHI operations
 * and system interactions. Each action represents a specific operation that requires
 * audit logging for HIPAA compliance.
 * 
 * Actions are categorized by:
 * - **CRUD Operations**: CREATE, READ, UPDATE, DELETE
 * - **Access Control**: VIEW, ACCESS_ATTEMPT, ACCESS_DENIED
 * - **PHI Specific**: Health records, allergies, medications, etc.
 * - **Administrative**: Exports, imports, transfers, bulk operations
 * 
 * @example
 * ```typescript
 * // Log a health record view
 * await auditService.log({
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   resourceId: 'rec123'
 * });
 * ```
 * 
 * @since 1.0.0
 * @readonly
 */
export enum AuditAction {
  // Health Records
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PRINT = 'PRINT',

  // Access Control
  VIEW = 'VIEW',
  ACCESS_ATTEMPT = 'ACCESS_ATTEMPT',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // Specific PHI Operations
  VIEW_HEALTH_RECORDS = 'VIEW_HEALTH_RECORDS',
  VIEW_HEALTH_RECORD = 'VIEW_HEALTH_RECORD',
  CREATE_HEALTH_RECORD = 'CREATE_HEALTH_RECORD',
  UPDATE_HEALTH_RECORD = 'UPDATE_HEALTH_RECORD',
  DELETE_HEALTH_RECORD = 'DELETE_HEALTH_RECORD',
  EXPORT_HEALTH_RECORDS = 'EXPORT_HEALTH_RECORDS',
  IMPORT_HEALTH_RECORDS = 'IMPORT_HEALTH_RECORDS',

  // Allergies
  VIEW_ALLERGIES = 'VIEW_ALLERGIES',
  VIEW_ALLERGY = 'VIEW_ALLERGY',
  CREATE_ALLERGY = 'CREATE_ALLERGY',
  UPDATE_ALLERGY = 'UPDATE_ALLERGY',
  DELETE_ALLERGY = 'DELETE_ALLERGY',
  VERIFY_ALLERGY = 'VERIFY_ALLERGY',
  VIEW_CRITICAL_ALLERGIES = 'VIEW_CRITICAL_ALLERGIES',
  CHECK_CONTRAINDICATIONS = 'CHECK_CONTRAINDICATIONS',

  // Chronic Conditions
  VIEW_CHRONIC_CONDITIONS = 'VIEW_CHRONIC_CONDITIONS',
  VIEW_CHRONIC_CONDITION = 'VIEW_CHRONIC_CONDITION',
  CREATE_CHRONIC_CONDITION = 'CREATE_CHRONIC_CONDITION',
  UPDATE_CHRONIC_CONDITION = 'UPDATE_CHRONIC_CONDITION',
  DELETE_CHRONIC_CONDITION = 'DELETE_CHRONIC_CONDITION',
  UPDATE_CONDITION_STATUS = 'UPDATE_CONDITION_STATUS',
  VIEW_ACTIVE_CONDITIONS = 'VIEW_ACTIVE_CONDITIONS',

  // Vaccinations
  VIEW_VACCINATIONS = 'VIEW_VACCINATIONS',
  VIEW_VACCINATION = 'VIEW_VACCINATION',
  CREATE_VACCINATION = 'CREATE_VACCINATION',
  UPDATE_VACCINATION = 'UPDATE_VACCINATION',
  DELETE_VACCINATION = 'DELETE_VACCINATION',
  CHECK_VACCINATION_COMPLIANCE = 'CHECK_VACCINATION_COMPLIANCE',
  VIEW_UPCOMING_VACCINATIONS = 'VIEW_UPCOMING_VACCINATIONS',
  GENERATE_VACCINATION_REPORT = 'GENERATE_VACCINATION_REPORT',

  // Screenings
  VIEW_SCREENINGS = 'VIEW_SCREENINGS',
  VIEW_SCREENING = 'VIEW_SCREENING',
  CREATE_SCREENING = 'CREATE_SCREENING',
  UPDATE_SCREENING = 'UPDATE_SCREENING',
  DELETE_SCREENING = 'DELETE_SCREENING',

  // Growth Measurements
  VIEW_GROWTH_MEASUREMENTS = 'VIEW_GROWTH_MEASUREMENTS',
  VIEW_GROWTH_MEASUREMENT = 'VIEW_GROWTH_MEASUREMENT',
  CREATE_GROWTH_MEASUREMENT = 'CREATE_GROWTH_MEASUREMENT',
  UPDATE_GROWTH_MEASUREMENT = 'UPDATE_GROWTH_MEASUREMENT',
  DELETE_GROWTH_MEASUREMENT = 'DELETE_GROWTH_MEASUREMENT',
  VIEW_GROWTH_TRENDS = 'VIEW_GROWTH_TRENDS',
  VIEW_GROWTH_CONCERNS = 'VIEW_GROWTH_CONCERNS',
  CALCULATE_PERCENTILES = 'CALCULATE_PERCENTILES',

  // Vital Signs
  VIEW_VITAL_SIGNS = 'VIEW_VITAL_SIGNS',
  CREATE_VITAL_SIGNS = 'CREATE_VITAL_SIGNS',
  UPDATE_VITAL_SIGNS = 'UPDATE_VITAL_SIGNS',
  DELETE_VITAL_SIGNS = 'DELETE_VITAL_SIGNS',
  VIEW_LATEST_VITALS = 'VIEW_LATEST_VITALS',
  VIEW_VITAL_TRENDS = 'VIEW_VITAL_TRENDS',

  // Medications
  VIEW_MEDICATIONS = 'VIEW_MEDICATIONS',
  VIEW_MEDICATION = 'VIEW_MEDICATION',
  CREATE_MEDICATION = 'CREATE_MEDICATION',
  UPDATE_MEDICATION = 'UPDATE_MEDICATION',
  DELETE_MEDICATION = 'DELETE_MEDICATION',
  ASSIGN_MEDICATION = 'ASSIGN_MEDICATION',
  ADMINISTER_MEDICATION = 'ADMINISTER_MEDICATION',
  DEACTIVATE_MEDICATION = 'DEACTIVATE_MEDICATION',
  VIEW_MEDICATION_LOGS = 'VIEW_MEDICATION_LOGS',
  VIEW_MEDICATION_SCHEDULE = 'VIEW_MEDICATION_SCHEDULE',
  REPORT_ADVERSE_REACTION = 'REPORT_ADVERSE_REACTION',
  VIEW_ADVERSE_REACTIONS = 'VIEW_ADVERSE_REACTIONS',

  // Inventory
  VIEW_INVENTORY = 'VIEW_INVENTORY',
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  ADD_TO_INVENTORY = 'ADD_TO_INVENTORY',

  // Students
  VIEW_STUDENT = 'VIEW_STUDENT',
  VIEW_STUDENTS = 'VIEW_STUDENTS',
  CREATE_STUDENT = 'CREATE_STUDENT',
  UPDATE_STUDENT = 'UPDATE_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',
  DEACTIVATE_STUDENT = 'DEACTIVATE_STUDENT',
  REACTIVATE_STUDENT = 'REACTIVATE_STUDENT',
  TRANSFER_STUDENT = 'TRANSFER_STUDENT',
  EXPORT_STUDENT_DATA = 'EXPORT_STUDENT_DATA',
  VIEW_STUDENT_HEALTH_RECORDS = 'VIEW_STUDENT_HEALTH_RECORDS',
  VIEW_STUDENT_MENTAL_HEALTH = 'VIEW_STUDENT_MENTAL_HEALTH',
  BULK_UPDATE_STUDENTS = 'BULK_UPDATE_STUDENTS',

  // Summary Views
  VIEW_HEALTH_SUMMARY = 'VIEW_HEALTH_SUMMARY',
  VIEW_HEALTH_TIMELINE = 'VIEW_HEALTH_TIMELINE',
}

/**
 * @enum {string} AuditResourceType  
 * @description Enumeration of all resource types that can be audited in the system.
 * These types correspond to different data entities and are used to categorize
 * audit events for reporting and compliance tracking.
 * 
 * Resource types are automatically mapped to PHI classification based on
 * the RESOURCE_PHI_MAP configuration. PHI resources require additional
 * security measures and audit detail.
 * 
 * @example
 * ```typescript
 * // Check if a resource type contains PHI
 * const isPHI = isResourcePHI(AuditResourceType.HEALTH_RECORD); // true
 * const isNotPHI = isResourcePHI(AuditResourceType.INVENTORY); // false
 * ```
 * 
 * @since 1.0.0
 * @readonly
 * @see {@link RESOURCE_PHI_MAP} for PHI classification mapping
 */
export enum AuditResourceType {
  HEALTH_RECORD = 'HEALTH_RECORD',
  ALLERGY = 'ALLERGY',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION',
  VACCINATION = 'VACCINATION',
  SCREENING = 'SCREENING',
  GROWTH_MEASUREMENT = 'GROWTH_MEASUREMENT',
  VITAL_SIGNS = 'VITAL_SIGNS',
  MEDICATION = 'MEDICATION',
  STUDENT_MEDICATION = 'STUDENT_MEDICATION',
  MEDICATION_LOG = 'MEDICATION_LOG',
  ADVERSE_REACTION = 'ADVERSE_REACTION',
  INVENTORY = 'INVENTORY',
  STUDENT = 'STUDENT',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  DOCUMENT = 'DOCUMENT',
  REPORT = 'REPORT',
  EXPORT = 'EXPORT',
}

/**
 * @enum {string} AuditSeverity
 * @description Severity levels for audit events, determining priority and handling.
 * Higher severity events may trigger immediate alerts, require immediate flush
 * to backend, or demand manual review.
 * 
 * **Severity Levels:**
 * - **LOW**: Routine operations, bulk logged
 * - **MEDIUM**: Important operations, normal processing
 * - **HIGH**: Sensitive operations, priority handling
 * - **CRITICAL**: Security events, immediate attention required
 * 
 * @example
 * ```typescript
 * // Critical events are flushed immediately
 * const isCritical = isCriticalSeverity(AuditSeverity.CRITICAL); // true
 * 
 * // Get default severity for an action
 * const severity = getActionSeverity(AuditAction.DELETE_HEALTH_RECORD); // CRITICAL
 * ```
 * 
 * @since 1.0.0
 * @readonly
 * @see {@link ACTION_SEVERITY_MAP} for action-to-severity mapping
 */
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * @enum {string} AuditStatus
 * @description Status values indicating the outcome of an audited operation.
 * Used to track both successful operations and various failure modes
 * for compliance reporting and system monitoring.
 * 
 * **Status Values:**
 * - **SUCCESS**: Operation completed successfully
 * - **FAILURE**: Operation failed due to business logic or validation
 * - **PENDING**: Operation in progress (async operations)
 * - **QUEUED**: Operation queued for processing
 * - **ERROR**: Technical error occurred during operation
 * 
 * @example
 * ```typescript
 * // Log successful operation
 * await auditService.logSuccess({
 *   action: AuditAction.CREATE_ALLERGY,
 *   resourceType: AuditResourceType.ALLERGY,
 *   status: AuditStatus.SUCCESS // automatically set by logSuccess
 * });
 * 
 * // Log failed operation
 * await auditService.logFailure(params, error);
 * ```
 * 
 * @since 1.0.0
 * @readonly
 */
export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  ERROR = 'ERROR',
}

// ==========================================
// CORE AUDIT INTERFACES
// ==========================================

/**
 * @interface AuditEvent
 * @description Complete audit event structure capturing comprehensive information
 * for HIPAA compliance. This is the core data structure that represents a single
 * auditable operation in the healthcare system.
 * 
 * The audit event follows the "5 W's and H" framework:
 * - **WHO**: User identification and role information
 * - **WHAT**: Action performed and resource affected
 * - **WHEN**: Precise timestamps for compliance tracking
 * - **WHERE**: Device, location, and network context
 * - **WHY**: Business reason and contextual information
 * - **HOW**: Technical method and implementation details
 * 
 * **Key Features:**
 * - Tamper-evident checksums for data integrity
 * - Complete change tracking for PHI modifications
 * - Hierarchical severity classification
 * - Local caching for offline resilience
 * - Extensible metadata for custom requirements
 * 
 * @example Complete Audit Event
 * ```typescript
 * const event: AuditEvent = {
 *   id: 'audit_1698765432_abc123',
 *   sessionId: 'session_1698765000_xyz789',
 *   userId: 'nurse_456',
 *   userEmail: 'jane.doe@school.edu',
 *   userName: 'Jane Doe',
 *   userRole: 'School Nurse',
 *   action: AuditAction.UPDATE_ALLERGY,
 *   resourceType: AuditResourceType.ALLERGY,
 *   resourceId: 'allergy_789',
 *   resourceIdentifier: 'Peanut Allergy - John Smith',
 *   timestamp: '2025-10-21T14:30:32.123Z',
 *   ipAddress: '10.1.2.3',
 *   userAgent: 'Mozilla/5.0...',
 *   method: 'UI',
 *   status: AuditStatus.SUCCESS,
 *   changes: [{
 *     field: 'severity',
 *     oldValue: 'moderate',
 *     newValue: 'severe',
 *     type: 'UPDATE'
 *   }],
 *   isPHI: true,
 *   isHIPAACompliant: true,
 *   severity: AuditSeverity.HIGH,
 *   studentId: 'student_123',
 *   checksum: 'abc123def456',
 *   localTimestamp: 1698765432123,
 *   isSynced: false
 * };
 * ```
 * 
 * @example Minimal Event
 * ```typescript
 * const minimalEvent: AuditEvent = {
 *   userId: 'user_123',
 *   action: AuditAction.VIEW_STUDENT,
 *   resourceType: AuditResourceType.STUDENT,
 *   timestamp: new Date().toISOString(),
 *   status: AuditStatus.SUCCESS,
 *   isPHI: true,
 *   isHIPAACompliant: true,
 *   severity: AuditSeverity.LOW
 * };
 * ```
 * 
 * @since 1.0.0
 * @see {@link AuditLogParams} for simplified event creation
 * @see {@link AuditChange} for change tracking details
 */
export interface AuditEvent {
  // Event Identity
  id?: string; // Generated by backend or client
  sessionId?: string; // User session identifier

  // WHO - User Information
  userId: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;

  // WHAT - Action Information
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  resourceIdentifier?: string; // Human-readable identifier (e.g., student name)

  // WHEN - Temporal Information
  timestamp: string; // ISO 8601 format

  // WHERE - Context Information
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceId?: string;

  // WHY - Reason and Context
  reason?: string;
  context?: Record<string, unknown>;

  // HOW - Method and Details
  method?: 'API' | 'UI' | 'BATCH' | 'SYSTEM';
  endpoint?: string;

  // STATUS - Operation Result
  status: AuditStatus;
  statusCode?: number;
  errorMessage?: string;

  // CHANGE TRACKING - Before/After for Updates
  changes?: AuditChange[];
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;

  // PHI AND COMPLIANCE FLAGS
  isPHI: boolean; // Is this Protected Health Information?
  isHIPAACompliant: boolean; // Was action HIPAA-compliant?
  requiresReview?: boolean; // Does this require manual review?

  // SECURITY - Tamper Evidence
  checksum?: string; // Hash of event data for tamper detection
  signature?: string; // Digital signature if available

  // METADATA
  metadata?: Record<string, unknown>;
  tags?: string[];
  severity: AuditSeverity;

  // RELATED ENTITIES
  studentId?: string; // For student-related operations
  schoolId?: string;
  districtId?: string;

  // LOCAL TRACKING
  localTimestamp?: number; // Local timestamp for ordering
  retryCount?: number; // Number of send attempts
  lastRetryAt?: number; // Last retry timestamp
  isSynced?: boolean; // Whether synced to backend
}

/**
 * @interface AuditChange
 * @description Represents a single field change in an audit event, enabling
 * precise tracking of PHI modifications for compliance and accountability.
 * 
 * Change tracking is essential for HIPAA compliance as it provides:
 * - Detailed modification history
 * - Before/after values for rollback capability
 * - Change type classification for reporting
 * - Field-level granularity for sensitive data
 * 
 * @example Basic Change Tracking
 * ```typescript
 * const changes: AuditChange[] = [
 *   {
 *     field: 'email',
 *     oldValue: 'old@example.com',
 *     newValue: 'new@example.com',
 *     type: 'UPDATE'
 *   },
 *   {
 *     field: 'phoneNumbers',
 *     oldValue: null,
 *     newValue: ['+1-555-0123'],
 *     type: 'ADD'
 *   },
 *   {
 *     field: 'tempAddress',
 *     oldValue: '123 Old St',
 *     newValue: null,
 *     type: 'REMOVE'
 *   }
 * ];
 * ```
 * 
 * @example Nested Object Changes
 * ```typescript
 * const nestedChange: AuditChange = {
 *   field: 'vitals.bloodPressure.systolic',
 *   oldValue: 120,
 *   newValue: 118,
 *   type: 'UPDATE'
 * };
 * ```
 * 
 * @since 1.0.0
 * @see {@link AuditEvent.changes} for usage in audit events
 */
export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type?: 'ADD' | 'UPDATE' | 'REMOVE';
}

/**
 * @interface AuditLogParams
 * @description Simplified parameters for creating audit log entries. This interface
 * provides a developer-friendly API for logging operations without requiring
 * knowledge of the complete AuditEvent structure.
 * 
 * The service automatically enhances these parameters with:
 * - User context from authentication state
 * - System-generated timestamps and IDs
 * - Security checksums and signatures
 * - Default severity levels based on action type
 * - PHI classification based on resource type
 * 
 * **Parameter Categories:**
 * - **Required**: action, resourceType
 * - **Identification**: resourceId, resourceIdentifier, studentId
 * - **Status**: status (defaults to SUCCESS)
 * - **Change Tracking**: changes, beforeState, afterState
 * - **Context**: reason, context, metadata, tags
 * - **Classification**: isPHI, severity
 * 
 * @example Basic Logging
 * ```typescript
 * await auditService.log({
 *   action: AuditAction.VIEW_HEALTH_RECORD,
 *   resourceType: AuditResourceType.HEALTH_RECORD,
 *   resourceId: 'health_record_456',
 *   studentId: 'student_123'
 * });
 * ```
 * 
 * @example Detailed Change Logging
 * ```typescript
 * await auditService.log({
 *   action: AuditAction.UPDATE_MEDICATION,
 *   resourceType: AuditResourceType.MEDICATION,
 *   resourceId: 'med_789',
 *   resourceIdentifier: 'Albuterol Inhaler - Jane Doe',
 *   studentId: 'student_456',
 *   status: AuditStatus.SUCCESS,
 *   changes: [{
 *     field: 'dosage',
 *     oldValue: '2 puffs',
 *     newValue: '1 puff',
 *     type: 'UPDATE'
 *   }],
 *   reason: 'Dosage adjustment per physician orders',
 *   severity: AuditSeverity.HIGH,
 *   metadata: {
 *     physicianId: 'doc_123',
 *     orderDate: '2025-10-21'
 *   }
 * });
 * ```
 * 
 * @example Error Logging
 * ```typescript
 * await auditService.log({
 *   action: AuditAction.DELETE_ALLERGY,
 *   resourceType: AuditResourceType.ALLERGY,
 *   resourceId: 'allergy_999',
 *   status: AuditStatus.FAILURE,
 *   reason: 'Insufficient permissions',
 *   context: {
 *     requiredRole: 'admin',
 *     userRole: 'viewer'
 *   }
 * });
 * ```
 * 
 * @since 1.0.0
 * @see {@link AuditService.log} for usage
 * @see {@link AuditEvent} for complete event structure
 */
export interface AuditLogParams {
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  resourceIdentifier?: string;
  studentId?: string;
  status?: AuditStatus;
  isPHI?: boolean;
  changes?: AuditChange[];
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  reason?: string;
  context?: Record<string, unknown>;
  severity?: AuditSeverity;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

/**
 * Batch audit event submission
 */
export interface AuditBatch {
  events: AuditEvent[];
  batchId: string;
  timestamp: string;
  checksum?: string;
}

/**
 * Audit event filter for queries
 */
export interface AuditEventFilter {
  userId?: string;
  studentId?: string;
  action?: AuditAction;
  resourceType?: AuditResourceType;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  isPHI?: boolean;
  status?: AuditStatus;
  severity?: AuditSeverity;
  page?: number;
  limit?: number;
}

/**
 * Audit statistics and metrics
 */
export interface AuditStatistics {
  totalEvents: number;
  phiAccess: number;
  failedAttempts: number;
  byAction: Record<string, number>;
  byResourceType: Record<string, number>;
  bySeverity: Record<string, number>;
  recentEvents: AuditEvent[];
  criticalEvents: AuditEvent[];
}

// ==========================================
// SERVICE CONFIGURATION
// ==========================================

/**
 * Audit service configuration
 */
export interface AuditConfig {
  // Batching Configuration
  batchSize: number; // Number of events to batch before sending
  batchInterval: number; // Max time (ms) to wait before sending batch

  // Storage Configuration
  maxLocalStorage: number; // Max events to store locally
  localStorageKey: string; // LocalStorage key for queued events

  // Retry Configuration
  maxRetries: number; // Max retry attempts for failed sends
  retryDelay: number; // Delay (ms) between retries
  retryBackoff: number; // Backoff multiplier for retries

  // Critical Events
  criticalActions: AuditAction[]; // Actions that must be logged immediately
  criticalSeverities: AuditSeverity[]; // Severities that require immediate logging

  // PHI Protection
  autoDetectPHI: boolean; // Automatically flag PHI resources
  phiResourceTypes: AuditResourceType[]; // Resource types that are PHI

  // Security
  enableChecksum: boolean; // Generate checksums for tamper detection
  enableSignature: boolean; // Generate digital signatures

  // Performance
  enableAsync: boolean; // Use async logging (don't block operations)
  enableCompression: boolean; // Compress batch payloads

  // Development
  enableDebug: boolean; // Enable debug logging
  enableConsoleLog: boolean; // Log to console in development
}

// ==========================================
// AUDIT SERVICE INTERFACE
// ==========================================

/**
 * Audit service interface for dependency injection
 */
export interface IAuditService {
  // Core Logging
  log(params: AuditLogParams): Promise<void>;
  logSuccess(params: AuditLogParams): Promise<void>;
  logFailure(params: AuditLogParams, error: Error): Promise<void>;

  // Specific Operations
  logPHIAccess(action: AuditAction, studentId: string, resourceType: AuditResourceType, resourceId?: string): Promise<void>;
  logPHIModification(action: AuditAction, studentId: string, resourceType: AuditResourceType, resourceId: string, changes: AuditChange[]): Promise<void>;
  logAccessDenied(action: AuditAction, resourceType: AuditResourceType, resourceId?: string, reason?: string): Promise<void>;

  // Batch Management
  flush(): Promise<void>;
  getQueuedCount(): number;
  clearQueue(): void;

  // Configuration
  getConfig(): AuditConfig;
  updateConfig(config: Partial<AuditConfig>): void;

  // Status
  isHealthy(): boolean;
  getStatus(): AuditServiceStatus;
}

/**
 * Audit service health status
 */
export interface AuditServiceStatus {
  isHealthy: boolean;
  queuedEvents: number;
  failedEvents: number;
  lastSyncAt?: number;
  lastError?: string;
  syncErrors: number;
}

// ==========================================
// BACKEND API TYPES
// ==========================================

/**
 * Backend API response for audit logging
 */
export interface AuditApiResponse {
  success: boolean;
  data?: {
    received: number;
    processed: number;
    failed: number;
    errors?: Array<{
      eventId: string;
      error: string;
    }>;
  };
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Backend audit query response
 */
export interface AuditQueryResponse {
  success: boolean;
  data?: {
    events: AuditEvent[];
    total: number;
    page: number;
    limit: number;
  };
  error?: {
    message: string;
  };
}
