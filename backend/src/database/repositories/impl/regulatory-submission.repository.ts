/**
 * Regulatory Submission Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface RegulatorySubmissionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRegulatorySubmissionDTO {
  id?: string;
}

export interface UpdateRegulatorySubmissionDTO {
  id?: string;
}

@Injectable()
export class RegulatorySubmissionRepository extends BaseRepository<
  any,
  RegulatorySubmissionAttributes,
  CreateRegulatorySubmissionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'RegulatorySubmission');
  }

  protected async validateCreate(
    data: CreateRegulatorySubmissionDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateRegulatorySubmissionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: RegulatorySubmission): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<RegulatorySubmissionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
