/**
 * Medical History Repository Implementation
 * Injectable NestJS repository for historical medical record tracking
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface MedicalHistoryAttributes {
  id: string;
  studentId: string;
  category: string;
  condition: string;
  diagnosisDate?: Date;
  resolutionDate?: Date;
  provider?: string;
  isResolved: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicalHistoryDTO {
  studentId: string;
  category: string;
  condition: string;
  diagnosisDate?: Date;
  resolutionDate?: Date;
  provider?: string;
  notes?: string;
}

export interface UpdateMedicalHistoryDTO {
  category?: string;
  condition?: string;
  diagnosisDate?: Date;
  resolutionDate?: Date;
  provider?: string;
  isResolved?: boolean;
  notes?: string;
}

@Injectable()
export class MedicalHistoryRepository extends BaseRepository<
  any,
  MedicalHistoryAttributes,
  CreateMedicalHistoryDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'MedicalHistory');
  }

  async findByStudent(studentId: string): Promise<MedicalHistoryAttributes[]> {
    try {
      const history = await this.model.findAll({
        where: { studentId },
        order: [['diagnosisDate', 'DESC']],
      });
      return history.map((h: any) => this.mapToEntity(h));
    } catch (error) {
      this.logger.error('Error finding medical history by student:', error);
      throw new RepositoryError(
        'Failed to find medical history by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findByCategory(
    studentId: string,
    category: string,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const history = await this.model.findAll({
        where: { studentId, category },
        order: [['diagnosisDate', 'DESC']],
      });
      return history.map((h: any) => this.mapToEntity(h));
    } catch (error) {
      this.logger.error('Error finding medical history by category:', error);
      throw new RepositoryError(
        'Failed to find medical history by category',
        'FIND_BY_CATEGORY_ERROR',
        500,
        { studentId, category, error: (error as Error).message },
      );
    }
  }

  async findActiveConditions(
    studentId: string,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const history = await this.model.findAll({
        where: { studentId, isResolved: false },
        order: [['diagnosisDate', 'DESC']],
      });
      return history.map((h: any) => this.mapToEntity(h));
    } catch (error) {
      this.logger.error('Error finding active conditions:', error);
      throw new RepositoryError(
        'Failed to find active conditions',
        'FIND_ACTIVE_CONDITIONS_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateMedicalHistoryDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateMedicalHistoryDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(history: any): Promise<void> {
    try {
      const historyData = history.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, historyData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:medical-history:student:${historyData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating medical history caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      condition: '[PHI]',
      notes: '[PHI]',
    });
  }
}
