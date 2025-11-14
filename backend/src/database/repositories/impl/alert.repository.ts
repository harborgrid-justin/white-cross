/**
 * Alert Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from "../../interfaces";
import { sanitizeSensitiveData } from "../../interfaces";
import type { ICacheManager } from "../../interfaces";
import { Alert } from '../../models/alert.model';

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
  Alert,
  AlertAttributes,
  CreateAlertDTO
> {
  constructor(
    @InjectModel(Alert) private readonly alertModel: typeof Alert,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(alertModel, auditLogger, cacheManager, 'Alert');
  }

  protected async validateCreate(data: CreateAlertDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateAlertDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: typeof Alert.prototype): Promise<void> {
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
