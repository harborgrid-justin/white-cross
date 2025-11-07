/**
 * Health Record Repository Implementation
 * HIPAA-compliant repository for student health records with PHI protection
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { HealthRecord } from '../../models/health-record.model';

export interface HealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: string;
  recordDate: Date;
  providerId?: string;
  diagnosis?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthRecordDTO {
  studentId: string;
  recordType: string;
  recordDate: Date;
  providerId?: string;
  diagnosis?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
}

export interface UpdateHealthRecordDTO {
  recordType?: string;
  recordDate?: Date;
  providerId?: string;
  diagnosis?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
}

@Injectable()
export class HealthRecordRepository extends BaseRepository<
  HealthRecord,
  HealthRecordAttributes,
  CreateHealthRecordDTO
> {
  constructor(
    @InjectModel(HealthRecord) model: typeof HealthRecord,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'HealthRecord');
  }

  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<HealthRecordAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: { studentId },
        order: [['recordDate', 'DESC']],
      });
      return records.map((r: HealthRecord) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding health records by student:', error);
      throw new RepositoryError(
        'Failed to find health records by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findByType(
    studentId: string,
    recordType: string,
  ): Promise<HealthRecordAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: { studentId, recordType },
        order: [['recordDate', 'DESC']],
      });
      return records.map((r: HealthRecord) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding health records by type:', error);
      throw new RepositoryError(
        'Failed to find health records by type',
        'FIND_BY_TYPE_ERROR',
        500,
        { studentId, recordType, error: (error as Error).message },
      );
    }
  }

  async findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HealthRecordAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: {
          studentId,
          recordDate: { [Op.between]: [startDate, endDate] },
        },
        order: [['recordDate', 'DESC']],
      });
      return records.map((r: HealthRecord) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding health records by date range:', error);
      throw new RepositoryError(
        'Failed to find health records by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { studentId, startDate, endDate, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateHealthRecordDTO): Promise<void> {
    // Validation logic for health records
  }

  protected async validateUpdate(
    id: string,
    data: UpdateHealthRecordDTO,
  ): Promise<void> {
    // Validation logic for health record updates
  }

  protected async invalidateCaches(record: HealthRecord): Promise<void> {
    try {
      const recordData = record.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, recordData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:health-record:student:${recordData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating health record caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<HealthRecordAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({
      ...data,
      diagnosis: '[PHI]',
      notes: '[PHI]',
    });
  }
}
