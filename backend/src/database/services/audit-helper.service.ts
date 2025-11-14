/**
 * Audit Helper Service
 * Provides utility methods for audit operations including data sanitization,
 * severity determination, and compliance type classification
 */

import { Injectable } from '@nestjs/common';
import { AuditAction, isPHIEntity, SENSITIVE_FIELDS } from '../types/database.enums';
import { AuditSeverity, ComplianceType } from '../models/audit-log.model';

import { BaseService } from '@/common/base';
/**
 * Audit Helper Service
 *
 * Centralizes utility functions for audit operations:
 * - Sensitive data sanitization
 * - Severity level determination
 * - Compliance type classification
 * - Entity type analysis
 */
@Injectable()
export class AuditHelperService extends BaseService {
  constructor() {
    super('AuditHelperService');
  }

  /**
   * Sanitize sensitive data before storing in audit logs
   * Recursively redacts sensitive fields defined in SENSITIVE_FIELDS
   *
   * @param data - Data object to sanitize
   * @returns Sanitized data object with sensitive fields redacted
   */
  sanitizeSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };

    for (const field of SENSITIVE_FIELDS) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Recursively sanitize nested objects
    for (const [key, value] of Object.entries(sanitized)) {
      if (value && typeof value === 'object') {
        sanitized[key] = this.sanitizeSensitiveData(value);
      }
    }

    return sanitized;
  }

  /**
   * Determine compliance type based on entity type and PHI status
   *
   * @param entityType - Type of entity being audited
   * @param isPHI - Whether the entity contains PHI data
   * @returns Appropriate compliance type (HIPAA, FERPA, or GENERAL)
   */
  determineComplianceType(
    entityType: string,
    isPHI: boolean,
  ): ComplianceType {
    if (isPHI) {
      return ComplianceType.HIPAA;
    }

    const ferpaEntities = [
      'Student',
      'AcademicRecord',
      'GradeTransition',
      'Attendance',
    ];
    if (ferpaEntities.includes(entityType)) {
      return ComplianceType.FERPA;
    }

    return ComplianceType.GENERAL;
  }

  /**
   * Determine severity based on action, entity type, and success status
   *
   * Failed operations are HIGH severity
   * DELETE, BULK_DELETE, EXPORT operations are HIGH severity
   * PHI entity operations are MEDIUM severity
   * All other operations are LOW severity
   *
   * @param action - Audit action being performed
   * @param entityType - Type of entity being audited
   * @param success - Whether the operation succeeded
   * @returns Appropriate severity level
   */
  determineSeverity(
    action: AuditAction,
    entityType: string,
    success: boolean,
  ): AuditSeverity {
    if (!success) {
      return AuditSeverity.HIGH;
    }

    const criticalActions = [
      AuditAction.DELETE,
      AuditAction.BULK_DELETE,
      AuditAction.EXPORT,
    ];
    if (criticalActions.includes(action)) {
      return AuditSeverity.HIGH;
    }

    if (isPHIEntity(entityType)) {
      return AuditSeverity.MEDIUM;
    }

    return AuditSeverity.LOW;
  }

  /**
   * Check if an entity type is PHI-related
   *
   * @param entityType - Type of entity to check
   * @returns true if entity contains PHI data
   */
  isPHIEntity(entityType: string): boolean {
    return isPHIEntity(entityType);
  }
}
