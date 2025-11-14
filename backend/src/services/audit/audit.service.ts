import { Injectable } from '@nestjs/common';
import { AuditLogService } from './services/audit-log.service';
import { AuditQueryService } from '@/database/services/audit-query.service';
import { AuditStatisticsService } from '@/database/services/audit-statistics.service';
import { AuditUtilsService } from './services/audit-utils.service';
import { ComplianceReportingService } from './services/compliance-reporting.service';
import { PHIAccessService } from './services/phi-access.service';
import { SecurityAnalysisService } from './services/security-analysis.service';
import { IAuditLogEntry } from './interfaces/audit-log-entry.interface';
import { IPHIAccessLog } from './interfaces/phi-access-log.interface';
import { AuditLogFilters, AuditLogSearchCriteria, AuditRequest, PHIAccessLogFilters, ValidationResult } from './types/audit.types';

import { BaseService } from '@/common/base';
/**
 * Unified Audit Service Facade
 *
 * This class provides a single interface to all audit functionality,
 * maintaining backward compatibility while delegating to specialized services.
 *
 * HIPAA Compliance: This service is critical for HIPAA compliance, recording all access
 * and modifications to Protected Health Information (PHI). It provides a complete audit
 * trail for regulatory compliance, security monitoring, and forensic analysis.
 */
@Injectable()
export class AuditService extends BaseService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly phiAccessService: PHIAccessService,
    private readonly auditQueryService: AuditQueryService,
    private readonly complianceService: ComplianceReportingService,
    private readonly statisticsService: AuditStatisticsService,
    private readonly securityService: SecurityAnalysisService,
    private readonly utilsService: AuditUtilsService,
  ) {
    super('AuditService');
  }

  // ========== CORE AUDIT LOGGING ==========

  /**
   * Log general system action (FAIL-SAFE)
   */
  async logAction(entry: IAuditLogEntry): Promise<void> {
    return this.auditLogService.logAction(entry);
  }

  /**
   * Log PHI access (HIPAA requirement) (FAIL-SAFE)
   */
  async logPHIAccess(entry: IPHIAccessLog): Promise<void> {
    return this.phiAccessService.logPHIAccess(entry);
  }

  /**
   * Get audit log by ID
   */
  async getAuditLogById(id: string) {
    return this.auditLogService.getAuditLogById(id);
  }

  /**
   * Get recent audit logs
   */
  async getRecentAuditLogs(limit: number = 50) {
    return this.auditLogService.getRecentAuditLogs(limit);
  }

  // ========== AUDIT QUERYING ==========

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: AuditLogFilters = {}) {
    return this.auditQueryService.getAuditLogs(filters);
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditHistory(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.auditQueryService.getEntityAuditHistory(
      entityType,
      entityId,
      page,
      limit,
    );
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.auditQueryService.getUserAuditHistory(userId, page, limit);
  }

  /**
   * Search audit logs by keyword
   */
  async searchAuditLogs(criteria: AuditLogSearchCriteria) {
    return this.auditQueryService.searchAuditLogs(criteria);
  }

  /**
   * Get audit logs by date range
   */
  async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50,
  ) {
    return this.auditQueryService.getAuditLogsByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );
  }

  // ========== PHI ACCESS LOGS ==========

  /**
   * Get PHI access logs with filtering and pagination
   */
  async getPHIAccessLogs(filters: PHIAccessLogFilters = {}) {
    return this.phiAccessService.getPHIAccessLogs(filters);
  }

  /**
   * Get PHI access logs for a specific student
   */
  async getStudentPHIAccessLogs(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.phiAccessService.getStudentPHIAccessLogs(
      studentId,
      page,
      limit,
    );
  }

  /**
   * Get PHI access logs for a specific user
   */
  async getUserPHIAccessLogs(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.phiAccessService.getUserPHIAccessLogs(userId, page, limit);
  }

  // ========== COMPLIANCE REPORTING ==========

  /**
   * Get compliance report for HIPAA
   */
  async getComplianceReport(startDate: Date, endDate: Date) {
    return this.complianceService.getComplianceReport(startDate, endDate);
  }

  /**
   * Get PHI access summary for a specific period
   */
  async getPHIAccessSummary(startDate: Date, endDate: Date) {
    return this.complianceService.getPHIAccessSummary(startDate, endDate);
  }

  // ========== STATISTICS ==========

  /**
   * Get audit statistics for a time period
   */
  async getAuditStatistics(startDate: Date, endDate: Date) {
    return this.statisticsService.getAuditStatistics(startDate, endDate);
  }

  /**
   * Get comprehensive audit dashboard statistics
   */
  async getAuditDashboard(startDate: Date, endDate: Date) {
    return this.statisticsService.getAuditDashboard(startDate, endDate);
  }

  // ========== SECURITY ANALYSIS ==========

  /**
   * Detect suspicious login patterns
   */
  async detectSuspiciousLogins(startDate: Date, endDate: Date) {
    return this.securityService.detectSuspiciousLogins(startDate, endDate);
  }

  /**
   * Generate comprehensive security report
   */
  async generateSecurityReport(startDate: Date, endDate: Date) {
    return this.securityService.generateSecurityReport(startDate, endDate);
  }

  // ========== UTILITIES ==========

  /**
   * Validate audit log entry data
   */
  validateAuditEntry(entry: Partial<IAuditLogEntry>): ValidationResult {
    return this.utilsService.validateAuditEntry(entry);
  }

  /**
   * Validate PHI access log entry
   */
  validatePHIEntry(entry: Partial<IPHIAccessLog>): ValidationResult {
    return this.utilsService.validatePHIEntry(entry);
  }

  /**
   * Extract IP address from request object
   */
  extractIPAddress(req: AuditRequest | string): string | undefined {
    return this.utilsService.extractIPAddress(req);
  }

  /**
   * Extract user agent from request object
   */
  extractUserAgent(req: AuditRequest | string): string | undefined {
    return this.utilsService.extractUserAgent(req);
  }
}
