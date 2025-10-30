/**
 * Healthcare Compliance Hook
 * 
 * HIPAA and healthcare-specific compliance utilities including
 * PHI detection, data retention policies, and audit requirements.
 * 
 * @module hooks/shared/useHealthcareCompliance
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback, useMemo } from 'react';
import { useAuditLog } from './useAuditLog';

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
 * Healthcare Compliance Hook
 */
export function useHealthcareCompliance(options: UseHealthcareComplianceOptions = {}) {
  const {
    enablePHIDetection = true,
    enableAuditLogging = true,
    strictMode = process.env.NODE_ENV === 'production'
  } = options;

  const { logPHIAccess, logComplianceViolation } = useAuditLog();

  /**
   * Detect PHI in data
   */
  const detectPHI = useCallback((data: unknown): PHIType[] => {
    if (!enablePHIDetection) return [];

    const phiTypes: PHIType[] = [];
    const dataStr = JSON.stringify(data).toLowerCase();

    // Name patterns
    if (/\b(first_?name|last_?name|full_?name|patient_?name)\b/.test(dataStr)) {
      phiTypes.push('name');
    }

    // Address patterns
    if (/\b(address|street|city|state|zip|postal)\b/.test(dataStr)) {
      phiTypes.push('address');
    }

    // Date patterns
    if (/\b(birth_?date|dob|date_of_birth)\b/.test(dataStr)) {
      phiTypes.push('birth_date');
    }

    // SSN patterns
    if (/\b(ssn|social_security|social_security_number)\b/.test(dataStr)) {
      phiTypes.push('ssn');
    }

    // Medical record patterns
    if (/\b(medical_?record|mrn|chart_?number)\b/.test(dataStr)) {
      phiTypes.push('medical_record');
    }

    // Account number patterns
    if (/\b(account_?number|patient_?id)\b/.test(dataStr)) {
      phiTypes.push('account_number');
    }

    return phiTypes;
  }, [enablePHIDetection]);

  /**
   * Determine compliance level
   */
  const getComplianceLevel = useCallback((data: unknown): ComplianceLevel => {
    const phiTypes = detectPHI(data);
    
    if (phiTypes.length > 0) {
      return 'phi';
    }

    const dataStr = JSON.stringify(data).toLowerCase();
    
    // Check for critical safety data
    if (/\b(allergy|medication|dosage|vital_signs|emergency)\b/.test(dataStr)) {
      return 'critical';
    }

    // Check for restricted internal data
    if (/\b(internal|confidential|restricted)\b/.test(dataStr)) {
      return 'restricted';
    }

    // Check for internal business data
    if (/\b(employee|staff|internal_id)\b/.test(dataStr)) {
      return 'internal';
    }

    return 'public';
  }, [detectPHI]);

  /**
   * Get retention policy based on compliance level
   */
  const getRetentionPolicy = useCallback((level: ComplianceLevel): RetentionPolicy => {
    const policies: Record<ComplianceLevel, RetentionPolicy> = {
      public: {
        retentionPeriod: 365, // 1 year
        autoDelete: true,
        requiresApproval: false,
        archiveRequired: false,
      },
      internal: {
        retentionPeriod: 365 * 3, // 3 years
        autoDelete: true,
        requiresApproval: false,
        archiveRequired: true,
      },
      restricted: {
        retentionPeriod: 365 * 7, // 7 years
        autoDelete: false,
        requiresApproval: true,
        archiveRequired: true,
      },
      phi: {
        retentionPeriod: 365 * 6, // 6 years (HIPAA minimum)
        autoDelete: false,
        requiresApproval: true,
        archiveRequired: true,
      },
      critical: {
        retentionPeriod: 365 * 10, // 10 years (safety critical)
        autoDelete: false,
        requiresApproval: true,
        archiveRequired: true,
      },
    };

    return policies[level];
  }, []);

  /**
   * Validate compliance for data operation
   */
  const validateCompliance = useCallback((
    data: unknown,
    operation: 'create' | 'read' | 'update' | 'delete' | 'export'
  ): ComplianceValidation => {
    const phiTypes = detectPHI(data);
    const level = getComplianceLevel(data);
    const retentionPolicy = getRetentionPolicy(level);
    
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Check for compliance violations
    if (level === 'phi' && operation === 'export') {
      violations.push('PHI export requires additional authorization');
      recommendations.push('Implement PHI export approval workflow');
    }

    if (level === 'critical' && operation === 'delete') {
      violations.push('Safety-critical data cannot be deleted without approval');
      recommendations.push('Route deletion request through safety review board');
    }

    if (strictMode && phiTypes.length > 0 && operation === 'read') {
      recommendations.push('Log PHI access for audit trail');
    }

    const isCompliant = violations.length === 0;

    return {
      isCompliant,
      level,
      phiTypes,
      violations,
      recommendations,
      retentionPolicy,
    };
  }, [detectPHI, getComplianceLevel, getRetentionPolicy, strictMode]);

  /**
   * Sanitize data for logging (remove PHI)
   */
  const sanitizeForLogging = useCallback((data: unknown): unknown => {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data as Record<string, unknown> };
    const phiFields = [
      'firstName', 'lastName', 'fullName', 'name',
      'address', 'street', 'city', 'state', 'zip',
      'birthDate', 'dob', 'dateOfBirth',
      'ssn', 'socialSecurity', 'socialSecurityNumber',
      'medicalRecord', 'mrn', 'chartNumber',
      'accountNumber', 'patientId'
    ];

    for (const field of phiFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }, []);

  /**
   * Log compliant data access
   */
  const logCompliantAccess = useCallback(async (
    resource: string,
    action: 'view' | 'edit' | 'export' | 'print',
    data: unknown,
    patientId?: string
  ) => {
    if (!enableAuditLogging) return;

    const validation = validateCompliance(data, action as any);
    
    if (validation.phiTypes.length > 0 && patientId) {
      await logPHIAccess(patientId, resource, action, {
        phiTypes: validation.phiTypes,
        complianceLevel: validation.level,
      });
    }

    // Log compliance violations
    if (!validation.isCompliant) {
      await logComplianceViolation(
        'data_access_violation',
        `Non-compliant ${action} on ${resource}`,
        {
          violations: validation.violations,
          phiTypes: validation.phiTypes,
          level: validation.level,
        }
      );
    }
  }, [enableAuditLogging, validateCompliance, logPHIAccess, logComplianceViolation]);

  /**
   * Memoized compliance configuration
   */
  const complianceConfig = useMemo(() => ({
    phiDetectionEnabled: enablePHIDetection,
    auditLoggingEnabled: enableAuditLogging,
    strictModeEnabled: strictMode,
    retentionPolicies: {
      public: getRetentionPolicy('public'),
      internal: getRetentionPolicy('internal'),
      restricted: getRetentionPolicy('restricted'),
      phi: getRetentionPolicy('phi'),
      critical: getRetentionPolicy('critical'),
    },
  }), [enablePHIDetection, enableAuditLogging, strictMode, getRetentionPolicy]);

  return {
    detectPHI,
    getComplianceLevel,
    getRetentionPolicy,
    validateCompliance,
    sanitizeForLogging,
    logCompliantAccess,
    complianceConfig,
  };
}
