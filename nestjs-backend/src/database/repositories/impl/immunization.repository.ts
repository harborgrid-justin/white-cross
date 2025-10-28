/**
 * Immunization Repository Implementation
 * Injectable NestJS repository for vaccine records with schedule tracking
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { Immunization } from '../../models/immunization.model';

export interface ImmunizationAttributes {
  id: string;
  studentId: string;
  vaccineName: string;
  administeredDate: Date;
  dosageNumber: number;
  administrator: string;
  lotNumber?: string;
  expirationDate?: Date;
  siteOfAdministration?: string;
  nextDueDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImmunizationDTO {
  studentId: string;
  vaccineName: string;
  administeredDate: Date;
  dosageNumber: number;
  administrator: string;
  lotNumber?: string;
  expirationDate?: Date;
  siteOfAdministration?: string;
  nextDueDate?: Date;
  notes?: string;
}

export interface UpdateImmunizationDTO {
  vaccineName?: string;
  administeredDate?: Date;
  administrator?: string;
  lotNumber?: string;
  nextDueDate?: Date;
  notes?: string;
}

@Injectable()
export class ImmunizationRepository
  extends BaseRepository<any, ImmunizationAttributes, CreateImmunizationDTO>
{
  constructor(
    @InjectModel(Immunization) model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Immunization');
  }

  async findByStudent(studentId: string): Promise<ImmunizationAttributes[]> {
    try {
      const immunizations = await this.model.findAll({
        where: { studentId },
        order: [['administeredDate', 'DESC']]
      });
      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding immunizations by student:', error);
      throw new RepositoryError(
        'Failed to find immunizations by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findByVaccine(studentId: string, vaccineName: string): Promise<ImmunizationAttributes[]> {
    try {
      const immunizations = await this.model.findAll({
        where: { studentId, vaccineName },
        order: [['dosageNumber', 'ASC']]
      });
      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding immunizations by vaccine:', error);
      throw new RepositoryError(
        'Failed to find immunizations by vaccine',
        'FIND_BY_VACCINE_ERROR',
        500,
        { studentId, vaccineName, error: (error as Error).message }
      );
    }
  }

  async findUpcomingDue(daysAhead: number = 30): Promise<ImmunizationAttributes[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const immunizations = await this.model.findAll({
        where: {
          nextDueDate: {
            [Op.between]: [new Date(), futureDate]
          }
        },
        order: [['nextDueDate', 'ASC']]
      });
      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding upcoming due immunizations:', error);
      throw new RepositoryError(
        'Failed to find upcoming due immunizations',
        'FIND_UPCOMING_DUE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateImmunizationDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateImmunizationDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(immunization: any): Promise<void> {
    try {
      const immunizationData = immunization.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, immunizationData.id));
      await this.cacheManager.deletePattern(`white-cross:immunization:student:${immunizationData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating immunization caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
