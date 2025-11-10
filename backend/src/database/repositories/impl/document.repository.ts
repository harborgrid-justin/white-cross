/**
 * Document Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';

export interface DocumentAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDTO {
  id?: string;
}

export interface UpdateDocumentDTO {
  id?: string;
}

@Injectable()
export class DocumentRepository extends BaseRepository<
  any,
  DocumentAttributes,
  CreateDocumentDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Document');
  }

  protected async validateCreate(data: CreateDocumentDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateDocumentDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: Document): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<DocumentAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
