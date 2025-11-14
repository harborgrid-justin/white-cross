/**
 * Growth Tracking Repository Implementation
 * Injectable NestJS repository for growth tracking data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateGrowthTrackingDTO,
  GrowthPercentiles,
  GrowthTrackingAttributes,
  GrowthTrend,
  IGrowthTrackingRepository,
  UpdateGrowthTrackingDTO,
} from '../interfaces/growth-tracking.repository.interface';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { QueryOptions } from '../../../database/types';
import { GrowthTracking } from '@/database/models';

@Injectable()
export class GrowthTrackingRepository
  extends BaseRepository<any, GrowthTrackingAttributes, CreateGrowthTrackingDTO>
  implements IGrowthTrackingRepository
{
  constructor(
    @InjectModel(GrowthTracking) model: typeof GrowthTracking,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'GrowthTracking');
  }

  /**
   * Find all growth records for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<GrowthTrackingAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<GrowthTrackingAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(
          `Cache hit for growth records by student: ${studentId}`,
        );
        return cached;
      }

      const records = await this.model.findAll({
        where: { studentId },
        order: [['measurementDate', 'DESC']],
        limit: options?.limit || 100,
      });

      const entities = records.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding growth records by student:', error);
      throw new RepositoryError(
        'Failed to find growth records by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find latest growth record for a student
   */
  async findLatestByStudent(
    studentId: string,
  ): Promise<GrowthTrackingAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'latest',
      );

      const cached =
        await this.cacheManager.get<GrowthTrackingAttributes>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for latest growth record: ${studentId}`);
        return cached;
      }

      const record = await this.model.findOne({
        where: { studentId },
        order: [['measurementDate', 'DESC']],
      });

      if (!record) {
        return null;
      }

      const entity = this.mapToEntity(record);
      await this.cacheManager.set(cacheKey, entity, 3600);

      return entity;
    } catch (error) {
      this.logger.error('Error finding latest growth record:', error);
      throw new RepositoryError(
        'Failed to find latest growth record',
        'FIND_LATEST_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find growth records within a date range for a student
   */
  async findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GrowthTrackingAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: {
          studentId,
          measurementDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['measurementDate', 'ASC']],
      });

      return records.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding growth records by date range:', error);
      throw new RepositoryError(
        'Failed to find growth records by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { studentId, startDate, endDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Calculate BMI from height and weight
   */
  calculateBMI(
    height: number,
    heightUnit: string,
    weight: number,
    weightUnit: string,
  ): number {
    try {
      // Convert to metric (kg and cm)
      let weightInKg = weight;
      let heightInCm = height;

      if (weightUnit.toLowerCase() === 'lbs') {
        weightInKg = weight * 0.453592;
      }

      if (heightUnit.toLowerCase() === 'inches') {
        heightInCm = height * 2.54;
      }

      // BMI = weight(kg) / (height(m))^2
      const heightInM = heightInCm / 100;
      const bmi = weightInKg / (heightInM * heightInM);

      return Math.round(bmi * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      this.logger.error('Error calculating BMI:', error);
      throw new RepositoryError(
        'Failed to calculate BMI',
        'BMI_CALCULATION_ERROR',
        500,
        {
          height,
          heightUnit,
          weight,
          weightUnit,
          error: (error as Error).message,
        },
      );
    }
  }

  /**
   * Get growth percentiles for a student based on latest measurement
   */
  async getGrowthPercentiles(studentId: string): Promise<GrowthPercentiles> {
    try {
      const latest = await this.findLatestByStudent(studentId);

      if (!latest) {
        throw new RepositoryError(
          'No growth records found for student',
          'NO_RECORDS_ERROR',
          404,
          { studentId },
        );
      }

      return {
        bmi: latest.bmiPercentile,
        height: latest.heightPercentile,
        weight: latest.weightPercentile,
        headCircumference: latest.headCircumferencePercentile,
      };
    } catch (error) {
      this.logger.error('Error getting growth percentiles:', error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        'Failed to get growth percentiles',
        'PERCENTILES_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Get growth trend analysis for a student
   */
  async getGrowthTrend(
    studentId: string,
    months: number = 12,
  ): Promise<GrowthTrend> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const measurements = await this.findByDateRange(
        studentId,
        startDate,
        new Date(),
      );

      if (measurements.length < 2) {
        throw new RepositoryError(
          'Insufficient data for trend analysis',
          'INSUFFICIENT_DATA',
          400,
          { studentId, measurements: measurements.length },
        );
      }

      // Calculate average growth rates
      const firstMeasurement = measurements[0];
      const lastMeasurement = measurements[measurements.length - 1];

      const monthsDiff = this.getMonthsDifference(
        firstMeasurement.measurementDate,
        lastMeasurement.measurementDate,
      );

      const heightGrowthRate =
        monthsDiff > 0
          ? (lastMeasurement.height - firstMeasurement.height) / monthsDiff
          : 0;

      const weightGrowthRate =
        monthsDiff > 0
          ? (lastMeasurement.weight - firstMeasurement.weight) / monthsDiff
          : 0;

      // Project next measurement (simple linear projection)
      const projectedNextMeasurement =
        monthsDiff > 0
          ? {
              height: lastMeasurement.height + heightGrowthRate * 3, // 3 months ahead
              weight: lastMeasurement.weight + weightGrowthRate * 3,
              bmi: 0, // Will be calculated based on projected values
            }
          : undefined;

      if (projectedNextMeasurement) {
        projectedNextMeasurement.bmi = this.calculateBMI(
          projectedNextMeasurement.height,
          lastMeasurement.heightUnit,
          projectedNextMeasurement.weight,
          lastMeasurement.weightUnit,
        );
      }

      return {
        studentId,
        measurements,
        averageGrowthRate: {
          height: Math.round(heightGrowthRate * 100) / 100,
          weight: Math.round(weightGrowthRate * 100) / 100,
        },
        projectedNextMeasurement,
      };
    } catch (error) {
      this.logger.error('Error getting growth trend:', error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        'Failed to get growth trend',
        'TREND_ERROR',
        500,
        { studentId, months, error: (error as Error).message },
      );
    }
  }

  /**
   * Find growth records by age range
   */
  async findByAgeRange(
    minAge: number,
    maxAge: number,
    options?: QueryOptions,
  ): Promise<GrowthTrackingAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: {
          ageInMonths: {
            [Op.between]: [minAge, maxAge],
          },
        },
        order: [['measurementDate', 'DESC']],
        limit: options?.limit || 200,
      });

      return records.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding growth records by age range:', error);
      throw new RepositoryError(
        'Failed to find growth records by age range',
        'FIND_BY_AGE_ERROR',
        500,
        { minAge, maxAge, error: (error as Error).message },
      );
    }
  }

  /**
   * Helper: Calculate months difference between two dates
   */
  private getMonthsDifference(date1: Date, date2: Date): number {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12;
    return months + (date2.getMonth() - date1.getMonth());
  }

  /**
   * Validate growth tracking data before creation
   */
  protected async validateCreate(data: CreateGrowthTrackingDTO): Promise<void> {
    if (!data.studentId) {
      throw new RepositoryError(
        'Student ID is required',
        'VALIDATION_ERROR',
        400,
        { field: 'studentId' },
      );
    }

    if (!data.measurementDate) {
      throw new RepositoryError(
        'Measurement date is required',
        'VALIDATION_ERROR',
        400,
        { field: 'measurementDate' },
      );
    }

    if (!data.height || !data.weight) {
      throw new RepositoryError(
        'Height and weight are required',
        'VALIDATION_ERROR',
        400,
        { fields: ['height', 'weight'] },
      );
    }

    // Validate ranges
    if (data.height <= 0 || data.height > 300) {
      throw new RepositoryError(
        'Height value out of valid range',
        'VALIDATION_ERROR',
        400,
        { height: data.height, range: '0-300cm or 0-120 inches' },
      );
    }

    if (data.weight <= 0 || data.weight > 500) {
      throw new RepositoryError(
        'Weight value out of valid range',
        'VALIDATION_ERROR',
        400,
        { weight: data.weight, range: '0-500kg or 0-1100 lbs' },
      );
    }
  }

  /**
   * Validate growth tracking data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateGrowthTrackingDTO,
  ): Promise<void> {
    if (data.height !== undefined && (data.height <= 0 || data.height > 300)) {
      throw new RepositoryError(
        'Height value out of valid range',
        'VALIDATION_ERROR',
        400,
        { height: data.height, range: '0-300cm or 0-120 inches' },
      );
    }

    if (data.weight !== undefined && (data.weight <= 0 || data.weight > 500)) {
      throw new RepositoryError(
        'Weight value out of valid range',
        'VALIDATION_ERROR',
        400,
        { weight: data.weight, range: '0-500kg or 0-1100 lbs' },
      );
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(growthRecord: any): Promise<void> {
    try {
      const growthData = growthRecord.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, growthData.id),
      );

      // Invalidate student-specific caches
      if (growthData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            growthData.studentId,
            'by-student',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            growthData.studentId,
            'latest',
          ),
        );

        // Invalidate all student growth patterns
        await this.cacheManager.deletePattern(
          `white-cross:growthtracking:student:${growthData.studentId}:*`,
        );
      }

      // Invalidate age range caches
      await this.cacheManager.deletePattern(`white-cross:growthtracking:age:*`);
    } catch (error) {
      this.logger.warn('Error invalidating growth tracking caches:', error);
    }
  }

  /**
   * Sanitize growth tracking data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Growth data is PHI but should be logged for audit trail
    });
  }
}
