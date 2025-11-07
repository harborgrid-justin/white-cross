/**
 * Alert Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface AlertAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAlertDTO {
  id?: string;
}

export interface UpdateAlertDTO {
  id?: string;
}

@Injectable()
export class AlertRepository extends BaseRepository<
  any,
  AlertAttributes,
  CreateAlertDTO
> {
  constructor(
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    // TODO: Inject proper Alert model when implemented
    super(null as Alert, auditLogger, cacheManager, 'Alert');
  }

  protected async validateCreate(data: CreateAlertDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAlertDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Alert): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<AlertAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
