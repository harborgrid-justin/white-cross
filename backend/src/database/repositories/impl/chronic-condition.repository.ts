/**
 * Chronic Condition Repository Implementation
 * Injectable NestJS repository for ongoing medical condition tracking
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface ChronicConditionAttributes {
  id: string;
  studentId: string;
  conditionName: string;
  diagnosisDate: Date;
  severity: string;
  managementPlan?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChronicConditionDTO {
  studentId: string;
  conditionName: string;
  diagnosisDate: Date;
  severity: string;
  managementPlan?: string;
  notes?: string;
}

export interface UpdateChronicConditionDTO {
  conditionName?: string;
  severity?: string;
  managementPlan?: string;
  isActive?: boolean;
  notes?: string;
}

@Injectable()
export class ChronicConditionRepository
  extends BaseRepository<any, ChronicConditionAttributes, CreateChronicConditionDTO>
{
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ChronicCondition');
  }

  async findByStudent(studentId: string): Promise<ChronicConditionAttributes[]> {
    try {
      const conditions = await this.model.findAll({
        where: { studentId, isActive: true },
        order: [['diagnosisDate', 'DESC']]
      });
      return conditions.map((c: any) => this.mapToEntity(c));
    } catch (error) {
      this.logger.error('Error finding chronic conditions by student:', error);
      throw new RepositoryError(
        'Failed to find chronic conditions by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findBySeverity(severity: string): Promise<ChronicConditionAttributes[]> {
    try {
      const conditions = await this.model.findAll({
        where: { severity, isActive: true },
        order: [['conditionName', 'ASC']]
      });
      return conditions.map((c: any) => this.mapToEntity(c));
    } catch (error) {
      this.logger.error('Error finding chronic conditions by severity:', error);
      throw new RepositoryError(
        'Failed to find chronic conditions by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateChronicConditionDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateChronicConditionDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(condition: any): Promise<void> {
    try {
      const conditionData = condition.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, conditionData.id));
      await this.cacheManager.deletePattern(`white-cross:chronic-condition:student:${conditionData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating chronic condition caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      conditionName: '[PHI]',
      managementPlan: '[PHI]'
    });
  }
}
