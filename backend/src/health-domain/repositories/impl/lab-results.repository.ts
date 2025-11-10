/**
 * Lab Results Repository Implementation
 * Injectable NestJS repository for laboratory results data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateLabResultsDTO,
  ILabResultsRepository,
  LabResultsAttributes,
  LabResultTrend,
  UpdateLabResultsDTO,
} from '../interfaces/lab-results.repository.interface';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { QueryOptions } from '../../../database/types';
import { LabResults } from '../../../database/models/lab-results.model';

@Injectable()
export class LabResultsRepository
  extends BaseRepository<any, LabResultsAttributes, CreateLabResultsDTO>
  implements ILabResultsRepository
{
  constructor(
    @InjectModel(LabResults) model: typeof LabResults,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'LabResults');
  }

  /**
   * Find all lab results for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<LabResultsAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for lab results by student: ${studentId}`);
        return cached;
      }

      const results = await this.model.findAll({
        where: { studentId },
        order: [
          ['resultDate', 'DESC'],
          ['orderedDate', 'DESC'],
        ],
      });

      const entities = results.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
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

  /**
   * Find lab results by test type
   */
  async findByTestType(
    testType: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: { testType },
        order: [['resultDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding lab results by test type:', error);
      throw new RepositoryError(
        'Failed to find lab results by test type',
        'FIND_BY_TEST_TYPE_ERROR',
        500,
        { testType, error: (error as Error).message },
      );
    }
  }

  /**
   * Find lab results within a date range for a student
   */
  async findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<LabResultsAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: {
          studentId,
          resultDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['resultDate', 'DESC']],
      });

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding lab results by date range:', error);
      throw new RepositoryError(
        'Failed to find lab results by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { studentId, startDate, endDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Find lab results with abnormal values
   */
  async findAbnormalResults(
    studentId?: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]> {
    try {
      const whereClause: any = {
        isAbnormal: true,
        status: 'completed',
      };

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const results = await this.model.findAll({
        where: whereClause,
        order: [['resultDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding abnormal lab results:', error);
      throw new RepositoryError(
        'Failed to find abnormal lab results',
        'FIND_ABNORMAL_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find lab results awaiting review
   */
  async findPendingResults(
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: {
          status: {
            [Op.in]: ['pending', 'completed'],
          },
          reviewedBy: null,
        },
        order: [['orderedDate', 'ASC']],
        limit: options?.limit || 50,
      });

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding pending lab results:', error);
      throw new RepositoryError(
        'Failed to find pending lab results',
        'FIND_PENDING_ERROR',
        500,
        { error: (error as Error).message },
      );
    }
  }

  /**
   * Get result trends for a specific test type
   */
  async getResultTrends(
    studentId: string,
    testType: string,
    months: number = 12,
  ): Promise<LabResultTrend> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        `${studentId}:${testType}:${months}`,
        'trends',
      );

      const cached = await this.cacheManager.get<LabResultTrend>(cacheKey);
      if (cached) {
        return cached;
      }

      const results = await this.model.findAll({
        where: {
          studentId,
          testType,
          resultDate: {
            [Op.gte]: startDate,
          },
          status: 'completed',
          resultValue: {
            [Op.ne]: null,
          },
        },
        order: [['resultDate', 'ASC']],
      });

      if (results.length === 0) {
        throw new RepositoryError(
          'No results found for trend analysis',
          'NO_RESULTS_ERROR',
          404,
          { studentId, testType, months },
        );
      }

      const entities = results.map((r: any) => this.mapToEntity(r));

      // Calculate trend
      const values = entities.map((e: any) => e.resultValue as number);
      const averageValue =
        values.reduce((sum: number, val: number) => sum + val, 0) / values.length;

      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';

      if (values.length >= 2) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));

        const firstAvg =
          firstHalf.reduce((sum: number, val: number) => sum + val, 0) / firstHalf.length;
        const secondAvg =
          secondHalf.reduce((sum: number, val: number) => sum + val, 0) / secondHalf.length;

        const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

        if (percentChange > 10) {
          trend = 'increasing';
        } else if (percentChange < -10) {
          trend = 'decreasing';
        }
      }

      const trendData: LabResultTrend = {
        testName: entities[0].testName,
        testType,
        results: entities.map((e: any) => ({
          date: e.resultDate as Date,
          value: e.resultValue as number,
          unit: e.resultUnit || '',
          isAbnormal: e.isAbnormal,
        })),
        trend,
        averageValue: Math.round(averageValue * 100) / 100,
      };

      await this.cacheManager.set(cacheKey, trendData, 3600);

      return trendData;
    } catch (error) {
      this.logger.error('Error getting result trends:', error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        'Failed to get result trends',
        'TRENDS_ERROR',
        500,
        { studentId, testType, months, error: (error as Error).message },
      );
    }
  }

  /**
   * Compare results for a specific test type over time
   */
  async compareResults(
    studentId: string,
    testType: string,
  ): Promise<LabResultsAttributes[]> {
    try {
      const results = await this.model.findAll({
        where: {
          studentId,
          testType,
          status: 'completed',
        },
        order: [['resultDate', 'ASC']],
      });

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error comparing lab results:', error);
      throw new RepositoryError(
        'Failed to compare lab results',
        'COMPARE_ERROR',
        500,
        { studentId, testType, error: (error as Error).message },
      );
    }
  }

  /**
   * Validate lab results data before creation
   */
  protected async validateCreate(data: CreateLabResultsDTO): Promise<void> {
    if (!data.studentId) {
      throw new RepositoryError(
        'Student ID is required',
        'VALIDATION_ERROR',
        400,
        { field: 'studentId' },
      );
    }

    if (!data.testType || !data.testName) {
      throw new RepositoryError(
        'Test type and test name are required',
        'VALIDATION_ERROR',
        400,
        { fields: ['testType', 'testName'] },
      );
    }

    if (!data.orderedDate) {
      throw new RepositoryError(
        'Ordered date is required',
        'VALIDATION_ERROR',
        400,
        { field: 'orderedDate' },
      );
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'reviewed', 'cancelled'];
    if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
      throw new RepositoryError('Invalid status', 'VALIDATION_ERROR', 400, {
        status: data.status,
        validStatuses,
      });
    }

    // Validate date sequence
    if (data.collectionDate && data.collectionDate < data.orderedDate) {
      throw new RepositoryError(
        'Collection date cannot be before ordered date',
        'VALIDATION_ERROR',
        400,
        { orderedDate: data.orderedDate, collectionDate: data.collectionDate },
      );
    }

    if (data.resultDate) {
      if (data.collectionDate && data.resultDate < data.collectionDate) {
        throw new RepositoryError(
          'Result date cannot be before collection date',
          'VALIDATION_ERROR',
          400,
          { collectionDate: data.collectionDate, resultDate: data.resultDate },
        );
      }

      if (data.resultDate < data.orderedDate) {
        throw new RepositoryError(
          'Result date cannot be before ordered date',
          'VALIDATION_ERROR',
          400,
          { orderedDate: data.orderedDate, resultDate: data.resultDate },
        );
      }
    }
  }

  /**
   * Validate lab results data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateLabResultsDTO,
  ): Promise<void> {
    // Validate status if provided
    if (data.status) {
      const validStatuses = ['pending', 'completed', 'reviewed', 'cancelled'];
      if (!validStatuses.includes(data.status.toLowerCase())) {
        throw new RepositoryError('Invalid status', 'VALIDATION_ERROR', 400, {
          status: data.status,
          validStatuses,
        });
      }
    }

    // If marking as reviewed, ensure reviewer is provided
    if (data.status === 'reviewed' && !data.reviewedBy) {
      throw new RepositoryError(
        'Reviewer is required when marking as reviewed',
        'VALIDATION_ERROR',
        400,
        { status: data.status },
      );
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(labResult: any): Promise<void> {
    try {
      const labData = labResult.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, labData.id),
      );

      // Invalidate student-specific caches
      if (labData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            labData.studentId,
            'by-student',
          ),
        );

        // Invalidate all student lab result patterns
        await this.cacheManager.deletePattern(
          `white-cross:labresults:student:${labData.studentId}:*`,
        );

        // Invalidate trend caches
        await this.cacheManager.deletePattern(
          `white-cross:labresults:${labData.studentId}:*:trends`,
        );
      }

      // Invalidate test type caches
      if (labData.testType) {
        await this.cacheManager.deletePattern(
          `white-cross:labresults:type:${labData.testType}:*`,
        );
      }

      // Invalidate abnormal results cache if applicable
      if (labData.isAbnormal) {
        await this.cacheManager.deletePattern(
          `white-cross:labresults:abnormal:*`,
        );
      }

      // Invalidate pending results cache
      if (labData.status === 'pending' || labData.status === 'completed') {
        await this.cacheManager.deletePattern(
          `white-cross:labresults:pending:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating lab results caches:', error);
    }
  }

  /**
   * Sanitize lab results data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Lab results are PHI but should be logged for audit trail
    });
  }
}
