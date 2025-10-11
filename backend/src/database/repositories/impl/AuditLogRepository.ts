/**
 * Audit Log Repository Implementation
 * HIPAA compliance audit trail queries
 */

import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { AuditLog as AuditLogModel } from '../../models/compliance/AuditLog';
import {
  IAuditLogRepository,
  AuditLog,
  CreateAuditLogDTO
} from '../interfaces/IAuditLogRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { ExecutionContext } from '../../types/ExecutionContext';
import { logger } from '../../../utils/logger';

export class AuditLogRepository
  extends BaseRepository<AuditLogModel, any, any>
  implements IAuditLogRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(AuditLogModel, auditLogger, cacheManager, 'AuditLog');
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    try {
      const logs = await this.model.findAll({
        where: { entityType, entityId },
        order: [['createdAt', 'DESC']],
        limit: 100
      });
      interface AuditLogMapper {
        (value: AuditLogModel, index: number, array: AuditLogModel[]): AuditLog;
      }
      const mapper: AuditLogMapper = (l) => this.mapToEntity(l);
      return logs.map(mapper);
    } catch (error) {
      logger.error('Error finding audit logs by entity:', error);
      throw new RepositoryError(
        'Failed to find audit logs',
        'FIND_BY_ENTITY_ERROR',
        500
      );
    }
  }

  async findByUser(userId: string, limit?: number): Promise<AuditLog[]> {
    try {
      const logs = await this.model.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: limit || 100
      });
      interface AuditLogMapper {
        (value: AuditLogModel, index: number, array: AuditLogModel[]): AuditLog;
      }
      const mapper: AuditLogMapper = (l) => this.mapToEntity(l);
      return logs.map(mapper);
    } catch (error) {
      logger.error('Error finding audit logs by user:', error);
      throw new RepositoryError(
        'Failed to find audit logs by user',
        'FIND_BY_USER_ERROR',
        500
      );
    }
  }

  async findByAction(action: string, limit?: number): Promise<AuditLog[]> {
    try {
      const logs = await this.model.findAll({
        where: { action },
        order: [['createdAt', 'DESC']],
        limit: limit || 100
      });
      return logs.map<AuditLog>((l: AuditLogModel, index: number, array: AuditLogModel[]) => this.mapToEntity(l));
    } catch (error) {
      logger.error('Error finding audit logs by action:', error);
      throw new RepositoryError(
        'Failed to find audit logs by action',
        'FIND_BY_ACTION_ERROR',
        500
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: any
  ): Promise<AuditLog[]> {
    try {
      const where: any = {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      };

      if (filters?.entityType) {
        where.entityType = filters.entityType;
      }

      if (filters?.userId) {
        where.userId = filters.userId;
      }

      if (filters?.action) {
        where.action = filters.action;
      }

      const logs = await this.model.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: filters?.limit || 1000
      });

      interface AuditLogMapper {
        (value: AuditLogModel, index: number, array: AuditLogModel[]): AuditLog;
      }
      const mapper: AuditLogMapper = (l) => this.mapToEntity(l);
      return logs.map(mapper);
    } catch (error) {
      logger.error('Error finding audit logs by date range:', error);
      throw new RepositoryError(
        'Failed to find audit logs by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500
      );
    }
  }

  async createMany(entries: CreateAuditLogDTO[]): Promise<void> {
    try {
      await this.model.bulkCreate(entries as any[], {
        validate: true
      });
      logger.debug(`Created ${entries.length} audit log entries`);
    } catch (error) {
      logger.error('Error creating audit log entries:', error);
      throw new RepositoryError(
        'Failed to create audit log entries',
        'CREATE_MANY_ERROR',
        500
      );
    }
  }

  // Override create to skip audit logging (prevent infinite loop)
  async create(data: CreateAuditLogDTO, context: ExecutionContext): Promise<any> {
    try {
      const result = await this.model.create(data as any);
      return this.mapToEntity(result);
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw new RepositoryError(
        'Failed to create audit log',
        'CREATE_ERROR',
        500
      );
    }
  }

  // Override update - audit logs are immutable
  async update(): Promise<any> {
    throw new RepositoryError(
      'Audit logs are immutable',
      'UPDATE_NOT_ALLOWED',
      403
    );
  }

  // Override delete - audit logs cannot be deleted
  async delete(): Promise<void> {
    throw new RepositoryError(
      'Audit logs cannot be deleted',
      'DELETE_NOT_ALLOWED',
      403
    );
  }

  protected async invalidateCaches(): Promise<void> {
    // Audit logs are not cached
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return false; // Never cache audit logs
  }
}
