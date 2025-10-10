import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface AuditLogEntry {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export interface PHIAccessLog extends AuditLogEntry {
  studentId: string;
  accessType: 'READ' | 'WRITE' | 'DELETE' | 'EXPORT';
  dataCategory: 'HEALTH_RECORD' | 'MEDICATION' | 'ALLERGY' | 'VACCINATION' | 'DIAGNOSIS' | 'TREATMENT';
}

class AuditService {
  /**
   * Log general system action
   */
  async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          resourceType: entry.resourceType,
          resourceId: entry.resourceId,
          details: entry.details || {},
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          success: entry.success,
          errorMessage: entry.errorMessage,
          timestamp: new Date(),
        },
      });

      logger.info(`Audit: ${entry.action} on ${entry.resourceType} by user ${entry.userId}`);
    } catch (error) {
      logger.error('Failed to create audit log:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  /**
   * Log PHI access (HIPAA requirement)
   */
  async logPHIAccess(entry: PHIAccessLog): Promise<void> {
    try {
      await prisma.phiAccessLog.create({
        data: {
          userId: entry.userId,
          studentId: entry.studentId,
          accessType: entry.accessType,
          dataCategory: entry.dataCategory,
          action: entry.action,
          resourceType: entry.resourceType,
          resourceId: entry.resourceId,
          details: entry.details || {},
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          success: entry.success,
          errorMessage: entry.errorMessage,
          timestamp: new Date(),
        },
      });

      logger.info(
        `PHI Access: ${entry.accessType} ${entry.dataCategory} for student ${entry.studentId} by user ${entry.userId}`
      );
    } catch (error) {
      logger.error('Failed to create PHI access log:', error);
    }
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters: {
    userId?: string;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, resourceType, startDate, endDate, page = 1, limit = 50 } = filters;

    const where: any = {};
    if (userId) where.userId = userId;
    if (resourceType) where.resourceType = resourceType;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get PHI access logs (for compliance reporting)
   */
  async getPHIAccessLogs(filters: {
    userId?: string;
    studentId?: string;
    accessType?: string;
    dataCategory?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, studentId, accessType, dataCategory, startDate, endDate, page = 1, limit = 50 } = filters;

    const where: any = {};
    if (userId) where.userId = userId;
    if (studentId) where.studentId = studentId;
    if (accessType) where.accessType = accessType;
    if (dataCategory) where.dataCategory = dataCategory;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.phiAccessLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
            },
          },
        },
      }),
      prisma.phiAccessLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get compliance report for HIPAA
   */
  async getComplianceReport(startDate: Date, endDate: Date) {
    const totalAccess = await prisma.phiAccessLog.count({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const accessByType = await prisma.phiAccessLog.groupBy({
      by: ['accessType'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    const accessByCategory = await prisma.phiAccessLog.groupBy({
      by: ['dataCategory'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });

    const failedAccess = await prisma.phiAccessLog.count({
      where: {
        success: false,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      period: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalAccess,
        failedAccess,
        successRate: totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 0,
      },
      accessByType: accessByType.map((item) => ({
        type: item.accessType,
        count: item._count,
      })),
      accessByCategory: accessByCategory.map((item) => ({
        category: item.dataCategory,
        count: item._count,
      })),
    };
  }
}

export const auditService = new AuditService();
