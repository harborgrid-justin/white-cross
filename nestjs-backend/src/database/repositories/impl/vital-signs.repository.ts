/**
 * Vital Signs Repository Implementation
 * Injectable NestJS repository for vital signs measurement tracking
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface VitalSignsAttributes {
  id: string;
  studentId: string;
  measurementDate: Date;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVitalSignsDTO {
  studentId: string;
  measurementDate: Date;
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedBy: string;
  notes?: string;
}

export interface UpdateVitalSignsDTO {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
}

@Injectable()
export class VitalSignsRepository
  extends BaseRepository<any, VitalSignsAttributes, CreateVitalSignsDTO>
{
  constructor(
    @InjectModel('VitalSigns') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'VitalSigns');
  }

  async findByStudent(studentId: string, limit: number = 10): Promise<VitalSignsAttributes[]> {
    try {
      const vitalSigns = await this.model.findAll({
        where: { studentId },
        order: [['measurementDate', 'DESC']],
        limit
      });
      return vitalSigns.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding vital signs by student:', error);
      throw new RepositoryError(
        'Failed to find vital signs by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<VitalSignsAttributes[]> {
    try {
      const vitalSigns = await this.model.findAll({
        where: {
          studentId,
          measurementDate: { [Op.between]: [startDate, endDate] }
        },
        order: [['measurementDate', 'ASC']]
      });
      return vitalSigns.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding vital signs by date range:', error);
      throw new RepositoryError(
        'Failed to find vital signs by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { studentId, startDate, endDate, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateVitalSignsDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateVitalSignsDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(vitalSigns: any): Promise<void> {
    try {
      const vitalSignsData = vitalSigns.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, vitalSignsData.id));
      await this.cacheManager.deletePattern(`white-cross:vital-signs:student:${vitalSignsData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating vital signs caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
