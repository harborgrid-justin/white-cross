/**
 * Vital Signs Repository Implementation
 * Injectable NestJS repository for vital signs data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateVitalSignsDTO,
  IVitalSignsRepository,
  UpdateVitalSignsDTO,
  VitalSignsAttributes,
} from '../interfaces/vital-signs.repository.interface';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { VitalSigns } from '@/database/models';
import { ExecutionContext, QueryOptions } from '../../../database/types';

@Injectable()
export class VitalSignsRepository
  extends BaseRepository<any, VitalSignsAttributes, CreateVitalSignsDTO>
  implements IVitalSignsRepository
{
  constructor(
    @InjectModel(VitalSigns) model: typeof VitalSigns,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'VitalSigns');
  }

  /**
   * Find all vital signs for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<VitalSignsAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<VitalSignsAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for vital signs by student: ${studentId}`);
        return cached;
      }

      const vitalSigns = await this.model.findAll({
        where: { studentId },
        order: [['measurementDate', 'DESC']],
        limit: options?.limit || 100,
      });

      const entities = vitalSigns.map((v: any) => this.mapToEntity(v));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding vital signs by student:', error);
      throw new RepositoryError(
        'Failed to find vital signs by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find latest vital signs measurement for a student
   */
  async findLatestByStudent(
    studentId: string,
  ): Promise<VitalSignsAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'latest',
      );

      const cached =
        await this.cacheManager.get<VitalSignsAttributes>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for latest vital signs: ${studentId}`);
        return cached;
      }

      const vitalSign = await this.model.findOne({
        where: { studentId },
        order: [['measurementDate', 'DESC']],
      });

      if (!vitalSign) {
        return null;
      }

      const entity = this.mapToEntity(vitalSign);
      await this.cacheManager.set(cacheKey, entity, 3600);

      return entity;
    } catch (error) {
      this.logger.error('Error finding latest vital signs:', error);
      throw new RepositoryError(
        'Failed to find latest vital signs',
        'FIND_LATEST_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find vital signs within a date range for a student
   */
  async findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<VitalSignsAttributes[]> {
    try {
      const vitalSigns = await this.model.findAll({
        where: {
          studentId,
          measurementDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['measurementDate', 'ASC']],
      });

      return vitalSigns.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding vital signs by date range:', error);
      throw new RepositoryError(
        'Failed to find vital signs by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { studentId, startDate, endDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Find vital signs with abnormal values
   */
  async findAbnormalVitals(
    studentId?: string,
    options?: QueryOptions,
  ): Promise<VitalSignsAttributes[]> {
    try {
      const whereClause: any = {
        isAbnormal: true,
      };

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const vitalSigns = await this.model.findAll({
        where: whereClause,
        order: [['measurementDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return vitalSigns.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding abnormal vital signs:', error);
      throw new RepositoryError(
        'Failed to find abnormal vital signs',
        'FIND_ABNORMAL_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Get vital sign trends for a specific vital type
   */
  async getVitalTrends(
    studentId: string,
    vitalType: string,
    days: number = 30,
  ): Promise<VitalSignsAttributes[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        `${studentId}:${vitalType}:${days}`,
        'trends',
      );

      const cached =
        await this.cacheManager.get<VitalSignsAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const vitalSigns = await this.model.findAll({
        where: {
          studentId,
          measurementDate: {
            [Op.gte]: startDate,
          },
        },
        order: [['measurementDate', 'ASC']],
      });

      const entities = vitalSigns.map((v: any) => this.mapToEntity(v));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error getting vital trends:', error);
      throw new RepositoryError(
        'Failed to get vital trends',
        'TRENDS_ERROR',
        500,
        { studentId, vitalType, days, error: (error as Error).message },
      );
    }
  }

  /**
   * Bulk record vital signs for multiple students
   */
  async bulkRecordVitals(
    records: CreateVitalSignsDTO[],
    context: ExecutionContext,
  ): Promise<VitalSignsAttributes[]> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      const results = await this.model.bulkCreate(records as any, {
        transaction,
        validate: true,
        returning: true,
      });

      await this.auditLogger.logBulkOperation(
        'BULK_RECORD_VITALS',
        this.entityName,
        context,
        { count: results.length },
      );

      if (transaction) {
        await transaction.commit();
      }

      this.logger.log(
        `Bulk recorded ${results.length} vital sign measurements`,
      );

      return results.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error('Error bulk recording vital signs:', error);
      throw new RepositoryError(
        'Failed to bulk record vital signs',
        'BULK_RECORD_ERROR',
        500,
        { count: records.length, error: (error as Error).message },
      );
    }
  }

  /**
   * Validate vital signs data before creation
   */
  protected async validateCreate(data: CreateVitalSignsDTO): Promise<void> {
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

    // Validate measurement date is not in the future
    if (data.measurementDate > new Date()) {
      throw new RepositoryError(
        'Measurement date cannot be in the future',
        'VALIDATION_ERROR',
        400,
        { measurementDate: data.measurementDate },
      );
    }

    // Validate vital sign ranges
    if (data.temperature !== undefined) {
      if (data.temperature < 90 || data.temperature > 110) {
        throw new RepositoryError(
          'Temperature value out of valid range',
          'VALIDATION_ERROR',
          400,
          { temperature: data.temperature, range: '90-110°F' },
        );
      }
    }

    if (data.heartRate !== undefined) {
      if (data.heartRate < 30 || data.heartRate > 220) {
        throw new RepositoryError(
          'Heart rate value out of valid range',
          'VALIDATION_ERROR',
          400,
          { heartRate: data.heartRate, range: '30-220 bpm' },
        );
      }
    }

    if (data.oxygenSaturation !== undefined) {
      if (data.oxygenSaturation < 70 || data.oxygenSaturation > 100) {
        throw new RepositoryError(
          'Oxygen saturation value out of valid range',
          'VALIDATION_ERROR',
          400,
          { oxygenSaturation: data.oxygenSaturation, range: '70-100%' },
        );
      }
    }

    if (data.bloodPressureSystolic !== undefined) {
      if (data.bloodPressureSystolic < 60 || data.bloodPressureSystolic > 250) {
        throw new RepositoryError(
          'Blood pressure systolic value out of valid range',
          'VALIDATION_ERROR',
          400,
          {
            bloodPressureSystolic: data.bloodPressureSystolic,
            range: '60-250 mmHg',
          },
        );
      }
    }
  }

  /**
   * Validate vital signs data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateVitalSignsDTO,
  ): Promise<void> {
    // Apply same range validations as create
    if (data.temperature !== undefined) {
      if (data.temperature < 90 || data.temperature > 110) {
        throw new RepositoryError(
          'Temperature value out of valid range',
          'VALIDATION_ERROR',
          400,
          { temperature: data.temperature, range: '90-110°F' },
        );
      }
    }

    if (data.heartRate !== undefined) {
      if (data.heartRate < 30 || data.heartRate > 220) {
        throw new RepositoryError(
          'Heart rate value out of valid range',
          'VALIDATION_ERROR',
          400,
          { heartRate: data.heartRate, range: '30-220 bpm' },
        );
      }
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(vitalSign: any): Promise<void> {
    try {
      const vitalSignData = vitalSign.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, vitalSignData.id),
      );

      // Invalidate student-specific caches
      if (vitalSignData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            vitalSignData.studentId,
            'by-student',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            vitalSignData.studentId,
            'latest',
          ),
        );

        // Invalidate all student vital sign patterns
        await this.cacheManager.deletePattern(
          `white-cross:vitalsigns:student:${vitalSignData.studentId}:*`,
        );

        // Invalidate trend caches
        await this.cacheManager.deletePattern(
          `white-cross:vitalsigns:${vitalSignData.studentId}:*:trends`,
        );
      }

      // Invalidate abnormal vitals cache if applicable
      if (vitalSignData.isAbnormal) {
        await this.cacheManager.deletePattern(
          `white-cross:vitalsigns:abnormal:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating vital signs caches:', error);
    }
  }

  /**
   * Sanitize vital signs data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Vital signs are PHI but should be logged for audit trail
    });
  }
}
