/**
 * Emergency Contact Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface EmergencyContactAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmergencyContactDTO {
  id?: string;
}

export interface UpdateEmergencyContactDTO {
  id?: string;
}

@Injectable()
export class EmergencyContactRepository extends BaseRepository<any, EmergencyContactAttributes, CreateEmergencyContactDTO> {
  constructor(
    @InjectModel('EmergencyContact') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'EmergencyContact');
  }

  protected async validateCreate(data: CreateEmergencyContactDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateEmergencyContactDTO): Promise<void> {}

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
