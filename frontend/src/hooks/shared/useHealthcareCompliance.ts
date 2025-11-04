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
import {
  detectPHI as detectPHIUtil,
  getComplianceLevel as getComplianceLevelUtil,
  sanitizeForLogging as sanitizeForLoggingUtil
} from './complianceRules';
import {
  getRetentionPolicy as getRetentionPolicyUtil,
  validateCompliance as validateComplianceUtil,
  getAllRetentionPolicies
} from './complianceValidation';
import type {
  UseHealthcareComplianceOptions,
  ComplianceValidation,
  ComplianceConfig
} from './complianceTypes';

// Re-export types
export type {
  PHIType,
  ComplianceLevel,
  RetentionPolicy,
  ComplianceValidation,
  UseHealthcareComplianceOptions,
  ComplianceConfig
} from './complianceTypes';

// Re-export utility functions
export { detectPHI, getComplianceLevel, sanitizeForLogging } from './complianceRules';
export { getRetentionPolicy, validateCompliance, getAllRetentionPolicies } from './complianceValidation';

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
  const detectPHI = useCallback((data: unknown) => {
    return detectPHIUtil(data, enablePHIDetection);
  }, [enablePHIDetection]);

  /**
   * Determine compliance level
   */
  const getComplianceLevel = useCallback((data: unknown) => {
    const phiTypes = detectPHI(data);
    return getComplianceLevelUtil(data, phiTypes);
  }, [detectPHI]);

  /**
   * Get retention policy based on compliance level
   */
  const getRetentionPolicy = useCallback(getRetentionPolicyUtil, []);

  /**
   * Validate compliance for data operation
   */
  const validateCompliance = useCallback((
    data: unknown,
    operation: 'create' | 'read' | 'update' | 'delete' | 'export'
  ): ComplianceValidation => {
    const phiTypes = detectPHI(data);
    const level = getComplianceLevel(data);
    return validateComplianceUtil(level, phiTypes, operation, strictMode);
  }, [detectPHI, getComplianceLevel, strictMode]);

  /**
   * Sanitize data for logging (remove PHI)
   */
  const sanitizeForLogging = useCallback(sanitizeForLoggingUtil, []);

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
  const complianceConfig = useMemo((): ComplianceConfig => ({
    phiDetectionEnabled: enablePHIDetection,
    auditLoggingEnabled: enableAuditLogging,
    strictModeEnabled: strictMode,
    retentionPolicies: getAllRetentionPolicies(),
  }), [enablePHIDetection, enableAuditLogging, strictMode]);

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
