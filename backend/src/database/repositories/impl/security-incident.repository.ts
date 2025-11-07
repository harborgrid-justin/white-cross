/**
 * Security Incident Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface SecurityIncidentAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSecurityIncidentDTO {
  id?: string;
}

export interface UpdateSecurityIncidentDTO {
  id?: string;
}

@Injectable()
export class SecurityIncidentRepository extends BaseRepository<
  any,
  SecurityIncidentAttributes,
  CreateSecurityIncidentDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'SecurityIncident');
  }

  protected async validateCreate(
    data: CreateSecurityIncidentDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateSecurityIncidentDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: SecurityIncident): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<SecurityIncidentAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
