/**
 * Medication Log Repository Implementation
 * Tracks medication administration logs for compliance and adherence monitoring
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { QueryOptions } from '../../types';
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
export class MedicationLogRepository extends BaseRepository<
  MedicationLog,
  MedicationLogAttributes,
  CreateMedicationLogDTO
> {
  constructor(
    @InjectModel(MedicationLog) model: typeof MedicationLog,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'MedicationLog');
  }

  /**
   * Find medication logs by student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<MedicationLogAttributes[]> {
    try {
      const logs = await this.model.findAll({
        where: { studentId },
        order: [['administeredAt', 'DESC']],
        ...options,
      });
      return logs.map((log: MedicationLog) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding medication logs by student:', error);
      throw new RepositoryError(
        'Failed to find medication logs by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find pending medication administrations
   */
  async findPending(
    studentId?: string,
    options?: QueryOptions,
  ): Promise<MedicationLogAttributes[]> {
    try {
      const where: WhereOptions = { status: 'PENDING' };
      if (studentId) {
        where.studentId = studentId;
      }

      const logs = await this.model.findAll({
        where,
        order: [['scheduledAt', 'ASC']],
        ...options,
      });
      return logs.map((log: MedicationLog) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding pending medication logs:', error);
      throw new RepositoryError(
        'Failed to find pending medication logs',
        'FIND_PENDING_ERROR',
        500,
        { studentId, error: (error as Error).message },
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
    options?: QueryOptions,
  ): Promise<MedicationLogAttributes[]> {
    try {
      const where: WhereOptions = {
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
      return logs.map((log: MedicationLog) => this.mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding medication logs by date range:', error);
      throw new RepositoryError(
        'Failed to find medication logs by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { startDate, endDate, studentId, error: (error as Error).message },
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
    endDate?: Date,
  ): Promise<{
    totalScheduled: number;
    totalAdministered: number;
    adherenceRate: number;
  }> {
    try {
      const where: WhereOptions = { studentId };
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
        (log: MedicationLog) => log.status === 'ADMINISTERED',
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
        { studentId, medicationId, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateMedicationLogDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateMedicationLogDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(log: MedicationLog): Promise<void> {
    try {
      const logData = log.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, logData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:medication-log:student:${logData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating medication log caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<MedicationLogAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
