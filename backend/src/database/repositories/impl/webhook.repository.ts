/**
 * Webhook Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { Webhook } from '../../models/webhook.model';

export interface WebhookAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebhookDTO {
  id?: string;
}

export interface UpdateWebhookDTO {
  id?: string;
}

@Injectable()
export class WebhookRepository extends BaseRepository<any, WebhookAttributes, CreateWebhookDTO> {
  constructor(
    @InjectModel(Webhook) model: typeof Webhook,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Webhook');
  }

  protected async validateCreate(data: CreateWebhookDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateWebhookDTO): Promise<void> {}

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
