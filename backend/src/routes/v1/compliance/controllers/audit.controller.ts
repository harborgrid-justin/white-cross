/**
 * @fileoverview Audit Log Controller - Comprehensive audit trail and security logging
 *
 * Provides HTTP request handlers for audit log management, PHI access tracking,
 * security analysis, and compliance reporting. Implements comprehensive audit
 * trail per HIPAA requirements with support for:
 * - Audit log CRUD operations and querying
 * - PHI access tracking and monitoring
 * - Security incident detection and analysis
 * - Compliance report generation
 * - Log archival and retention management
 *
 * @module routes/v1/compliance/controllers/audit
 * @since 1.0.0
 *
 * @requires @hapi/hapi - Hapi.js framework types
 * @requires ../../../../services/audit/* - Audit service layer
 * @requires ../../../shared/types/route.types - Request/Response types
 * @requires ../../../shared/utils - Response utilities
 *
 * @compliance HIPAA - 45 CFR § 164.308(a)(1)(ii)(D) - Information system activity review
 * @compliance HIPAA - 45 CFR § 164.312(b) - Audit controls for PHI access
 * @compliance HITECH - 13402 - Breach notification requires audit trail
 *
 * @security All audit operations require authentication
 * @security PHI access logging is mandatory and cannot be disabled
 *
 * @example
 * Import and use in route definitions:
 * ```typescript
 * import { AuditController } from './controllers/audit.controller';
 *
 * server.route({
 *   method: 'GET',
 *   path: '/api/v1/audit/logs',
 *   handler: AuditController.listAuditLogs,
 *   options: { auth: 'jwt' }
 * });
 * ```
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
 * Payload interface for creating audit log entries.
 *
 * @interface CreateAuditLogPayload
 * @property {string} [userId] - ID of user performing action (auto-populated if not provided)
 * @property {string} action - Action performed (e.g., "CREATE", "UPDATE", "DELETE", "VIEW")
 * @property {string} entityType - Type of entity accessed (e.g., "Student", "Medication", "HealthRecord")
 * @property {string} entityId - UUID of entity accessed
 * @property {Record<string, any>} [changes] - Object containing before/after values for updates
 */
interface CreateAuditLogPayload {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
}

/**
 * Payload interface for logging PHI access events.
 *
 * @interface LogPhiAccessPayload
 * @property {string} [userId] - ID of user accessing PHI (auto-populated if not provided)
 * @property {string} accessType - Type of PHI access (READ, WRITE, PRINT, EXPORT, TRANSMIT)
 * @property {string} entityType - PHI entity type (HealthRecord, Medication, etc.)
 * @property {string} entityId - UUID of PHI entity accessed
 * @property {string} studentId - UUID of student whose PHI was accessed
 * @property {string} dataCategory - Category of PHI (MEDICAL, MENTAL_HEALTH, DENTAL, etc.)
 * @property {boolean} [success] - Whether access was successful (default: true)
 * @property {string} [errorMessage] - Error message if access failed
 */
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

/**
 * Payload interface for running security analysis.
 *
 * @interface RunSecurityAnalysisPayload
 * @property {string} startDate - Analysis start date (ISO 8601)
 * @property {string} endDate - Analysis end date (ISO 8601)
 * @property {string} [analysisType] - Type of analysis to run (e.g., "ANOMALY_DETECTION", "BREACH_RISK")
 */
interface RunSecurityAnalysisPayload {
  startDate: string;
  endDate: string;
  analysisType?: string;
}

/**
 * Payload interface for archiving old audit logs.
 *
 * @interface ArchiveLogsPayload
 * @property {number} olderThanDays - Archive logs older than this many days
 * @property {boolean} [dryRun] - If true, only simulate archival without actually moving logs
 */
interface ArchiveLogsPayload {
  olderThanDays: number;
  dryRun?: boolean;
}

/**
 * Audit Controller - HTTP request handlers for audit log management.
 *
 * Provides comprehensive audit trail management including:
 * - General audit log CRUD operations
 * - PHI-specific access tracking
 * - Security analysis and anomaly detection
 * - Compliance reporting
 * - Log retention and archival
 *
 * @class AuditController
 * @static
 * @since 1.0.0
 *
 * @compliance HIPAA - Implements audit controls per 45 CFR § 164.312(b)
 * @compliance HITECH - Supports breach notification requirements
 *
 * @example
 * Use in Hapi route definitions:
 * ```typescript
 * server.route({
 *   method: 'GET',
 *   path: '/api/v1/audit/logs',
 *   handler: AuditController.listAuditLogs,
 *   options: {
 *     auth: 'jwt',
 *     tags: ['api', 'audit'],
 *     description: 'List audit logs with filters'
 *   }
 * });
 * ```
 */
export class AuditController {
  /**
   * List audit logs with pagination and advanced filtering.
   *
   * Retrieves audit log entries with support for filtering by user, entity type,
   * action, date range, and IP address. Commonly used for security reviews,
   * compliance audits, and incident investigation.
   *
   * @route GET /api/v1/audit/logs
   * @authentication JWT required - Admin or Compliance Officer role
   *
   * @param {AuthenticatedRequest} request - Authenticated request with query parameters:
   * @param {number} [request.query.page=1] - Page number for pagination
   * @param {number} [request.query.limit=20] - Items per page (max 100)
   * @param {string} [request.query.userId] - Filter by user UUID
   * @param {string} [request.query.entityType] - Filter by entity type
   * @param {string} [request.query.action] - Filter by action type
   * @param {string} [request.query.startDate] - Filter logs after this date (ISO 8601)
   * @param {string} [request.query.endDate] - Filter logs before this date (ISO 8601)
   * @param {string} [request.query.ipAddress] - Filter by IP address
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<Response>} HTTP 200 with paginated audit logs
   * @returns {200} { data: AuditLog[], pagination: PaginationMeta }
   *
   * @throws {UnauthorizedError} When JWT token is missing or invalid (401)
   * @throws {ForbiddenError} When user lacks audit log access permission (403)
   * @throws {ValidationError} When query parameters are invalid (400)
   *
   * @compliance HIPAA - Provides audit trail access per 45 CFR § 164.308(a)(1)(ii)(D)
   *
   * @example
   * Query audit logs for specific user over date range:
   * ```typescript
   * // GET /api/v1/audit/logs?userId=123&startDate=2025-10-01&endDate=2025-10-31
   * const request = {
   *   query: {
   *     userId: '123',
   *     startDate: '2025-10-01',
   *     endDate: '2025-10-31',
   *     page: 1,
   *     limit: 50
   *   },
   *   auth: { credentials: { userId: 'admin-uuid', role: 'ADMIN' } }
   * };
   * const response = await AuditController.listAuditLogs(request, h);
   * // Returns: {
   * //   data: [{ id: 'uuid', action: 'VIEW', entityType: 'Student', ... }],
   * //   pagination: { page: 1, limit: 50, total: 234, totalPages: 5 }
   * // }
   * ```
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
