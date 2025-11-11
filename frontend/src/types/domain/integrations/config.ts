/**
 * @fileoverview Integration Configuration Types
 * @module types/domain/integrations/config
 * @category Healthcare - Integration Management
 * 
 * Types for integration configuration, settings, and system-specific configurations.
 */

import { 
  IntegrationType, 
  IntegrationStatus, 
  SyncStatus, 
  AuthenticationMethod,
  IntegrationHealth,
  FieldMapping,
  TransformRule
} from './core';

// ==================== INTEGRATION CONFIG ====================

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
  logs?: Array<{
    id: string;
    action: string;
    status: SyncStatus;
    timestamp: string;
  }>;
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
  customSettings?: Record<string, unknown>;
}

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
  serverInfo?: Record<string, unknown>;
  supportedFeatures?: string[];
  healthCheck?: {
    status: 'healthy' | 'degraded' | 'down';
    components?: Record<string, string>;
  };
  additionalInfo?: Record<string, unknown>;
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
  issues?: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'connectivity' | 'authentication' | 'data' | 'performance' | 'configuration';
    message: string;
    details?: string;
    detectedAt: string;
    resolved?: boolean;
    resolvedAt?: string;
  }>;
}

// ==================== TYPE GUARDS & UTILITIES ====================

/**
 * Type guard to check if integration is active
 */
export const isIntegrationActive = (integration: IntegrationConfig): boolean => {
  return integration.isActive && integration.status === IntegrationStatus.ACTIVE;
};

/**
 * Type guard to check if integration has errors
 */
export const hasIntegrationErrors = (integration: IntegrationConfig): boolean => {
  return integration.status === IntegrationStatus.ERROR ||
         integration.lastSyncStatus === SyncStatus.FAILED;
};

/**
 * Get integration config by type
 */
export const getIntegrationTypeConfig = (
  settings: IntegrationSettings, 
  type: IntegrationType
): unknown => {
  const configMap = {
    [IntegrationType.SIS]: settings.sisConfig,
    [IntegrationType.EHR]: settings.ehrConfig,
    [IntegrationType.PHARMACY]: settings.pharmacyConfig,
    [IntegrationType.LABORATORY]: settings.laboratoryConfig,
    [IntegrationType.INSURANCE]: settings.insuranceConfig,
    [IntegrationType.PARENT_PORTAL]: settings.parentPortalConfig,
    [IntegrationType.HEALTH_APP]: settings.healthAppConfig,
    [IntegrationType.GOVERNMENT_REPORTING]: settings.governmentReportingConfig,
  };
  return configMap[type];
};

/**
 * Validate integration configuration
 */
export const validateIntegrationConfig = (config: IntegrationConfig): boolean => {
  if (!config.name || !config.type) return false;
  if (config.isActive && !config.endpoint) return false;
  return true;
};
