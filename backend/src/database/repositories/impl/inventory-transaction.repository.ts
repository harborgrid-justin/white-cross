/**
 * Inventory Transaction Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

export interface InventorytransactionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventorytransactionDTO {
  id: string;
}

export interface UpdateInventorytransactionDTO {
  id?: string;
}

@Injectable()
export class InventorytransactionRepository extends BaseRepository<
  any,
  InventorytransactionAttributes,
  CreateInventorytransactionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Inventorytransaction');
  }

  protected async validateCreate(
    data: CreateInventorytransactionDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateInventorytransactionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: InventoryTransaction): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<InventoryTransactionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
