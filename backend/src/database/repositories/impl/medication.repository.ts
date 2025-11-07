/**
 * Medication Repository Implementation
 * Injectable NestJS repository for medication tracking with dosage management
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface MedicationAttributes {
  id: string;
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicationDTO {
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface UpdateMedicationDTO {
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  endDate?: Date;
  isActive?: boolean;
  notes?: string;
}

@Injectable()
export class MedicationRepository extends BaseRepository<
  any,
  MedicationAttributes,
  CreateMedicationDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Medication');
  }

  async findByStudent(studentId: string): Promise<MedicationAttributes[]> {
    try {
      const medications = await this.model.findAll({
        where: { studentId },
        order: [['startDate', 'DESC']],
      });
      return medications.map((m: Medication) => this.mapToEntity(m));
    } catch (error) {
      this.logger.error('Error finding medications by student:', error);
      throw new RepositoryError(
        'Failed to find medications by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findActiveMedications(
    studentId: string,
  ): Promise<MedicationAttributes[]> {
    try {
      const medications = await this.model.findAll({
        where: {
          studentId,
          isActive: true,
          [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: new Date() } }],
        },
        order: [['medicationName', 'ASC']],
      });
      return medications.map((m: Medication) => this.mapToEntity(m));
    } catch (error) {
      this.logger.error('Error finding active medications:', error);
      throw new RepositoryError(
        'Failed to find active medications',
        'FIND_ACTIVE_MEDICATIONS_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findByMedicationName(
    medicationName: string,
  ): Promise<MedicationAttributes[]> {
    try {
      const medications = await this.model.findAll({
        where: {
          medicationName: { [Op.iLike]: `%${medicationName}%` },
          isActive: true,
        },
        order: [['studentId', 'ASC']],
      });
      return medications.map((m: Medication) => this.mapToEntity(m));
    } catch (error) {
      this.logger.error('Error finding medications by name:', error);
      throw new RepositoryError(
        'Failed to find medications by name',
        'FIND_BY_NAME_ERROR',
        500,
        { medicationName, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateMedicationDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateMedicationDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(medication: Medication): Promise<void> {
    try {
      const medicationData = medication.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, medicationData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:medication:student:${medicationData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating medication caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<MedicationAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
