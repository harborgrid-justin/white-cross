/**
 * Document Permission Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';

export interface DocumentPermissionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentPermissionDTO {
  id?: string;
}

export interface UpdateDocumentPermissionDTO {
  id?: string;
}

@Injectable()
export class DocumentPermissionRepository extends BaseRepository<
  any,
  DocumentPermissionAttributes,
  CreateDocumentPermissionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'DocumentPermission');
  }

  protected async validateCreate(
    data: CreateDocumentPermissionDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateDocumentPermissionDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: DocumentPermission): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<DocumentPermissionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
