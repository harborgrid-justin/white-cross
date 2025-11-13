/**
 * Immunization Repository Implementation
 * Injectable NestJS repository for immunization data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateImmunizationDTO,
  IImmunizationRepository,
  ImmunizationAttributes,
  UpdateImmunizationDTO,
} from '../interfaces/immunization.repository.interface';
import type { IAuditLogger  } from "../../interfaces";
import { sanitizeSensitiveData  } from "../../interfaces";
import type { ICacheManager  } from "../../interfaces";
import { QueryOptions   } from "../../database/types";
import { Immunization    } from "../../database/models";

@Injectable()
export class ImmunizationRepository
  extends BaseRepository<any, ImmunizationAttributes, CreateImmunizationDTO>
  implements IImmunizationRepository
{
  constructor(
    @InjectModel(Immunization) model: typeof Immunization,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Immunization');
  }

  /**
   * Find all immunizations for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<ImmunizationAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<ImmunizationAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(
          `Cache hit for immunizations by student: ${studentId}`,
        );
        return cached;
      }

      const immunizations = await this.model.findAll({
        where: { studentId },
        order: [['administeredDate', 'DESC']],
      });

      const entities = immunizations.map((i: any) => this.mapToEntity(i));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding immunizations by student:', error);
      throw new RepositoryError(
        'Failed to find immunizations by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find immunizations by vaccine type
   */
  async findByVaccineType(
    vaccineType: string,
    options?: QueryOptions,
  ): Promise<ImmunizationAttributes[]> {
    try {
      const immunizations = await this.model.findAll({
        where: { vaccineType },
        order: [['administeredDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding immunizations by vaccine type:', error);
      throw new RepositoryError(
        'Failed to find immunizations by vaccine type',
        'FIND_BY_VACCINE_TYPE_ERROR',
        500,
        { vaccineType, error: (error as Error).message },
      );
    }
  }

  /**
   * Find due immunizations for a student based on vaccination schedule
   */
  async findDueImmunizations(
    studentId: string,
    asOfDate: Date = new Date(),
  ): Promise<ImmunizationAttributes[]> {
    try {
      const immunizations = await this.model.findAll({
        where: {
          studentId,
          nextDueDate: {
            [Op.lte]: asOfDate,
          },
          isCompliant: false,
        },
        order: [['nextDueDate', 'ASC']],
      });

      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding due immunizations:', error);
      throw new RepositoryError(
        'Failed to find due immunizations',
        'FIND_DUE_ERROR',
        500,
        { studentId, asOfDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Find immunizations within a date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: QueryOptions,
  ): Promise<ImmunizationAttributes[]> {
    try {
      const immunizations = await this.model.findAll({
        where: {
          administeredDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['administeredDate', 'DESC']],
        limit: options?.limit || 500,
      });

      return immunizations.map((i: any) => this.mapToEntity(i));
    } catch (error) {
      this.logger.error('Error finding immunizations by date range:', error);
      throw new RepositoryError(
        'Failed to find immunizations by date range',
        'FIND_BY_DATE_RANGE_ERROR',
        500,
        { startDate, endDate, error: (error as Error).message },
      );
    }
  }

  /**
   * Check vaccination compliance status for a student
   */
  async checkComplianceStatus(
    studentId: string,
  ): Promise<{ isCompliant: boolean; missingVaccines: string[] }> {
    try {
      // Required vaccines for school enrollment (example list)
      const requiredVaccines = [
        'DTaP',
        'Polio',
        'MMR',
        'Varicella',
        'Hepatitis B',
        'Meningococcal',
      ];

      const immunizations = await this.findByStudent(studentId);
      const receivedVaccines = new Set(
        immunizations.filter((i) => i.isCompliant).map((i) => i.vaccineType),
      );

      const missingVaccines = requiredVaccines.filter(
        (vaccine) => !receivedVaccines.has(vaccine),
      );

      return {
        isCompliant: missingVaccines.length === 0,
        missingVaccines,
      };
    } catch (error) {
      this.logger.error('Error checking compliance status:', error);
      throw new RepositoryError(
        'Failed to check compliance status',
        'COMPLIANCE_CHECK_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Get complete vaccination history for a student
   */
  async getVaccinationHistory(
    studentId: string,
  ): Promise<ImmunizationAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'history',
      );

      const cached =
        await this.cacheManager.get<ImmunizationAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const immunizations = await this.model.findAll({
        where: { studentId },
        order: [
          ['vaccineType', 'ASC'],
          ['administeredDate', 'ASC'],
        ],
      });

      const entities = immunizations.map((i: any) => this.mapToEntity(i));
      await this.cacheManager.set(cacheKey, entities, 3600); // Cache for 1 hour

      return entities;
    } catch (error) {
      this.logger.error('Error getting vaccination history:', error);
      throw new RepositoryError(
        'Failed to get vaccination history',
        'HISTORY_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Validate immunization data before creation
   */
  protected async validateCreate(data: CreateImmunizationDTO): Promise<void> {
    // Validate required fields
    if (!data.studentId) {
      throw new RepositoryError(
        'Student ID is required',
        'VALIDATION_ERROR',
        400,
        { field: 'studentId' },
      );
    }

    if (!data.vaccineType || !data.vaccineName) {
      throw new RepositoryError(
        'Vaccine type and name are required',
        'VALIDATION_ERROR',
        400,
        { fields: ['vaccineType', 'vaccineName'] },
      );
    }

    if (!data.administeredDate) {
      throw new RepositoryError(
        'Administered date is required',
        'VALIDATION_ERROR',
        400,
        { field: 'administeredDate' },
      );
    }

    // Validate date is not in the future
    if (data.administeredDate > new Date()) {
      throw new RepositoryError(
        'Administered date cannot be in the future',
        'VALIDATION_ERROR',
        400,
        { administeredDate: data.administeredDate },
      );
    }

    // Check for duplicate immunization (same vaccine, same date)
    const existing = await this.model.findOne({
      where: {
        studentId: data.studentId,
        vaccineType: data.vaccineType,
        administeredDate: data.administeredDate,
      },
    });

    if (existing) {
      throw new RepositoryError(
        'Duplicate immunization record',
        'DUPLICATE_IMMUNIZATION',
        409,
        { studentId: data.studentId, vaccineType: data.vaccineType },
      );
    }
  }

  /**
   * Validate immunization data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateImmunizationDTO,
  ): Promise<void> {
    // Validate date is not in the future if provided
    if (data.administeredDate && data.administeredDate > new Date()) {
      throw new RepositoryError(
        'Administered date cannot be in the future',
        'VALIDATION_ERROR',
        400,
        { administeredDate: data.administeredDate },
      );
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(immunization: any): Promise<void> {
    try {
      const immunizationData = immunization.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, immunizationData.id),
      );

      // Invalidate student-specific caches
      if (immunizationData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            immunizationData.studentId,
            'by-student',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            immunizationData.studentId,
            'history',
          ),
        );

        // Invalidate all student immunization patterns
        await this.cacheManager.deletePattern(
          `white-cross:immunization:student:${immunizationData.studentId}:*`,
        );
      }

      // Invalidate vaccine type caches
      if (immunizationData.vaccineType) {
        await this.cacheManager.deletePattern(
          `white-cross:immunization:vaccine:${immunizationData.vaccineType}:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating immunization caches:', error);
    }
  }

  /**
   * Sanitize immunization data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Immunization data is PHI but should be logged for audit trail
      // Redact any particularly sensitive notes if needed
    });
  }
}
