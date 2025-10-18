/**
 * WC-MID-AUD-043 | HIPAA-Compliant Audit Logging Middleware & PHI Access Tracking
 * Purpose: Comprehensive audit trail for PHI access, HIPAA compliance monitoring
 * Upstream: database/models/AuditLog, utils/logger, database/types/enums, auth middleware
 * Downstream: routes/*, services/*, background jobs | Called by: Hapi server extensions
 * Related: middleware/auth.ts, routes/audit.ts, models/AuditLog.ts, HIPAA compliance
 * Exports: auditLoggingMiddleware, createAuditLog, auditPHIExport, getAuditLogs
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, sequelize, database models
 * Critical Path: Request → PHI route check → Auth validation → Audit log creation
 * LLM Context: HIPAA Security Rule §164.312(b) compliance, 6-year retention, PHI access tracking
 */

/**
 * HIPAA-Compliant Audit Logging Middleware
 * Tracks all access to Protected Health Information (PHI)
 *
 * Compliance: HIPAA Security Rule § 164.312(b) - Audit Controls
 * Records: Who accessed what PHI, when, from where, and why
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { AuditLog, User } from '../database/models';
import { logger } from '../utils/logger';
import { Op } from 'sequelize';
import { AuditAction } from '../database/types/enums';

// Define entity type enum to match the expected interface
export type EntityType = 'Student' | 'HealthRecord' | 'Medication' | 'Appointment' |
  'IncidentReport' | 'Document' | 'User' | 'EmergencyContact' | 'Other';

/**
 * PHI-sensitive routes that require audit logging
 * Pattern matching for dynamic routes (e.g., /api/students/:id)
 */
const PHI_ROUTES = [
  /^\/api\/students/,
  /^\/api\/health-records/,
  /^\/api\/medications/,
  /^\/api\/allergies/,
  /^\/api\/chronic-conditions/,
  /^\/api\/vaccinations/,
  /^\/api\/mental-health/,
  /^\/api\/appointments/,
  /^\/api\/incident-reports/,
  /^\/api\/emergency-contacts/,
  /^\/api\/documents\/.*\/download/,
  /^\/api\/reports\/export/
];

/**
 * Map HTTP methods to audit actions
 */
const METHOD_TO_ACTION: Record<string, AuditAction> = {
  GET: AuditAction.READ,
  POST: AuditAction.CREATE,
  PUT: AuditAction.UPDATE,
  PATCH: AuditAction.UPDATE,
  DELETE: AuditAction.DELETE
};

/**
 * Extract entity type from route path
 */
function extractEntityType(path: string): EntityType {
  if (path.includes('/students')) return 'Student';
  if (path.includes('/health-records')) return 'HealthRecord';
  if (path.includes('/medications')) return 'Medication';
  if (path.includes('/appointments')) return 'Appointment';
  if (path.includes('/incident-reports')) return 'IncidentReport';
  if (path.includes('/documents')) return 'Document';
  if (path.includes('/users')) return 'User';
  if (path.includes('/emergency-contacts')) return 'EmergencyContact';
  return 'Other';
}

/**
 * Extract entity ID from request
 * Tries params, payload, and query in that order
 */
function extractEntityId(request: Request): string | undefined {
  // Try route params first (e.g., /students/:id)
  if (request.params.id) return request.params.id;
  if (request.params.studentId) return request.params.studentId;

  // Try payload for POST/PUT
  const payload = request.payload as any;
  if (payload?.id) return payload.id;
  if (payload?.studentId) return payload.studentId;

  // Try query params
  const query = request.query as any;
  if (query?.id) return query.id;
  if (query?.studentId) return query.studentId;

  return undefined;
}

/**
 * Check if route requires PHI audit logging
 */
function isPHIRoute(path: string): boolean {
  return PHI_ROUTES.some(pattern => pattern.test(path));
}

/**
 * Audit logging middleware for Hapi.js
 * Records all PHI access with full context
 */
export const auditLoggingMiddleware = {
  name: 'audit-logging',
  version: '1.0.0',

  register: async (server: any) => {
    // Pre-handler: Record request start
    server.ext('onPreHandler', async (request: Request, h: ResponseToolkit) => {
      // Skip non-PHI routes
      if (!isPHIRoute(request.path)) {
        return h.continue;
      }

      // Store request timestamp for performance tracking
      (request as any).auditStartTime = Date.now();

      return h.continue;
    });

    // Post-handler: Record successful PHI access
    server.ext('onPreResponse', async (request: Request, h: ResponseToolkit) => {
      // Skip non-PHI routes
      if (!isPHIRoute(request.path)) {
        return h.continue;
      }

      const response = request.response as any;

      // Only log successful operations (2xx status codes)
      const isSuccess = !response.isBoom &&
                       (response.statusCode >= 200 && response.statusCode < 300);

      if (!isSuccess) {
        return h.continue;
      }

      try {
        const userId = (request.auth.credentials as any)?.userId;
        const action = METHOD_TO_ACTION[request.method.toUpperCase()] || AuditAction.READ;
        const entityType = extractEntityType(request.path);
        const entityId = extractEntityId(request);
        const duration = Date.now() - ((request as any).auditStartTime || Date.now());

        // Create audit log entry
        await AuditLog.create({
          action,
          entityType,
          entityId,
          userId,
          ipAddress: request.info.remoteAddress,
          userAgent: request.headers['user-agent'] || 'Unknown',
          changes: JSON.stringify({
            method: request.method,
            path: request.path,
            query: request.query,
            duration
          })
        });

        logger.debug('PHI access logged', {
          userId,
          action,
          entityType,
          entityId,
          path: request.path,
          duration
        });
      } catch (error) {
        // CRITICAL: Audit logging failure should be logged but not block request
        logger.error('Failed to create audit log entry', {
          error: error instanceof Error ? error.message : 'Unknown error',
          path: request.path,
          method: request.method
        });
      }

      return h.continue;
    });
  }
};

/**
 * Manual audit logging function for service-level operations
 * Use when middleware doesn't capture the context (e.g., background jobs)
 */
export async function createAuditLog(params: {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
}): Promise<void> {
  try {
    await AuditLog.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      userId: params.userId,
      ipAddress: params.ipAddress || 'System',
      userAgent: params.userAgent || 'System',
      changes: params.changes ? JSON.stringify(params.changes) : undefined
    });

    logger.info('Manual audit log created', {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      userId: params.userId
    });
  } catch (error) {
    logger.error('Failed to create manual audit log', {
      error: error instanceof Error ? error.message : 'Unknown error',
      params
    });
    // Re-throw for critical audit failures
    throw error;
  }
}

/**
 * Audit export access (special handling for PHI exports)
 */
export async function auditPHIExport(params: {
  userId: string;
  entityType: EntityType;
  entityIds: string[];
  exportFormat: string;
  reason: string;
  ipAddress: string;
  userAgent: string;
}): Promise<string> {
  try {
    const auditLog = await AuditLog.create({
      action: AuditAction.EXPORT,
      entityType: params.entityType,
      entityId: params.entityIds.join(','), // Store multiple IDs
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      changes: JSON.stringify({
        exportFormat: params.exportFormat,
        recordCount: params.entityIds.length,
        timestamp: new Date().toISOString(),
        reason: params.reason
      })
    });

    logger.warn('PHI EXPORT performed', {
      auditId: auditLog.id,
      userId: params.userId,
      recordCount: params.entityIds.length,
      reason: params.reason
    });

    return auditLog.id;
  } catch (error) {
    logger.error('CRITICAL: Failed to audit PHI export', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: params.userId,
      recordCount: params.entityIds.length
    });
    throw new Error('PHI export audit failed - operation blocked');
  }
}

/**
 * Query audit logs for compliance reporting
 */
export async function getAuditLogs(filters: {
  userId?: string;
  entityType?: EntityType;
  entityId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 50, 1000); // Max 1000 records
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.entityId) where.entityId = filters.entityId;
  if (filters.action) where.action = filters.action;

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt[Op.gte] = filters.startDate;
    if (filters.endDate) where.createdAt[Op.lte] = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      }]
    }),
    AuditLog.count({ where })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Audit log retention policy enforcement
 * HIPAA requires 6 years of audit log retention
 */
export async function enforceAuditRetention(): Promise<{ deleted: number }> {
  const sixYearsAgo = new Date();
  sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

  logger.info('Enforcing audit log retention policy', {
    cutoffDate: sixYearsAgo.toISOString()
  });

  try {
    const deletedCount = await AuditLog.destroy({
      where: {
        createdAt: {
          [Op.lt]: sixYearsAgo
        }
      }
    });

    logger.info('Audit logs purged per retention policy', {
      deletedCount,
      cutoffDate: sixYearsAgo.toISOString()
    });

    return { deleted: deletedCount };
  } catch (error) {
    logger.error('Failed to enforce audit retention policy', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

export default auditLoggingMiddleware;
