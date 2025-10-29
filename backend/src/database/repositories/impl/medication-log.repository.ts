/**
 * Medication Log Repository Implementation
 * Tracks medication administration logs for compliance and adherence monitoring
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { MedicationLog } from '../../models/medication-log.model';

export interface MedicationLogAttributes {
  id: string;
  studentId: string;
  medicationId: string;
  administeredAt: Date;
  scheduledAt: Date;
  administeredBy?: string;
  dosage: string;
  route: string;
  status: 'PENDING' | 'ADMINISTERED' | 'SKIPPED' | 'REFUSED';
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicationLogDTO {
  studentId: string;
  medicationId: string;
  administeredAt: Date;
  scheduledAt: Date;
  administeredBy?: string;
  dosage: string;
  route: string;
  status: 'PENDING' | 'ADMINISTERED' | 'SKIPPED' | 'REFUSED';
  reason?: string;
  notes?: string;
}

export interface UpdateMedicationLogDTO {
  administeredAt?: Date;
  administeredBy?: string;
  status?: 'PENDING' | 'ADMINISTERED' | 'SKIPPED' | 'REFUSED';
  reason?: string;
  notes?: string;
}

@Injectable()
export class MedicationLogRepository
  extends BaseRepository<MedicationLog, MedicationLogAttributes, CreateMedicationLogDTO>
{
  constructor(
    @InjectModel(MedicationLog) model: typeof MedicationLog,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'MedicationLog');
  }

  /**
   * Find medication logs by student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions
  ): Promise<MedicationLogAttributes[]> {
    try {
      const logs = await this.model.findAll({
        where: { studentId },
        order: [['administeredAt', 'DESC']],
        ...options,
      });
      return logs.map((log: any) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding medication logs by student:', error);
      throw new RepositoryError(
        'Failed to find medication logs by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Find pending medication administrations
   */
  async findPending(
    studentId?: string,
    options?: QueryOptions
  ): Promise<MedicationLogAttributes[]> {
    try {
      const where: any = { status: 'PENDING' };
      if (studentId) {
        where.studentId = studentId;
      }

      const logs = await this.model.findAll({
        where,
        order: [['scheduledAt', 'ASC']],
        ...options,
      });
      return logs.map((log: any) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding pending medication logs:', error);
      throw new RepositoryError(
        'Failed to find pending medication logs',
        'FIND_PENDING_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Find medication logs within date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    studentId?: string,
    options?: QueryOptions
  ): Promise<MedicationLogAttributes[]> {
    try {
      const where: any = {
        administeredAt: {
          [Op.between]: [startDate, endDate],
        },
      };
      if (studentId) {
        where.studentId = studentId;
      }

      const logs = await this.model.findAll({
        where,
        order: [['administeredAt', 'DESC']],
        ...options,
      });
      return logs.map((log: any) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding medication logs by date range:', error);
      throw new RepositoryError(
        'Failed to find medication logs by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { startDate, endDate, studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Calculate medication adherence rate
   */
  async calculateAdherenceRate(
    studentId: string,
    medicationId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalScheduled: number;
    totalAdministered: number;
    adherenceRate: number;
  }> {
    try {
      const where: any = { studentId };
      if (medicationId) {
        where.medicationId = medicationId;
      }
      if (startDate && endDate) {
        where.scheduledAt = {
          [Op.between]: [startDate, endDate],
        };
      }

      const logs = await this.model.findAll({ where });
      const totalScheduled = logs.length;
      const totalAdministered = logs.filter(
        (log: any) => log.status === 'ADMINISTERED'
      ).length;

      return {
        totalScheduled,
        totalAdministered,
        adherenceRate:
          totalScheduled > 0
            ? Math.round((totalAdministered / totalScheduled) * 100)
            : 0,
      };
    } catch (error) {
      this.logger.error('Error calculating adherence rate:', error);
      throw new RepositoryError(
        'Failed to calculate adherence rate',
        'CALCULATE_ADHERENCE_ERROR',
        500,
        { studentId, medicationId, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateMedicationLogDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateMedicationLogDTO
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(log: any): Promise<void> {
    try {
      const logData = log.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, logData.id)
      );
      await this.cacheManager.deletePattern(
        `white-cross:medication-log:student:${logData.studentId}:*`
      );
    } catch (error) {
      this.logger.warn('Error invalidating medication log caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
