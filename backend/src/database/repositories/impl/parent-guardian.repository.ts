/**
 * Parent Guardian Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

export interface ParentGuardianAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateParentGuardianDTO {
  id?: string;
}

export interface UpdateParentGuardianDTO {
  id?: string;
}

@Injectable()
export class ParentGuardianRepository extends BaseRepository<
  any,
  ParentGuardianAttributes,
  CreateParentGuardianDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'ParentGuardian');
  }

  protected async validateCreate(
    data: CreateParentGuardianDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateParentGuardianDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: ParentGuardian): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ParentGuardianAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
