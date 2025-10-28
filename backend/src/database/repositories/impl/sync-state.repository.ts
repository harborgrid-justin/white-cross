/**
 * Sync State Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
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
export class SyncStateRepository extends BaseRepository<any, SyncStateAttributes, CreateSyncStateDTO> {
  constructor(
    @InjectModel(SyncState) model: typeof SyncState,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'SyncState');
  }

  protected async validateCreate(data: CreateSyncStateDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateSyncStateDTO): Promise<void> {}

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


