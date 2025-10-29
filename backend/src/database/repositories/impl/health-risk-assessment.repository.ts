/**
 * Health Risk Assessment Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface HealthRiskAssessmentAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthRiskAssessmentDTO {
  id?: string;
}

export interface UpdateHealthRiskAssessmentDTO {
  id?: string;
}

@Injectable()
export class HealthRiskAssessmentRepository extends BaseRepository<any, HealthRiskAssessmentAttributes, CreateHealthRiskAssessmentDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'HealthRiskAssessment');
  }

  protected async validateCreate(data: CreateHealthRiskAssessmentDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateHealthRiskAssessmentDTO): Promise<void> {}

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
