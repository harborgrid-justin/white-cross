/**
 * Push Token Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

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
