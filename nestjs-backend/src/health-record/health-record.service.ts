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

  // ==================== Chronic Condition Operations ====================

  /**
   * Add chronic condition to student with validation and audit logging
   * @param data - Chronic condition creation data
   * @returns Created chronic condition record
   */
  async addChronicCondition(data: any): Promise<ChronicCondition> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create chronic condition
    const chronicCondition = this.chronicConditionRepository.create({
      ...data,
      isActive: true,
    });
    const savedCondition = await this.chronicConditionRepository.save(
      chronicCondition,
    );

    // Reload with associations
    const conditionWithRelations =
      await this.chronicConditionRepository.findOne({
        where: { id: savedCondition.id },
        relations: ['student'],
      });

    // PHI Creation Audit Log
    this.logger.log(
      `PHI Created: Chronic condition ${data.condition} for student ${student.firstName} ${student.lastName}`,
    );

    return conditionWithRelations;
  }

  /**
   * Get student chronic conditions with filtering
   * @param studentId - Student UUID
   * @returns Array of chronic conditions ordered by severity
   */
  async getStudentChronicConditions(studentId: string): Promise<any[]> {
    const conditions = await this.chronicConditionRepository.find({
      where: { studentId, isActive: true },
      relations: ['student'],
      order: {
        status: 'ASC',
        diagnosedDate: 'DESC',
      },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Chronic conditions retrieved for student ${studentId}, count: ${conditions.length}`,
    );

    return conditions;
  }

  /**
   * Update chronic condition information
   * @param id - Chronic condition UUID
   * @param data - Updated chronic condition data
   * @returns Updated chronic condition record
   */
  async updateChronicCondition(
    id: string,
    data: Partial<any>,
  ): Promise<ChronicCondition> {
    const existingCondition = await this.chronicConditionRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!existingCondition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Update chronic condition
    Object.assign(existingCondition, data);
    const updatedCondition = await this.chronicConditionRepository.save(
      existingCondition,
    );

    // Reload with associations
    const conditionWithRelations =
      await this.chronicConditionRepository.findOne({
        where: { id: updatedCondition.id },
        relations: ['student'],
      });

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Chronic condition ${conditionWithRelations.condition} updated for student ${conditionWithRelations.student.firstName} ${conditionWithRelations.student.lastName}`,
    );

    return conditionWithRelations;
  }

  /**
   * Delete chronic condition (soft delete for HIPAA compliance)
   * @param id - Chronic condition UUID
   * @returns Success status
   */
  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.chronicConditionRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Soft delete
    await this.chronicConditionRepository.softDelete(id);

    // PHI Deletion Audit Log
    this.logger.warn(
      `Chronic condition deleted: ${condition.condition} for ${condition.student.firstName} ${condition.student.lastName}`,
    );

    return { success: true };
  }

  // ==================== Vaccination Operations ====================

  /**
   * Add vaccination to student with validation and audit logging
   * @param data - Vaccination creation data
   * @returns Created vaccination record
   */
  async addVaccination(data: any): Promise<Vaccination> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Calculate series completion
    const seriesComplete =
      data.doseNumber && data.totalDoses
        ? data.doseNumber >= data.totalDoses
        : false;

    // Create vaccination
    const vaccination = this.vaccinationRepository.create({
      ...data,
      seriesComplete,
    });
    const savedVaccination = await this.vaccinationRepository.save(vaccination);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationRepository.findOne({
      where: { id: savedVaccination.id },
      relations: ['student'],
    });

    // PHI Creation Audit Log
    this.logger.log(
      `PHI Created: Vaccination ${data.vaccineName} for student ${student.firstName} ${student.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Get student vaccinations
   * @param studentId - Student UUID
   * @returns Array of vaccinations ordered by administration date
   */
  async getStudentVaccinations(studentId: string): Promise<Vaccination[]> {
    const vaccinations = await this.vaccinationRepository.find({
      where: { studentId },
      relations: ['student'],
      order: {
        administrationDate: 'DESC',
      },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Vaccinations retrieved for student ${studentId}, count: ${vaccinations.length}`,
    );

    return vaccinations;
  }

  /**
   * Update vaccination information
   * @param id - Vaccination UUID
   * @param data - Updated vaccination data
   * @returns Updated vaccination record
   */
  async updateVaccination(
    id: string,
    data: Partial<any>,
  ): Promise<Vaccination> {
    const existingVaccination = await this.vaccinationRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!existingVaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Recalculate series completion if dose information updated
    if (data.doseNumber || data.totalDoses) {
      const doseNumber = data.doseNumber || existingVaccination.doseNumber;
      const totalDoses = data.totalDoses || existingVaccination.totalDoses;
      if (doseNumber && totalDoses) {
        data.seriesComplete = doseNumber >= totalDoses;
      }
    }

    // Update vaccination
    Object.assign(existingVaccination, data);
    const updatedVaccination = await this.vaccinationRepository.save(
      existingVaccination,
    );

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationRepository.findOne({
      where: { id: updatedVaccination.id },
      relations: ['student'],
    });

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student.firstName} ${vaccinationWithRelations.student.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Soft delete
    await this.vaccinationRepository.softDelete(id);

    // PHI Deletion Audit Log
    this.logger.warn(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student.firstName} ${vaccination.student.lastName}`,
    );

    return { success: true };
  }

  // ==================== Growth and Vital Signs Operations ====================

  /**
   * Get growth chart data for student (height/weight over time)
   * @param studentId - Student UUID
   * @returns Array of growth data points
   */
  async getGrowthChartData(studentId: string): Promise<GrowthDataPoint[]> {
    // Query health records with vital signs metadata
    const records = await this.healthRecordRepository
      .createQueryBuilder('hr')
      .where('hr.studentId = :studentId', { studentId })
      .andWhere("hr.metadata->>'height' IS NOT NULL OR hr.metadata->>'weight' IS NOT NULL")
      .orderBy('hr.recordDate', 'ASC')
      .getMany();

    // Extract growth data points
    const growthData: GrowthDataPoint[] = records
      .map((record) => {
        const height = record.metadata?.height
          ? parseFloat(record.metadata.height)
          : undefined;
        const weight = record.metadata?.weight
          ? parseFloat(record.metadata.weight)
          : undefined;

        // Calculate BMI if both height and weight available
        let bmi: number | undefined;
        if (height && weight) {
          // BMI = weight (kg) / (height (m))^2
          const heightInMeters = height / 100;
          bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
        }

        return {
          date: record.recordDate,
          height,
          weight,
          bmi,
          recordType: record.recordType,
        };
      })
      .filter((point) => point.height !== undefined || point.weight !== undefined);

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Growth chart data retrieved for student ${studentId}, data points: ${growthData.length}`,
    );

    return growthData;
  }

  /**
   * Get recent vital signs for student
   * @param studentId - Student UUID
   * @param limit - Number of records to retrieve
   * @returns Array of recent vital signs
   */
  async getRecentVitals(studentId: string, limit: number = 10): Promise<VitalSigns[]> {
    const records = await this.healthRecordRepository.find({
      where: {
        studentId,
        recordType: In(['VITAL_SIGNS_CHECK', 'CHECKUP', 'PHYSICAL_EXAM']),
      },
      order: {
        recordDate: 'DESC',
      },
      take: limit,
    });

    // Extract vital signs from metadata
    const vitals: VitalSigns[] = records
      .map((record) => ({
        temperature: record.metadata?.temperature,
        bloodPressureSystolic: record.metadata?.bloodPressureSystolic,
        bloodPressureDiastolic: record.metadata?.bloodPressureDiastolic,
        heartRate: record.metadata?.heartRate,
        respiratoryRate: record.metadata?.respiratoryRate,
        oxygenSaturation: record.metadata?.oxygenSaturation,
        height: record.metadata?.height,
        weight: record.metadata?.weight,
        bmi: record.metadata?.bmi,
      }))
      .filter((vital) => Object.values(vital).some((v) => v !== undefined));

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Recent vitals retrieved for student ${studentId}, count: ${vitals.length}`,
    );

    return vitals;
  }

  // ==================== Summary and Analytics Operations ====================

  /**
   * Get comprehensive health summary for student
   * @param studentId - Student UUID
   * @returns Health summary with aggregated data
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    // Get student information
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get allergies
    const allergies = await this.allergyRepository.find({
      where: { studentId },
      order: { severity: 'DESC' },
    });

    // Get recent vitals
    const recentVitals = await this.getRecentVitals(studentId, 5);

    // Get recent vaccinations
    const recentVaccinations = await this.vaccinationRepository.find({
      where: { studentId },
      order: { administrationDate: 'DESC' },
      take: 5,
    });

    // Count records by type
    const recordCounts: Record<string, number> = {};
    const countsByType = await this.healthRecordRepository
      .createQueryBuilder('hr')
      .select('hr.recordType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('hr.studentId = :studentId', { studentId })
      .groupBy('hr.recordType')
      .getRawMany();

    countsByType.forEach((row) => {
      recordCounts[row.type] = parseInt(row.count, 10);
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Health summary retrieved for student ${studentId}`,
    );

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

    const queryBuilder = this.healthRecordRepository
      .createQueryBuilder('hr')
      .leftJoinAndSelect('hr.student', 'student')
      .where(
        'hr.title ILIKE :query OR hr.description ILIKE :query OR hr.diagnosis ILIKE :query OR hr.treatment ILIKE :query',
        { query: `%${query}%` },
      );

    // Apply type filter if provided
    if (type) {
      queryBuilder.andWhere('hr.recordType = :type', { type });
    }

    // Execute query with pagination
    const [records, total] = await queryBuilder
      .orderBy('hr.recordDate', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // PHI Access Audit Log
    this.logger.log(
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
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get all health data
    const healthRecords = await this.healthRecordRepository.find({
      where: { studentId },
      order: { recordDate: 'DESC' },
    });

    const allergies = await this.allergyRepository.find({
      where: { studentId },
      order: { severity: 'DESC' },
    });

    const vaccinations = await this.vaccinationRepository.find({
      where: { studentId },
      order: { administrationDate: 'DESC' },
    });

    const chronicConditions = await this.chronicConditionRepository.find({
      where: { studentId },
      order: { diagnosedDate: 'DESC' },
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Export: Complete health history exported for student ${studentId}`,
    );

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
  async importHealthRecords(
    studentId: string,
    importData: any,
  ): Promise<ImportResults> {
    const results: ImportResults = {
      imported: 0,
      skipped: 0,
      errors: [],
    };

    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      results.errors.push('Student not found');
      return results;
    }

    // Import health records
    if (importData.healthRecords && Array.isArray(importData.healthRecords)) {
      for (const recordData of importData.healthRecords) {
        try {
          const record = this.healthRecordRepository.create({
            ...recordData,
            studentId,
          });
          await this.healthRecordRepository.save(record);
          results.imported++;
        } catch (error) {
          results.errors.push(
            `Failed to import health record: ${error.message}`,
          );
          results.skipped++;
        }
      }
    }

    // Import allergies
    if (importData.allergies && Array.isArray(importData.allergies)) {
      for (const allergyData of importData.allergies) {
        try {
          // Check for duplicate
          const existing = await this.allergyRepository.findOne({
            where: {
              studentId,
              allergen: allergyData.allergen,
            },
          });

          if (existing) {
            results.skipped++;
            continue;
          }

          const allergy = this.allergyRepository.create({
            ...allergyData,
            studentId,
          });
          await this.allergyRepository.save(allergy);
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
          const vaccination = this.vaccinationRepository.create({
            ...vaccinationData,
            studentId,
          });
          await this.vaccinationRepository.save(vaccination);
          results.imported++;
        } catch (error) {
          results.errors.push(
            `Failed to import vaccination: ${error.message}`,
          );
          results.skipped++;
        }
      }
    }

    // PHI Creation Audit Log
    this.logger.log(
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
    const totalRecords = await this.healthRecordRepository.count();

    // Count active allergies
    const activeAllergies = await this.allergyRepository.count({
      where: { isActive: true },
    });

    // Count chronic conditions
    const chronicConditions = await this.chronicConditionRepository.count({
      where: { isActive: true },
    });

    // Count vaccinations due (next due date in past and series not complete)
    const today = new Date();
    const vaccinationsDue = await this.vaccinationRepository
      .createQueryBuilder('v')
      .where('v.nextDueDate < :today', { today })
      .andWhere('v.seriesComplete = :complete', { complete: false })
      .getCount();

    // Count recent records (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRecords = await this.healthRecordRepository.count({
      where: {
        createdAt: Between(thirtyDaysAgo, new Date()),
      },
    });

    // PHI Access Audit Log
    this.logger.log('System statistics retrieved for health records');

    return {
      totalRecords,
      activeAllergies,
      chronicConditions,
      vaccinationsDue,
      recentRecords,
    };
  }
}
