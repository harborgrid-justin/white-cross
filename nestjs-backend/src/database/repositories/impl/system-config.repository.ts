/**
 * System Config Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { SystemConfig } from '../../models/system-config.model';

export interface SystemConfigAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSystemConfigDTO {
  id?: string;
}

export interface UpdateSystemConfigDTO {
  id?: string;
}

@Injectable()
export class SystemConfigRepository extends BaseRepository<any, SystemConfigAttributes, CreateSystemConfigDTO> {
  constructor(
    @InjectModel(SystemConfig) model: typeof SystemConfig,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'SystemConfig');
  }

  protected async validateCreate(data: CreateSystemConfigDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateSystemConfigDTO): Promise<void> {}

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
