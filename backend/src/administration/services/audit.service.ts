import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/administration.enums';
import { AuditQueryDto } from '../dto/audit.dto';
import { PaginatedResponse, PaginationResult } from '../interfaces/administration.interfaces';

/**
 * AuditService
 *
 * Handles audit logging for administration operations
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Create an audit log entry
   */
  async createAuditLog(
    action: AuditAction,
    entityType: string,
    entityId?: string,
    userId?: string,
    changes?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    try {
      const audit = await this.auditLogModel.create({
        action,
        entityType,
        entityId,
        userId,
        changes,
        ipAddress,
        userAgent,
      } as any);

      this.logger.log(
        `Audit log created: ${action} on ${entityType} ${entityId || ''}`,
      );
      return audit;
    } catch (error) {
      this.logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(
    queryDto: AuditQueryDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    try {
      const { page = 1, limit = 50, ...filters } = queryDto;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      if (filters.entityType) {
        whereClause.entityType = filters.entityType;
      }
      if (filters.entityId) {
        whereClause.entityId = filters.entityId;
      }
      if (filters.action) {
        whereClause.action = filters.action;
      }

      if (filters.startDate || filters.endDate) {
        whereClause.createdAt = {
          [Op.between]: [filters.startDate || new Date(0), filters.endDate || new Date()]
        };
      }

      const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });

      const pagination: PaginationResult = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return {
        data: logs,
        pagination,
      };
    } catch (error) {
      this.logger.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }
}
