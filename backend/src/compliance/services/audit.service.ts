/**
 * Audit Service - Compliance audit logging and management
 * HIPAA Compliance: 45 CFR 164.312(b) - Information access management
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from '@/database/models';
import { BaseService } from '@/common/base';

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogEntry {
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {
    super();
  }

  /**
   * Create audit log entry
   */
  async createAuditLog(entry: AuditLogEntry): Promise<AuditLog> {
    try {
      const auditLog = await this.auditLogModel.create({
        userId: entry.userId,
        userName: entry.userName,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        description: entry.description,
        metadata: entry.metadata,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        timestamp: new Date(),
      });

      this.logInfo(`Audit log created: ${entry.action} on ${entry.entityType}`);
      return auditLog;
    } catch (error) {
      this.logError('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const {
        userId,
        entityType,
        entityId,
        action,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = filters;

      const whereClause: any = {};

      if (userId) whereClause.userId = userId;
      if (entityType) whereClause.entityType = entityType;
      if (entityId) whereClause.entityId = entityId;
      if (action) whereClause.action = action;

      if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate) whereClause.timestamp.$gte = startDate;
        if (endDate) whereClause.timestamp.$lte = endDate;
      }

      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        limit,
        offset,
      });

      const pages = Math.ceil(total / limit);

      this.logInfo(`Retrieved ${logs.length} audit logs (page ${page}/${pages})`);

      return {
        logs,
        total,
        page,
        pages,
      };
    } catch (error) {
      this.logError('Error getting audit logs:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<AuditLog[]> {
    try {
      const offset = (page - 1) * limit;

      const logs = await this.auditLogModel.findAll({
        where: {
          entityType,
          entityId,
        },
        order: [['timestamp', 'DESC']],
        limit,
        offset,
      });

      this.logInfo(`Retrieved ${logs.length} audit logs for ${entityType}:${entityId}`);
      return logs;
    } catch (error) {
      this.logError(`Error getting entity audit logs for ${entityType}:${entityId}:`, error);
      throw error;
    }
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditLogs(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<AuditLog[]> {
    try {
      const offset = (page - 1) * limit;

      const logs = await this.auditLogModel.findAll({
        where: { userId },
        order: [['timestamp', 'DESC']],
        limit,
        offset,
      });

      this.logInfo(`Retrieved ${logs.length} audit logs for user ${userId}`);
      return logs;
    } catch (error) {
      this.logError(`Error getting user audit logs for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Log compliance event
   */
  async logComplianceEvent(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata: {
        ...metadata,
        complianceEvent: true,
      },
    });
  }

  /**
   * Log PHI access for HIPAA compliance
   */
  async logPHIAccess(
    entityType: string,
    entityId: string,
    userId: string,
    action: string,
    description: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      description,
      metadata: {
        ...metadata,
        PHIAccess: true,
        complianceEvent: true,
      },
    });
  }
}