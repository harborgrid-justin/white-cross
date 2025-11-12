/**
 * Api Key Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface ApiKeyAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApiKeyDTO {
  id?: string;
}

export interface UpdateApiKeyDTO {
  id?: string;
}

@Injectable()
export class ApiKeyRepository extends BaseRepository<
  any,
  ApiKeyAttributes,
  CreateApiKeyDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'ApiKey');
  }

  protected async validateCreate(data: CreateApiKeyDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateApiKeyDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: ApiKey): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ApiKeyAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
