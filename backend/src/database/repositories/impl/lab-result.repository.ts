/**
 * Lab Result Repository Implementation
 * Injectable NestJS repository for laboratory test result tracking
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface LabResultAttributes {
  id: string;
  studentId: string;
  testName: string;
  testDate: Date;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  status: string;
  orderedBy: string;
  performedAt?: string;
  isAbnormal: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLabResultDTO {
  studentId: string;
  testName: string;
  testDate: Date;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  status: string;
  orderedBy: string;
  performedAt?: string;
  isAbnormal?: boolean;
  notes?: string;
}

export interface UpdateLabResultDTO {
  resultValue?: string;
  unit?: string;
  referenceRange?: string;
  status?: string;
  isAbnormal?: boolean;
  notes?: string;
}

@Injectable()
export class LabResultRepository extends BaseRepository<
  any,
  LabResultAttributes,
  CreateLabResultDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'LabResult');
  }

  async findByStudent(studentId: string): Promise<LabResultAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: { studentId },
        order: [['testDate', 'DESC']],
      });
      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding lab results by student:', error);
      throw new RepositoryError(
        'Failed to find lab results by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findAbnormalResults(studentId: string): Promise<LabResultAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: { studentId, isAbnormal: true },
        order: [['testDate', 'DESC']],
      });
      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding abnormal lab results:', error);
      throw new RepositoryError(
        'Failed to find abnormal lab results',
        'FIND_ABNORMAL_RESULTS_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findByTestName(
    studentId: string,
    testName: string,
  ): Promise<LabResultAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: { studentId, testName },
        order: [['testDate', 'DESC']],
      });
      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding lab results by test name:', error);
      throw new RepositoryError(
        'Failed to find lab results by test name',
        'FIND_BY_TEST_NAME_ERROR',
        500,
        { studentId, testName, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateLabResultDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateLabResultDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(labResult: any): Promise<void> {
    try {
      const labResultData = labResult.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, labResultData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:lab-result:student:${labResultData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating lab result caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      resultValue: '[PHI]',
      notes: '[PHI]',
    });
  }
}
