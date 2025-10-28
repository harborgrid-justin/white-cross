/**
 * Threat Detection Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
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
export class ThreatDetectionRepository extends BaseRepository<any, ThreatDetectionAttributes, CreateThreatDetectionDTO> {
  constructor(
    @InjectModel(ThreatDetection) model: typeof ThreatDetection,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ThreatDetection');
  }

  protected async validateCreate(data: CreateThreatDetectionDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateThreatDetectionDTO): Promise<void> {}

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


