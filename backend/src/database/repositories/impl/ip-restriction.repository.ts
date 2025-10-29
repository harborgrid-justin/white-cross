/**
 * Ip Restriction Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface IpRestrictionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIpRestrictionDTO {
  id?: string;
}

export interface UpdateIpRestrictionDTO {
  id?: string;
}

@Injectable()
export class IpRestrictionRepository extends BaseRepository<any, IpRestrictionAttributes, CreateIpRestrictionDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'IpRestriction');
  }

  protected async validateCreate(data: CreateIpRestrictionDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateIpRestrictionDTO): Promise<void> {}

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


