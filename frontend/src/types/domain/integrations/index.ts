/**
 * @fileoverview Integration Types Module Index
 * @module types/domain/integrations
 * @category Healthcare - Integration Management
 * 
 * Main entry point for all integration-related types.
 * Re-exports all types from modular components for backward compatibility.
 */

// ==================== CORE TYPES ====================
export {
  // Enums (values, not types)
  IntegrationType,
  IntegrationStatus,
  SyncStatus,
  IntegrationAction,
  AuthenticationMethod,
  IntegrationHealth,
  WebhookEvent,
  ConflictResolutionStrategy,
  
  // Utility Functions
  isSyncSuccessful,
  getIntegrationTypeDisplay,
  getIntegrationStatusColor,
  getSyncStatusColor,
  calculateSyncSuccessRate,
  formatSyncDuration,
} from './core';

export type {
  // Core Interfaces
  IntegrationLog,
  LogDetails,
  IntegrationActivity,
  HealthIssue,

  // Utility Types
  FieldMapping,
  TransformRule,
  ValidationRule,
  SyncFilter,
  SyncHook,
} from './core';

// ==================== CONFIGURATION TYPES ====================
export {
  // Utility Functions
  isIntegrationActive,
  getIntegrationTypeConfig,
  validateIntegrationConfig,
} from './config';

export type {
  // Main Configuration
  IntegrationConfig,
  IntegrationSettings,
  OAuth2Config,

  // Type-Specific Configurations
  SISIntegrationConfig,
  EHRIntegrationConfig,
  PharmacyIntegrationConfig,
  LaboratoryIntegrationConfig,
  InsuranceIntegrationConfig,
  ParentPortalIntegrationConfig,
  HealthAppIntegrationConfig,
  GovernmentReportingConfig,

  // Connection & Testing
  ConnectionTestResult,
  ConnectionTestDetails,
  IntegrationHealthCheck,
} from './config';

// ==================== SYNC & STATISTICS TYPES ====================
export {
  // Utility Functions
  isSyncResultSuccessful,
  calculateSuccessRate,
  formatDuration,
  getNextRotationDate,
  needsCredentialRotation,
} from './sync';

export type {
  // Sync Operations
  SyncConfiguration,
  SyncResult,
  SyncMetadata,

  // Authentication & Credentials
  APICredentials,
  CredentialRotationPolicy,

  // Webhook Management
  WebhookConfig,
  WebhookRetryPolicy,
  WebhookDeliveryLog,

  // Statistics & Monitoring
  IntegrationStatistics,
  SyncStatistics,
  TypeStatistics,

  // Request/Response Types
  BatchOperationResult,
  LogFilters,
} from './sync';

// ==================== API TYPES ====================
export {
  // Type Guards
  isAPIErrorResponse,
  isValidationErrorResponse,
  isSuccessfulSyncResponse,
} from './api';

export type {
  // Request Types
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  BulkIntegrationRequest,
  ManualSyncRequest,

  // Response Types
  IntegrationListResponse,
  IntegrationResponse,
  IntegrationLogsResponse,
  IntegrationStatisticsResponse,
  IntegrationHealthStatusResponse,
  BulkIntegrationResponse,
  ManualSyncResponse,
  SyncStatusResponse,

  // Query Parameters
  IntegrationQueryParams,
  HealthCheckQueryParams,

  // Error Types
  APIErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from './api';

// ==================== LEGACY COMPATIBILITY ====================
// Import types for utility function parameters
import type { IntegrationConfig, IntegrationSettings } from './config';
import type { SyncResult } from './sync';
// Import enums for metadata
import { IntegrationType, IntegrationStatus, SyncStatus } from './core';

// Re-export the hasIntegrationErrors function from config with a different name
export { hasIntegrationErrors as hasConfigErrors } from './config';

// ==================== MODULE METADATA ====================

/**
 * Module version for tracking changes
 */
export const INTEGRATION_TYPES_VERSION = '2.0.0';

/**
 * List of all integration types for reference
 */
export const INTEGRATION_TYPES_LIST = Object.values(IntegrationType);

/**
 * List of all integration statuses for reference
 */
export const INTEGRATION_STATUSES_LIST = Object.values(IntegrationStatus);

/**
 * List of all sync statuses for reference
 */
export const SYNC_STATUSES_LIST = Object.values(SyncStatus);
