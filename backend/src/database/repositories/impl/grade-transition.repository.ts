/**
 * Grade Transition Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface GradeTransitionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGradeTransitionDTO {
  id?: string;
}

export interface UpdateGradeTransitionDTO {
  id?: string;
}

@Injectable()
export class GradeTransitionRepository extends BaseRepository<
  any,
  GradeTransitionAttributes,
  CreateGradeTransitionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'GradeTransition');
  }

  protected async validateCreate(
    data: CreateGradeTransitionDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateGradeTransitionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: GradeTransition): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<GradeTransitionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
