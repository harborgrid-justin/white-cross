/**
 * Compliance Checklist Item Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { ComplianceChecklistItem } from '../../models/compliance-checklist-item.model';

export interface ComplianceChecklistItemAttributes {
  id: string;
  reportId: string;
  itemText: string;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  priority?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplianceChecklistItemDTO {
  reportId: string;
  itemText: string;
  isCompleted?: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  priority?: string;
  dueDate?: Date;
}

export interface UpdateComplianceChecklistItemDTO {
  reportId?: string;
  itemText?: string;
  isCompleted?: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  priority?: string;
  dueDate?: Date;
}

@Injectable()
export class ComplianceChecklistItemRepository extends BaseRepository<any, ComplianceChecklistItemAttributes, CreateComplianceChecklistItemDTO> {
  constructor(
    @InjectModel(ComplianceChecklistItem) model: typeof ComplianceChecklistItem,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ComplianceChecklistItem');
  }

  protected async validateCreate(data: CreateComplianceChecklistItemDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateComplianceChecklistItemDTO): Promise<void> {}

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
