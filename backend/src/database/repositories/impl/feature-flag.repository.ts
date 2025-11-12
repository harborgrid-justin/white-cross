/**
 * Feature Flag Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface FeatureFlagAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeatureFlagDTO {
  id?: string;
}

export interface UpdateFeatureFlagDTO {
  id?: string;
}

@Injectable()
export class FeatureFlagRepository extends BaseRepository<
  any,
  FeatureFlagAttributes,
  CreateFeatureFlagDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'FeatureFlag');
  }

  protected async validateCreate(data: CreateFeatureFlagDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateFeatureFlagDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: FeatureFlag): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<FeatureFlagAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
