/**
 * WF-COMP-327 | integrations.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Integration Hub Type Definitions
 * Enterprise-grade integration management types for healthcare platform
 *
 * Supports integration with:
 * - SIS (Student Information System)
 * - EHR (Electronic Health Records)
 * - Pharmacy Management Systems
 * - Laboratory Information Systems
 * - Insurance Verification Systems
 * - Parent Portal
 * - Health Applications
 * - Government Reporting Systems
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

// ==================== CORE INTEGRATION TYPES ====================

/**
 * Integration Configuration
 * Main entity representing an external system integration
 *
 * @aligned_with backend/src/database/models/integration/IntegrationConfig.ts
 * @security Sensitive fields (apiKey, username, password) should be masked in API responses
 * @note Backend stores these fields encrypted; frontend should never log or expose them
 */
export interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint?: string;
  apiKey?: string; // SECURITY: Encrypted in backend, should be masked in responses
  username?: string;
  password?: string; // SECURITY: Encrypted in backend, should be masked in responses
  settings?: IntegrationSettings;
  isActive: boolean;
  lastSyncAt?: string;
  lastSyncStatus?: SyncStatus;
  syncFrequency?: number; // In minutes
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  logs?: IntegrationLog[];
}

/**
 * Integration Settings
 * Type-specific configuration settings stored as JSON
 */
export interface IntegrationSettings {
  // Common settings
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  enableWebhooks?: boolean;

  // Authentication settings
  authMethod?: AuthenticationMethod;
  oauth2Config?: OAuth2Config;
  certificatePath?: string;

  // Data mapping settings
  fieldMappings?: FieldMapping[];
  transformRules?: TransformRule[];

  // Sync settings
  syncDirection?: 'inbound' | 'outbound' | 'bidirectional';
  syncSchedule?: string; // Cron expression
  autoSync?: boolean;

  // Type-specific settings
  sisConfig?: SISIntegrationConfig;
  ehrConfig?: EHRIntegrationConfig;
  pharmacyConfig?: PharmacyIntegrationConfig;
  laboratoryConfig?: LaboratoryIntegrationConfig;
  insuranceConfig?: InsuranceIntegrationConfig;
  parentPortalConfig?: ParentPortalIntegrationConfig;
  healthAppConfig?: HealthAppIntegrationConfig;
  governmentReportingConfig?: GovernmentReportingConfig;

  // Custom settings
  [key: string]: any;
}

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

// ==================== AUTHENTICATION & CREDENTIALS ====================

/**
 * OAuth2 Configuration
 * Configuration for OAuth2-based integrations
 */
export interface OAuth2Config {
  clientId: string;
  clientSecret: string; // Encrypted in database
  authorizationUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scope?: string[];
  grantType: 'authorization_code' | 'client_credentials' | 'password' | 'refresh_token';
  accessToken?: string; // Runtime only, not persisted
  refreshToken?: string; // Runtime only, not persisted
  expiresAt?: number; // Timestamp
}

/**
 * API Credentials
 * Secure credential management for integrations
 */
export interface APICredentials {
  id: string;
  integrationId: string;
  credentialType: AuthenticationMethod;
  apiKey?: string; // Encrypted
  username?: string;
  password?: string; // Encrypted
  token?: string; // Encrypted
  certificatePath?: string;
  privateKeyPath?: string;
  isActive: boolean;
  expiresAt?: string;
  lastRotatedAt?: string;
  rotationPolicy?: CredentialRotationPolicy;
  createdAt: string;
  updatedAt: string;
}

/**
 * Credential Rotation Policy
 * Defines how and when credentials should be rotated
 */
export interface CredentialRotationPolicy {
  enabled: boolean;
  rotationIntervalDays: number;
  notifyBeforeDays: number;
  autoRotate: boolean;
  lastRotation?: string;
  nextRotation?: string;
}

// ==================== DATA MAPPING & TRANSFORMATION ====================

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

// ==================== SYNC OPERATIONS ====================

/**
 * Sync Configuration
 * Configuration for synchronization operations
 */
export interface SyncConfiguration {
  integrationId: string;
  enabled: boolean;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  schedule?: string; // Cron expression
  batchSize?: number;
  throttleRatePerSecond?: number;
  conflictResolution?: ConflictResolutionStrategy;
  filters?: SyncFilter[];
  hooks?: SyncHook[];
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

/**
 * Sync Result
 * Result of a synchronization operation
 */
export interface SyncResult {
  success: boolean;
  message?: string;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number; // In milliseconds
  errors?: string[];
  warnings?: string[];
  metadata?: SyncMetadata;
}

/**
 * Sync Metadata
 * Additional metadata about sync operation
 */
export interface SyncMetadata {
  startTime: string;
  endTime: string;
  triggeredBy: 'manual' | 'scheduled' | 'webhook' | 'api';
  batchesProcessed?: number;
  datasetSize?: number;
  apiCallsMade?: number;
  [key: string]: any;
}

// ==================== WEBHOOK MANAGEMENT ====================

/**
 * Webhook Configuration
 * Configuration for webhook-based integrations
 */
export interface WebhookConfig {
  id: string;
  integrationId: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  events: WebhookEvent[];
  isActive: boolean;
  secretKey?: string; // For webhook signature verification
  retryPolicy?: WebhookRetryPolicy;
  createdAt: string;
  updatedAt: string;
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
 * Webhook Retry Policy
 * Defines retry behavior for failed webhook deliveries
 */
export interface WebhookRetryPolicy {
  maxAttempts: number;
  initialDelay: number; // In milliseconds
  backoffMultiplier: number;
  maxDelay: number; // In milliseconds
}

/**
 * Webhook Delivery Log
 * Records webhook delivery attempts and outcomes
 */
export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt: string;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
  createdAt: string;
}

// ==================== TYPE-SPECIFIC CONFIGURATIONS ====================

/**
 * SIS Integration Configuration
 * Student Information System specific settings
 */
export interface SISIntegrationConfig {
  sisVendor: 'PowerSchool' | 'Skyward' | 'Infinite Campus' | 'Schoology' | 'Other';
  apiVersion?: string;
  syncStudentDemographics: boolean;
  syncEnrollment: boolean;
  syncAttendance: boolean;
  syncGrades: boolean;
  schoolCodes?: string[]; // Specific schools to sync
}

/**
 * EHR Integration Configuration
 * Electronic Health Records specific settings
 */
export interface EHRIntegrationConfig {
  ehrVendor: 'Epic' | 'Cerner' | 'Allscripts' | 'NextGen' | 'Other';
  fhirVersion?: 'R4' | 'STU3' | 'DSTU2';
  syncClinicalData: boolean;
  syncVaccinations: boolean;
  syncAllergies: boolean;
  syncMedications: boolean;
  syncLabResults: boolean;
  patientIdField?: string; // Field used to match patients
}

/**
 * Pharmacy Integration Configuration
 * Pharmacy Management System specific settings
 */
export interface PharmacyIntegrationConfig {
  pharmacyName: string;
  pharmacyNPI?: string; // National Provider Identifier
  prescriptionFormat: 'NCPDP' | 'HL7' | 'Custom';
  supportedMedicationTypes?: string[];
  autoRefillEnabled: boolean;
  inventorySync: boolean;
}

/**
 * Laboratory Integration Configuration
 * Laboratory Information System specific settings
 */
export interface LaboratoryIntegrationConfig {
  labName: string;
  labCLIA?: string; // Clinical Laboratory Improvement Amendments ID
  resultFormat: 'HL7' | 'FHIR' | 'Custom';
  autoImportResults: boolean;
  notifyOnCriticalValues: boolean;
  supportedTestTypes?: string[];
}

/**
 * Insurance Integration Configuration
 * Insurance Verification System specific settings
 */
export interface InsuranceIntegrationConfig {
  provider: string;
  providerNetwork?: string;
  verificationMethod: 'realtime' | 'batch';
  eligibilityCheckEnabled: boolean;
  claimsSubmissionEnabled: boolean;
  priorAuthRequired: boolean;
}

/**
 * Parent Portal Integration Configuration
 * Parent Portal specific settings
 */
export interface ParentPortalIntegrationConfig {
  portalUrl: string;
  ssoEnabled: boolean;
  allowParentAccess: boolean;
  allowHealthRecordView: boolean;
  allowMedicationView: boolean;
  allowAppointmentScheduling: boolean;
  notificationPreferences?: string[];
}

/**
 * Health App Integration Configuration
 * Health Application specific settings
 */
export interface HealthAppIntegrationConfig {
  appName: string;
  platform: 'iOS' | 'Android' | 'Web' | 'All';
  dataTypes: string[]; // Types of health data to sync
  pushNotificationEnabled: boolean;
  backgroundSyncEnabled: boolean;
}

/**
 * Government Reporting Configuration
 * Government Reporting System specific settings
 */
export interface GovernmentReportingConfig {
  agency: string;
  reportingState: string;
  reportTypes: string[];
  submissionMethod: 'manual' | 'automated' | 'scheduled';
  complianceStandards?: string[];
  reportingFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
}

// ==================== CONNECTION & TESTING ====================

/**
 * Connection Test Result
 * Result of testing integration connectivity
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  status?: string;
  latency?: number;
  details?: ConnectionTestDetails;
  timestamp?: string;
}

/**
 * Connection Test Details
 * Detailed information from connection tests
 */
export interface ConnectionTestDetails {
  version?: string;
  apiVersion?: string;
  serverInfo?: Record<string, any>;
  supportedFeatures?: string[];
  healthCheck?: {
    status: 'healthy' | 'degraded' | 'down';
    components?: Record<string, string>;
  };
  [key: string]: any;
}

/**
 * Integration Health Check
 * Comprehensive health status of an integration
 */
export interface IntegrationHealthCheck {
  integrationId: string;
  integrationName: string;
  type: IntegrationType;
  status: IntegrationStatus;
  health: IntegrationHealth;
  lastSync?: string;
  lastSyncStatus?: SyncStatus;
  uptime?: number; // Percentage
  errorRate?: number; // Percentage
  averageResponseTime?: number; // In milliseconds
  lastHealthCheck: string;
  issues?: HealthIssue[];
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

// ==================== STATISTICS & MONITORING ====================

/**
 * Integration Statistics
 * Comprehensive statistics for monitoring integrations
 */
export interface IntegrationStatistics {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  syncStatistics: SyncStatistics;
  statsByType: Record<string, TypeStatistics>;
  recentActivity?: IntegrationActivity[];
}

/**
 * Sync Statistics
 * Statistics about synchronization operations
 */
export interface SyncStatistics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  successRate: number; // Percentage
  totalRecordsProcessed: number;
  totalRecordsSucceeded: number;
  totalRecordsFailed: number;
  averageSyncDuration?: number; // In milliseconds
  lastSyncAt?: string;
}

/**
 * Type Statistics
 * Statistics for a specific integration type
 */
export interface TypeStatistics {
  success: number;
  failed: number;
  total: number;
  successRate?: number; // Percentage
  averageDuration?: number; // In milliseconds
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

// ==================== REQUEST/RESPONSE TYPES ====================

/**
 * Create Integration Request
 * Request payload for creating new integration
 */
export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationType;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: IntegrationSettings;
  syncFrequency?: number;
}

/**
 * Update Integration Request
 * Request payload for updating integration
 */
export interface UpdateIntegrationRequest {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: IntegrationSettings;
  syncFrequency?: number;
  isActive?: boolean;
}

/**
 * Integration List Response
 * Response containing list of integrations
 */
export interface IntegrationListResponse {
  integrations: IntegrationConfig[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Integration Response
 * Response containing single integration
 */
export interface IntegrationResponse {
  integration: IntegrationConfig;
}

/**
 * Integration Logs Response
 * Response containing paginated logs
 */
export interface IntegrationLogsResponse {
  logs: IntegrationLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Integration Statistics Response
 * Response containing statistics
 */
export interface IntegrationStatisticsResponse {
  statistics: IntegrationStatistics;
}

/**
 * Log Filters
 * Filters for querying integration logs
 */
export interface LogFilters {
  integrationId?: string;
  type?: IntegrationType;
  action?: string;
  status?: SyncStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Batch Operation Result
 * Result of batch operations on integrations
 */
export interface BatchOperationResult {
  success: number;
  failed: number;
  total: number;
  errors?: Array<{
    integrationId: string;
    error: string;
  }>;
}

/**
 * Integration Health Status Response
 * Response containing overall integration health
 */
export interface IntegrationHealthStatusResponse {
  overall: 'healthy' | 'degraded' | 'critical';
  integrations: Array<{
    id: string;
    name: string;
    type: IntegrationType;
    status: IntegrationStatus;
    lastSync: string | null;
    health: IntegrationHealth;
  }>;
  summary: {
    total: number;
    healthy: number;
    warning: number;
    error: number;
  };
}

// ==================== TYPE GUARDS & UTILITIES ====================

/**
 * Type guard to check if integration is active
 */
export const isIntegrationActive = (integration: IntegrationConfig): boolean => {
  return integration.isActive && integration.status === IntegrationStatus.ACTIVE;
};

/**
 * Type guard to check if sync was successful
 */
export const isSyncSuccessful = (result: SyncResult): boolean => {
  return result.success && result.recordsFailed === 0;
};

/**
 * Type guard to check if integration has errors
 */
export const hasIntegrationErrors = (integration: IntegrationConfig): boolean => {
  return integration.status === IntegrationStatus.ERROR ||
         integration.lastSyncStatus === SyncStatus.FAILED;
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
