/**
 * Incident Follow Up Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

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
export class IncidentFollowUpRepository extends BaseRepository<
  any,
  IncidentFollowUpAttributes,
  CreateIncidentFollowUpDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'IncidentFollowUp');
  }

  protected async validateCreate(
    data: CreateIncidentFollowUpDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateIncidentFollowUpDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: IncidentFollowUp): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<IncidentFollowUpAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
