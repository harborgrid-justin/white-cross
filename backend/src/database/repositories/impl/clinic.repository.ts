/**
 * Clinic Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';

export interface ClinicAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClinicDTO {
  id?: string;
}

export interface UpdateClinicDTO {
  id?: string;
}

@Injectable()
export class ClinicRepository extends BaseRepository<
  any,
  ClinicAttributes,
  CreateClinicDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Clinic');
  }

  protected async validateCreate(data: CreateClinicDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateClinicDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Clinic): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ClinicAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
