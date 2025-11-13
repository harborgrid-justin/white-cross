/**
 * Stock Level Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

export interface StocklevelAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStocklevelDTO {
  id: string;
}

export interface UpdateStocklevelDTO {
  id?: string;
}

@Injectable()
export class StocklevelRepository extends BaseRepository<
  any,
  StocklevelAttributes,
  CreateStocklevelDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Stocklevel');
  }

  protected async validateCreate(data: CreateStocklevelDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateStocklevelDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: StockLevel): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<StockLevelAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
