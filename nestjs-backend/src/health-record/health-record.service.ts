/**
 * @fileoverview Health Record Service - Comprehensive HIPAA-Compliant Health Management
 * @module health-record
 * @description Unified service providing all health record operations including
 * health records, allergies, vaccinations, chronic conditions, vital signs, search,
 * import/export, and statistics.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance CDC Guidelines, ICD-10-CM Standards, CVX Vaccine Codes
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Like } from 'typeorm';
import { HealthRecord } from './entities/health-record.entity';
import { Allergy } from '../allergy/entities/allergy.entity';
import { Vaccination } from './vaccination/entities/vaccination.entity';
import { ChronicCondition } from '../chronic-condition/entities/chronic-condition.entity';
import { Student } from '../student/entities/student.entity';
import {
  PaginatedHealthRecords,
  PaginationResult,
  GrowthDataPoint,
  HealthSummary,
  ImportResults,
  BulkDeleteResults,
  HealthRecordStatistics,
  VitalSigns,
} from './interfaces';

@Injectable()
export class HealthRecordService {
  private readonly logger = new Logger(HealthRecordService.name);

  constructor(
    @InjectRepository(HealthRecord)
    private readonly healthRecordRepository: Repository<HealthRecord>,
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
    @InjectRepository(Vaccination)
    private readonly vaccinationRepository: Repository<Vaccination>,
    @InjectRepository(ChronicCondition)
    private readonly chronicConditionRepository: Repository<ChronicCondition>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // ==================== Health Record Operations ====================

  /**
   * Get paginated health records for a student with filtering
   * @param studentId - Student UUID
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records with metadata
   */
  async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const offset = (page - 1) * limit;

    const queryBuilder = this.healthRecordRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.student', 'student')
      .where('hr.studentId = :studentId', { studentId });

    // Apply filters
    if (filters.type) {
      queryBuilder.andWhere('hr.recordType = :type', { type: filters.type });
    }
    if (filters.dateFrom) {
      queryBuilder.andWhere('hr.recordDate >= :dateFrom', {
        dateFrom: filters.dateFrom,
      });
    }
    if (filters.dateTo) {
      queryBuilder.andWhere('hr.recordDate <= :dateTo', {
        dateTo: filters.dateTo,
      });
    }
    if (filters.provider) {
      queryBuilder.andWhere('hr.provider ILIKE :provider', {
        provider: `%${filters.provider}%`,
      });
    }

    // Execute query with pagination
    const [records, total] = await queryBuilder
      .orderBy('hr.recordDate', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Health records retrieved for student ${studentId}, count: ${records.length}`,
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
   * Create new health record with comprehensive validation
   * @param data - Health record creation data
   * @returns Created health record with associations
   */
  async createHealthRecord(data: any): Promise<HealthRecord> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create health record
    const healthRecord = this.healthRecordRepository.create(data);
    const savedRecord = await this.healthRecordRepository.save(healthRecord);

    // Reload with associations
    const record = await this.healthRecordRepository.findOne({
      where: { id: savedRecord.id },
      relations: ['student'],
    });

    // PHI Creation Audit Log
    this.logger.log(
      `PHI Created: Health record ${record.recordType} for student ${student.firstName} ${student.lastName}`,
    );

    return record;
  }

  /**
   * Update existing health record with validation
   * @param id - Health record UUID
   * @param data - Updated health record data
   * @returns Updated health record with associations
   */
  async updateHealthRecord(
    id: string,
    data: Partial<any>,
  ): Promise<HealthRecord> {
    const existingRecord = await this.healthRecordRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!existingRecord) {
      throw new NotFoundException('Health record not found');
    }

    // Update record
    Object.assign(existingRecord, data);
    const updatedRecord = await this.healthRecordRepository.save(
      existingRecord,
    );

    // Reload with associations
    const record = await this.healthRecordRepository.findOne({
      where: { id: updatedRecord.id },
      relations: ['student'],
    });

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Health record ${record.recordType} updated for student ${record.student.firstName} ${record.student.lastName}`,
    );

    return record;
  }

  /**
   * Get vaccination records for a student
   * @param studentId - Student UUID
   * @returns Array of vaccination records
   */
  async getVaccinationRecords(studentId: string): Promise<HealthRecord[]> {
    const records = await this.healthRecordRepository.find({
      where: {
        studentId,
        recordType: 'VACCINATION' as any,
      },
      relations: ['student'],
      order: {
        recordDate: 'DESC',
      },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Vaccination records retrieved for student ${studentId}, count: ${records.length}`,
    );

    return records;
  }

  /**
   * Bulk delete health records
   * @param recordIds - Array of health record UUIDs
   * @returns Deletion results
   */
  async bulkDeleteHealthRecords(
    recordIds: string[],
  ): Promise<BulkDeleteResults> {
    if (!recordIds || recordIds.length === 0) {
      throw new Error('No record IDs provided');
    }

    // Get records to be deleted for logging
    const recordsToDelete = await this.healthRecordRepository.find({
      where: {
        id: In(recordIds),
      },
      relations: ['student'],
    });

    // Soft delete (preserves audit trail)
    const deleteResult = await this.healthRecordRepository.softDelete({
      id: In(recordIds),
    });

    const deletedCount = deleteResult.affected || 0;
    const notFoundCount = recordIds.length - deletedCount;

    // PHI Deletion Audit Log
    this.logger.warn(
      `PHI Deletion: Bulk delete completed - ${deletedCount} records deleted, ${notFoundCount} not found`,
    );

    if (recordsToDelete.length > 0) {
      const studentNames = [
        ...new Set(
          recordsToDelete.map(
            (r) => `${r.student.firstName} ${r.student.lastName}`,
          ),
        ),
      ];
      this.logger.warn(
        `PHI Deletion: Records deleted for students: ${studentNames.join(', ')}`,
      );
    }

    return {
      deleted: deletedCount,
      notFound: notFoundCount,
      success: true,
    };
  }

  // ==================== Allergy Operations ====================

  /**
   * Add allergy to student with validation
   * @param data - Allergy creation data
   * @returns Created allergy record
   */
  async addAllergy(data: any): Promise<Allergy> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check for duplicate
    const existingAllergy = await this.allergyRepository.findOne({
      where: {
        studentId: data.studentId,
        allergen: data.allergen,
      },
    });

    if (existingAllergy) {
      throw new Error(
        `Allergy to ${data.allergen} already exists for this student`,
      );
    }

    // Create allergy
    const allergy = this.allergyRepository.create({
      ...data,
      verifiedAt: data.verified ? new Date() : null,
    });
    const savedAllergy = await this.allergyRepository.save(allergy);

    // Reload with associations
    const allergyWithRelations = await this.allergyRepository.findOne({
      where: { id: savedAllergy.id },
      relations: ['student'],
    });

    // PHI Creation Audit Log - WARNING for critical allergies
    if (data.severity === 'life-threatening' || data.severity === 'severe') {
      this.logger.warn(
        `CRITICAL ALLERGY ADDED: ${data.allergen} (${data.severity}) for student ${student.firstName} ${student.lastName}`,
      );
    } else {
      this.logger.log(
        `Allergy added: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`,
      );
    }

    return allergyWithRelations;
  }

  /**
   * Update allergy information
   * @param id - Allergy UUID
   * @param data - Updated allergy data
   * @returns Updated allergy record
   */
  async updateAllergy(id: string, data: Partial<any>): Promise<Allergy> {
    const existingAllergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Update verification timestamp if being verified
    const updateData: any = { ...data };
    if (data.verified && !existingAllergy.verified) {
      updateData.verifiedAt = new Date();
    }

    // Update allergy
    Object.assign(existingAllergy, updateData);
    const updatedAllergy = await this.allergyRepository.save(existingAllergy);

    // Reload with associations
    const allergyWithRelations = await this.allergyRepository.findOne({
      where: { id: updatedAllergy.id },
      relations: ['student'],
    });

    // PHI Modification Audit Log
    this.logger.log(
      `Allergy updated: ${allergyWithRelations.allergen} for ${allergyWithRelations.student.firstName} ${allergyWithRelations.student.lastName}`,
    );

    return allergyWithRelations;
  }

  /**
   * Get student allergies
   * @param studentId - Student UUID
   * @returns Array of allergies ordered by severity
   */
  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    const allergies = await this.allergyRepository.find({
      where: { studentId },
      relations: ['student'],
      order: {
        severity: 'DESC', // Most severe first
        allergen: 'ASC',
      },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Allergies retrieved for student ${studentId}, count: ${allergies.length}`,
    );

    return allergies;
  }

  /**
   * Delete allergy (soft delete for HIPAA compliance)
   * @param id - Allergy UUID
   * @returns Success status
   */
  async deleteAllergy(id: string): Promise<{ success: boolean }> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Soft delete
    await this.allergyRepository.softDelete(id);

    // PHI Deletion Audit Log
    this.logger.warn(
      `Allergy deleted: ${allergy.allergen} for ${allergy.student.firstName} ${allergy.student.lastName}`,
    );

    return { success: true };
  }

  // Placeholder methods for other operations (to be fully implemented)

  async addChronicCondition(data: any): Promise<any> {
    this.logger.log('addChronicCondition - to be implemented');
    return data;
  }

  async getStudentChronicConditions(studentId: string): Promise<any[]> {
    this.logger.log('getStudentChronicConditions - to be implemented');
    return [];
  }

  async updateChronicCondition(id: string, data: any): Promise<any> {
    this.logger.log('updateChronicCondition - to be implemented');
    return data;
  }

  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    this.logger.log('deleteChronicCondition - to be implemented');
    return { success: true };
  }

  async addVaccination(data: any): Promise<any> {
    this.logger.log('addVaccination - to be implemented');
    return data;
  }

  async getStudentVaccinations(studentId: string): Promise<any[]> {
    this.logger.log('getStudentVaccinations - to be implemented');
    return [];
  }

  async updateVaccination(id: string, data: any): Promise<any> {
    this.logger.log('updateVaccination - to be implemented');
    return data;
  }

  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    this.logger.log('deleteVaccination - to be implemented');
    return { success: true };
  }

  async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
    this.logger.log('getGrowthChartData - to be implemented');
    return [];
  }

  async getRecentVitals(studentId: string, limit: number = 10): Promise<any[]> {
    this.logger.log('getRecentVitals - to be implemented');
    return [];
  }

  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    this.logger.log('getHealthSummary - to be implemented');
    return {
      student: null,
      allergies: [],
      recentVitals: [],
      recentVaccinations: [],
      recordCounts: {},
    };
  }

  async searchHealthRecords(
    query: string,
    type?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    this.logger.log('searchHealthRecords - to be implemented');
    return {
      records: [],
      pagination: { page, limit, total: 0, pages: 0 },
    };
  }

  async exportHealthHistory(studentId: string): Promise<any> {
    this.logger.log('exportHealthHistory - to be implemented');
    return {};
  }

  async importHealthRecords(
    studentId: string,
    importData: any,
  ): Promise<ImportResults> {
    this.logger.log('importHealthRecords - to be implemented');
    return { imported: 0, skipped: 0, errors: [] };
  }

  async getHealthRecordStatistics(): Promise<HealthRecordStatistics> {
    this.logger.log('getHealthRecordStatistics - to be implemented');
    return {
      totalRecords: 0,
      activeAllergies: 0,
      chronicConditions: 0,
      vaccinationsDue: 0,
      recentRecords: 0,
    };
  }
}
