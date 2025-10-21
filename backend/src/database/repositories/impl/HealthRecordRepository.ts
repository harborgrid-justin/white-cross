/**
 * LOC: 0F9A4EE093
 * WC-GEN-102 | HealthRecordRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - HealthRecord.ts (database/models/healthcare/HealthRecord.ts)
 *   - IAuditLogger.ts (database/audit/IAuditLogger.ts)
 *   - ICacheManager.ts (database/cache/ICacheManager.ts)
 *   - ExecutionContext.ts (database/types/ExecutionContext.ts)
 *   - ... and 2 more
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

/**
 * WC-GEN-102 | HealthRecordRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../base/BaseRepository, ../../models/healthcare/HealthRecord, ../interfaces/IHealthRecordRepository | Dependencies: sequelize, ../base/BaseRepository, ../../models/healthcare/HealthRecord
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Health Record Repository Implementation
 * PHI-compliant data access for health records
 *
 * Features:
 * - PHI access logging (HIPAA compliance)
 * - Student health summary aggregation
 * - Vital signs tracking
 * - Vaccination record management
 * - Date range filtering
 * - Type-based queries
 */

import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { HealthRecord } from '../../models/healthcare/HealthRecord';
import {
  IHealthRecordRepository,
  CreateHealthRecordDTO,
  UpdateHealthRecordDTO,
  HealthRecordFilters,
  DateRangeFilter,
  HealthRecordType,
  SearchCriteria,
  VitalSignsHistory,
  HealthSummary
} from '../interfaces/IHealthRecordRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { ExecutionContext } from '../../types/ExecutionContext';
import { QueryOptions } from '../../types/QueryTypes';
import { logger } from '../../../utils/logger';

export class HealthRecordRepository
  extends BaseRepository<HealthRecord, any, any>
  implements IHealthRecordRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(HealthRecord, auditLogger, cacheManager, 'HealthRecord');
  }

  /**
   * Find health records for a specific student
   */
  async findByStudentId(
    studentId: string,
    filters: HealthRecordFilters,
    options?: QueryOptions
  ): Promise<any> {
    try {
      const where: any = { studentId };

      if (filters.type) {
        where.recordType = filters.type;
      }

      if (filters.dateFrom || filters.dateTo) {
        where.recordDate = {};
        if (filters.dateFrom) where.recordDate[Op.gte] = filters.dateFrom;
        if (filters.dateTo) where.recordDate[Op.lte] = filters.dateTo;
      }

      if (filters.provider) {
        where.provider = { [Op.iLike]: `%${filters.provider}%` };
      }

      const records = await this.model.findAll({
        where,
        order: [['recordDate', 'DESC']],
        limit: options?.take || 50
      });

      type MappedHealthRecord = ReturnType<typeof this.mapToEntity>;
      interface HealthRecordListResult {
        data: MappedHealthRecord[];
        total: number;
      }

      return {
        data: records.map<MappedHealthRecord>((r: HealthRecord): MappedHealthRecord => this.mapToEntity(r)),
        total: records.length
      } as HealthRecordListResult;
    } catch (error) {
      logger.error('Error finding health records by student:', error);
      throw new RepositoryError(
        'Failed to find health records',
        'FIND_BY_STUDENT_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Find health records by type within date range
   */
  async findByType(
    type: HealthRecordType,
    filters: DateRangeFilter,
    options?: QueryOptions
  ): Promise<any[]> {
    try {
      const records = await this.model.findAll({
        where: {
          recordType: type,
          recordDate: {
            [Op.between]: [filters.startDate, filters.endDate]
          }
        },
        order: [['recordDate', 'DESC']]
      });

      type MappedHealthRecord = ReturnType<typeof this.mapToEntity>;
      return records.map<MappedHealthRecord>(
        (r: HealthRecord): MappedHealthRecord => this.mapToEntity(r)
      );
    } catch (error) {
      logger.error('Error finding health records by type:', error);
      throw new RepositoryError(
        'Failed to find health records by type',
        'FIND_BY_TYPE_ERROR',
        500,
        { type, error: (error as Error).message }
      );
    }
  }

  /**
   * Get vital signs history for a student
   */
  async findVitalSignsHistory(
    studentId: string,
    limit: number
  ): Promise<VitalSignsHistory[]> {
    try {
      const records = await this.model.findAll({
        where: {
          studentId,
          recordType: 'PHYSICAL_EXAM'
        },
        order: [['recordDate', 'DESC']],
        limit
      });

      interface HealthRecordDataForVitals {
        recordDate: Date;
        metadata: unknown;
        recordType: HealthRecordType;
        provider: string | null;
      }

      return records.map<VitalSignsHistory>((r: HealthRecord): VitalSignsHistory => {
        const data: HealthRecordDataForVitals = r.toJSON() as unknown as HealthRecordDataForVitals;
        return {
          date: data.recordDate,
          vitals: data.metadata,
          recordType: data.recordType,
          provider: data.provider
        } as VitalSignsHistory;
      });
    } catch (error) {
      logger.error('Error finding vital signs history:', error);
      throw new RepositoryError(
        'Failed to find vital signs history',
        'FIND_VITALS_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Search health records across all students
   */
  async searchRecords(
    query: SearchCriteria,
    options?: QueryOptions
  ): Promise<any> {
    try {
      const where: any = {};

      if (query.query) {
        where[Op.or] = [
          { description: { [Op.iLike]: `%${query.query}%` } },
          { notes: { [Op.iLike]: `%${query.query}%` } },
          { provider: { [Op.iLike]: `%${query.query}%` } }
        ];
      }

      if (query.type) {
        where.recordType = query.type;
      }

      if (query.studentIds && query.studentIds.length > 0) {
        where.studentId = { [Op.in]: query.studentIds };
      }

      const records = await this.model.findAll({
        where,
        order: [['recordDate', 'DESC']],
        limit: options?.take || 100
      });

      type MappedHealthRecord = ReturnType<typeof this.mapToEntity>;
      interface HealthRecordSearchResult {
        data: MappedHealthRecord[];
        total: number;
      }

      return {
        data: records.map<MappedHealthRecord>((r: HealthRecord): MappedHealthRecord => this.mapToEntity(r)),
        total: records.length
      } as HealthRecordSearchResult;
    } catch (error) {
      logger.error('Error searching health records:', error);
      throw new RepositoryError(
        'Failed to search health records',
        'SEARCH_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Count health records by type for a student
   */
  async countByType(studentId: string): Promise<Record<HealthRecordType, number>> {
    try {
      const counts: Record<string, number> = {};

      // Initialize all types with 0
      const types: HealthRecordType[] = [
        'CHECKUP',
        'VACCINATION',
        'ILLNESS',
        'INJURY',
        'SCREENING',
        'PHYSICAL_EXAM',
        'MENTAL_HEALTH',
        'DENTAL',
        'VISION',
        'HEARING'
      ];

      types.forEach((type) => {
        counts[type] = 0;
      });

      // Count records by type
      const results = await this.model.findAll({
        where: { studentId },
        attributes: [
          'recordType',
          [this.model.sequelize!.fn('COUNT', 'id'), 'count']
        ],
        group: ['recordType'],
        raw: true
      });

      results.forEach((result: any) => {
        counts[result.recordType] = parseInt(result.count, 10);
      });

      return counts as Record<HealthRecordType, number>;
    } catch (error) {
      logger.error('Error counting health records by type:', error);
      throw new RepositoryError(
        'Failed to count health records by type',
        'COUNT_BY_TYPE_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Get comprehensive health summary for a student
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    try {
      // This would require joins to Student, Allergy, ChronicCondition tables
      // Simplified implementation - enhance with actual associations
      const recentVitals = await this.findVitalSignsHistory(studentId, 10);
      const recordCounts = await this.countByType(studentId);
      const recentVaccinations = await this.findByType('VACCINATION', {
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
        endDate: new Date()
      });

      return {
        student: {
          id: studentId,
          firstName: '',
          lastName: '',
          studentNumber: '',
          dateOfBirth: new Date(),
          gender: ''
        }, // Fetch from Student model
        allergies: [],
        chronicConditions: [],
        recentVitals,
        recentVaccinations,
        recordCounts,
        upcomingReviews: []
      };
    } catch (error) {
      logger.error('Error getting health summary:', error);
      throw new RepositoryError(
        'Failed to get health summary',
        'GET_SUMMARY_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Get vaccination records for a student
   */
  async getVaccinationRecords(studentId: string): Promise<any[]> {
    try {
      const records = await this.model.findAll({
        where: {
          studentId,
          recordType: 'VACCINATION'
        },
        order: [['recordDate', 'DESC']]
      });

      type MappedVaccinationRecord = ReturnType<typeof this.mapToEntity>;
      return records.map<MappedVaccinationRecord>(
        (r: HealthRecord): MappedVaccinationRecord => this.mapToEntity(r)
      );
    } catch (error) {
      logger.error('Error getting vaccination records:', error);
      throw new RepositoryError(
        'Failed to get vaccination records',
        'GET_VACCINATIONS_ERROR',
        500,
        { studentId, error: (error as Error).message }
      );
    }
  }

  /**
   * Bulk delete health records
   */
  async bulkDelete(
    recordIds: string[],
    context: ExecutionContext
  ): Promise<{ deleted: number; notFound: number }> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      const deleted = await this.model.destroy({
        where: { id: { [Op.in]: recordIds } },
        transaction
      });

      await this.auditLogger.logBulkOperation(
        'BULK_DELETE',
        this.entityName,
        context,
        { recordIds, count: deleted }
      );

      await transaction.commit();

      return {
        deleted,
        notFound: recordIds.length - deleted
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      logger.error('Error bulk deleting health records:', error);
      throw new RepositoryError(
        'Failed to bulk delete health records',
        'BULK_DELETE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  // ============ Protected Methods ============

  protected async invalidateCaches(record: HealthRecord): Promise<void> {
    try {
      const id = record.id as unknown as string;
      const studentId = record.studentId as unknown as string;
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, id)
      );
      await this.cacheManager.deletePattern(
        `white-cross:healthrecord:student:${studentId}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating health record caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    // Health records are PHI - log but sanitize sensitive vitals
    return sanitizeSensitiveData(data);
  }

  protected shouldCache(): boolean {
    return false; // PHI data - minimize caching
  }
}
