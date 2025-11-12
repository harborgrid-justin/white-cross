/**
 * Report Template Repository Implementation
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";

export interface ReportTemplateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportTemplateDTO {
  id?: string;
}

export interface UpdateReportTemplateDTO {
  id?: string;
}

@Injectable()
export class ReportTemplateRepository extends BaseRepository<
  any,
  ReportTemplateAttributes,
  CreateReportTemplateDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'ReportTemplate');
  }

  protected async validateCreate(
    data: CreateReportTemplateDTO,
  ): Promise<void> {}
  protected async validateUpdate(
    id: string,
    data: UpdateReportTemplateDTO,
  ): Promise<void> {}

  protected async invalidateCaches(entity: ReportTemplate): Promise<void> {
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

  protected sanitizeForAudit(data: Partial<ReportTemplateAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
