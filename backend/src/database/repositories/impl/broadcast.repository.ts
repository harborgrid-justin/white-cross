/**
 * Broadcast Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface BroadcastAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBroadcastDTO {
  id?: string;
}

export interface UpdateBroadcastDTO {
  id?: string;
}

@Injectable()
export class BroadcastRepository extends BaseRepository<
  any,
  BroadcastAttributes,
  CreateBroadcastDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Broadcast');
  }

  protected async validateCreate(data: CreateBroadcastDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateBroadcastDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Broadcast): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<BroadcastAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
