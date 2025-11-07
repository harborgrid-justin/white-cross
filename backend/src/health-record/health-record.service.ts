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
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HealthRecord } from '../database/models/health-record.model';
import { Allergy } from '../database/models/allergy.model';
import { Student } from '../database/models/student.model';
import { ChronicCondition } from '../database/models/chronic-condition.model';
import { Vaccination } from '../database/models/vaccination.model';
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

/**
 * HealthRecordService
 *
 * Comprehensive HIPAA-Compliant Health Management Service
 * Migrated to Sequelize ORM
 */
@Injectable()
export class HealthRecordService {
  private readonly logger = new Logger(HealthRecordService.name);

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

    const whereClause: any = { studentId };

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = {};
      if (filters.dateFrom) {
        whereClause.recordDate[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        whereClause.recordDate[Op.lte] = filters.dateTo;
      }
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
    }

    // Execute query with pagination
    const { rows: records, count: total } =
      await this.healthRecordModel.findAndCountAll({
        where: whereClause,
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
        limit,
        offset,
      });

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
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create health record
    const healthRecord = await this.healthRecordModel.create(data);

    // Reload with associations
    const record = await this.healthRecordModel.findByPk(healthRecord.id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!record) {
      throw new Error('Failed to reload health record after creation');
    }

    // PHI Creation Audit Log
    this.logger.log(
      `PHI Created: Health record ${record.recordType} for student ${record.student!.firstName} ${record.student!.lastName}`,
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
    const existingRecord = await this.healthRecordModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingRecord) {
      throw new NotFoundException('Health record not found');
    }

    // Update record
    await existingRecord.update(data);

    // Reload with associations
    const record = await this.healthRecordModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!record) {
      throw new Error('Failed to reload health record after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Health record ${record.recordType} updated for student ${record.student!.firstName} ${record.student!.lastName}`,
    );

    return record;
  }

  /**
   * Get vaccination records for a student
   * @param studentId - Student UUID
   * @returns Array of vaccination records
   */
  async getVaccinationRecords(studentId: string): Promise<HealthRecord[]> {
    const records = await this.healthRecordModel.findAll({
      where: {
        studentId,
        recordType: 'VACCINATION' as any,
      },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
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
    const recordsToDelete = await this.healthRecordModel.findAll({
      where: {
        id: { [Op.in]: recordIds },
      },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    // Soft delete (preserves audit trail) - Sequelize soft delete using paranoid
    const deletedCount = await this.healthRecordModel.destroy({
      where: { id: { [Op.in]: recordIds } },
    });

    const notFoundCount = recordIds.length - deletedCount;

    // PHI Deletion Audit Log
    this.logger.warn(
      `PHI Deletion: Bulk delete completed - ${deletedCount} records deleted, ${notFoundCount} not found`,
    );

    if (recordsToDelete.length > 0) {
      const studentNames = [
        ...new Set(
          recordsToDelete.map(
            (r) => `${r.student!.firstName} ${r.student!.lastName}`,
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
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check for duplicate
    const existingAllergy = await this.allergyModel.findOne({
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

    // Create allergy with verification timestamp
    const allergyData = {
      ...data,
      verificationDate: data.verified ? new Date() : null,
    };
    const savedAllergy = await this.allergyModel.create(allergyData);

    // Reload with associations
    const allergyWithRelations = await this.allergyModel.findByPk(
      savedAllergy.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!allergyWithRelations) {
      throw new Error('Failed to reload allergy after creation');
    }

    // PHI Creation Audit Log - WARNING for critical allergies
    if (data.severity === 'LIFE_THREATENING' || data.severity === 'SEVERE') {
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
    const existingAllergy = await this.allergyModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Update verification timestamp if being verified
    const updateData: any = { ...data };
    if (data.verified && !existingAllergy.verified) {
      updateData.verificationDate = new Date();
    }

    // Update allergy
    await existingAllergy.update(updateData);

    // Reload with associations
    const allergyWithRelations = await this.allergyModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!allergyWithRelations) {
      throw new Error('Failed to reload allergy after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `Allergy updated: ${allergyWithRelations.allergen} for ${allergyWithRelations.student!.firstName} ${allergyWithRelations.student!.lastName}`,
    );

    return allergyWithRelations;
  }

  /**
   * Get student allergies
   * @param studentId - Student UUID
   * @returns Array of allergies ordered by severity
   */
  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    const allergies = await this.allergyModel.findAll({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [
        ['severity', 'DESC'], // Most severe first
        ['allergen', 'ASC'],
      ],
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
    const allergy = await this.allergyModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.allergyModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logger.warn(
      `Allergy deleted: ${allergy.allergen} for ${allergy.student?.firstName} ${allergy.student?.lastName}`,
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
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create chronic condition
    const conditionData = {
      ...data,
      isActive: true,
    };
    const savedCondition =
      await this.chronicConditionModel.create(conditionData);

    // Reload with associations
    const conditionWithRelations = await this.chronicConditionModel.findByPk(
      savedCondition.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!conditionWithRelations) {
      throw new Error('Failed to reload chronic condition after creation');
    }

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
    const conditions = await this.chronicConditionModel.findAll({
      where: { studentId, isActive: true },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [
        ['status', 'ASC'],
        ['diagnosedDate', 'DESC'],
      ],
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
    const existingCondition = await this.chronicConditionModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingCondition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Update chronic condition
    await existingCondition.update(data);

    // Reload with associations
    const conditionWithRelations = await this.chronicConditionModel.findByPk(
      id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!conditionWithRelations) {
      throw new Error('Failed to reload chronic condition after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Chronic condition ${conditionWithRelations.condition} updated for student ${conditionWithRelations.studentId}`,
    );

    return conditionWithRelations;
  }

  /**
   * Delete chronic condition (soft delete for HIPAA compliance)
   * @param id - Chronic condition UUID
   * @returns Success status
   */
  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.chronicConditionModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.chronicConditionModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logger.warn(
      `Chronic condition deleted: ${condition.condition} for student ${condition.studentId}`,
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
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Calculate series completion
    const seriesComplete =
      data.doseNumber && data.totalDoses
        ? data.doseNumber >= data.totalDoses
        : false;

    // Create vaccination
    const vaccinationData = {
      ...data,
      seriesComplete,
    };
    const savedVaccination =
      await this.vaccinationModel.create(vaccinationData);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(
      savedVaccination.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after creation');
    }

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
    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['administrationDate', 'DESC']],
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
    const existingVaccination = await this.vaccinationModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingVaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Recalculate series completion if dose information updated
    const updateData = { ...data };
    if (data.doseNumber || data.totalDoses) {
      const doseNumber = data.doseNumber || existingVaccination.doseNumber;
      const totalDoses = data.totalDoses || existingVaccination.totalDoses;
      if (doseNumber && totalDoses) {
        updateData.seriesComplete = doseNumber >= totalDoses;
      }
    }

    // Update vaccination
    await existingVaccination.update(updateData);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student!.firstName} ${vaccinationWithRelations.student!.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.vaccinationModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logger.warn(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student!.firstName} ${vaccination.student!.lastName}`,
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
    // Query health records with vital signs metadata using Sequelize
    const records = await this.healthRecordModel.findAll({
      where: {
        studentId,
        [Op.or]: [
          { metadata: { height: { [Op.ne]: null } } },
          { metadata: { weight: { [Op.ne]: null } } },
        ],
      },
      order: [['recordDate', 'ASC']],
    });

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
          bmi = parseFloat(
            (weight / (heightInMeters * heightInMeters)).toFixed(1),
          );
        }

        return {
          date: record.recordDate,
          height,
          weight,
          bmi,
          recordType: record.recordType,
        };
      })
      .filter(
        (point) => point.height !== undefined || point.weight !== undefined,
      );

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
  async getRecentVitals(
    studentId: string,
    limit: number = 10,
  ): Promise<VitalSigns[]> {
    const records = await this.healthRecordModel.findAll({
      where: {
        studentId,
        recordType: {
          [Op.in]: ['VITAL_SIGNS_CHECK', 'CHECKUP', 'PHYSICAL_EXAM'],
        },
      },
      order: [['recordDate', 'DESC']],
      limit,
    });

    // Extract vital signs from metadata
    const vitals: VitalSigns[] = records
      .map((record) => ({
        studentId,
        measurementDate: record.recordDate,
        isAbnormal: false, // Default value
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
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get allergies
    const allergies = await this.allergyModel.findAll({
      where: { studentId },
      order: [['severity', 'DESC']],
    });

    // Get recent vitals
    const recentVitals = await this.getRecentVitals(studentId, 5);

    // Get recent vaccinations
    const recentVaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      order: [['administrationDate', 'DESC']],
      limit: 5,
    });

    // Count records by type using Sequelize aggregation
    const recordCounts: Record<string, number> = {};
    const countsByType = (await this.healthRecordModel.findAll({
      attributes: [
        'recordType',
        [this.healthRecordModel.sequelize!.fn('COUNT', '*'), 'count'],
      ],
      where: { studentId },
      group: ['recordType'],
      raw: true,
    })) as any[];

    countsByType.forEach((row) => {
      recordCounts[row.recordType] = parseInt(row.count, 10);
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
    const { rows: records, count: total } =
      await this.healthRecordModel.findAndCountAll({
        where: whereClause,
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
        limit,
        offset,
      });

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
    this.logger.log(
      `PHI Import: Health data imported for student ${studentId}, imported: ${results.imported}, skipped: ${results.skipped}`,
    );

    return results;
  }

  /**
   * Get all health records with optional filtering and pagination
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records across all students
   */
  async getAllHealthRecords(
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
      studentId?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = {};
      if (filters.dateFrom) {
        whereClause.recordDate[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        whereClause.recordDate[Op.lte] = filters.dateTo;
      }
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
    }

    // Execute query with pagination
    const { rows: records, count: total } =
      await this.healthRecordModel.findAndCountAll({
        where: whereClause,
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
        limit,
        offset,
      });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: All health records retrieved, count: ${records.length}, filters: ${JSON.stringify(filters)}`,
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
    this.logger.log('System statistics retrieved for health records');

    return {
      totalRecords,
      activeAllergies,
      chronicConditions,
      vaccinationsDue,
      recentRecords,
    };
  }

  /**
   * Get health record for a specific student
   * @param studentId - Student identifier
   * @returns Health record or null if not found
   */
  async getHealthRecord(studentId: string): Promise<HealthRecord | null> {
    return this.healthRecordModel.findOne({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
    });
  }

  /**
   * Get health record by its ID
   * @param id - Health record identifier
   * @returns Health record or null if not found
   */
  async getHealthRecordById(id: string): Promise<HealthRecord | null> {
    const record = await this.healthRecordModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!record) {
      throw new NotFoundException(`Health record with ID ${id} not found`);
    }

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Health record ${id} retrieved for student ${record.student?.firstName} ${record.student?.lastName}`,
    );

    return record;
  }

  /**
   * Delete a specific health record
   * @param id - Health record identifier
   */
  async deleteHealthRecord(id: string): Promise<void> {
    const deletedCount = await this.healthRecordModel.destroy({
      where: { id },
    });
    if (deletedCount === 0) {
      throw new NotFoundException(`Health record with ID ${id} not found`);
    }
  }

  /**
   * Get complete health profile for a student
   * @param studentId - Student identifier
   * @returns Complete health profile with all related data
   */
  async getCompleteHealthProfile(studentId: string): Promise<any> {
    const healthRecord = await this.getHealthRecord(studentId);
    if (!healthRecord) {
      throw new NotFoundException(
        `Health record for student ${studentId} not found`,
      );
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

  // ==================== GraphQL Resolver Helper Methods ====================

  /**
   * Find all health records with pagination and filters (alias for GraphQL resolver)
   * @param page - Page number
   * @param limit - Records per page
   * @param filters - Optional filters
   * @returns Paginated health records
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: any = {},
  ): Promise<any> {
    return this.getAllHealthRecords(page, limit, filters);
  }

  /**
   * Find single health record by ID (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @returns Health record or null
   */
  async findOne(id: string): Promise<HealthRecord | null> {
    return this.getHealthRecordById(id);
  }

  /**
   * Find health records by student ID (alias for GraphQL resolver)
   * @param studentId - Student UUID
   * @param page - Page number
   * @param limit - Records per page
   * @param filters - Optional filters
   * @returns Paginated health records for student
   */
  async findByStudent(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {},
  ): Promise<any> {
    return this.getStudentHealthRecords(studentId, page, limit, filters);
  }

  /**
   * Create health record (alias for GraphQL resolver)
   * @param data - Health record creation data
   * @returns Created health record
   */
  async create(data: any): Promise<HealthRecord> {
    return this.createHealthRecord(data);
  }

  /**
   * Update health record (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @param data - Update data
   * @returns Updated health record
   */
  async update(id: string, data: any): Promise<HealthRecord> {
    return this.updateHealthRecord(id, data);
  }

  /**
   * Remove health record (alias for GraphQL resolver)
   * @param id - Health record UUID
   * @returns void
   */
  async remove(id: string): Promise<void> {
    return this.deleteHealthRecord(id);
  }
}
