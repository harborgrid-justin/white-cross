/**
 * Health Screening Repository Implementation
 * Injectable NestJS repository for health screening program management
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../interfaces/cache/cache-manager.interface';
import { HealthScreening } from '../../models/health-screening.model';

export interface HealthScreeningAttributes {
  id: string;
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  result: string;
  isPassed: boolean;
  followUpRequired: boolean;
  followUpNotes?: string;
  conductedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthScreeningDTO {
  studentId: string;
  screeningType: string;
  screeningDate: Date;
  result: string;
  isPassed: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  conductedBy: string;
  notes?: string;
}

export interface UpdateHealthScreeningDTO {
  result?: string;
  isPassed?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  notes?: string;
}

@Injectable()
export class HealthScreeningRepository extends BaseRepository<
  any,
  HealthScreeningAttributes,
  CreateHealthScreeningDTO
> {
  constructor(
    @InjectModel(HealthScreening) model: typeof HealthScreening,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'HealthScreening');
  }

  async findByStudent(studentId: string): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: { studentId },
        order: [['screeningDate', 'DESC']],
      });
      return screenings.map((s: Student) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding health screenings by student:', error);
      throw new RepositoryError(
        'Failed to find health screenings by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findByType(
    screeningType: string,
  ): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: { screeningType },
        order: [['screeningDate', 'DESC']],
      });
      return screenings.map((s: Student) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding health screenings by type:', error);
      throw new RepositoryError(
        'Failed to find health screenings by type',
        'FIND_BY_TYPE_ERROR',
        500,
        { screeningType, error: (error as Error).message },
      );
    }
  }

  async findRequiringFollowUp(): Promise<HealthScreeningAttributes[]> {
    try {
      const screenings = await this.model.findAll({
        where: { followUpRequired: true },
        order: [['screeningDate', 'ASC']],
      });
      return screenings.map((s: Student) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding screenings requiring follow-up:', error);
      throw new RepositoryError(
        'Failed to find screenings requiring follow-up',
        'FIND_FOLLOW_UP_REQUIRED_ERROR',
        500,
        { error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(
    data: CreateHealthScreeningDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async validateUpdate(
    id: string,
    data: UpdateHealthScreeningDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(screening: HealthScreening): Promise<void> {
    try {
      const screeningData = screening.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, screeningData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:health-screening:student:${screeningData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating health screening caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<HealthScreeningAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({ ...data });
  }
}
