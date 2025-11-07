/**
 * Supplier Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { Supplier } from '../../models/supplier.model';

export interface SupplierAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierDTO {
  id: string;
}

export interface UpdateSupplierDTO {
  id?: string;
}

@Injectable()
export class SupplierRepository extends BaseRepository<
  any,
  SupplierAttributes,
  CreateSupplierDTO
> {
  constructor(
    @InjectModel(Supplier) model: typeof Supplier,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Supplier');
  }

  protected async validateCreate(data: CreateSupplierDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateSupplierDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Supplier): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<SupplierAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
