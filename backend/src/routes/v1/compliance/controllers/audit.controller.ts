/**
 * Audit Log Controller
 * Business logic for comprehensive audit trail and security logging
 * HIPAA Compliance: All PHI access must be logged per 45 CFR § 164.308(a)(1)(ii)(D)
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

// Import audit services
import { AuditLogService } from '../../../../services/audit/auditLogService';
import { AuditQueryService } from '../../../../services/audit/auditQueryService';
import { AuditStatisticsService } from '../../../../services/audit/auditStatisticsService';
import { PHIAccessService } from '../../../../services/audit/phiAccessService';
import { ComplianceReportingService } from '../../../../services/audit/complianceReportingService';
import { SecurityAnalysisService } from '../../../../services/audit/securityAnalysisService';
import { PHIAccessType, PHIDataCategory } from '../../../../services/audit/types';

/**
 * Payload Interfaces
 */
interface CreateAuditLogPayload {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
}

interface LogPhiAccessPayload {
  userId?: string;
  accessType: string;
  entityType: string;
  entityId: string;
  studentId: string;
  dataCategory: string;
  success?: boolean;
  errorMessage?: string;
}

interface RunSecurityAnalysisPayload {
  startDate: string;
  endDate: string;
  analysisType?: string;
}

interface ArchiveLogsPayload {
  olderThanDays: number;
  dryRun?: boolean;
}

export class AuditController {
  /**
   * AUDIT LOG MANAGEMENT
   */

  /**
   * List audit logs with filtering and pagination
   * GET /api/v1/audit/logs
   */
  static async listAuditLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      userId: { type: 'string' },
      entityType: { type: 'string' },
      action: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' },
      ipAddress: { type: 'string' }
    });

    const result = await AuditQueryService.getAuditLogs({
      ...filters,
      page,
      limit
    });

    return paginatedResponse(
      h,
      result.logs,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get audit log by ID
   * GET /api/v1/audit/logs/{id}
   */
  static async getAuditLogById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const log = await AuditLogService.getAuditLogById(id);

    if (!log) {
      return h.response({
        success: false,
        error: { message: 'Audit log not found' }
      }).code(404);
    }

    return successResponse(h, { log });
  }

  /**
   * Create audit log entry
   * POST /api/v1/audit/logs
   */
  static async createAuditLog(request: AuthenticatedRequest, h: ResponseToolkit) {
    const ipAddress = request.info.remoteAddress || request.headers['x-forwarded-for'] as string;
    const userAgent = request.headers['user-agent'];
    const payload = request.payload as CreateAuditLogPayload;

    await AuditLogService.logAction({
      userId: payload.userId || request.auth.credentials.userId as string,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      changes: payload.changes || {},
      ipAddress,
      userAgent: userAgent as string
    });

    return createdResponse(h, { logged: true });
  }

  /**
   * PHI ACCESS LOGGING
   */

  /**
   * Get PHI access logs
   * GET /api/v1/audit/phi-access
   */
  static async getPhiAccessLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      userId: { type: 'string' },
      studentId: { type: 'string' },
      accessType: { type: 'string' },
      dataCategory: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' }
    });

    const result = await PHIAccessService.getPHIAccessLogs({
      ...filters,
      page,
      limit
    });

    return paginatedResponse(
      h,
      result.logs,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Log PHI access
   * POST /api/v1/audit/phi-access
   */
  static async logPhiAccess(request: AuthenticatedRequest, h: ResponseToolkit) {
    const ipAddress = request.info.remoteAddress || request.headers['x-forwarded-for'] as string;
    const userAgent = request.headers['user-agent'];
    const payload = request.payload as LogPhiAccessPayload;

    await PHIAccessService.logPHIAccess({
      userId: payload.userId || request.auth.credentials.userId as string,
      action: payload.accessType === 'VIEW' ? 'VIEW' : 'UPDATE',
      entityType: payload.entityType,
      entityId: payload.entityId,
      studentId: payload.studentId,
      accessType: payload.accessType as PHIAccessType,
      dataCategory: payload.dataCategory as PHIDataCategory,
      success: payload.success !== undefined ? payload.success : true,
      errorMessage: payload.errorMessage,
      changes: {},
      ipAddress,
      userAgent: userAgent as string
    });

    return createdResponse(h, { logged: true });
  }

  /**
   * AUDIT STATISTICS & ANALYTICS
   */

  /**
   * Get audit statistics
   * GET /api/v1/audit/statistics
   */
  static async getAuditStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { startDate, endDate } = request.query;

    const statistics = await AuditStatisticsService.getAuditStatistics(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return successResponse(h, { statistics });
  }

  /**
   * Get user activity
   * GET /api/v1/audit/user/{userId}/activity
   */
  static async getUserActivity(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      startDate: { type: 'date' },
      endDate: { type: 'date' },
      action: { type: 'string' }
    });

    const result = await AuditQueryService.getUserAuditHistory(userId, page, limit);

    return paginatedResponse(
      h,
      result.logs,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Export audit logs
   * GET /api/v1/audit/export
   */
  static async exportAuditLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { startDate, endDate, format = 'CSV' } = request.query;

    const filters = buildFilters(request.query, {
      userId: { type: 'string' },
      entityType: { type: 'string' },
      action: { type: 'string' }
    });

    const result = await AuditQueryService.getAuditLogs({
      ...filters,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      page: 1,
      limit: 100000 // Large limit for export
    });

    // Note: In production, this would generate actual CSV/PDF files
    // For now, return JSON data that can be transformed by the client
    return successResponse(h, {
      format,
      exportDate: new Date().toISOString(),
      totalRecords: result.pagination.total,
      data: result.logs
    });
  }

  /**
   * SECURITY ANALYSIS
   */

  /**
   * Get security analysis
   * GET /api/v1/audit/security-analysis
   */
  static async getSecurityAnalysis(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { startDate, endDate, analysisType = 'COMPREHENSIVE' } = request.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    let analysis;
    switch (analysisType) {
      case 'SUSPICIOUS_LOGINS':
        analysis = await SecurityAnalysisService.detectSuspiciousLogins(start, end);
        break;
      case 'UNUSUAL_PHI_ACCESS':
        analysis = await SecurityAnalysisService.detectUnusualPHIAccess(start, end);
        break;
      case 'AFTER_HOURS_ACCESS':
        analysis = await SecurityAnalysisService.analyzeAfterHoursAccess(start, end);
        break;
      case 'DATA_EXFILTRATION':
        analysis = await SecurityAnalysisService.detectDataExfiltration(start, end);
        break;
      case 'COMPREHENSIVE':
      default:
        analysis = await SecurityAnalysisService.generateSecurityReport(start, end);
        break;
    }

    return successResponse(h, { analysis });
  }

  /**
   * Run security analysis
   * POST /api/v1/audit/security-analysis/run
   */
  static async runSecurityAnalysis(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = request.payload as RunSecurityAnalysisPayload;
    const { startDate, endDate, analysisType = 'COMPREHENSIVE' } = payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const report = await SecurityAnalysisService.generateSecurityReport(start, end);

    return createdResponse(h, {
      report,
      generatedAt: new Date().toISOString(),
      generatedBy: request.auth.credentials.userId
    });
  }

  /**
   * COMPLIANCE REPORTING
   */

  /**
   * Generate compliance report
   * GET /api/v1/audit/compliance-report
   */
  static async generateComplianceReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { startDate, endDate } = request.query;

    const report = await ComplianceReportingService.getComplianceReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return successResponse(h, { report });
  }

  /**
   * ANOMALY DETECTION
   */

  /**
   * Detect anomalies
   * GET /api/v1/audit/anomalies
   */
  static async detectAnomalies(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { startDate, endDate } = request.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Detect multiple types of anomalies
    const [suspiciousLogins, unusualPHIAccess, afterHoursAccess] = await Promise.all([
      SecurityAnalysisService.detectSuspiciousLogins(start, end),
      SecurityAnalysisService.detectUnusualPHIAccess(start, end),
      SecurityAnalysisService.analyzeAfterHoursAccess(start, end)
    ]);

    const anomalies = {
      suspiciousLogins: suspiciousLogins.suspiciousIPs || [],
      unusualPHIAccess: unusualPHIAccess.unusualPatterns || [],
      afterHoursAccess: afterHoursAccess.userAnalysis?.filter((u: any) => u.riskLevel === 'HIGH') || [],
      summary: {
        totalAnomalies:
          (suspiciousLogins.suspiciousIPs?.length || 0) +
          (unusualPHIAccess.unusualPatterns?.length || 0) +
          (afterHoursAccess.summary?.highRiskUsers || 0),
        period: { start, end }
      }
    };

    return successResponse(h, { anomalies });
  }

  /**
   * SESSION AUDIT TRAIL
   */

  /**
   * Get session audit trail
   * GET /api/v1/audit/session/{sessionId}
   */
  static async getSessionAuditTrail(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { sessionId } = request.params;

    // Note: This would require session tracking in audit logs
    // For now, return a placeholder indicating the feature needs session ID tracking
    return successResponse(h, {
      sessionId,
      message: 'Session audit trail - feature requires session ID tracking in audit logs',
      logs: []
    });
  }

  /**
   * DATA ACCESS HISTORY
   */

  /**
   * Get resource access history
   * GET /api/v1/audit/data-access/{resourceType}/{resourceId}
   */
  static async getDataAccessHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { resourceType, resourceId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await AuditQueryService.getEntityAuditHistory(
      resourceType,
      resourceId,
      page,
      limit
    );

    return paginatedResponse(
      h,
      result.logs,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * ARCHIVE OPERATIONS
   */

  /**
   * Archive old audit logs
   * DELETE /api/v1/audit/logs/archive
   */
  /**
   * Archive old logs - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async archiveOldLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = request.payload as ArchiveLogsPayload;
    const { olderThanDays, dryRun = false } = payload;

    // Note: This would require actual archival implementation
    // Archive logs (implementation would be in service layer)
    // await AuditService.archiveOldLogs(olderThanDays, dryRun);

    return h.response().code(204);
  }
}
