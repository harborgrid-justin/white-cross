/**
 * Data Retention Policy Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { DataRetentionPolicy } from '../../models/data-retention-policy.model';

export interface DataRetentionPolicyAttributes {
  id: string;
  name: string;
  description?: string;
  dataCategory: string;
  retentionPeriodMonths: number;
  retentionPeriodYears?: number;
  legalBasis?: string;
  applicableRegulations?: string[];
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDataRetentionPolicyDTO {
  name: string;
  description?: string;
  dataCategory: string;
  retentionPeriodMonths: number;
  retentionPeriodYears?: number;
  legalBasis?: string;
  applicableRegulations?: string[];
  isActive?: boolean;
  createdBy?: string;
}

export interface UpdateDataRetentionPolicyDTO {
  name?: string;
  description?: string;
  dataCategory?: string;
  retentionPeriodMonths?: number;
  retentionPeriodYears?: number;
  legalBasis?: string;
  applicableRegulations?: string[];
  isActive?: boolean;
}

@Injectable()
export class DataRetentionPolicyRepository extends BaseRepository<
  any,
  DataRetentionPolicyAttributes,
  CreateDataRetentionPolicyDTO
> {
  constructor(
    @InjectModel(DataRetentionPolicy) model: typeof DataRetentionPolicy,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'DataRetentionPolicy');
  }

  protected async validateCreate(
    data: CreateDataRetentionPolicyDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateDataRetentionPolicyDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: any): Promise<void> {
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

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
