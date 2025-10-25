/**
 * LOC: 4FE7284D02
 * WC-GEN-243 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - statisticsService.ts (services/compliance/statisticsService.ts)
 */

/**
 * WC-GEN-243 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  ConsentType,
  PolicyCategory,
  PolicyStatus,
  AuditAction
} from '../../database/types/enums';

/**
 * Type definitions for compliance services.
 *
 * This module defines interfaces and types for HIPAA compliance management,
 * including compliance reports, audit logs, consent forms, and policy documents.
 * These types ensure type safety and consistent data structures across the
 * compliance domain.
 *
 * @module services/compliance/types
 */

// ========== Interface Definitions ==========

/**
 * Data structure for creating a new compliance report.
 *
 * Compliance reports track regulatory compliance status for various
 * healthcare and educational standards (HIPAA, FERPA, state regulations).
 *
 * @interface CreateComplianceReportData
 * @property {ComplianceReportType} reportType - Type of compliance report (e.g., 'HIPAA_AUDIT', 'MEDICATION_COMPLIANCE')
 * @property {string} title - Title of the compliance report
 * @property {string} [description] - Optional detailed description of the report scope
 * @property {string} period - Reporting period (e.g., 'Q1 2025', 'January 2025', '2024-2025 School Year')
 * @property {Date} [dueDate] - Optional deadline for report completion
 * @property {string} createdById - ID of the user creating the report
 */
export interface CreateComplianceReportData {
  reportType: ComplianceReportType;
  title: string;
  description?: string;
  period: string;
  dueDate?: Date;
  createdById: string;
}

/**
 * Data structure for creating a compliance checklist item.
 *
 * Checklist items represent specific compliance requirements that must be
 * verified and documented for regulatory compliance.
 *
 * @interface CreateChecklistItemData
 * @property {string} requirement - The specific compliance requirement to verify
 * @property {string} [description] - Optional detailed description of the requirement
 * @property {ComplianceCategory} category - Category of compliance (e.g., 'HIPAA_SECURITY', 'MEDICATION_SAFETY')
 * @property {Date} [dueDate] - Optional deadline for completing this requirement
 * @property {string} [reportId] - Optional ID of parent compliance report
 */
export interface CreateChecklistItemData {
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  dueDate?: Date;
  reportId?: string;
}

/**
 * Data structure for creating a consent form.
 *
 * @interface CreateConsentFormData
 * @property {ConsentType} type - Type of consent (e.g., 'MEDICATION_ADMINISTRATION', 'PHOTO_RELEASE')
 * @property {string} title - User-facing title of the consent form
 * @property {string} description - Brief description of consent purpose
 * @property {string} content - Full legal text of consent form (minimum 50 characters)
 * @property {string} [version] - Version number in X.Y or X.Y.Z format (defaults to '1.0')
 * @property {Date} [expiresAt] - Optional expiration date for the consent form
 */
export interface CreateConsentFormData {
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

/**
 * Data structure for creating a policy document.
 *
 * Policy documents define organizational policies for HIPAA, FERPA, safety,
 * and operational procedures requiring staff acknowledgment.
 *
 * @interface CreatePolicyData
 * @property {string} title - Title of the policy document
 * @property {PolicyCategory} category - Policy category (e.g., 'HIPAA_PRIVACY', 'MEDICATION_ADMINISTRATION')
 * @property {string} content - Full text of the policy (minimum 100 characters)
 * @property {string} [version] - Version number in X.Y or X.Y.Z format (defaults to '1.0')
 * @property {Date} effectiveDate - Date when policy becomes effective
 * @property {Date} [reviewDate] - Optional scheduled review date for policy updates
 */
export interface CreatePolicyData {
  title: string;
  category: PolicyCategory;
  content: string;
  version?: string;
  effectiveDate: Date;
  reviewDate?: Date;
}

/**
 * Filter criteria for querying compliance reports.
 *
 * @interface ComplianceReportFilters
 * @property {ComplianceReportType} [reportType] - Filter by report type
 * @property {ComplianceStatus} [status] - Filter by compliance status (COMPLIANT, PENDING, NON_COMPLIANT)
 * @property {string} [period] - Filter by reporting period
 */
export interface ComplianceReportFilters {
  reportType?: ComplianceReportType;
  status?: ComplianceStatus;
  period?: string;
}

/**
 * Filter criteria for querying audit logs.
 *
 * @interface AuditLogFilters
 * @property {string} [userId] - Filter by user who performed the action
 * @property {string} [entityType] - Filter by entity type (e.g., 'HealthRecord', 'Medication')
 * @property {AuditAction} [action] - Filter by action type (CREATE, VIEW, UPDATE, DELETE)
 * @property {Date} [startDate] - Filter logs created on or after this date
 * @property {Date} [endDate] - Filter logs created on or before this date
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Aggregated compliance statistics for dashboard and reporting.
 *
 * @interface ComplianceStatistics
 * @property {Object} reports - Statistics about compliance reports
 * @property {number} reports.total - Total number of compliance reports
 * @property {number} reports.compliant - Number of compliant reports
 * @property {number} reports.pending - Number of pending reports
 * @property {number} reports.nonCompliant - Number of non-compliant reports
 * @property {Object} checklistItems - Statistics about checklist items
 * @property {number} checklistItems.total - Total number of checklist items
 * @property {number} checklistItems.completed - Number of completed items
 * @property {number} checklistItems.overdue - Number of overdue items
 * @property {number} checklistItems.completionRate - Completion rate as percentage (0-100)
 */
export interface ComplianceStatistics {
  reports: {
    total: number;
    compliant: number;
    pending: number;
    nonCompliant: number;
  };
  checklistItems: {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
}

/**
 * Pagination metadata for paginated query results.
 *
 * @interface PaginationResult
 * @property {number} page - Current page number (1-based)
 * @property {number} limit - Number of items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} pages - Total number of pages
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Data structure for signing a consent form.
 *
 * @interface SignConsentFormData
 * @property {string} consentFormId - ID of the consent form being signed
 * @property {string} studentId - ID of the student for whom consent is given
 * @property {string} signedBy - Full name of the person signing
 * @property {string} relationship - Relationship to student from authorized list
 * @property {string} [signatureData] - Optional base64-encoded digital signature image
 * @property {string} [ipAddress] - Optional IP address for audit trail
 */
export interface SignConsentFormData {
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Data structure for creating an audit log entry.
 *
 * @interface CreateAuditLogData
 * @property {string} [userId] - ID of user performing action (optional for system actions)
 * @property {AuditAction} action - Action type (CREATE, VIEW, UPDATE, DELETE, etc.)
 * @property {string} entityType - Type of entity accessed (e.g., 'HealthRecord', 'Medication')
 * @property {string} [entityId] - Optional ID of the specific entity instance
 * @property {any} [changes] - Optional change details (before/after values)
 * @property {string} [ipAddress] - Optional IP address for security tracking
 * @property {string} [userAgent] - Optional browser/client user agent string
 */
export interface CreateAuditLogData {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Data structure for updating a compliance report.
 *
 * @interface UpdateComplianceReportData
 * @property {ComplianceStatus} [status] - Updated compliance status
 * @property {any} [findings] - Findings from compliance review
 * @property {any} [recommendations] - Recommendations for improving compliance
 * @property {string} [submittedBy] - ID of user submitting the report
 * @property {string} [reviewedBy] - ID of user reviewing the report
 */
export interface UpdateComplianceReportData {
  status?: ComplianceStatus;
  findings?: any;
  recommendations?: any;
  submittedBy?: string;
  reviewedBy?: string;
}

/**
 * Data structure for updating a checklist item.
 *
 * @interface UpdateChecklistItemData
 * @property {ChecklistItemStatus} [status] - Updated status (PENDING, IN_PROGRESS, COMPLETED)
 * @property {string} [evidence] - Evidence documenting completion
 * @property {string} [notes] - Additional notes about the requirement
 * @property {string} [completedBy] - ID of user who completed the item
 */
export interface UpdateChecklistItemData {
  status?: ChecklistItemStatus;
  evidence?: string;
  notes?: string;
  completedBy?: string;
}

/**
 * Data structure for updating a policy document.
 *
 * @interface UpdatePolicyData
 * @property {PolicyStatus} [status] - Updated policy status (DRAFT, ACTIVE, ARCHIVED, SUPERSEDED)
 * @property {string} [approvedBy] - ID of user approving the policy
 * @property {Date} [reviewDate] - Updated scheduled review date
 */
export interface UpdatePolicyData {
  status?: PolicyStatus;
  approvedBy?: string;
  reviewDate?: Date;
}
