/**
 * Integration Settings Types
 * Type definitions for integration-specific configuration settings
 */

/**
 * Base integration settings interface
 */
export interface BaseIntegrationSettings {
  /** Enable/disable debug logging */
  enableDebugLogging?: boolean;
  /** Custom timeout in milliseconds */
  customTimeout?: number;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Student Information System (SIS) settings
 */
export interface SisIntegrationSettings extends BaseIntegrationSettings {
  /** SIS vendor name (e.g., PowerSchool, Infinite Campus) */
  vendor?: string;
  /** Organization/district ID in the SIS */
  organizationId?: string;
  /** Sync frequency in minutes */
  syncFrequencyMinutes?: number;
  /** Fields to sync from SIS */
  syncFields?: string[];
  /** Enable automatic enrollment sync */
  autoSync?: boolean;
}

/**
 * Electronic Health Record (EHR) settings
 */
export interface EhrIntegrationSettings extends BaseIntegrationSettings {
  /** EHR vendor name */
  vendor?: string;
  /** FHIR version (e.g., R4, STU3) */
  fhirVersion?: string;
  /** Enable bi-directional sync */
  bidirectionalSync?: boolean;
  /** Data types to sync */
  syncDataTypes?: string[];
}

/**
 * Pharmacy integration settings
 */
export interface PharmacyIntegrationSettings extends BaseIntegrationSettings {
  /** Pharmacy name */
  pharmacyName?: string;
  /** Pharmacy license number */
  licenseNumber?: string;
  /** Enable e-prescribing */
  enableEPrescribing?: boolean;
  /** Formulary preferences */
  formularyPreferences?: string[];
}

/**
 * Laboratory integration settings
 */
export interface LaboratoryIntegrationSettings extends BaseIntegrationSettings {
  /** Lab name */
  labName?: string;
  /** Lab certification number */
  certificationNumber?: string;
  /** Result notification preferences */
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  /** Test type filters */
  testTypeFilters?: string[];
}

/**
 * Insurance verification settings
 */
export interface InsuranceIntegrationSettings extends BaseIntegrationSettings {
  /** Insurance provider name */
  provider?: string;
  /** Verification frequency in days */
  verificationFrequencyDays?: number;
  /** Enable automatic reverification */
  autoReverify?: boolean;
  /** Coverage types to verify */
  coverageTypes?: string[];
}

/**
 * Parent portal settings
 */
export interface ParentPortalIntegrationSettings extends BaseIntegrationSettings {
  /** Portal name */
  portalName?: string;
  /** Enable consent management */
  enableConsentManagement?: boolean;
  /** Enable notifications */
  enableNotifications?: boolean;
  /** Notification channels */
  notificationChannels?: ('email' | 'sms' | 'push')[];
}

/**
 * Government reporting settings
 */
export interface GovernmentReportingSettings extends BaseIntegrationSettings {
  /** Reporting agency */
  agency?: string;
  /** Report format (e.g., HL7, XML, JSON) */
  reportFormat?: string;
  /** Submission frequency */
  submissionFrequency?: string;
  /** Required fields */
  requiredFields?: string[];
}

/**
 * Union type for all integration settings
 */
export type IntegrationSettings =
  | SisIntegrationSettings
  | EhrIntegrationSettings
  | PharmacyIntegrationSettings
  | LaboratoryIntegrationSettings
  | InsuranceIntegrationSettings
  | ParentPortalIntegrationSettings
  | GovernmentReportingSettings
  | BaseIntegrationSettings;
