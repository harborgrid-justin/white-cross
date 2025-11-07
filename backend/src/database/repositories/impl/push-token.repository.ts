/**
 * Push Token Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface PushTokenAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePushTokenDTO {
  id?: string;
}

export interface UpdatePushTokenDTO {
  id?: string;
}

@Injectable()
export class PushTokenRepository extends BaseRepository<
  any,
  PushTokenAttributes,
  CreatePushTokenDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'PushToken');
  }

  protected async validateCreate(data: CreatePushTokenDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdatePushTokenDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: PushToken): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<PushTokenAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
