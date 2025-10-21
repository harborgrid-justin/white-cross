/**
 * HIPAA-Compliant Audit Logging System - Type Definitions
 *
 * Purpose: Comprehensive type definitions for audit logging system
 * HIPAA Requirements:
 * - Track WHO accessed WHAT and WHEN
 * - Include successful and failed access attempts
 * - Tamper-evident logging with checksums
 * - Complete change tracking for PHI
 *
 * Last Updated: 2025-10-21
 */

// ==========================================
// AUDIT ACTION TYPES
// ==========================================

/**
 * Comprehensive audit actions covering all PHI operations
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
 * Resource types for audit logging
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
 * Audit event severity/criticality levels
 */
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Audit event status
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
 * Complete audit event structure
 * Captures comprehensive information for HIPAA compliance
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
 * Individual field change tracking
 */
export interface AuditChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type?: 'ADD' | 'UPDATE' | 'REMOVE';
}

/**
 * Simplified audit log parameters for common operations
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
