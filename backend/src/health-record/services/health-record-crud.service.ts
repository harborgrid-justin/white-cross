/**
 * @fileoverview Health Record CRUD Service - Basic Health Record Operations
 * @module health-record/services
 * @description Service providing core CRUD operations for health records.
 * Handles creation, retrieval, updating, and deletion of health records with
 * HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { HealthRecord   } from '@/database/models';
import { Student   } from '@/database/models';
import { PaginatedHealthRecords } from '../interfaces/pagination.interface';
import { BulkDeleteResults } from '../interfaces/health-record-types';

import { BaseService } from '@/common/base';
/**
 * HealthRecordCrudService
 *
 * Provides core CRUD operations for health records with comprehensive
 * HIPAA-compliant audit logging and validation.
 *
 * Responsibilities:
 * - Create, read, update, delete health records
 * - Paginated health record retrieval with filtering
 * - Bulk delete operations with audit trails
 * - Vaccination record filtering
 */
@Injectable()
export class HealthRecordCrudService extends BaseService {
  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {
    super("HealthRecordCrudService");
  }

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
    const whereClause: any = { studentId };

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
    }

    // Execute query with pagination using BaseService method
    const result = await this.createPaginatedQuery(this.healthRecordModel, {
      page,
      limit,
      where: whereClause,
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(
      `PHI Access: Health records retrieved for student ${studentId}, count: ${result.data.length}`,
    );

    return {
      records: result.data,
      pagination: result.pagination,
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
    this.logInfo(
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
    this.logInfo(
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
    this.logInfo(
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
    this.logWarning(
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
      this.logWarning(
        `PHI Deletion: Records deleted for students: ${studentNames.join(', ')}`,
      );
    }

    return {
      deleted: deletedCount,
      notFound: notFoundCount,
      success: true,
    };
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
    const whereClause: any = {};

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: `%${filters.provider}%` };
    }

    // Execute query with pagination using BaseService method
    const result = await this.createPaginatedQuery(this.healthRecordModel, {
      page,
      limit,
      where: whereClause,
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(
      `PHI Access: All health records retrieved, count: ${result.data.length}, filters: ${JSON.stringify(filters)}`,
    );

    return {
      records: result.data,
      pagination: result.pagination,
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
    this.logInfo(
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
}
