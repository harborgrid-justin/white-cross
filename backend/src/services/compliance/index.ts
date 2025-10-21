/**
 * LOC: 8C5AF60B9B
 * WC-IDX-239 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - complianceReportService.ts (services/compliance/complianceReportService.ts)
 *   - checklistService.ts (services/compliance/checklistService.ts)
 *   - consentService.ts (services/compliance/consentService.ts)
 *   - policyService.ts (services/compliance/policyService.ts)
 *   - auditService.ts (services/compliance/auditService.ts)
 *   - ... and 2 more
 *
 * DOWNSTREAM (imported by):
 *   - complianceService.ts (services/complianceService.ts)
 */

/**
 * WC-IDX-239 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ./complianceReportService, ./checklistService, ./consentService | Dependencies: ./complianceReportService, ./checklistService, ./consentService
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

// Export all types and interfaces
export * from './types';

// Export all services
export { ComplianceReportService } from './complianceReportService';
export { ChecklistService } from './checklistService';
export { ConsentService } from './consentService';
export { PolicyService } from './policyService';
export { AuditService } from './auditService';
export { StatisticsService } from './statisticsService';
export { ReportGenerationService } from './reportGenerationService';

// Export utilities and constants
export { ComplianceUtils, COMPLIANCE_CONSTANTS, COMPLIANCE_ERRORS } from './utils';

// Import all services for the unified interface
import { ComplianceReportService } from './complianceReportService';
import { ChecklistService } from './checklistService';
import { ConsentService } from './consentService';
import { PolicyService } from './policyService';
import { AuditService } from './auditService';
import { StatisticsService } from './statisticsService';
import { ReportGenerationService } from './reportGenerationService';

import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  PolicyCategory,
  PolicyStatus,
  AuditAction
} from '../../database/types/enums';

import {
  CreateComplianceReportData,
  CreateChecklistItemData,
  CreateConsentFormData,
  CreatePolicyData,
  ComplianceReportFilters,
  AuditLogFilters,
  SignConsentFormData,
  CreateAuditLogData,
  UpdateComplianceReportData,
  UpdateChecklistItemData,
  UpdatePolicyData,
  ComplianceStatistics,
  PaginationResult
} from './types';

/**
 * Unified Compliance Service
 * 
 * This class provides a single interface to all compliance functionality,
 * maintaining backward compatibility with the original ComplianceService
 * while delegating to the appropriate specialized services.
 */
export class ComplianceService {
  // ========== COMPLIANCE REPORTS ==========

  /**
   * Get all compliance reports with pagination and filters
   */
  static async getComplianceReports(
    page: number = 1,
    limit: number = 20,
    filters: ComplianceReportFilters = {}
  ) {
    return ComplianceReportService.getComplianceReports(page, limit, filters);
  }

  /**
   * Get compliance report by ID
   */
  static async getComplianceReportById(id: string) {
    return ComplianceReportService.getComplianceReportById(id);
  }

  /**
   * Create a new compliance report
   */
  static async createComplianceReport(data: CreateComplianceReportData) {
    return ComplianceReportService.createComplianceReport(data);
  }

  /**
   * Update compliance report
   */
  static async updateComplianceReport(id: string, data: UpdateComplianceReportData) {
    return ComplianceReportService.updateComplianceReport(id, data);
  }

  /**
   * Delete compliance report
   */
  static async deleteComplianceReport(id: string) {
    return ComplianceReportService.deleteComplianceReport(id);
  }

  // ========== CHECKLIST ITEMS ==========

  /**
   * Add checklist item to report
   */
  static async addChecklistItem(data: CreateChecklistItemData) {
    return ChecklistService.addChecklistItem(data);
  }

  /**
   * Update checklist item
   */
  static async updateChecklistItem(id: string, data: UpdateChecklistItemData) {
    return ChecklistService.updateChecklistItem(id, data);
  }

  /**
   * Get checklist item by ID
   */
  static async getChecklistItemById(id: string) {
    return ChecklistService.getChecklistItemById(id);
  }

  /**
   * Delete checklist item
   */
  static async deleteChecklistItem(id: string) {
    return ChecklistService.deleteChecklistItem(id);
  }

  /**
   * Get checklist items by report ID
   */
  static async getChecklistItemsByReportId(reportId: string) {
    return ChecklistService.getChecklistItemsByReportId(reportId);
  }

  // ========== CONSENT FORMS ==========

  /**
   * Get all consent forms
   */
  static async getConsentForms(filters: { isActive?: boolean } = {}) {
    return ConsentService.getConsentForms(filters);
  }

  /**
   * Get consent form by ID
   */
  static async getConsentFormById(id: string) {
    return ConsentService.getConsentFormById(id);
  }

  /**
   * Create consent form
   */
  static async createConsentForm(data: CreateConsentFormData) {
    return ConsentService.createConsentForm(data);
  }

  /**
   * Update consent form
   */
  static async updateConsentForm(
    id: string,
    data: Partial<CreateConsentFormData & { isActive?: boolean }>
  ) {
    return ConsentService.updateConsentForm(id, data);
  }

  /**
   * Sign consent form
   */
  static async signConsentForm(data: SignConsentFormData) {
    return ConsentService.signConsentForm(data);
  }

  /**
   * Get student consent signatures
   */
  static async getStudentConsents(studentId: string) {
    return ConsentService.getStudentConsents(studentId);
  }

  /**
   * Withdraw consent
   */
  static async withdrawConsent(signatureId: string, withdrawnBy: string) {
    return ConsentService.withdrawConsent(signatureId, withdrawnBy);
  }

  // ========== POLICIES ==========

  /**
   * Get all policy documents
   */
  static async getPolicies(filters: { category?: PolicyCategory; status?: PolicyStatus } = {}) {
    return PolicyService.getPolicies(filters);
  }

  /**
   * Get policy document by ID
   */
  static async getPolicyById(id: string) {
    return PolicyService.getPolicyById(id);
  }

  /**
   * Create policy document
   */
  static async createPolicy(data: CreatePolicyData) {
    return PolicyService.createPolicy(data);
  }

  /**
   * Update policy
   */
  static async updatePolicy(id: string, data: UpdatePolicyData) {
    return PolicyService.updatePolicy(id, data);
  }

  /**
   * Delete policy document
   */
  static async deletePolicy(id: string) {
    return PolicyService.deletePolicy(id);
  }

  /**
   * Acknowledge policy
   */
  static async acknowledgePolicy(policyId: string, userId: string, ipAddress?: string) {
    return PolicyService.acknowledgePolicy(policyId, userId, ipAddress);
  }

  /**
   * Get policy acknowledgments for a policy
   */
  static async getPolicyAcknowledgments(policyId: string) {
    return PolicyService.getPolicyAcknowledgments(policyId);
  }

  /**
   * Get user's policy acknowledgments
   */
  static async getUserPolicyAcknowledgments(userId: string) {
    return PolicyService.getUserPolicyAcknowledgments(userId);
  }

  // ========== AUDIT LOGS ==========

  /**
   * Get audit logs for compliance with HIPAA tracking
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters: AuditLogFilters = {}
  ) {
    return AuditService.getAuditLogs(page, limit, filters);
  }

  /**
   * Get audit log by ID
   */
  static async getAuditLogById(id: string) {
    return AuditService.getAuditLogById(id);
  }

  /**
   * Create audit log entry for HIPAA compliance
   */
  static async createAuditLog(data: CreateAuditLogData) {
    return AuditService.createAuditLog(data);
  }

  /**
   * Get audit logs for specific entity
   */
  static async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return AuditService.getEntityAuditLogs(entityType, entityId, page, limit);
  }

  /**
   * Get audit logs for specific user
   */
  static async getUserAuditLogs(userId: string, page: number = 1, limit: number = 20) {
    return AuditService.getUserAuditLogs(userId, page, limit);
  }

  /**
   * Search audit logs by date range
   */
  static async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50
  ) {
    return AuditService.getAuditLogsByDateRange(startDate, endDate, page, limit);
  }

  /**
   * Get audit statistics
   */
  static async getAuditStatistics(startDate?: Date, endDate?: Date) {
    return AuditService.getAuditStatistics(startDate, endDate);
  }

  // ========== STATISTICS ==========

  /**
   * Get compliance statistics
   */
  static async getComplianceStatistics(period?: string): Promise<ComplianceStatistics> {
    return StatisticsService.getComplianceStatistics(period);
  }

  /**
   * Get detailed compliance metrics by report type
   */
  static async getComplianceMetricsByType() {
    return StatisticsService.getComplianceMetricsByType();
  }

  /**
   * Get compliance trends over time
   */
  static async getComplianceTrends(startDate: Date, endDate: Date) {
    return StatisticsService.getComplianceTrends(startDate, endDate);
  }

  /**
   * Get checklist completion statistics by category
   */
  static async getChecklistStatsByCategory() {
    return StatisticsService.getChecklistStatsByCategory();
  }

  /**
   * Get overdue items summary
   */
  static async getOverdueItemsSummary() {
    return StatisticsService.getOverdueItemsSummary();
  }

  /**
   * Get compliance dashboard summary
   */
  static async getComplianceDashboard() {
    return StatisticsService.getComplianceDashboard();
  }

  // ========== REPORT GENERATION ==========

  /**
   * Generate compliance report for period with automatic checklist items
   */
  static async generateComplianceReport(
    reportType: ComplianceReportType,
    period: string,
    createdById: string
  ) {
    return ReportGenerationService.generateComplianceReport(reportType, period, createdById);
  }

  /**
   * Generate custom compliance report with user-defined checklist items
   */
  static async generateCustomComplianceReport(
    title: string,
    description: string,
    period: string,
    createdById: string,
    customItems: Array<{
      requirement: string;
      description?: string;
      category: ComplianceCategory;
      dueDate?: Date;
    }>
  ) {
    return ReportGenerationService.generateCustomComplianceReport(
      title,
      description,
      period,
      createdById,
      customItems
    );
  }

  /**
   * Clone existing compliance report for new period
   */
  static async cloneComplianceReport(
    existingReportId: string,
    newPeriod: string,
    createdById: string
  ) {
    return ReportGenerationService.cloneComplianceReport(existingReportId, newPeriod, createdById);
  }

  /**
   * Get available report templates
   */
  static getAvailableReportTemplates() {
    return ReportGenerationService.getAvailableReportTemplates();
  }
}
