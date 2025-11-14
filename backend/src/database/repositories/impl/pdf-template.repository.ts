/**
 * Pdf Template Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";

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
export class PdfTemplateRepository extends BaseRepository<
  any,
  PdfTemplateAttributes,
  CreatePdfTemplateDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'PdfTemplate');
  }

  protected async validateCreate(data: CreatePdfTemplateDTO): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdatePdfTemplateDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: PdfTemplate): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<PdfTemplateAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
