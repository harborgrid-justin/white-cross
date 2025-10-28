/**
 * Audit Service - HIPAA-compliant audit logging
 * Required by 45 CFR 164.312(b) - Audit Controls
 *
 * Maintains complete audit trails of electronic PHI access and modifications
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditAction } from '../enums';

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Retrieve paginated audit logs with filtering
   * HIPAA Compliance: Essential for demonstrating compliance with audit logging requirements
   */
  async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters: AuditLogFilters = {},
  ): Promise<{ logs: AuditLog[]; pagination: PaginationResult }> {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      if (filters.entityType) {
        whereClause.entityType = filters.entityType;
      }
      if (filters.action) {
        whereClause.action = filters.action;
      }
      if (filters.startDate && filters.endDate) {
        whereClause.createdAt = Between(filters.startDate, filters.endDate);
      } else if (filters.startDate) {
        whereClause.createdAt = MoreThanOrEqual(filters.startDate);
      } else if (filters.endDate) {
        whereClause.createdAt = LessThanOrEqual(filters.endDate);
      }

      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: whereClause,
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Retrieved ${logs.length} audit logs`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting audit logs:', error);
      throw error;
    }
  }

  /**
   * Get specific audit log by ID
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    try {
      const log = await this.auditLogRepository.findOne({ where: { id } });

      if (!log) {
        throw new NotFoundException('Audit log not found');
      }

      this.logger.log(`Retrieved audit log: ${id}`);
      return log;
    } catch (error) {
      this.logger.error(`Error getting audit log ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create audit log entry - CRITICAL for HIPAA compliance
   * Every PHI access must be logged through this method
   */
  async createAuditLog(data: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogRepository.create({
        userId: data.userId || null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId || null,
        changes: data.changes || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      });

      const savedLog = await this.auditLogRepository.save(auditLog);

      this.logger.log(
        `Audit log created: ${data.action} on ${data.entityType}${data.entityId ? ` (${data.entityId})` : ''} by user ${data.userId || 'system'}`,
      );

      return savedLog;
    } catch (error) {
      this.logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get complete audit history for a specific entity
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ logs: AuditLog[]; pagination: PaginationResult }> {
    try {
      const offset = (page - 1) * limit;

      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: { entityType, entityId },
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Retrieved ${logs.length} audit logs for ${entityType} ${entityId}`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error getting audit logs for ${entityType} ${entityId}:`, error);
      throw error;
    }
  }

  /**
   * Get complete audit history for a specific user
   */
  async getUserAuditLogs(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ logs: AuditLog[]; pagination: PaginationResult }> {
    try {
      const offset = (page - 1) * limit;

      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: { userId },
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Retrieved ${logs.length} audit logs for user ${userId}`);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error getting audit logs for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get audit logs within date range for compliance reporting
   */
  async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ logs: AuditLog[]; pagination: PaginationResult }> {
    try {
      const offset = (page - 1) * limit;

      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: {
          createdAt: Between(startDate, endDate),
        },
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      this.logger.log(
        `Retrieved ${logs.length} audit logs between ${startDate.toISOString()} and ${endDate.toISOString()}`,
      );

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting audit logs by date range:', error);
      throw error;
    }
  }

  /**
   * Generate audit statistics for compliance reporting
   */
  async getAuditStatistics(startDate?: Date, endDate?: Date): Promise<{
    totalLogs: number;
    actionBreakdown: { [key: string]: number };
    entityTypeBreakdown: { [key: string]: number };
    dailyActivity: { date: string; count: number }[];
  }> {
    try {
      const whereClause: any = {};

      if (startDate && endDate) {
        whereClause.createdAt = Between(startDate, endDate);
      } else if (startDate) {
        whereClause.createdAt = MoreThanOrEqual(startDate);
      } else if (endDate) {
        whereClause.createdAt = LessThanOrEqual(endDate);
      }

      const totalLogs = await this.auditLogRepository.count({ where: whereClause });
      const logs = await this.auditLogRepository.find({
        where: whereClause,
        select: ['action', 'entityType', 'createdAt'],
        order: { createdAt: 'DESC' },
      });

      // Calculate breakdowns
      const actionBreakdown: { [key: string]: number } = {};
      const entityTypeBreakdown: { [key: string]: number } = {};
      const dailyActivity: { [key: string]: number } = {};

      logs.forEach((log) => {
        // Action breakdown
        actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;

        // Entity type breakdown
        entityTypeBreakdown[log.entityType] = (entityTypeBreakdown[log.entityType] || 0) + 1;

        // Daily activity
        const date = log.createdAt.toISOString().split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      });

      // Convert daily activity to array format
      const dailyActivityArray = Object.entries(dailyActivity)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      this.logger.log(`Retrieved audit statistics: ${totalLogs} total logs`);

      return {
        totalLogs,
        actionBreakdown,
        entityTypeBreakdown,
        dailyActivity: dailyActivityArray,
      };
    } catch (error) {
      this.logger.error('Error getting audit statistics:', error);
      throw error;
    }
  }
}
