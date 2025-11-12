/**
 * Health Screening Repository Implementation
 * Injectable NestJS repository for health screening data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateHealthScreeningDTO,
  HealthScreeningAttributes,
  IHealthScreeningRepository,
  UpdateHealthScreeningDTO,
} from '../interfaces/health-screening.repository.interface';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";
import { QueryOptions   } from "../../database/types";
import { HealthScreening    } from "../../database/models";

@Injectable()
export class HealthScreeningRepository
  extends BaseRepository<
    any,
    HealthScreeningAttributes,
    CreateHealthScreeningDTO
  >
  implements IHealthScreeningRepository
{
  constructor(
    @InjectModel(HealthScreening) model: typeof HealthScreening,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'HealthScreening');
  }

  /**
   * Find all health screenings for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<HealthScreeningAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for screenings by student: ${studentId}`);
        return cached;
      }

      const screenings = await this.model.findAll({
        where: { studentId },
        order: [['screeningDate', 'DESC']],
      });

      const entities = screenings.map((s: any) => this.mapToEntity(s));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding screenings by student:', error);
      throw new RepositoryError(
        'Failed to find screenings by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find screenings by screening type (vision, hearing, dental, etc.)
   */
  async findByScreeningType(
    screeningType: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: { screeningType },
        order: [['screeningDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return screenings.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding screenings by type:', error);
      throw new RepositoryError(
        'Failed to find screenings by type',
        'FIND_BY_TYPE_ERROR',
        500,
        { screeningType, error: (error as Error).message },
      );
    }
  }

  /**
   * Find screenings due on or before a specific date
   */
  async findDueScreenings(
    date: Date,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: {
          nextScheduledDate: {
            [Op.lte]: date,
          },
          followUpRequired: true,
          followUpCompleted: false,
        },
        order: [['nextScheduledDate', 'ASC']],
        limit: options?.limit || 100,
      });

      return screenings.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding due screenings:', error);
      throw new RepositoryError(
        'Failed to find due screenings',
        'FIND_DUE_ERROR',
        500,
        { date, error: (error as Error).message },
      );
    }
  }

  /**
   * Find screenings within a date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: {
          screeningDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['screeningDate', 'DESC']],
        limit: options?.limit || 500,
      });

      return screenings.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding screenings by date range:', error);
      throw new RepositoryError(
        'Failed to find screenings by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { startDate, endDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Find screenings with abnormal results
   */
  async findAbnormalResults(
    screeningType?: string,
    options?: QueryOptions,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const whereClause: any = {
        isAbnormal: true,
      };

      if (screeningType) {
        whereClause.screeningType = screeningType;
      }

      const screenings = await this.model.findAll({
        where: whereClause,
        order: [['screeningDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return screenings.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding abnormal screenings:', error);
      throw new RepositoryError(
        'Failed to find abnormal screenings',
        'FIND_ABNORMAL_ERROR',
        500,
        { screeningType, error: (error as Error).message },
      );
    }
  }

  /**
   * Get screening schedule for a student
   */
  async getScreeningSchedule(
    studentId: string,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'schedule',
      );

      const cached =
        await this.cacheManager.get<HealthScreeningAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Get all screenings with upcoming scheduled dates
      const screenings = await this.model.findAll({
        where: {
          studentId,
          nextScheduledDate: {
            [Op.gte]: new Date(),
          },
        },
        order: [['nextScheduledDate', 'ASC']],
      });

      const entities = screenings.map((s: any) => this.mapToEntity(s));
      await this.cacheManager.set(cacheKey, entities, 3600);

      return entities;
    } catch (error) {
      this.logger.error('Error getting screening schedule:', error);
      throw new RepositoryError(
        'Failed to get screening schedule',
        'SCHEDULE_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Validate screening data before creation
   */
  protected async validateCreate(
    data: CreateHealthScreeningDTO,
  ): Promise<void> {
    if (!data.studentId) {
      throw new RepositoryError(
        'Student ID is required',
        'VALIDATION_ERROR',
        400,
        { field: 'studentId' },
      );
    }

    if (!data.screeningType) {
      throw new RepositoryError(
        'Screening type is required',
        'VALIDATION_ERROR',
        400,
        { field: 'screeningType' },
      );
    }

    if (!data.screeningDate) {
      throw new RepositoryError(
        'Screening date is required',
        'VALIDATION_ERROR',
        400,
        { field: 'screeningDate' },
      );
    }

    // Validate screening type
    const validTypes = [
      'vision',
      'hearing',
      'dental',
      'scoliosis',
      'bmi',
      'general',
    ];
    if (!validTypes.includes(data.screeningType.toLowerCase())) {
      throw new RepositoryError(
        'Invalid screening type',
        'VALIDATION_ERROR',
        400,
        { screeningType: data.screeningType, validTypes },
      );
    }

    // Validate result
    const validResults = ['pass', 'fail', 'refer', 'incomplete', 'pending'];
    if (data.result && !validResults.includes(data.result.toLowerCase())) {
      throw new RepositoryError(
        'Invalid screening result',
        'VALIDATION_ERROR',
        400,
        { result: data.result, validResults },
      );
    }
  }

  /**
   * Validate screening data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateHealthScreeningDTO,
  ): Promise<void> {
    // Validate screening type if provided
    if (data.screeningType) {
      const validTypes = [
        'vision',
        'hearing',
        'dental',
        'scoliosis',
        'bmi',
        'general',
      ];
      if (!validTypes.includes(data.screeningType.toLowerCase())) {
        throw new RepositoryError(
          'Invalid screening type',
          'VALIDATION_ERROR',
          400,
          { screeningType: data.screeningType, validTypes },
        );
      }
    }

    // Validate result if provided
    if (data.result) {
      const validResults = ['pass', 'fail', 'refer', 'incomplete', 'pending'];
      if (!validResults.includes(data.result.toLowerCase())) {
        throw new RepositoryError(
          'Invalid screening result',
          'VALIDATION_ERROR',
          400,
          { result: data.result, validResults },
        );
      }
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(screening: any): Promise<void> {
    try {
      const screeningData = screening.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, screeningData.id),
      );

      // Invalidate student-specific caches
      if (screeningData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            screeningData.studentId,
            'by-student',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            screeningData.studentId,
            'schedule',
          ),
        );

        await this.cacheManager.deletePattern(
          `white-cross:healthscreening:student:${screeningData.studentId}:*`,
        );
      }

      // Invalidate screening type caches
      if (screeningData.screeningType) {
        await this.cacheManager.deletePattern(
          `white-cross:healthscreening:type:${screeningData.screeningType}:*`,
        );
      }

      // Invalidate abnormal results cache if applicable
      if (screeningData.isAbnormal) {
        await this.cacheManager.deletePattern(
          `white-cross:healthscreening:abnormal:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating screening caches:', error);
    }
  }

  /**
   * Sanitize screening data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Health screening data is PHI but should be logged for audit trail
    });
  }
}
