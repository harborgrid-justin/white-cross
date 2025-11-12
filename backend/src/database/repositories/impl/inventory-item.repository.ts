/**
 * Inventory Item Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface InventoryitemAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryitemDTO {
  id: string;
}

export interface UpdateInventoryitemDTO {
  id?: string;
}

@Injectable()
export class InventoryitemRepository extends BaseRepository<
  any,
  InventoryitemAttributes,
  CreateInventoryitemDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Inventoryitem');
  }

  protected async validateCreate(data: CreateInventoryitemDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateInventoryitemDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: InventoryItem): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<InventoryItemAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
