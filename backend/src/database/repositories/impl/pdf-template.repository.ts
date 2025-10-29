/**
 * Pdf Template Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface PdfTemplateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePdfTemplateDTO {
  id?: string;
}

export interface UpdatePdfTemplateDTO {
  id?: string;
}

@Injectable()
export class PdfTemplateRepository extends BaseRepository<any, PdfTemplateAttributes, CreatePdfTemplateDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'PdfTemplate');
  }

  protected async validateCreate(data: CreatePdfTemplateDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdatePdfTemplateDTO): Promise<void> {}

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


