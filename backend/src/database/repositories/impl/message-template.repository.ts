/**
 * Message Template Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface MessageTemplateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageTemplateDTO {
  id?: string;
}

export interface UpdateMessageTemplateDTO {
  id?: string;
}

@Injectable()
export class MessageTemplateRepository extends BaseRepository<
  any,
  MessageTemplateAttributes,
  CreateMessageTemplateDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'MessageTemplate');
  }

  protected async validateCreate(
    data: CreateMessageTemplateDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateMessageTemplateDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: MessageTemplate): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<MessageTemplateAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
