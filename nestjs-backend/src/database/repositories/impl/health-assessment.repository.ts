/**
 * Health Assessment Repository Implementation
 * Injectable NestJS repository for comprehensive health assessment tracking
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface HealthAssessmentAttributes {
  id: string;
  studentId: string;
  assessmentDate: Date;
  assessmentType: string;
  assessor: string;
  findings: string;
  recommendations?: string;
  riskLevel?: string;
  followUpDate?: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthAssessmentDTO {
  studentId: string;
  assessmentDate: Date;
  assessmentType: string;
  assessor: string;
  findings: string;
  recommendations?: string;
  riskLevel?: string;
  followUpDate?: Date;
  status: string;
  notes?: string;
}

export interface UpdateHealthAssessmentDTO {
  findings?: string;
  recommendations?: string;
  riskLevel?: string;
  followUpDate?: Date;
  status?: string;
  notes?: string;
}

@Injectable()
export class HealthAssessmentRepository
  extends BaseRepository<any, HealthAssessmentAttributes, CreateHealthAssessmentDTO>
{
  constructor(
    @InjectModel(('' as any)) model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'HealthAssessment');
  }

  async findByStudent(studentId: string): Promise<HealthAssessmentAttributes[]> {
    try {
      const assessments = await this.model.findAll({
        where: { studentId },
        order: [['assessmentDate', 'DESC']]
      });
      return assessments.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding health assessments by student:', error);
      throw new RepositoryError(
        'Failed to find health assessments by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findByType(assessmentType: string): Promise<HealthAssessmentAttributes[]> {
    try {
      const assessments = await this.model.findAll({
        where: { assessmentType },
        order: [['assessmentDate', 'DESC']]
      });
      return assessments.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding health assessments by type:', error);
      throw new RepositoryError(
        'Failed to find health assessments by type',
        'FIND_BY_TYPE_ERROR',
        500,
        { assessmentType, error: (error as Error).message }
      );
    }
  }

  async findByRiskLevel(riskLevel: string): Promise<HealthAssessmentAttributes[]> {
    try {
      const assessments = await this.model.findAll({
        where: { riskLevel },
        order: [['assessmentDate', 'DESC']]
      });
      return assessments.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding health assessments by risk level:', error);
      throw new RepositoryError(
        'Failed to find health assessments by risk level',
        'FIND_BY_RISK_LEVEL_ERROR',
        500,
        { riskLevel, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateHealthAssessmentDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateHealthAssessmentDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(assessment: any): Promise<void> {
    try {
      const assessmentData = assessment.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, assessmentData.id));
      await this.cacheManager.deletePattern(`white-cross:health-assessment:student:${assessmentData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating health assessment caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      findings: '[PHI]',
      recommendations: '[PHI]'
    });
  }
}
