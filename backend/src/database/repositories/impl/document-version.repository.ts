/**
 * Document Version Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface DocumentVersionAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentVersionDTO {
  id?: string;
}

export interface UpdateDocumentVersionDTO {
  id?: string;
}

@Injectable()
export class DocumentVersionRepository extends BaseRepository<any, DocumentVersionAttributes, CreateDocumentVersionDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'DocumentVersion');
  }

  protected async validateCreate(data: CreateDocumentVersionDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateDocumentVersionDTO): Promise<void> {}

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
