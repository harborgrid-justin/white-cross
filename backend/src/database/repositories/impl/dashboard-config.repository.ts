/**
 * Dashboard Config Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface DashboardConfigAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDashboardConfigDTO {
  id?: string;
}

export interface UpdateDashboardConfigDTO {
  id?: string;
}

@Injectable()
export class DashboardConfigRepository extends BaseRepository<any, DashboardConfigAttributes, CreateDashboardConfigDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'DashboardConfig');
  }

  protected async validateCreate(data: CreateDashboardConfigDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateDashboardConfigDTO): Promise<void> {}

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
