/**
 * Incident Follow Up Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface IncidentFollowUpAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncidentFollowUpDTO {
  id?: string;
}

export interface UpdateIncidentFollowUpDTO {
  id?: string;
}

@Injectable()
export class IncidentFollowUpRepository extends BaseRepository<any, IncidentFollowUpAttributes, CreateIncidentFollowUpDTO> {
  constructor(
    @InjectModel('IncidentFollowUp') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'IncidentFollowUp');
  }

  protected async validateCreate(data: CreateIncidentFollowUpDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateIncidentFollowUpDTO): Promise<void> {}

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
