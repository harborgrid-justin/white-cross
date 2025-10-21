/**
 * LOC: 0578E06D5B
 * WC-IDX-222 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - auditLogService.ts (services/audit/auditLogService.ts)
 *   - phiAccessService.ts (services/audit/phiAccessService.ts)
 *   - auditQueryService.ts (services/audit/auditQueryService.ts)
 *   - complianceReportingService.ts (services/audit/complianceReportingService.ts)
 *   - auditStatisticsService.ts (services/audit/auditStatisticsService.ts)
 *   - ... and 2 more
 *
 * DOWNSTREAM (imported by):
 *   - auditService.ts (services/auditService.ts)
 */

/**
 * WC-IDX-222 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: ./auditLogService, ./phiAccessService, ./auditQueryService | Dependencies: ./auditLogService, ./phiAccessService, ./auditQueryService
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

// Export all types and interfaces
export * from './types';

// Export all service classes
export { AuditLogService } from './auditLogService';
export { PHIAccessService } from './phiAccessService';
export { AuditQueryService } from './auditQueryService';
export { ComplianceReportingService } from './complianceReportingService';
export { AuditStatisticsService } from './auditStatisticsService';
export { SecurityAnalysisService } from './securityAnalysisService';
export { AuditUtilsService, AUDIT_CONSTANTS, AUDIT_ERRORS } from './auditUtilsService';

// Import services for the unified AuditService class
import { AuditLogService } from './auditLogService';
import { PHIAccessService } from './phiAccessService';
import { AuditQueryService } from './auditQueryService';
import { ComplianceReportingService } from './complianceReportingService';
import { AuditStatisticsService } from './auditStatisticsService';
import { SecurityAnalysisService } from './securityAnalysisService';
import { AuditUtilsService } from './auditUtilsService';

import {
  AuditLogEntry,
  PHIAccessLog,
  AuditLogFilters,
  PHIAccessLogFilters,
  PaginatedResult,
  ComplianceReport,
  AuditStatistics,
  AuditLogSearchCriteria
} from './types';

/**
 * Unified Audit Service
 * 
 * This class provides a single interface to all audit functionality,
 * maintaining backward compatibility with the original AuditService
 * while delegating to the appropriate specialized services.
 * 
 * HIPAA Compliance: This service is critical for HIPAA compliance, recording all access
 * and modifications to Protected Health Information (PHI). It provides a complete audit
 * trail for regulatory compliance, security monitoring, and forensic analysis.
 */
export class AuditService {
  // ========== CORE AUDIT LOGGING ==========

  /**
   * Log general system action
   *
   * @param entry - Audit log entry details
   * @returns Promise<void>
   */
  static async logAction(entry: AuditLogEntry): Promise<void> {
    return AuditLogService.logAction(entry);
  }

  /**
   * Log PHI access (HIPAA requirement)
   *
   * HIPAA Compliance: This method creates an audit trail for all PHI access,
   * which is required by the HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D))
   *
   * @param entry - PHI access log entry details
   * @returns Promise<void>
   */
  static async logPHIAccess(entry: PHIAccessLog): Promise<void> {
    return PHIAccessService.logPHIAccess(entry);
  }

  /**
   * Get audit log by ID
   *
   * @param id - Audit log ID
   * @returns Promise with audit log details
   */
  static async getAuditLogById(id: string) {
    return AuditLogService.getAuditLogById(id);
  }

  /**
   * Get recent audit logs
   *
   * @param limit - Number of recent logs to fetch
   * @returns Promise with recent audit logs
   */
  static async getRecentAuditLogs(limit: number = 50) {
    return AuditLogService.getRecentAuditLogs(limit);
  }

  // ========== AUDIT QUERYING ==========

  /**
   * Get audit logs with filtering and pagination
   *
   * @param filters - Filter criteria for audit logs
   * @returns Promise with paginated audit logs
   */
  static async getAuditLogs(filters: AuditLogFilters = {}) {
    return AuditQueryService.getAuditLogs(filters);
  }

  /**
   * Get audit logs for a specific entity
   *
   * @param entityType - Type of entity (e.g., 'Student', 'HealthRecord')
   * @param entityId - ID of the entity
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  static async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return AuditQueryService.getEntityAuditHistory(entityType, entityId, page, limit);
  }

  /**
   * Get audit logs for a specific user
   *
   * @param userId - User ID
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs
   */
  static async getUserAuditHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return AuditQueryService.getUserAuditHistory(userId, page, limit);
  }

  /**
   * Search audit logs by keyword
   *
   * @param criteria - Search criteria including keyword and pagination
   * @returns Promise with paginated search results
   */
  static async searchAuditLogs(criteria: AuditLogSearchCriteria) {
    return AuditQueryService.searchAuditLogs(criteria);
  }

  /**
   * Get audit logs by date range
   *
   * @param startDate - Start date for the range
   * @param endDate - End date for the range
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated audit logs in date range
   */
  static async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50
  ) {
    return AuditQueryService.getAuditLogsByDateRange(startDate, endDate, page, limit);
  }

  // ========== PHI ACCESS LOGS ==========

  /**
   * Get PHI access logs with filtering and pagination
   *
   * HIPAA Compliance: Provides detailed audit trail of PHI access for compliance reporting
   *
   * @param filters - Filter criteria for PHI access logs
   * @returns Promise with paginated PHI access logs including user and student details
   */
  static async getPHIAccessLogs(filters: PHIAccessLogFilters = {}) {
    return PHIAccessService.getPHIAccessLogs(filters);
  }

  /**
   * Get PHI access logs for a specific student
   *
   * @param studentId - Student ID to get access logs for
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated PHI access logs for the student
   */
  static async getStudentPHIAccessLogs(
    studentId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return PHIAccessService.getStudentPHIAccessLogs(studentId, page, limit);
  }

  /**
   * Get PHI access logs for a specific user
   *
   * @param userId - User ID to get access logs for
   * @param page - Page number for pagination
   * @param limit - Number of records per page
   * @returns Promise with paginated PHI access logs by the user
   */
  static async getUserPHIAccessLogs(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return PHIAccessService.getUserPHIAccessLogs(userId, page, limit);
  }

  // ========== COMPLIANCE REPORTING ==========

  /**
   * Get compliance report for HIPAA
   *
   * HIPAA Compliance: Generates comprehensive compliance report for audit purposes
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with compliance report data
   */
  static async getComplianceReport(startDate: Date, endDate: Date): Promise<ComplianceReport> {
    return ComplianceReportingService.getComplianceReport(startDate, endDate);
  }

  /**
   * Get PHI access summary for a specific period
   *
   * @param startDate - Start date for the summary period
   * @param endDate - End date for the summary period
   * @returns Promise with PHI access summary data
   */
  static async getPHIAccessSummary(startDate: Date, endDate: Date) {
    return ComplianceReportingService.getPHIAccessSummary(startDate, endDate);
  }

  /**
   * Get user activity report for compliance
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with user activity report data
   */
  static async getUserActivityReport(startDate: Date, endDate: Date) {
    return ComplianceReportingService.getUserActivityReport(startDate, endDate);
  }

  /**
   * Get system access patterns for security analysis
   *
   * @param startDate - Start date for the analysis period
   * @param endDate - End date for the analysis period
   * @returns Promise with access pattern analysis
   */
  static async getAccessPatterns(startDate: Date, endDate: Date) {
    return ComplianceReportingService.getAccessPatterns(startDate, endDate);
  }

  // ========== STATISTICS ==========

  /**
   * Get audit statistics for a time period
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Promise with audit statistics
   */
  static async getAuditStatistics(startDate: Date, endDate: Date): Promise<AuditStatistics> {
    return AuditStatisticsService.getAuditStatistics(startDate, endDate);
  }

  /**
   * Get daily audit log counts for trend analysis
   *
   * @param startDate - Start date for the trend analysis
   * @param endDate - End date for the trend analysis
   * @returns Promise with daily audit log counts
   */
  static async getDailyAuditTrend(startDate: Date, endDate: Date) {
    return AuditStatisticsService.getDailyAuditTrend(startDate, endDate);
  }

  /**
   * Get hourly distribution of audit logs
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with hourly distribution data
   */
  static async getHourlyDistribution(startDate: Date, endDate: Date) {
    return AuditStatisticsService.getHourlyDistribution(startDate, endDate);
  }

  /**
   * Get comprehensive audit dashboard statistics
   *
   * @param startDate - Start date for the dashboard period
   * @param endDate - End date for the dashboard period
   * @returns Promise with comprehensive dashboard data
   */
  static async getAuditDashboard(startDate: Date, endDate: Date) {
    return AuditStatisticsService.getAuditDashboard(startDate, endDate);
  }

  // ========== SECURITY ANALYSIS ==========

  /**
   * Detect suspicious login patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with suspicious login patterns
   */
  static async detectSuspiciousLogins(startDate: Date, endDate: Date) {
    return SecurityAnalysisService.detectSuspiciousLogins(startDate, endDate);
  }

  /**
   * Detect unusual PHI access patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with unusual PHI access analysis
   */
  static async detectUnusualPHIAccess(startDate: Date, endDate: Date) {
    return SecurityAnalysisService.detectUnusualPHIAccess(startDate, endDate);
  }

  /**
   * Analyze system access outside normal hours
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with after-hours access analysis
   */
  static async analyzeAfterHoursAccess(startDate: Date, endDate: Date) {
    return SecurityAnalysisService.analyzeAfterHoursAccess(startDate, endDate);
  }

  /**
   * Detect potential data exfiltration attempts
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with data exfiltration analysis
   */
  static async detectDataExfiltration(startDate: Date, endDate: Date) {
    return SecurityAnalysisService.detectDataExfiltration(startDate, endDate);
  }

  /**
   * Generate comprehensive security report
   *
   * @param startDate - Start date for the security analysis
   * @param endDate - End date for the security analysis
   * @returns Promise with comprehensive security analysis
   */
  static async generateSecurityReport(startDate: Date, endDate: Date) {
    return SecurityAnalysisService.generateSecurityReport(startDate, endDate);
  }

  // ========== UTILITIES ==========

  /**
   * Validate audit log entry data
   *
   * @param entry - Audit log entry to validate
   * @returns Validation result with errors if any
   */
  static validateAuditEntry(entry: any) {
    return AuditUtilsService.validateAuditEntry(entry);
  }

  /**
   * Validate PHI access log entry
   *
   * @param entry - PHI access log entry to validate
   * @returns Validation result with errors if any
   */
  static validatePHIEntry(entry: any) {
    return AuditUtilsService.validatePHIEntry(entry);
  }

  /**
   * Format audit log for display
   *
   * @param log - Audit log entry
   * @returns Formatted log entry
   */
  static formatAuditLog(log: any) {
    return AuditUtilsService.formatAuditLog(log);
  }

  /**
   * Generate compliance-friendly audit summary
   *
   * @param logs - Array of audit logs
   * @param period - Time period for the summary
   * @returns Compliance summary
   */
  static generateComplianceSummary(logs: any[], period: { start: Date; end: Date }) {
    return AuditUtilsService.generateComplianceSummary(logs, period);
  }

  /**
   * Extract IP address from request-like object
   *
   * @param req - Request object or IP string
   * @returns IP address string
   */
  static extractIPAddress(req: any) {
    return AuditUtilsService.extractIPAddress(req);
  }

  /**
   * Extract user agent from request-like object
   *
   * @param req - Request object or user agent string
   * @returns User agent string
   */
  static extractUserAgent(req: any) {
    return AuditUtilsService.extractUserAgent(req);
  }
}

// Export singleton instance for backward compatibility
export const auditService = new AuditService();
