/**
 * School Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface SchoolAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchoolDTO {
  id?: string;
}

export interface UpdateSchoolDTO {
  id?: string;
}

@Injectable()
export class SchoolRepository extends BaseRepository<
  any,
  SchoolAttributes,
  CreateSchoolDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'School');
  }

  protected async validateCreate(data: CreateSchoolDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateSchoolDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: School): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<SchoolAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
