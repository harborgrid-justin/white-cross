/**
 * Audit Log Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { AuditLog } from '../../models/audit-log.model';

export interface AuditLogAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAuditLogDTO {
  id?: string;
}

export interface UpdateAuditLogDTO {
  id?: string;
}

@Injectable()
export class AuditLogRepository extends BaseRepository<
  any,
  AuditLogAttributes,
  CreateAuditLogDTO
> {
  constructor(
    @InjectModel(AuditLog) model: typeof AuditLog,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'AuditLog');
  }

  protected async validateCreate(data: CreateAuditLogDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAuditLogDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: AuditLog): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<AuditLogAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
