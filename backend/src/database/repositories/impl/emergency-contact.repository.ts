/**
 * Emergency Contact Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

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
export class EmergencyContactRepository extends BaseRepository<
  any,
  EmergencyContactAttributes,
  CreateEmergencyContactDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'EmergencyContact');
  }

  protected async validateCreate(
    data: CreateEmergencyContactDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateEmergencyContactDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: EmergencyContact): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, entityData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:${this.entityName.toLowerCase()}:*`,
      );
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: Partial<EmergencyContactAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
