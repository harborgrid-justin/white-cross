/**
 * Notification Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

export interface NotificationAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDTO {
  id?: string;
}

export interface UpdateNotificationDTO {
  id?: string;
}

@Injectable()
export class NotificationRepository extends BaseRepository<
  any,
  NotificationAttributes,
  CreateNotificationDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Notification');
  }

  protected async validateCreate(data: CreateNotificationDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateNotificationDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Notification): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<NotificationAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
