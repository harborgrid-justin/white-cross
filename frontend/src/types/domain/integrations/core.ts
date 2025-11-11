/**
 * @fileoverview Core Integration Types
 * @module types/domain/integrations/core
 * @category Healthcare - Integration Management
 * 
 * Core types and enums for integration management system.
 * Defines fundamental integration concepts used across the platform.
 */

// ==================== ENUMS ====================

/**
 * Integration Type Enum
 * Defines all supported integration types in the healthcare platform
 */
export enum IntegrationType {
  SIS = 'SIS',
  EHR = 'EHR',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  INSURANCE = 'INSURANCE',
  PARENT_PORTAL = 'PARENT_PORTAL',
  HEALTH_APP = 'HEALTH_APP',
  GOVERNMENT_REPORTING = 'GOVERNMENT_REPORTING',
}

/**
 * Integration Status Enum
 * Tracks the current operational status of an integration
 */
export enum IntegrationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR',
  TESTING = 'TESTING',
  SYNCING = 'SYNCING',
}

/**
 * Sync Status Enum
 * Tracks the outcome of synchronization operations
 */
export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
}

/**
 * Integration Action Enum
 * Types of operations performed on integrations
 */
export enum IntegrationAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  TEST_CONNECTION = 'test_connection',
  SYNC = 'sync',
  ENABLE = 'enable',
  DISABLE = 'disable',
  CONFIGURE = 'configure',
}

/**
 * Authentication Method Enum
 * Supported authentication mechanisms for integrations
 */
export enum AuthenticationMethod {
  API_KEY = 'api_key',
  BASIC_AUTH = 'basic_auth',
  OAUTH2 = 'oauth2',
  JWT = 'jwt',
  CERTIFICATE = 'certificate',
  CUSTOM = 'custom',
}

/**
 * Integration Health Status
 * Aggregated health indicator for integration monitoring
 */
export enum IntegrationHealth {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown',
}

/**
 * Webhook Event
 * Events that can trigger webhooks
 */
export enum WebhookEvent {
  STUDENT_CREATED = 'student.created',
  STUDENT_UPDATED = 'student.updated',
  HEALTH_RECORD_CREATED = 'health_record.created',
  HEALTH_RECORD_UPDATED = 'health_record.updated',
  MEDICATION_ADMINISTERED = 'medication.administered',
  APPOINTMENT_SCHEDULED = 'appointment.scheduled',
  INCIDENT_REPORTED = 'incident.reported',
  SYNC_COMPLETED = 'sync.completed',
  SYNC_FAILED = 'sync.failed',
}

/**
 * Conflict Resolution Strategy
 * Defines how to handle data conflicts during sync
 */
export enum ConflictResolutionStrategy {
  SOURCE_WINS = 'source_wins',
  TARGET_WINS = 'target_wins',
  NEWEST_WINS = 'newest_wins',
  MANUAL = 'manual',
  MERGE = 'merge',
}

// ==================== CORE INTERFACES ====================

/**
 * Integration Log
 * Records all integration operations and their outcomes
 *
 * @aligned_with backend/src/database/models/integration/IntegrationLog.ts
 */
export interface IntegrationLog {
  id: string;
  integrationId?: string;
  integrationType: IntegrationType;
  action: string;
  status: SyncStatus;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  startedAt: string;
  completedAt?: string;
  duration?: number; // In milliseconds
  errorMessage?: string;
  details?: LogDetails;
  createdAt: string;

  // Frontend-only relationship field
  integration?: {
    name: string;
    type: IntegrationType;
  };
}

/**
 * Log Details
 * Additional information stored with integration logs
 */
export interface LogDetails {
  message?: string;
  errors?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
  stackTrace?: string;
  apiVersion?: string;
  requestId?: string;
  [key: string]: any;
}

/**
 * Integration Activity
 * Recent activity record for an integration
 */
export interface IntegrationActivity {
  id: string;
  integrationId: string;
  integrationName: string;
  type: IntegrationType;
  action: IntegrationAction;
  status: SyncStatus;
  timestamp: string;
  duration?: number;
  recordsProcessed?: number;
  userId?: string;
  userName?: string;
}

/**
 * Health Issue
 * Specific issue affecting integration health
 */
export interface HealthIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'connectivity' | 'authentication' | 'data' | 'performance' | 'configuration';
  message: string;
  details?: string;
  detectedAt: string;
  resolved?: boolean;
  resolvedAt?: string;
}

// ==================== UTILITY TYPES ====================

/**
 * Field Mapping
 * Maps fields between external systems and internal schema
 */
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  transformRule?: string; // Reference to transform rule ID
  validationRules?: ValidationRule[];
}

/**
 * Transform Rule
 * Defines data transformation logic for field mapping
 */
export interface TransformRule {
  id: string;
  name: string;
  type: 'format' | 'calculate' | 'lookup' | 'conditional' | 'custom';
  expression: string;
  parameters?: Record<string, any>;
}

/**
 * Validation Rule
 * Validation rules for field mapping
 */
export interface ValidationRule {
  type: 'required' | 'pattern' | 'range' | 'enum' | 'custom';
  value?: any;
  message?: string;
}

/**
 * Sync Filter
 * Filters for selective data synchronization
 */
export interface SyncFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

/**
 * Sync Hook
 * Pre/post processing hooks for sync operations
 */
export interface SyncHook {
  type: 'pre' | 'post';
  action: string;
  webhook?: string;
  script?: string;
  retryOnFailure?: boolean;
}

// ==================== TYPE GUARDS & UTILITIES ====================

/**
 * Type guard to check if sync was successful
 */
export const isSyncSuccessful = (log: IntegrationLog): boolean => {
  return log.status === SyncStatus.SUCCESS && (log.recordsFailed || 0) === 0;
};

/**
 * Get integration type display name
 */
export const getIntegrationTypeDisplay = (type: IntegrationType): string => {
  const displayNames: Record<IntegrationType, string> = {
    [IntegrationType.SIS]: 'Student Information System',
    [IntegrationType.EHR]: 'Electronic Health Records',
    [IntegrationType.PHARMACY]: 'Pharmacy Management',
    [IntegrationType.LABORATORY]: 'Laboratory Information System',
    [IntegrationType.INSURANCE]: 'Insurance Verification',
    [IntegrationType.PARENT_PORTAL]: 'Parent Portal',
    [IntegrationType.HEALTH_APP]: 'Health Application',
    [IntegrationType.GOVERNMENT_REPORTING]: 'Government Reporting',
  };
  return displayNames[type] || type;
};

/**
 * Get integration status color for UI
 */
export const getIntegrationStatusColor = (status: IntegrationStatus): string => {
  const colors: Record<IntegrationStatus, string> = {
    [IntegrationStatus.ACTIVE]: 'green',
    [IntegrationStatus.INACTIVE]: 'gray',
    [IntegrationStatus.ERROR]: 'red',
    [IntegrationStatus.TESTING]: 'yellow',
    [IntegrationStatus.SYNCING]: 'blue',
  };
  return colors[status] || 'gray';
};

/**
 * Get sync status color for UI
 */
export const getSyncStatusColor = (status: SyncStatus): string => {
  const colors: Record<SyncStatus, string> = {
    [SyncStatus.SUCCESS]: 'green',
    [SyncStatus.FAILED]: 'red',
    [SyncStatus.PENDING]: 'gray',
    [SyncStatus.IN_PROGRESS]: 'blue',
  };
  return colors[status] || 'gray';
};

/**
 * Calculate sync success rate
 */
export const calculateSyncSuccessRate = (succeeded: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((succeeded / total) * 100);
};

/**
 * Format sync duration for display
 */
export const formatSyncDuration = (milliseconds: number): string => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  return `${(milliseconds / 60000).toFixed(1)}m`;
};
