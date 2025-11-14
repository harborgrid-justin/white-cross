/**
 * Threat Detection Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";
import { ThreatDetection } from '../../models/threat-detection.model';

export interface ThreatDetectionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateThreatDetectionDTO {
  id?: string;
}

export interface UpdateThreatDetectionDTO {
  id?: string;
}

@Injectable()
export class ThreatDetectionRepository extends BaseRepository<
  any,
  ThreatDetectionAttributes,
  CreateThreatDetectionDTO
> {
  constructor(
    @InjectModel(ThreatDetection) model: typeof ThreatDetection,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'ThreatDetection');
  }

  protected async validateCreate(
    data: CreateThreatDetectionDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateThreatDetectionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: ThreatDetection): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ThreatDetectionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
