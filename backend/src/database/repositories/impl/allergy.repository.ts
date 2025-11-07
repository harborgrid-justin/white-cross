/**
 * Allergy Repository Implementation
 * Injectable NestJS repository for allergy tracking with severity management
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { Allergy } from '../../models/allergy.model';

export interface AllergyAttributes {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: string;
  severity: string;
  reaction?: string;
  onsetDate?: Date;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAllergyDTO {
  studentId: string;
  allergen: string;
  allergyType: string;
  severity: string;
  reaction?: string;
  onsetDate?: Date;
  notes?: string;
}

export interface UpdateAllergyDTO {
  allergen?: string;
  allergyType?: string;
  severity?: string;
  reaction?: string;
  onsetDate?: Date;
  active?: boolean;
  notes?: string;
}

@Injectable()
export class AllergyRepository extends BaseRepository<
  Allergy,
  AllergyAttributes,
  CreateAllergyDTO
> {
  constructor(
    @InjectModel(Allergy) model: typeof Allergy,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Allergy');
  }

  async findByStudent(studentId: string): Promise<AllergyAttributes[]> {
    try {
      const allergies = await this.model.findAll({
        where: { studentId, active: true },
        order: [
          ['severity', 'DESC'],
          ['allergen', 'ASC'],
        ],
      });
      return allergies.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding allergies by student:', error);
      throw new RepositoryError(
        'Failed to find allergies by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  async findBySeverity(severity: string): Promise<AllergyAttributes[]> {
    try {
      const allergies = await this.model.findAll({
        where: { severity, active: true },
        order: [
          ['studentId', 'ASC'],
          ['allergen', 'ASC'],
        ],
      });
      return allergies.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding allergies by severity:', error);
      throw new RepositoryError(
        'Failed to find allergies by severity',
        'FIND_BY_SEVERITY_ERROR',
        500,
        { severity, error: (error as Error).message },
      );
    }
  }

  async findByAllergen(allergen: string): Promise<AllergyAttributes[]> {
    try {
      const allergies = await this.model.findAll({
        where: {
          allergen: { [Op.iLike]: `%${allergen}%` },
          active: true,
        },
        order: [['severity', 'DESC']],
      });
      return allergies.map((a: any) => this.mapToEntity(a));
    } catch (error) {
      this.logger.error('Error finding allergies by allergen:', error);
      throw new RepositoryError(
        'Failed to find allergies by allergen',
        'FIND_BY_ALLERGEN_ERROR',
        500,
        { allergen, error: (error as Error).message },
      );
    }
  }

  protected async validateCreate(data: CreateAllergyDTO): Promise<void> {
    const existing = await this.model.findOne({
      where: {
        studentId: data.studentId,
        allergen: data.allergen,
        active: true,
      },
    });

    if (existing) {
      throw new RepositoryError(
        'Allergy already exists for this student',
        'DUPLICATE_ALLERGY',
        409,
        { studentId: data.studentId, allergen: data.allergen },
      );
    }
  }

  protected async validateUpdate(
    id: string,
    data: UpdateAllergyDTO,
  ): Promise<void> {
    // Validation logic
  }

  protected async invalidateCaches(allergy: any): Promise<void> {
    try {
      const allergyData = allergy.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, allergyData.id),
      );
      await this.cacheManager.deletePattern(
        `white-cross:allergy:student:${allergyData.studentId}:*`,
      );
    } catch (error) {
      this.logger.warn('Error invalidating allergy caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({ ...data });
  }
}
