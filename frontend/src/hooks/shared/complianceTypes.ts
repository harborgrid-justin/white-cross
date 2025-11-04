/**
 * Healthcare Compliance Types
 *
 * Type definitions for HIPAA and healthcare-specific compliance.
 *
 * @module hooks/shared/complianceTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * PHI (Protected Health Information) types
 */
export type PHIType =
  | 'name'
  | 'address'
  | 'birth_date'
  | 'death_date'
  | 'ssn'
  | 'medical_record'
  | 'account_number'
  | 'certificate_number'
  | 'license_number'
  | 'device_identifier'
  | 'biometric'
  | 'photograph'
  | 'other';

/**
 * Compliance level for data handling
 */
export type ComplianceLevel =
  | 'public'      // No PHI, no restrictions
  | 'internal'    // Internal data, basic controls
  | 'restricted'  // Restricted access required
  | 'phi'         // PHI data, full HIPAA compliance
  | 'critical';   // Safety-critical data

/**
 * Data retention policy
 */
export interface RetentionPolicy {
  retentionPeriod: number; // in days
  autoDelete: boolean;
  requiresApproval: boolean;
  archiveRequired: boolean;
}

/**
 * Compliance validation result
 */
export interface ComplianceValidation {
  isCompliant: boolean;
  level: ComplianceLevel;
  phiTypes: PHIType[];
  violations: string[];
  recommendations: string[];
  retentionPolicy: RetentionPolicy;
}

/**
 * Healthcare compliance hook options
 */
export interface UseHealthcareComplianceOptions {
  enablePHIDetection?: boolean;
  enableAuditLogging?: boolean;
  strictMode?: boolean;
}

/**
 * Compliance configuration
 */
export interface ComplianceConfig {
  phiDetectionEnabled: boolean;
  auditLoggingEnabled: boolean;
  strictModeEnabled: boolean;
  retentionPolicies: Record<ComplianceLevel, RetentionPolicy>;
}
