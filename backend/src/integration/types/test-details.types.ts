/**
 * Integration Test Details Types
 * Type definitions for integration test result details
 */

/**
 * SIS integration test details
 */
export interface SisTestDetails {
  /** SIS system version */
  version: string;
  /** Number of students accessible */
  studentCount: number;
  /** Last successful sync timestamp */
  lastSync: string;
}

/**
 * EHR integration test details
 */
export interface EhrTestDetails {
  /** EHR system version */
  version: string;
  /** Number of records available */
  recordsAvailable: number;
  /** Integration version (e.g., HL7 FHIR R4) */
  integrationVersion: string;
}

/**
 * Pharmacy integration test details
 */
export interface PharmacyTestDetails {
  /** Pharmacy name */
  pharmacyName: string;
  /** Number of active orders */
  activeOrders: number;
  /** E-prescribing capability status */
  ePrescribingEnabled?: boolean;
}

/**
 * Laboratory integration test details
 */
export interface LaboratoryTestDetails {
  /** Laboratory name */
  labName: string;
  /** Number of pending results */
  pendingResults: number;
  /** Certification status */
  certificationStatus?: string;
}

/**
 * Insurance integration test details
 */
export interface InsuranceTestDetails {
  /** Insurance provider name */
  provider: string;
  /** API version */
  apiVersion: string;
  /** Verification capabilities */
  capabilities?: string[];
}

/**
 * Parent portal integration test details
 */
export interface ParentPortalTestDetails {
  /** Number of active parents */
  activeParents: number;
  /** Portal version */
  portalVersion: string;
  /** Available features */
  features?: string[];
}

/**
 * Generic test details with flexible structure
 */
export interface GenericTestDetails {
  /** Connection status */
  connectionStatus: 'success' | 'failed';
  /** Response time in milliseconds */
  responseTime?: number;
  /** Additional properties */
  [key: string]: unknown;
}

/**
 * Union type for all test details
 */
export type IntegrationTestDetails =
  | SisTestDetails
  | EhrTestDetails
  | PharmacyTestDetails
  | LaboratoryTestDetails
  | InsuranceTestDetails
  | ParentPortalTestDetails
  | GenericTestDetails;
