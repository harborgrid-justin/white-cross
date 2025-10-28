/**
 * Alert Rule Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface AlertRuleAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAlertRuleDTO {
  id?: string;
}

export interface UpdateAlertRuleDTO {
  id?: string;
}

@Injectable()
export class AlertRuleRepository extends BaseRepository<any, AlertRuleAttributes, CreateAlertRuleDTO> {
  constructor(
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    // TODO: Inject proper AlertRule model when implemented
    super(null as any, auditLogger, cacheManager, 'AlertRule');
  }

  protected async validateCreate(data: CreateAlertRuleDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateAlertRuleDTO): Promise<void> {}

  protected async invalidateCaches(entity: any): Promise<void> {
    try {
      const entityData = entity.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, entityData.id));
      await this.cacheManager.deletePattern(`white-cross:${this.entityName.toLowerCase()}:*`);
    } catch (error) {
      this.logger.warn(`Error invalidating ${this.entityName} caches:`, error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
