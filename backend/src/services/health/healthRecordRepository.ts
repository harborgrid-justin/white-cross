/**
 * LOC: 7F00651A86
 * WC-GEN-253 | healthRecordRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecordService.ts (services/health/healthRecordService.ts)
 *   - importExportService.ts (services/health/importExportService.ts)
 */

/**
 * WC-GEN-253 | healthRecordRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { HealthRecord, Student, sequelize } from '../../database/models';
import { 
  CreateHealthRecordData, 
  UpdateHealthRecordData, 
  HealthRecordFilters,
  PaginatedResponse
} from './types';
import {
  validateHealthRecordData,
  calculateBMI
} from '../../utils/healthRecordValidators';

/**
 * Health Record Repository - Basic CRUD operations for health records
 */
export class HealthRecordRepository {
  /**
   * Create new health record with comprehensive validation
   */
  static async createHealthRecord(data: CreateHealthRecordData) {
    try {
      // Verify student exists and get date of birth for age-based validation
      const student = await Student.findByPk(data.studentId, {
        attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth']
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate health record data
      const validationResult = validateHealthRecordData(
        {
          vital: data.vital,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        student.dateOfBirth ? new Date(student.dateOfBirth) : undefined
      );

      // Log warnings but don't block creation
      if (validationResult.warnings.length > 0) {
        logger.warn(`Health record validation warnings for student ${student.id}:`, validationResult.warnings);
      }

      // Block creation if there are critical errors
      if (!validationResult.isValid) {
        const errorMessage = `Health record validation failed: ${validationResult.errors.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Calculate BMI if height and weight are provided in vitals
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const vitals = data.vital as any;
        if (vitals.height && vitals.weight) {
          const calculatedBMI = calculateBMI(vitals.height, vitals.weight);
          if (calculatedBMI !== null) {
            vitals.bmi = calculatedBMI;
            data.vital = vitals;
            logger.info(`Auto-calculated BMI: ${calculatedBMI} for student ${student.id}`);
          }
        }
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

      logger.info(`Health record created: ${data.type} for ${student.firstName} ${student.lastName}`);
      return healthRecord;
    } catch (error) {
      logger.error('Error creating health record:', error);
      throw error;
    }
  }

  /**
   * Update health record with validation
   */
  static async updateHealthRecord(id: string, data: UpdateHealthRecordData) {
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
      if (data.vital && typeof data.vital === 'object' && data.vital !== null) {
        const currentVitals = (existingRecord.vital && typeof existingRecord.vital === 'object' && existingRecord.vital !== null)
          ? existingRecord.vital as any
          : {};
        const vitalsUpdate = data.vital as any;
        mergedVitals = { ...currentVitals, ...vitalsUpdate };

        // Recalculate BMI if height or weight is being updated
        if (mergedVitals.height && mergedVitals.weight) {
          const calculatedBMI = calculateBMI(mergedVitals.height, mergedVitals.weight);
          if (calculatedBMI !== null) {
            mergedVitals.bmi = calculatedBMI;
            logger.info(`Auto-recalculated BMI: ${calculatedBMI} for health record ${id}`);
          }
        }

        data.vital = mergedVitals;
      }

      // Validate updated data
      const validationResult = validateHealthRecordData(
        {
          vital: mergedVitals,
          date: data.date,
          diagnosisCode: (data as any).diagnosisCode,
          providerNpi: (data as any).providerNpi
        },
        existingRecord.student?.dateOfBirth ? new Date(existingRecord.student.dateOfBirth) : undefined
      );

      // Log warnings
      if (validationResult.warnings.length > 0) {
        logger.warn(`Health record update validation warnings for record ${id}:`, validationResult.warnings);
      }

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

      logger.info(`Health record updated: ${existingRecord.type} for ${existingRecord.student!.firstName} ${existingRecord.student!.lastName}`);
      return existingRecord;
    } catch (error) {
      logger.error('Error updating health record:', error);
      throw error;
    }
  }

  /**
   * Get health record by ID
   */
  static async getHealthRecordById(id: string) {
    try {
      const healthRecord = await HealthRecord.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'dateOfBirth', 'gender']
          }
        ]
      });

      if (!healthRecord) {
        throw new Error('Health record not found');
      }

      return healthRecord;
    } catch (error) {
      logger.error('Error fetching health record by ID:', error);
      throw error;
    }
  }

  /**
   * Get health records for a student with pagination and filters
   */
  static async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: HealthRecordFilters = {}
  ): Promise<PaginatedResponse<any>> {
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
   * Delete health record
   */
  static async deleteHealthRecord(id: string) {
    try {
      const healthRecord = await HealthRecord.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      if (!healthRecord) {
        throw new Error('Health record not found');
      }

      await healthRecord.destroy();

      logger.info(`Health record deleted: ${healthRecord.type} for ${healthRecord.student!.firstName} ${healthRecord.student!.lastName}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting health record:', error);
      throw error;
    }
  }

  /**
   * Search health records across all students
   */
  static async searchHealthRecords(
    query: string,
    type?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<any>> {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {
        [Op.or]: [
          { description: { [Op.iLike]: `%${query}%` } },
          { notes: { [Op.iLike]: `%${query}%` } },
          { provider: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (type) {
        whereClause.type = type;
      }

      const { rows: records, count: total } = await HealthRecord.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } },
                { studentNumber: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
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
      logger.error('Error searching health records:', error);
      throw error;
    }
  }

  /**
   * Bulk delete health records
   */
  static async bulkDeleteHealthRecords(recordIds: string[]) {
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
      logger.info(`Bulk delete completed: ${deletedCount} records deleted, ${notFoundCount} not found`);

      if (recordsToDelete.length > 0) {
        const studentNames = [...new Set(recordsToDelete.map(r => `${r.student!.firstName} ${r.student!.lastName}`))];
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

  /**
   * Get total count of health records
   */
  static async getTotalHealthRecordsCount() {
    try {
      return await HealthRecord.count();
    } catch (error) {
      logger.error('Error getting total health records count:', error);
      throw error;
    }
  }

  /**
   * Get health records count by type
   */
  static async getHealthRecordsCountByType() {
    try {
      const recordCounts = await HealthRecord.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('type')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      return recordCounts.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.type] = parseInt(curr.count, 10);
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      logger.error('Error getting health records count by type:', error);
      throw error;
    }
  }

  /**
   * Get recent health records
   */
  static async getRecentHealthRecords(limit: number = 10) {
    try {
      const records = await HealthRecord.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      return records;
    } catch (error) {
      logger.error('Error getting recent health records:', error);
      throw error;
    }
  }
}
