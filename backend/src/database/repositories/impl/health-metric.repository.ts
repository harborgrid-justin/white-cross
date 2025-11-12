/**
 * Health Metric Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface HealthMetricAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthMetricDTO {
  id?: string;
}

export interface UpdateHealthMetricDTO {
  id?: string;
}

@Injectable()
export class HealthMetricRepository extends BaseRepository<
  any,
  HealthMetricAttributes,
  CreateHealthMetricDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'HealthMetric');
  }

  protected async validateCreate(data: CreateHealthMetricDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateHealthMetricDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: HealthMetric): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<HealthMetricAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
