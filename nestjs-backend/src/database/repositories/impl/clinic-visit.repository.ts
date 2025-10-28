/**
 * Clinic Visit Repository Implementation
 * Injectable NestJS repository for clinic visit tracking with outcomes
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface ClinicVisitAttributes {
  id: string;
  studentId: string;
  visitDate: Date;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  providerId: string;
  duration?: number;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClinicVisitDTO {
  studentId: string;
  visitDate: Date;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  providerId: string;
  duration?: number;
  outcome: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  notes?: string;
}

export interface UpdateClinicVisitDTO {
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  notes?: string;
}

@Injectable()
export class ClinicVisitRepository
  extends BaseRepository<any, ClinicVisitAttributes, CreateClinicVisitDTO>
{
  constructor(
    @InjectModel(('' as any)) model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'ClinicVisit');
  }

  async findByStudent(studentId: string): Promise<ClinicVisitAttributes[]> {
    try {
      const visits = await this.model.findAll({
        where: { studentId },
        order: [['visitDate', 'DESC']]
      });
      return visits.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding clinic visits by student:', error);
      throw new RepositoryError(
        'Failed to find clinic visits by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  async findByProvider(providerId: string): Promise<ClinicVisitAttributes[]> {
    try {
      const visits = await this.model.findAll({
        where: { providerId },
        order: [['visitDate', 'DESC']]
      });
      return visits.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding clinic visits by provider:', error);
      throw new RepositoryError(
        'Failed to find clinic visits by provider',
        'FIND_BY_PROVIDER_ERROR',
        500,
        { providerId, error: (error as Error).message }
      );
    }
  }

  async findRequiringFollowUp(): Promise<ClinicVisitAttributes[]> {
    try {
      const visits = await this.model.findAll({
        where: { followUpRequired: true },
        order: [['followUpDate', 'ASC']]
      });
      return visits.map((v: any) => this.mapToEntity(v));
    } catch (error) {
      this.logger.error('Error finding visits requiring follow-up:', error);
      throw new RepositoryError(
        'Failed to find visits requiring follow-up',
        'FIND_FOLLOW_UP_REQUIRED_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateClinicVisitDTO): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(id: string, data: UpdateClinicVisitDTO): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(visit: any): Promise<void> {
    try {
      const visitData = visit.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, visitData.id));
      await this.cacheManager.deletePattern(`white-cross:clinic-visit:student:${visitData.studentId}:*`);
    } catch (error) {
      this.logger.warn('Error invalidating clinic visit caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      diagnosis: '[PHI]',
      treatment: '[PHI]',
      notes: '[PHI]'
    });
  }
}
