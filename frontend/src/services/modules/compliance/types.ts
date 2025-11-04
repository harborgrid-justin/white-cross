/**
 * @fileoverview Compliance API Type Definitions
 * @module services/modules/compliance/types
 * @category Services - Compliance
 *
 * Interface definitions for the compliance API service layer.
 * Defines the contract for all compliance-related operations.
 */

import type {
  ComplianceReport,
  ConsentForm,
  PolicyDocument,
  ComplianceChecklistItem,
  ConsentSignature,
  PolicyAcknowledgment,
  AuditLog,
  ComplianceStatistics,
  ComplianceReportFilters,
  ConsentFormFilters,
  PolicyDocumentFilters,
  AuditLogFilters,
  CreateComplianceReportData,
  UpdateComplianceReportData,
  CreateChecklistItemData,
  UpdateChecklistItemData,
  CreateConsentFormData,
  SignConsentFormData,
  CreatePolicyData,
  UpdatePolicyData,
  ComplianceReportsResponse,
  ComplianceReportResponse,
  ConsentFormsResponse,
  ConsentSignatureResponse,
  StudentConsentsResponse,
  PolicyDocumentsResponse,
  PolicyDocumentResponse,
  PolicyAcknowledgmentResponse,
  AuditLogsResponse,
  ChecklistItemResponse,
  ConsentFormResponse,
  SuccessResponse,
} from '../../../types/domain/compliance';

/**
 * Compliance API Interface
 *
 * Comprehensive interface for HIPAA/FERPA compliance management.
 * Organized by functional domains:
 * - Compliance Reports
 * - Checklist Items
 * - Consent Forms
 * - Policy Documents
 * - Statistics and Audit Logs
 */
export interface IComplianceApi {
  // ============================================================================
  // Compliance Reports
  // ============================================================================

  /**
   * Get compliance reports with pagination and filters
   */
  getReports(params?: ComplianceReportFilters): Promise<ComplianceReportsResponse>;

  /**
   * Get compliance report by ID with checklist items
   */
  getReportById(id: string): Promise<ComplianceReportResponse>;

  /**
   * Create a new compliance report
   */
  createReport(data: CreateComplianceReportData): Promise<ComplianceReportResponse>;

  /**
   * Update a compliance report (status, findings, recommendations)
   */
  updateReport(id: string, data: UpdateComplianceReportData): Promise<ComplianceReportResponse>;

  /**
   * Delete a compliance report
   */
  deleteReport(id: string): Promise<SuccessResponse>;

  /**
   * Generate a compliance report with automatic checklist items
   */
  generateReport(reportType: string, period: string): Promise<ComplianceReportResponse>;

  // ============================================================================
  // Checklist Items
  // ============================================================================

  /**
   * Add a checklist item to a report
   */
  addChecklistItem(data: CreateChecklistItemData): Promise<ChecklistItemResponse>;

  /**
   * Update a checklist item (status, evidence, notes)
   */
  updateChecklistItem(id: string, data: UpdateChecklistItemData): Promise<ChecklistItemResponse>;

  // ============================================================================
  // Consent Forms
  // ============================================================================

  /**
   * Get consent forms with optional active status filter
   */
  getConsentForms(filters?: ConsentFormFilters): Promise<ConsentFormsResponse>;

  /**
   * Create a consent form template
   */
  createConsentForm(data: CreateConsentFormData): Promise<ConsentFormResponse>;

  /**
   * Sign a consent form for a student
   */
  signConsentForm(data: SignConsentFormData): Promise<ConsentSignatureResponse>;

  /**
   * Get all consent signatures for a student
   */
  getStudentConsents(studentId: string): Promise<StudentConsentsResponse>;

  /**
   * Withdraw a consent signature
   */
  withdrawConsent(signatureId: string): Promise<ConsentSignatureResponse>;

  // ============================================================================
  // Policy Documents
  // ============================================================================

  /**
   * Get policy documents with filters
   */
  getPolicies(filters?: PolicyDocumentFilters): Promise<PolicyDocumentsResponse>;

  /**
   * Create a new policy document
   */
  createPolicy(data: CreatePolicyData): Promise<PolicyDocumentResponse>;

  /**
   * Update a policy document (status, approval, review date)
   */
  updatePolicy(id: string, data: UpdatePolicyData): Promise<PolicyDocumentResponse>;

  /**
   * Acknowledge a policy document (tracks user acceptance)
   */
  acknowledgePolicy(policyId: string): Promise<PolicyAcknowledgmentResponse>;

  // ============================================================================
  // Statistics and Audit Logs
  // ============================================================================

  /**
   * Get compliance statistics overview
   */
  getStatistics(period?: string): Promise<ComplianceStatistics>;

  /**
   * Get audit logs with pagination and filters for HIPAA compliance
   */
  getAuditLogs(filters?: AuditLogFilters): Promise<AuditLogsResponse>;
}

// Re-export all compliance types for convenience
export type {
  ComplianceReport,
  ConsentForm,
  PolicyDocument,
  ComplianceChecklistItem,
  ConsentSignature,
  PolicyAcknowledgment,
  AuditLog,
  ComplianceStatistics,
  ComplianceReportFilters,
  ConsentFormFilters,
  PolicyDocumentFilters,
  AuditLogFilters,
  CreateComplianceReportData,
  UpdateComplianceReportData,
  CreateChecklistItemData,
  UpdateChecklistItemData,
  CreateConsentFormData,
  SignConsentFormData,
  CreatePolicyData,
  UpdatePolicyData,
  ComplianceReportsResponse,
  ComplianceReportResponse,
  ConsentFormsResponse,
  ConsentSignatureResponse,
  StudentConsentsResponse,
  PolicyDocumentsResponse,
  PolicyDocumentResponse,
  PolicyAcknowledgmentResponse,
  AuditLogsResponse,
  ChecklistItemResponse,
  ConsentFormResponse,
  SuccessResponse,
};
