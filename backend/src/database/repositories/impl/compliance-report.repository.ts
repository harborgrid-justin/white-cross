/**
 * Compliance Report Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { ComplianceReport } from '../../models/compliance-report.model';

export interface ComplianceReportAttributes {
  id: string;
  reportType: string;
  title: string;
  description?: string;
  status: string;
  period: string;
  findings?: any;
  recommendations?: any;
  dueDate?: Date;
  submittedAt?: Date;
  submittedBy?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplianceReportDTO {
  reportType: string;
  title: string;
  description?: string;
  status?: string;
  period: string;
  findings?: any;
  recommendations?: any;
  dueDate?: Date;
  submittedAt?: Date;
  submittedBy?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdById: string;
}

export interface UpdateComplianceReportDTO {
  reportType?: string;
  title?: string;
  description?: string;
  status?: string;
  period?: string;
  findings?: any;
  recommendations?: any;
  dueDate?: Date;
  submittedAt?: Date;
  submittedBy?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export class ComplianceReportRepository extends BaseRepository<any, ComplianceReportAttributes, CreateComplianceReportDTO> {
  constructor(
    @InjectModel(ComplianceReport) model: typeof ComplianceReport,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ComplianceReport');
  }

  protected async validateCreate(data: CreateComplianceReportDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateComplianceReportDTO): Promise<void> {}

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
