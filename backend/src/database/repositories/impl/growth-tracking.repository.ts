/**
 * Growth Tracking Repository Implementation
 * Injectable NestJS repository for pediatric growth tracking
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { GrowthTracking } from '../../models/growth-tracking.model';

export interface GrowthTrackingAttributes {
  id: string;
  studentId: string;
  measurementDate: Date;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  headCircumference?: number;
  weightPercentile?: number;
  heightPercentile?: number;
  bmiPercentile?: number;
  recordedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGrowthTrackingDTO {
  studentId: string;
  measurementDate: Date;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  headCircumference?: number;
  weightPercentile?: number;
  heightPercentile?: number;
  bmiPercentile?: number;
  recordedBy: string;
  notes?: string;
}

export interface UpdateGrowthTrackingDTO {
  weight?: number;
  height?: number;
  bmi?: number;
  headCircumference?: number;
  weightPercentile?: number;
  heightPercentile?: number;
  bmiPercentile?: number;
  notes?: string;
}

@Injectable()
export class GrowthTrackingRepository
  extends BaseRepository<any, GrowthTrackingAttributes, CreateGrowthTrackingDTO>
{
  constructor(
    @InjectModel(GrowthTracking) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'GrowthTracking');
  }

  async findByStudent(studentId: string): Promise<GrowthTrackingAttributes[]> {
    try {
      const measurements = await this.model.findAll({
        where: { studentId },
        order: [['measurementDate', 'ASC']]
      });
      return measurements.map((m: any) => this.mapToEntity(m));
    } catch (error) {
      this.logger.error('Error finding growth tracking by student:', error);
      throw new RepositoryError(
        'Failed to find growth tracking by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findLatestMeasurement(studentId: string): Promise<GrowthTrackingAttributes | null> {
    try {
      const measurement = await this.model.findOne({
        where: { studentId },
        order: [['measurementDate', 'DESC']]
      });
      return measurement ? this.mapToEntity(measurement) : null;
    } catch (error) {
      this.logger.error('Error finding latest growth measurement:', error);
      throw new RepositoryError(
        'Failed to find latest growth measurement',
        'FIND_LATEST_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateGrowthTrackingDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateGrowthTrackingDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(growth: any): Promise<void> {
    try {
      const growthData = growth.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, growthData.id));
      await this.cacheManager.deletePattern(`white-cross:growth-tracking:student:${growthData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating growth tracking caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}


