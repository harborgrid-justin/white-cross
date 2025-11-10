/**
 * Compliance Utilities and Constants
 * HIPAA compliance helper functions and configuration constants
 */

import { ComplianceCategory, ComplianceReportType, PolicyStatus } from '../enums/index';

/**
 * Compliance validation and utility methods
 */
export class ComplianceUtils {
  /**
   * Valid relationship types for consent forms (HIPAA/FERPA authorized signatories)
   */
  static readonly VALID_RELATIONSHIPS = [
    'Mother',
    'Father',
    'Parent',
    'Legal Guardian',
    'Foster Parent',
    'Grandparent',
    'Stepparent',
    'Other Authorized Adult',
  ];

  /**
   * Version format regex pattern (semantic versioning)
   */
  static readonly VERSION_PATTERN = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;

  /**
   * Validate version format (X.Y or X.Y.Z)
   */
  static validateVersionFormat(version: string): boolean {
    return this.VERSION_PATTERN.test(version);
  }

  /**
   * Validate relationship type for consent forms
   */
  static validateRelationship(relationship: string): boolean {
    return this.VALID_RELATIONSHIPS.includes(relationship);
  }

  /**
   * Validate content length for legal documents
   */
  static validateContentLength(
    content: string,
    minLength: number = 50,
  ): boolean {
    return content.trim().length >= minLength;
  }

  /**
   * Validate signature data size and format
   */
  static validateSignatureData(signatureData: string): {
    valid: boolean;
    error?: string;
  } {
    if (signatureData.length < 10) {
      return {
        valid: false,
        error: 'Digital signature data appears incomplete',
      };
    }
    if (signatureData.length > 100000) {
      return {
        valid: false,
        error: 'Digital signature data is too large (max 100KB)',
      };
    }
    return { valid: true };
  }

  /**
   * Check if policy status transition is valid
   */
  static isValidPolicyStatusTransition(
    currentStatus: PolicyStatus,
    newStatus: PolicyStatus,
  ): { valid: boolean; error?: string } {
    // Cannot reactivate archived or superseded policies
    if (newStatus === PolicyStatus.ACTIVE) {
      if (currentStatus === PolicyStatus.ARCHIVED) {
        return {
          valid: false,
          error:
            'Cannot reactivate an archived policy. Create a new version instead.',
        };
      }
      if (currentStatus === PolicyStatus.SUPERSEDED) {
        return {
          valid: false,
          error:
            'Cannot reactivate a superseded policy. Create a new version instead.',
        };
      }
    }
    return { valid: true };
  }

  /**
   * Calculate days overdue for checklist items
   */
  static calculateDaysOverdue(dueDate: Date): number {
    const now = new Date();
    const diffTime = now.getTime() - dueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get priority level based on days overdue
   */
  static getPriorityLevel(
    daysOverdue: number,
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (daysOverdue > 30) return 'critical';
    if (daysOverdue > 14) return 'high';
    if (daysOverdue > 7) return 'medium';
    return 'low';
  }

  /**
   * Calculate completion percentage for a report
   */
  static calculateCompletionPercentage(
    totalItems: number,
    completedItems: number,
  ): number {
    if (totalItems === 0) return 100;
    return Math.round((completedItems / totalItems) * 100);
  }

  /**
   * Get required compliance categories for report type
   */
  static getRequiredCategories(
    reportType: ComplianceReportType,
  ): ComplianceCategory[] {
    const categoryMap: Record<ComplianceReportType, ComplianceCategory[]> = {
      [ComplianceReportType.HIPAA]: [
        ComplianceCategory.PRIVACY,
        ComplianceCategory.SECURITY,
      ],
      [ComplianceReportType.FERPA]: [
        ComplianceCategory.PRIVACY,
        ComplianceCategory.DOCUMENTATION,
        ComplianceCategory.CONSENT,
      ],
      [ComplianceReportType.MEDICATION_AUDIT]: [
        ComplianceCategory.MEDICATION,
        ComplianceCategory.SAFETY,
      ],
      [ComplianceReportType.STATE_HEALTH]: [
        ComplianceCategory.HEALTH_RECORDS,
        ComplianceCategory.SAFETY,
      ],
      [ComplianceReportType.SAFETY_INSPECTION]: [ComplianceCategory.SAFETY],
      [ComplianceReportType.TRAINING_COMPLIANCE]: [ComplianceCategory.TRAINING],
      [ComplianceReportType.DATA_PRIVACY]: [
        ComplianceCategory.SECURITY,
        ComplianceCategory.PRIVACY,
      ],
      [ComplianceReportType.CUSTOM]: [],
    };
    return categoryMap[reportType] || [];
  }
}

/**
 * Compliance constants for HIPAA and regulatory requirements
 */
export const COMPLIANCE_CONSTANTS = {
  // Content length requirements for legal validity
  MIN_POLICY_CONTENT_LENGTH: 100,
  MIN_CONSENT_CONTENT_LENGTH: 50,
  MIN_SIGNATORY_NAME_LENGTH: 2,
  MIN_MINIMUM_NECESSARY_LENGTH: 10,

  // Signature data limits
  MAX_SIGNATURE_DATA_SIZE: 100000, // 100KB
  MIN_SIGNATURE_DATA_SIZE: 10,

  // Date ranges for alerts and notifications
  OVERDUE_CRITICAL_DAYS: 30,
  OVERDUE_HIGH_DAYS: 14,
  OVERDUE_MEDIUM_DAYS: 7,
  EXPIRING_SOON_DAYS: 7,

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Report generation
  DEFAULT_REPORT_VERSION: '1.0',

  // HIPAA audit retention (7 years required by 45 CFR 164.530(j))
  AUDIT_LOG_RETENTION_DAYS: 2555, // 7 years

  // File size limits
  MAX_DOCUMENT_SIZE: 10485760, // 10MB

  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 100,
} as const;

/**
 * Compliance error messages for consistent error handling
 */
export const COMPLIANCE_ERRORS = {
  // General
  INVALID_INPUT: 'Invalid input provided',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',

  // Validation
  INVALID_VERSION_FORMAT:
    'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)',
  INVALID_RELATIONSHIP:
    'Relationship must be a valid authorized relationship type',
  CONTENT_TOO_SHORT:
    'Content must meet minimum length requirements for legal validity',
  SIGNATURE_INCOMPLETE: 'Digital signature data appears incomplete',
  SIGNATURE_TOO_LARGE: 'Digital signature data is too large (max 100KB)',
  MINIMUM_NECESSARY_TOO_SHORT:
    'Minimum necessary justification must be at least 10 characters (HIPAA requirement)',

  // Policy
  POLICY_ALREADY_ACKNOWLEDGED: 'Policy already acknowledged by this user',
  POLICY_NOT_ACTIVE: 'Policy is not active and cannot be acknowledged',
  POLICY_ARCHIVED_REACTIVATION:
    'Cannot reactivate an archived policy. Create a new version instead.',
  POLICY_SUPERSEDED_REACTIVATION:
    'Cannot reactivate a superseded policy. Create a new version instead.',

  // Consent
  CONSENT_ALREADY_SIGNED: 'Consent form already signed for this student',
  CONSENT_EXPIRED: 'Consent form has expired and cannot be signed',
  CONSENT_NOT_ACTIVE: 'Consent form is not active and cannot be signed',
  CONSENT_ALREADY_WITHDRAWN: 'Consent was already withdrawn',
  SIGNATORY_NAME_REQUIRED: 'Signatory name is required for legal validity',

  // PHI Disclosure
  AUTHORIZATION_DATE_REQUIRED:
    'Authorization date required when authorization is obtained',

  // Dates
  EXPIRATION_DATE_PAST: 'Expiration date must be in the future',
  REVIEW_DATE_BEFORE_EFFECTIVE: 'Review date cannot be before effective date',

  // Reports
  REPORT_NOT_FOUND: 'Compliance report not found',
  CHECKLIST_ITEM_NOT_FOUND: 'Checklist item not found',
  DISCLOSURE_NOT_FOUND: 'PHI disclosure not found',

  // Users
  USER_NOT_FOUND: 'User not found',
  STUDENT_NOT_FOUND: 'Student not found',
} as const;
