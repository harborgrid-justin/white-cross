/**
 * Compliance Violation Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { ComplianceViolation } from '../../models/compliance-violation.model';

export interface ComplianceViolationAttributes {
  id: string;
  violationType: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  reportedBy: string;
  discoveredAt: Date;
  affectedStudents?: string[];
  affectedDataCategories?: string[];
  rootCause?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplianceViolationDTO {
  violationType: string;
  title: string;
  description: string;
  severity: string;
  status?: string;
  reportedBy: string;
  discoveredAt: Date;
  affectedStudents?: string[];
  affectedDataCategories?: string[];
  rootCause?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
}

export interface UpdateComplianceViolationDTO {
  violationType?: string;
  title?: string;
  description?: string;
  severity?: string;
  status?: string;
  reportedBy?: string;
  discoveredAt?: Date;
  affectedStudents?: string[];
  affectedDataCategories?: string[];
  rootCause?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: Date;
}

@Injectable()
export class ComplianceViolationRepository extends BaseRepository<any, ComplianceViolationAttributes, CreateComplianceViolationDTO> {
  constructor(
    @InjectModel(ComplianceViolation) model: typeof ComplianceViolation,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ComplianceViolation');
  }

  protected async validateCreate(data: CreateComplianceViolationDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateComplianceViolationDTO): Promise<void> {}

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
