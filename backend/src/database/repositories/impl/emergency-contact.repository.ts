/**
 * Emergency Contact Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface EmergencyContactAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmergencyContactDTO {
  id?: string;
}

export interface UpdateEmergencyContactDTO {
  id?: string;
}

@Injectable()
export class EmergencyContactRepository extends BaseRepository<
  any,
  EmergencyContactAttributes,
  CreateEmergencyContactDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'EmergencyContact');
  }

  protected async validateCreate(
    data: CreateEmergencyContactDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateEmergencyContactDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: EmergencyContact): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<EmergencyContactAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
