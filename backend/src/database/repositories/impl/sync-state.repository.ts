/**
 * Sync State Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";
import { SyncState } from '../../models/sync-state.model';

export interface SyncStateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSyncStateDTO {
  id?: string;
}

export interface UpdateSyncStateDTO {
  id?: string;
}

@Injectable()
export class SyncStateRepository extends BaseRepository<
  any,
  SyncStateAttributes,
  CreateSyncStateDTO
> {
  constructor(
    @InjectModel(SyncState) model: typeof SyncState,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'SyncState');
  }

  protected async validateCreate(data: CreateSyncStateDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateSyncStateDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: SyncState): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<SyncStateAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
