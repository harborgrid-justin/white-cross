/**
 * LOC: 9A4E6C2B85
 * WC-SVC-HLT-REC | healthRecord.module.ts - Health Record CRUD Operations Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *   - validation.module.ts (./validation.module.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Core CRUD operations for health records with validation and HIPAA compliance
 * Exports: HealthRecordModule class with create, read, update, delete operations
 * HIPAA: Contains PHI operations - medical records with audit logging
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Request → Validation → Database → Audit logging → Response
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student } from '../../database/models';
import {
  CreateHealthRecordData,
  HealthRecordFilters,
  PaginatedHealthRecords,
  BulkDeleteResults
} from './types';
import { ValidationModule } from './validation.module';

/**
 * Health Record Module
 * Manages core health record CRUD operations with comprehensive validation
 */
export class HealthRecordModule {
  /**
   * Get health records for a student with pagination and filters
   */
  static async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilters = {}
  ): Promise<PaginatedHealthRecords<any>> {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = { studentId };

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.date = {};
        if (filters.dateFrom) {
          whereClause.date[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.date[Op.lte] = filters.dateTo;
        }
      }

      if (filters.provider) {
        whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['date', 'DESC']],
        distinct: true
      });

      return {
        records,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching student health records:', error);
      throw new Error('Failed to fetch health records');
    }
  }

  /**
   * Create new health record with comprehensive validation
   */
  static async createHealthRecord(data: CreateHealthRecordData): Promise<any> {
    try {
      // Verify student exists and get date of birth for age-based validation
      const student = await Student.findByPk(data.studentId, {
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate health record data
      const validationResult = ValidationModule.validateHealthRecord(
        {
          vital: data.vital,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        student.dateOfBirth ? new Date(student.dateOfBirth) : undefined
      );

      // Block creation if there are critical errors
      if (!validationResult.isValid) {
        const errorMessage = `Health record validation failed: ${validationResult.errors.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Process vitals (calculate BMI if needed)
      if (data.vital) {
        data.vital = ValidationModule.processVitals(data.vital);
      }

      const healthRecord = await HealthRecord.create(data);

      // Reload with associations
      await healthRecord.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Health record created: ${data.type} for ${student.firstName} ${student.lastName}`
      );
      return healthRecord;
    } catch (error) {
      logger.error('Error creating health record:', error);
      throw error;
    }
  }

  /**
   * Update health record with validation
   */
  static async updateHealthRecord(
    id: string,
    data: Partial<CreateHealthRecordData>
  ): Promise<any> {
    try {
      const existingRecord = await HealthRecord.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
          }
        ]
      });

      if (!existingRecord) {
        throw new Error('Health record not found');
      }

      // Merge vitals for validation
      let mergedVitals = null;
      if (data.vital) {
        mergedVitals = ValidationModule.mergeVitals(
          existingRecord.vital,
          data.vital,
          id
        );
        data.vital = mergedVitals;
      }

      // Validate updated data
      const validationResult = ValidationModule.validateHealthRecord(
        {
          vital: mergedVitals,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        existingRecord.student?.dateOfBirth
          ? new Date(existingRecord.student.dateOfBirth)
          : undefined
      );

      // Block update if there are critical errors
      if (!validationResult.isValid) {
        const errorMessage = `Health record update validation failed: ${validationResult.errors.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      await existingRecord.update(data);

      // Reload with associations
      await existingRecord.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Health record updated: ${existingRecord.type} for ${existingRecord.student!.firstName} ${existingRecord.student!.lastName}`
      );
      return existingRecord;
    } catch (error) {
      logger.error('Error updating health record:', error);
      throw error;
    }
  }

  /**
   * Get vaccination records for a student
   */
  static async getVaccinationRecords(studentId: string): Promise<any[]> {
    try {
      const records = await HealthRecord.findAll({
        where: {
          studentId,
          type: 'VACCINATION' as any
        } as any,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [['date', 'DESC']]
      });

      return records;
    } catch (error) {
      logger.error('Error fetching vaccination records:', error);
      throw error;
    }
  }

  /**
   * Bulk delete health records
   */
  static async bulkDeleteHealthRecords(recordIds: string[]): Promise<BulkDeleteResults> {
    try {
      if (!recordIds || recordIds.length === 0) {
        throw new Error('No record IDs provided');
      }

      // Get records to be deleted for logging
      const recordsToDelete = await HealthRecord.findAll({
        where: {
          id: { [Op.in]: recordIds }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      // Delete the records
      const deletedCount = await HealthRecord.destroy({
        where: {
          id: { [Op.in]: recordIds }
        }
      });

      const notFoundCount = recordIds.length - deletedCount;

      // Log the bulk deletion
      logger.info(
        `Bulk delete completed: ${deletedCount} records deleted, ${notFoundCount} not found`
      );

      if (recordsToDelete.length > 0) {
        const studentNames = [
          ...new Set(
            recordsToDelete.map(
              (r) => `${r.student!.firstName} ${r.student!.lastName}`
            )
          )
        ];
        logger.info(`Records deleted for students: ${studentNames.join(', ')}`);
      }

      return {
        deleted: deletedCount,
        notFound: notFoundCount,
        success: true
      };
    } catch (error) {
      logger.error('Error in bulk delete operation:', error);
      throw error;
    }
  }
}
