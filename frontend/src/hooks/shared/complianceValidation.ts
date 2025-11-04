/**
 * Healthcare Compliance Validation
 *
 * Validation logic and retention policies for healthcare compliance.
 *
 * @module hooks/shared/complianceValidation
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type {
  ComplianceLevel,
  RetentionPolicy,
  ComplianceValidation,
  PHIType
} from './complianceTypes';

/**
 * Get retention policy based on compliance level
 */
export function getRetentionPolicy(level: ComplianceLevel): RetentionPolicy {
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
}

/**
 * Validate compliance for data operation
 */
export function validateCompliance(
  level: ComplianceLevel,
  phiTypes: PHIType[],
  operation: 'create' | 'read' | 'update' | 'delete' | 'export',
  strictMode: boolean = false
): ComplianceValidation {
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
}

/**
 * Get all retention policies
 */
export function getAllRetentionPolicies(): Record<ComplianceLevel, RetentionPolicy> {
  return {
    public: getRetentionPolicy('public'),
    internal: getRetentionPolicy('internal'),
    restricted: getRetentionPolicy('restricted'),
    phi: getRetentionPolicy('phi'),
    critical: getRetentionPolicy('critical'),
  };
}
