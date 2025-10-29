/**
 * Prescription Repository Implementation
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext } from '../../types';

export interface PrescriptionAttributes {
  id: string;
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedDate: Date;
  prescriberId: string;
  startDate: Date;
  endDate?: Date;
  refillsRemaining: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePrescriptionDTO {
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedDate: Date;
  prescriberId: string;
  startDate: Date;
  endDate?: Date;
  refillsRemaining: number;
  notes?: string;
}

export interface UpdatePrescriptionDTO {
  refillsRemaining?: number;
  status?: string;
  endDate?: Date;
  notes?: string;
}

@Injectable()
export class PrescriptionRepository extends BaseRepository<any, PrescriptionAttributes, CreatePrescriptionDTO> {
  constructor(
    @InjectModel(('' as any)) model: any,
    @Inject('IAuditLogger') auditLogger,
    @Inject('ICacheManager') cacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Prescription');
  }

  async findByStudent(studentId: string): Promise<PrescriptionAttributes[]> {
    try {
      const prescriptions = await this.model.findAll({
        where: { studentId },
        order: [['prescribedDate', 'DESC']]
      });
      return prescriptions.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding prescriptions:', error);
      throw new RepositoryError('Failed to find prescriptions', 'FIND_BY_STUDENT_ERROR', 500, { studentId, error: (error as Error).message });
    }
  }

  async findActivePrescriptions(studentId: string): Promise<PrescriptionAttributes[]> {
    try {
      const prescriptions = await this.model.findAll({
        where: {
          studentId,
          status: 'active',
          [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: new Date() } }]
        },
        order: [['medicationName', 'ASC']]
      });
      return prescriptions.map((p: any) => this.mapToEntity(p));
    } catch (error) {
      this.logger.error('Error finding active prescriptions:', error);
      throw new RepositoryError('Failed to find active prescriptions', 'FIND_ACTIVE_ERROR', 500, { studentId, error: (error as Error).message });
    }
  }

  protected async validateCreate(data: CreatePrescriptionDTO): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdatePrescriptionDTO): Promise<void> {}

  protected async invalidateCaches(prescription: any): Promise<void> {
    try {
      const prescriptionData = prescription.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, prescriptionData.id));
      await this.cacheManager.deletePattern(`white-cross:prescription:student:${prescriptionData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating prescription caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}


