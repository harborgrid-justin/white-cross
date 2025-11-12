/**
 * Medical History Repository Implementation
 * Injectable NestJS repository for medical history data access
 * HIPAA-compliant with audit logging and caching
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BaseRepository, RepositoryError } from '../../../database/repositories/base/base.repository';
import {
  CreateMedicalHistoryDTO,
  IMedicalHistoryRepository,
  MedicalHistoryAttributes,
  UpdateMedicalHistoryDTO,
} from '../interfaces/medical-history.repository.interface';
import type { IAuditLogger  } from "../../../backend/src/database/interfaces";
import { sanitizeSensitiveData  } from "../../../backend/src/database/interfaces";
import type { ICacheManager  } from "../../../backend/src/database/interfaces";
import { QueryOptions   } from "../../database/types";
import { MedicalHistory    } from "../../database/models";

@Injectable()
export class MedicalHistoryRepository
  extends BaseRepository<any, MedicalHistoryAttributes, CreateMedicalHistoryDTO>
  implements IMedicalHistoryRepository
{
  constructor(
    @InjectModel(MedicalHistory) model: typeof MedicalHistory,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'MedicalHistory');
  }

  /**
   * Find all medical history records for a specific student
   */
  async findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'by-student',
      );

      const cached =
        await this.cacheManager.get<MedicalHistoryAttributes[]>(cacheKey);
      if (cached) {
        this.logger.debug(
          `Cache hit for medical history by student: ${studentId}`,
        );
        return cached;
      }

      const records = await this.model.findAll({
        where: { studentId },
        order: [
          ['isCritical', 'DESC'],
          ['isActive', 'DESC'],
          ['diagnosisDate', 'DESC'],
        ],
      });

      const entities = records.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding medical history by student:', error);
      throw new RepositoryError(
        'Failed to find medical history by student',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find medical history records by condition/diagnosis
   */
  async findByCondition(
    condition: string,
    options?: QueryOptions,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: {
          condition: {
            [Op.iLike]: `%${condition}%`,
          },
        },
        order: [['diagnosisDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return records.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding medical history by condition:', error);
      throw new RepositoryError(
        'Failed to find medical history by condition',
        'FIND_BY_CONDITION_ERROR',
        500,
        { condition, error: (error as Error).message },
      );
    }
  }

  /**
   * Find active medical conditions for a student
   */
  async findActiveConditions(
    studentId: string,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'active',
      );

      const cached =
        await this.cacheManager.get<MedicalHistoryAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const records = await this.model.findAll({
        where: {
          studentId,
          isActive: true,
        },
        order: [
          ['isCritical', 'DESC'],
          ['diagnosisDate', 'DESC'],
        ],
      });

      const entities = records.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding active conditions:', error);
      throw new RepositoryError(
        'Failed to find active conditions',
        'FIND_ACTIVE_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Find medical history records by category
   */
  async findByCategory(
    category: string,
    options?: QueryOptions,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const records = await this.model.findAll({
        where: { category },
        order: [['diagnosisDate', 'DESC']],
        limit: options?.limit || 100,
      });

      return records.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error finding medical history by category:', error);
      throw new RepositoryError(
        'Failed to find medical history by category',
        'FIND_BY_CATEGORY_ERROR',
        500,
        { category, error: (error as Error).message },
      );
    }
  }

  /**
   * Find family medical history for a student
   */
  async findFamilyHistory(
    studentId: string,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'family-history',
      );

      const cached =
        await this.cacheManager.get<MedicalHistoryAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const records = await this.model.findAll({
        where: {
          studentId,
          isFamilyHistory: true,
        },
        order: [
          ['familyRelation', 'ASC'],
          ['condition', 'ASC'],
        ],
      });

      const entities = records.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 3600);

      return entities;
    } catch (error) {
      this.logger.error('Error finding family history:', error);
      throw new RepositoryError(
        'Failed to find family history',
        'FIND_FAMILY_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Search medical conditions with full-text search
   */
  async searchConditions(
    query: string,
    options?: QueryOptions,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const searchTerm = `%${query}%`;

      const records = await this.model.findAll({
        where: {
          [Op.or]: [
            { condition: { [Op.iLike]: searchTerm } },
            { diagnosisCode: { [Op.iLike]: searchTerm } },
            { treatment: { [Op.iLike]: searchTerm } },
            { medication: { [Op.iLike]: searchTerm } },
          ],
        },
        order: [['diagnosisDate', 'DESC']],
        limit: options?.limit || 50,
      });

      return records.map((r: any) => this.mapToEntity(r));
    } catch (error) {
      this.logger.error('Error searching medical conditions:', error);
      throw new RepositoryError(
        'Failed to search medical conditions',
        'SEARCH_ERROR',
        500,
        { query, error: (error as Error).message },
      );
    }
  }

  /**
   * Flag and retrieve critical medical conditions for a student
   */
  async flagCriticalConditions(
    studentId: string,
  ): Promise<MedicalHistoryAttributes[]> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentId,
        'critical',
      );

      const cached =
        await this.cacheManager.get<MedicalHistoryAttributes[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const records = await this.model.findAll({
        where: {
          studentId,
          isCritical: true,
          isActive: true,
        },
        order: [['diagnosisDate', 'DESC']],
      });

      const entities = records.map((r: any) => this.mapToEntity(r));
      await this.cacheManager.set(cacheKey, entities, 1800);

      return entities;
    } catch (error) {
      this.logger.error('Error finding critical conditions:', error);
      throw new RepositoryError(
        'Failed to find critical conditions',
        'FIND_CRITICAL_ERROR',
        500,
        { studentId, error: (error as Error).message },
      );
    }
  }

  /**
   * Validate medical history data before creation
   */
  protected async validateCreate(data: CreateMedicalHistoryDTO): Promise<void> {
    if (!data.studentId) {
      throw new RepositoryError(
        'Student ID is required',
        'VALIDATION_ERROR',
        400,
        { field: 'studentId' },
      );
    }

    if (!data.recordType) {
      throw new RepositoryError(
        'Record type is required',
        'VALIDATION_ERROR',
        400,
        { field: 'recordType' },
      );
    }

    if (!data.condition) {
      throw new RepositoryError(
        'Condition is required',
        'VALIDATION_ERROR',
        400,
        { field: 'condition' },
      );
    }

    // Validate record type
    const validTypes = [
      'condition',
      'allergy',
      'surgery',
      'hospitalization',
      'family_history',
      'medication',
      'immunization',
    ];

    if (!validTypes.includes(data.recordType.toLowerCase())) {
      throw new RepositoryError(
        'Invalid record type',
        'VALIDATION_ERROR',
        400,
        { recordType: data.recordType, validTypes },
      );
    }

    // Validate severity if provided
    if (data.severity) {
      const validSeverities = ['mild', 'moderate', 'severe', 'critical'];
      if (!validSeverities.includes(data.severity.toLowerCase())) {
        throw new RepositoryError(
          'Invalid severity level',
          'VALIDATION_ERROR',
          400,
          { severity: data.severity, validSeverities },
        );
      }
    }

    // Validate family history fields
    if (data.isFamilyHistory && !data.familyRelation) {
      throw new RepositoryError(
        'Family relation is required for family history records',
        'VALIDATION_ERROR',
        400,
        { field: 'familyRelation' },
      );
    }

    // Validate dates
    if (data.diagnosisDate && data.resolvedDate) {
      if (data.resolvedDate < data.diagnosisDate) {
        throw new RepositoryError(
          'Resolved date cannot be before diagnosis date',
          'VALIDATION_ERROR',
          400,
          {
            diagnosisDate: data.diagnosisDate,
            resolvedDate: data.resolvedDate,
          },
        );
      }
    }
  }

  /**
   * Validate medical history data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateMedicalHistoryDTO,
  ): Promise<void> {
    // Validate record type if provided
    if (data.recordType) {
      const validTypes = [
        'condition',
        'allergy',
        'surgery',
        'hospitalization',
        'family_history',
        'medication',
        'immunization',
      ];

      if (!validTypes.includes(data.recordType.toLowerCase())) {
        throw new RepositoryError(
          'Invalid record type',
          'VALIDATION_ERROR',
          400,
          { recordType: data.recordType, validTypes },
        );
      }
    }

    // Validate severity if provided
    if (data.severity) {
      const validSeverities = ['mild', 'moderate', 'severe', 'critical'];
      if (!validSeverities.includes(data.severity.toLowerCase())) {
        throw new RepositoryError(
          'Invalid severity level',
          'VALIDATION_ERROR',
          400,
          { severity: data.severity, validSeverities },
        );
      }
    }
  }

  /**
   * Invalidate related caches after operations
   */
  protected async invalidateCaches(medicalHistory: any): Promise<void> {
    try {
      const historyData = medicalHistory.get();

      // Invalidate entity cache
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, historyData.id),
      );

      // Invalidate student-specific caches
      if (historyData.studentId) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            historyData.studentId,
            'by-student',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            historyData.studentId,
            'active',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            historyData.studentId,
            'critical',
          ),
        );

        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            historyData.studentId,
            'family-history',
          ),
        );

        // Invalidate all student medical history patterns
        await this.cacheManager.deletePattern(
          `white-cross:medicalhistory:student:${historyData.studentId}:*`,
        );
      }

      // Invalidate condition caches
      if (historyData.condition) {
        await this.cacheManager.deletePattern(
          `white-cross:medicalhistory:condition:*`,
        );
      }

      // Invalidate category caches
      if (historyData.category) {
        await this.cacheManager.deletePattern(
          `white-cross:medicalhistory:category:${historyData.category}:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating medical history caches:', error);
    }
  }

  /**
   * Sanitize medical history data for audit logging
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Medical history is highly sensitive PHI but must be logged for audit trail
      // Consider additional sanitization for particularly sensitive notes
    });
  }
}
