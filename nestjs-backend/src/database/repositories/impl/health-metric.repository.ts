/**
 * Health Metric Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface HealthMetricAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthMetricDTO {
  id?: string;
}

export interface UpdateHealthMetricDTO {
  id?: string;
}

@Injectable()
export class HealthMetricRepository extends BaseRepository<any, HealthMetricAttributes, CreateHealthMetricDTO> {
  constructor(
    @InjectModel('HealthMetric') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'HealthMetric');
  }

  protected async validateCreate(data: CreateHealthMetricDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateHealthMetricDTO): Promise<void> {}

  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
      await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
