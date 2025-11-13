/**
 * @fileoverview Health Record Summary Service - Analytics and Reporting
 * @module health-record/services
 * @description Service providing comprehensive health summaries, statistics,
 * search, import/export operations with HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HealthRecord } from '../../database/models';
import { Allergy } from '../../database/models';
import { Student } from '../../database/models';
import { ChronicCondition } from '../../database/models';
import { Vaccination } from '../../database/models';
import { HealthSummary } from '../interfaces/pagination.interface';
import { ImportResults } from '../interfaces/health-record-types';
import { HealthRecordStatistics } from '../interfaces/health-record-types';
import { PaginatedHealthRecords } from '../interfaces/pagination.interface';

import { BaseService } from '../../../common/base';
/**
 * HealthRecordSummaryService
 *
 * Provides comprehensive health summaries, statistics, search capabilities,
 * and import/export operations with HIPAA-compliant audit logging.
 *
 * Responsibilities:
 * - Generate comprehensive health summaries
 * - Search health records by keyword
 * - Export complete health history
 * - Import health records from external sources
 * - Calculate system-wide health record statistics
 * - Retrieve complete health profiles
 */
@Injectable()
export class HealthRecordSummaryService extends BaseService {
  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
  ) {}

  /**
   * Get comprehensive health summary for student
   * @param studentId - Student UUID
   * @returns Health summary with aggregated data
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    // Get student information
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get allergies
    const allergies = await this.allergyModel.findAll({
      where: { studentId },
      order: [['severity', 'DESC']],
    });

    // Get recent vitals (delegated to vitals service in main service)
    const recentVitals: any[] = [];

    // Get recent vaccinations
    const recentVaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      order: [['administrationDate', 'DESC']],
      limit: 5,
    });

    // Count records by type using Sequelize aggregation
    const recordCounts: Record<string, number> = {};
    const countsByType = (await this.healthRecordModel.findAll({
      attributes: ['recordType', [this.healthRecordModel.sequelize.fn('COUNT', '*'), 'count']],
      where: { studentId },
      group: ['recordType'],
      raw: true,
    })) as any[];

    countsByType.forEach((row) => {
      recordCounts[row.recordType] = parseInt(row.count, 10);
    });

    // PHI Access Audit Log
    this.logInfo(`PHI Access: Health summary retrieved for student ${studentId}`);

    return {
      student,
      allergies,
      recentVitals,
      recentVaccinations,
      recordCounts,
    };
  }

  /**
   * Search health records by keyword
   * @param query - Search query string
   * @param type - Optional record type filter
   * @param page - Page number
   * @param limit - Records per page
   * @returns Paginated search results
   */
  async searchHealthRecords(
    query: string,
    type?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause: any = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { diagnosis: { [Op.iLike]: `%${query}%` } },
        { treatment: { [Op.iLike]: `%${query}%` } },
      ],
    };

    // Apply type filter if provided
    if (type) {
      whereClause.recordType = type;
    }

    // Execute query with pagination
    const { rows: records, count: total } = await this.healthRecordModel.findAndCountAll({
      where: whereClause,
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
      limit,
      offset,
    });

    // PHI Access Audit Log
    this.logInfo(
      `PHI Access: Health records search performed, query: "${query}", results: ${records.length}`,
    );

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Export complete health history for student
   * @param studentId - Student UUID
   * @returns Complete health data export
   */
  async exportHealthHistory(studentId: string): Promise<any> {
    // Get student
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get all health data
    const healthRecords = await this.healthRecordModel.findAll({
      where: { studentId },
      order: [['recordDate', 'DESC']],
    });

    const allergies = await this.allergyModel.findAll({
      where: { studentId },
      order: [['severity', 'DESC']],
    });

    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      order: [['administrationDate', 'DESC']],
    });

    const chronicConditions = await this.chronicConditionModel.findAll({
      where: { studentId },
      order: [['diagnosedDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(`PHI Export: Complete health history exported for student ${studentId}`);

    return {
      exportDate: new Date(),
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
      },
      healthRecords,
      allergies,
      vaccinations,
      chronicConditions,
      summary: {
        totalRecords: healthRecords.length,
        totalAllergies: allergies.length,
        totalVaccinations: vaccinations.length,
        totalChronicConditions: chronicConditions.length,
      },
    };
  }

  /**
   * Import health records from external source
   * @param studentId - Student UUID
   * @param importData - Import data structure
   * @returns Import operation results
   */
  async importHealthRecords(studentId: string, importData: any): Promise<ImportResults> {
    const results: ImportResults = {
      imported: 0,
      skipped: 0,
      errors: [],
    };

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      results.errors.push('Student not found');
      return results;
    }

    // Import health records
    if (importData.healthRecords && Array.isArray(importData.healthRecords)) {
      for (const recordData of importData.healthRecords) {
        try {
          await this.healthRecordModel.create({
            ...recordData,
            studentId,
          });
          results.imported++;
        } catch (error) {
          results.errors.push(`Failed to import health record: ${error.message}`);
          results.skipped++;
        }
      }
    }

    // Import allergies
    if (importData.allergies && Array.isArray(importData.allergies)) {
      for (const allergyData of importData.allergies) {
        try {
          // Check for duplicate
          const existing = await this.allergyModel.findOne({
            where: {
              studentId,
              allergen: allergyData.allergen,
            },
          });

          if (existing) {
            results.skipped++;
            continue;
          }

          await this.allergyModel.create({
            ...allergyData,
            studentId,
          });
          results.imported++;
        } catch (error) {
          results.errors.push(`Failed to import allergy: ${error.message}`);
          results.skipped++;
        }
      }
    }

    // Import vaccinations
    if (importData.vaccinations && Array.isArray(importData.vaccinations)) {
      for (const vaccinationData of importData.vaccinations) {
        try {
          await this.vaccinationModel.create({
            ...vaccinationData,
            studentId,
          });
          results.imported++;
        } catch (error) {
          results.errors.push(`Failed to import vaccination: ${error.message}`);
          results.skipped++;
        }
      }
    }

    // PHI Creation Audit Log
    this.logInfo(
      `PHI Import: Health data imported for student ${studentId}, imported: ${results.imported}, skipped: ${results.skipped}`,
    );

    return results;
  }

  /**
   * Get health record statistics
   * @returns System-wide health record statistics
   */
  async getHealthRecordStatistics(): Promise<HealthRecordStatistics> {
    // Count total health records
    const totalRecords = await this.healthRecordModel.count();

    // Count active allergies
    const activeAllergies = await this.allergyModel.count({
      where: { active: true },
    });

    // Count chronic conditions
    const chronicConditions = await this.chronicConditionModel.count({
      where: { isActive: true },
    });

    // Count vaccinations due (next due date in past and series not complete)
    const today = new Date();
    const vaccinationsDue = await this.vaccinationModel.count({
      where: {
        nextDueDate: { [Op.lt]: today },
        seriesComplete: false,
      },
    });

    // Count recent records (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRecords = await this.healthRecordModel.count({
      where: {
        recordDate: { [Op.between]: [thirtyDaysAgo, new Date()] },
      },
    });

    // PHI Access Audit Log
    this.logInfo('System statistics retrieved for health records');

    return {
      totalRecords,
      activeAllergies,
      chronicConditions,
      vaccinationsDue,
      recentRecords,
    };
  }

  /**
   * Get complete health profile for a student
   * @param studentId - Student identifier
   * @returns Complete health profile with all related data
   */
  async getCompleteHealthProfile(studentId: string): Promise<any> {
    const healthRecord = await this.healthRecordModel.findOne({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!healthRecord) {
      throw new NotFoundException(`Health record for student ${studentId} not found`);
    }

    // Get additional related data
    const allergies = await this.allergyModel.findAll({
      where: { studentId },
    });

    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
    });

    const chronicConditions = await this.chronicConditionModel.findAll({
      where: { studentId },
    });

    return {
      healthRecord,
      allergies,
      vaccinations,
      chronicConditions,
    };
  }
}
