/**
 * Contact Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';

export interface ContactAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactDTO {
  id?: string;
}

export interface UpdateContactDTO {
  id?: string;
}

@Injectable()
export class ContactRepository extends BaseRepository<
  any,
  ContactAttributes,
  CreateContactDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Contact');
  }

  protected async validateCreate(data: CreateContactDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateContactDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Contact): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ContactAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
