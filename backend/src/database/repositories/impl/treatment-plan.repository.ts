/**
 * Treatment Plan Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';
import { TreatmentPlan } from '../../models/treatment-plan.model';

export interface TreatmentPlanAttributes {
  id: string;
  studentId: string;
  planName: string;
  condition: string;
  startDate: Date;
  endDate?: Date;
  goals: string[];
  interventions: string[];
  providerId: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTreatmentPlanDTO {
  studentId: string;
  planName: string;
  condition: string;
  startDate: Date;
  endDate?: Date;
  goals: string[];
  interventions: string[];
  providerId: string;
  notes?: string;
}

export interface UpdateTreatmentPlanDTO {
  planName?: string;
  goals?: string[];
  interventions?: string[];
  status?: string;
  endDate?: Date;
  notes?: string;
}

@Injectable()
export class TreatmentPlanRepository extends BaseRepository<any, TreatmentPlanAttributes, CreateTreatmentPlanDTO> {
  constructor(
    @InjectModel(TreatmentPlan) model: typeof TreatmentPlan,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'TreatmentPlan');
  }

  async findByStudent(studentId: string): Promise<TreatmentPlanAttributes[]> {
    try {
      const plans = await this.model.findAll({
        where: { studentId },
        order: [['startDate', 'DESC']]
      });
      return plans.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding treatment plans:', error);
      throw new RepositoryError('Failed to find treatment plans', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: (error as Error).message });
    }
  }

  async findActiveByStudent(studentId: string): Promise<TreatmentPlanAttributes[]> {
    try {
      const plans = await this.model.findAll({
        where: { studentId, status: 'active' },
        order: [['startDate', 'DESC']]
      });
      return plans.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding active treatment plans:', error);
      throw new RepositoryError('Failed to find active treatment plans', 'FIND_ACTIVE_ERROR', 500, { studentId, error: (error as Error).message });
    }
  }

  protected async validateCreate(data: CreateTreatmentPlanDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateTreatmentPlanDTO): Promise<void> {}

  protected async invalidateCaches(plan: any): Promise<void> {
    try {
      const planData = plan.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, planData.id));
      await this.cacheManager.deletePattern(`white-cross:treatment-plan:student:${planData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating treatment plan caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data, condition: '[PHI]', goals: '[PHI]', interventions: '[PHI]' });
  }
}


