/**
 * LOC: 3BA34FF1EB
 * WC-GEN-244 | utils.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-244 | utils.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import {
  ComplianceReportType,
  ComplianceCategory,
  ComplianceStatus,
  ChecklistItemStatus,
  PolicyStatus,
  ConsentType
} from '../../database/types/enums';

/**
 * Compliance validation utilities
 */
export class ComplianceUtils {
  /**
   * Valid relationship types for consent forms
   */
  static readonly VALID_RELATIONSHIPS = [
    'Mother',
    'Father', 
    'Parent',
    'Legal Guardian',
    'Foster Parent',
    'Grandparent',
    'Stepparent',
    'Other Authorized Adult'
  ];

  /**
   * Version format regex pattern
   */
  static readonly VERSION_PATTERN = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;

  /**
   * Validate version format
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
  static validateContentLength(content: string, minLength: number = 50): boolean {
    return content.trim().length >= minLength;
  }

  /**
   * Validate signature data
   */
  static validateSignatureData(signatureData: string): { valid: boolean; error?: string } {
    if (signatureData.length < 10) {
      return { valid: false, error: 'Digital signature data appears incomplete' };
    }
    if (signatureData.length > 100000) {
      return { valid: false, error: 'Digital signature data is too large (max 100KB)' };
    }
    return { valid: true };
  }

  /**
   * Check if policy status transition is valid
   */
  static isValidPolicyStatusTransition(
    currentStatus: PolicyStatus,
    newStatus: PolicyStatus
  ): { valid: boolean; error?: string } {
    // Cannot reactivate archived or superseded policies
    if (newStatus === PolicyStatus.ACTIVE) {
      if (currentStatus === PolicyStatus.ARCHIVED) {
        return {
          valid: false,
          error: 'Cannot reactivate an archived policy. Create a new version instead.'
        };
      }
      if (currentStatus === PolicyStatus.SUPERSEDED) {
        return {
          valid: false,
          error: 'Cannot reactivate a superseded policy. Create a new version instead.'
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
  static getPriorityLevel(daysOverdue: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysOverdue > 30) return 'critical';
    if (daysOverdue > 14) return 'high';
    if (daysOverdue > 7) return 'medium';
    return 'low';
  }

  /**
   * Format compliance status for display
   */
  static formatComplianceStatus(status: ComplianceStatus): string {
    const statusMap: Record<ComplianceStatus, string> = {
      [ComplianceStatus.PENDING]: 'Pending Review',
      [ComplianceStatus.COMPLIANT]: 'Compliant',
      [ComplianceStatus.NON_COMPLIANT]: 'Non-Compliant',
      [ComplianceStatus.UNDER_REVIEW]: 'Under Review'
    };
    return statusMap[status] || status;
  }

  /**
   * Format checklist item status for display
   */
  static formatChecklistStatus(status: ChecklistItemStatus): string {
    const statusMap: Record<ChecklistItemStatus, string> = {
      [ChecklistItemStatus.PENDING]: 'Pending',
      [ChecklistItemStatus.COMPLETED]: 'Completed',
      [ChecklistItemStatus.NOT_APPLICABLE]: 'Not Applicable',
      [ChecklistItemStatus.IN_PROGRESS]: 'In Progress',
      [ChecklistItemStatus.FAILED]: 'Failed'
    };
    return statusMap[status] || status;
  }

  /**
   * Get compliance category display name
   */
  static getCategoryDisplayName(category: ComplianceCategory): string {
    const categoryMap: Record<ComplianceCategory, string> = {
      [ComplianceCategory.PRIVACY]: 'Privacy',
      [ComplianceCategory.SECURITY]: 'Security',
      [ComplianceCategory.DOCUMENTATION]: 'Documentation',
      [ComplianceCategory.TRAINING]: 'Training',
      [ComplianceCategory.MEDICATION]: 'Medication',
      [ComplianceCategory.HEALTH_RECORDS]: 'Health Records',
      [ComplianceCategory.SAFETY]: 'Safety',
      [ComplianceCategory.CONSENT]: 'Consent'
    };
    return categoryMap[category] || category;
  }

  /**
   * Get report type display name
   */
  static getReportTypeDisplayName(reportType: ComplianceReportType): string {
    const typeMap: Record<ComplianceReportType, string> = {
      [ComplianceReportType.HIPAA]: 'HIPAA Compliance',
      [ComplianceReportType.FERPA]: 'FERPA Compliance',
      [ComplianceReportType.MEDICATION_AUDIT]: 'Medication Audit',
      [ComplianceReportType.STATE_HEALTH]: 'State Health Compliance',
      [ComplianceReportType.SAFETY_INSPECTION]: 'Safety Inspection',
      [ComplianceReportType.TRAINING_COMPLIANCE]: 'Training Compliance',
      [ComplianceReportType.DATA_PRIVACY]: 'Data Privacy',
      [ComplianceReportType.CUSTOM]: 'Custom Report'
    };
    return typeMap[reportType] || reportType;
  }

  /**
   * Get consent type display name
   */
  static getConsentTypeDisplayName(consentType: ConsentType): string {
    // This would need to be updated based on actual ConsentType enum values
    // Assuming common consent types for now
    return consentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Calculate completion percentage for a report
   */
  static calculateCompletionPercentage(
    totalItems: number,
    completedItems: number
  ): number {
    if (totalItems === 0) return 100;
    return Math.round((completedItems / totalItems) * 100);
  }

  /**
   * Determine if date is in the future
   */
  static isFutureDate(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Determine if date is past due
   */
  static isPastDue(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format datetime for display
   */
  static formatDateTime(date: Date): string {
    return date.toLocaleString();
  }

  /**
   * Generate report period string
   */
  static generateReportPeriod(startDate: Date, endDate: Date): string {
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    return `${start} to ${end}`;
  }

  /**
   * Generate monthly report period
   */
  static generateMonthlyPeriod(year: number, month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[month - 1]} ${year}`;
  }

  /**
   * Generate quarterly report period
   */
  static generateQuarterlyPeriod(year: number, quarter: number): string {
    const quarterMap: Record<number, string> = {
      1: 'Q1 (Jan-Mar)',
      2: 'Q2 (Apr-Jun)',
      3: 'Q3 (Jul-Sep)',
      4: 'Q4 (Oct-Dec)'
    };
    return `${year} ${quarterMap[quarter] || `Q${quarter}`}`;
  }

  /**
   * Get required compliance categories for report type
   */
  static getRequiredCategories(reportType: ComplianceReportType): ComplianceCategory[] {
    const categoryMap: Record<ComplianceReportType, ComplianceCategory[]> = {
      [ComplianceReportType.HIPAA]: [
        ComplianceCategory.PRIVACY,
        ComplianceCategory.SECURITY
      ],
      [ComplianceReportType.FERPA]: [
        ComplianceCategory.PRIVACY,
        ComplianceCategory.DOCUMENTATION,
        ComplianceCategory.CONSENT
      ],
      [ComplianceReportType.MEDICATION_AUDIT]: [
        ComplianceCategory.MEDICATION,
        ComplianceCategory.SAFETY
      ],
      [ComplianceReportType.STATE_HEALTH]: [
        ComplianceCategory.HEALTH_RECORDS,
        ComplianceCategory.SAFETY
      ],
      [ComplianceReportType.SAFETY_INSPECTION]: [
        ComplianceCategory.SAFETY
      ],
      [ComplianceReportType.TRAINING_COMPLIANCE]: [
        ComplianceCategory.TRAINING
      ],
      [ComplianceReportType.DATA_PRIVACY]: [
        ComplianceCategory.SECURITY,
        ComplianceCategory.PRIVACY
      ],
      [ComplianceReportType.CUSTOM]: []
    };
    return categoryMap[reportType] || [];
  }

  /**
   * Sanitize input for database storage
   */
  static sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate email format (basic validation)
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate unique identifier
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

/**
 * Compliance constants
 */
export const COMPLIANCE_CONSTANTS = {
  // Content length requirements
  MIN_POLICY_CONTENT_LENGTH: 100,
  MIN_CONSENT_CONTENT_LENGTH: 50,
  MIN_SIGNATORY_NAME_LENGTH: 2,
  
  // Signature data limits
  MAX_SIGNATURE_DATA_SIZE: 100000, // 100KB
  MIN_SIGNATURE_DATA_SIZE: 10,
  
  // Date ranges for alerts
  OVERDUE_CRITICAL_DAYS: 30,
  OVERDUE_HIGH_DAYS: 14,
  OVERDUE_MEDIUM_DAYS: 7,
  EXPIRING_SOON_DAYS: 7,
  
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Report generation
  DEFAULT_REPORT_VERSION: '1.0',
  
  // Audit retention
  AUDIT_LOG_RETENTION_DAYS: 2555, // 7 years for HIPAA compliance
  
  // File size limits
  MAX_DOCUMENT_SIZE: 10485760, // 10MB
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 100
} as const;

/**
 * Error messages
 */
export const COMPLIANCE_ERRORS = {
  // General
  INVALID_INPUT: 'Invalid input provided',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  
  // Validation
  INVALID_VERSION_FORMAT: 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)',
  INVALID_RELATIONSHIP: 'Relationship must be a valid authorized relationship type',
  CONTENT_TOO_SHORT: 'Content must meet minimum length requirements for legal validity',
  SIGNATURE_INCOMPLETE: 'Digital signature data appears incomplete',
  SIGNATURE_TOO_LARGE: 'Digital signature data is too large (max 100KB)',
  
  // Policy
  POLICY_ALREADY_ACKNOWLEDGED: 'Policy already acknowledged by this user',
  POLICY_NOT_ACTIVE: 'Policy is not active and cannot be acknowledged',
  POLICY_ARCHIVED_REACTIVATION: 'Cannot reactivate an archived policy. Create a new version instead.',
  POLICY_SUPERSEDED_REACTIVATION: 'Cannot reactivate a superseded policy. Create a new version instead.',
  
  // Consent
  CONSENT_ALREADY_SIGNED: 'Consent form already signed for this student',
  CONSENT_EXPIRED: 'Consent form has expired and cannot be signed',
  CONSENT_NOT_ACTIVE: 'Consent form is not active and cannot be signed',
  CONSENT_ALREADY_WITHDRAWN: 'Consent was already withdrawn',
  
  // Dates
  EXPIRATION_DATE_PAST: 'Expiration date must be in the future',
  REVIEW_DATE_BEFORE_EFFECTIVE: 'Review date cannot be before effective date',
  
  // Reports
  REPORT_NOT_FOUND: 'Compliance report not found',
  CHECKLIST_ITEM_NOT_FOUND: 'Checklist item not found',
  
  // Users
  USER_NOT_FOUND: 'User not found',
  STUDENT_NOT_FOUND: 'Student not found'
} as const;
