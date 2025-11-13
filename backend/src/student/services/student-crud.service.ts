/**
 * @fileoverview Student CRUD Service
 * @module student/services/student-crud.service
 * @description Core CRUD operations for student management
 *
 * This service handles:
 * - Create, Read, Update, Delete operations
 * - Student activation/deactivation
 * - Student transfers
 * - Bulk updates
 * - Basic validation
 */

import { ConflictException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Student } from '../../database/models/student.model';
import { User, UserRole } from '../../database/models/user.model';
import { QueryCacheService } from '../../database/services/query-cache.service';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '@/common/base';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentBulkUpdateDto } from '../dto/bulk-update.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { TransferStudentDto } from '../dto/transfer-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { PaginatedResponse } from '../types';

/**
 * Student CRUD Service
 *
 * Provides core CRUD operations for student management with:
 * - HIPAA-compliant error handling
 * - Automatic audit logging via request context
 * - Validation and business rules
 * - Event emission for decoupled architecture
 */
@Injectable()
export class StudentCrudService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly queryCacheService: QueryCacheService,
    @Optional() protected readonly requestContext: RequestContextService,
    @Optional() private readonly eventEmitter: EventEmitter2,
  ) {
    super(
      requestContext ||
        ({
          requestId: 'system',
          userId: undefined,
          getLogContext: () => ({ requestId: 'system' }),
          getAuditContext: () => ({
            requestId: 'system',
            timestamp: new Date(),
          }),
        } as any),
    );
  }

  // ==================== CRUD Operations ====================

  /**
   * Create a new student
   * Validates uniqueness and business rules
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      // Normalize data
      const normalizedData = this.normalizeCreateData(createStudentDto);

      // Validate student number uniqueness
      await this.validateStudentNumber(normalizedData.studentNumber);

      // Validate medical record number uniqueness if provided
      if (normalizedData.medicalRecordNum) {
        await this.validateMedicalRecordNumber(normalizedData.medicalRecordNum);
      }

      // Validate date of birth
      this.validateDateOfBirth(normalizedData.dateOfBirth);

      // Validate nurse assignment if provided
      if (normalizedData.nurseId) {
        await this.validateNurseAssignment(normalizedData.nurseId);
      }

      // Create student
      const student = await this.studentModel.create(normalizedData as any);

      // Emit event
      if (this.eventEmitter) {
        this.eventEmitter.emit('student.created', {
          studentId: student.id,
          data: student,
          userId: this.requestContext?.userId,
        });
      }

      this.logInfo(`Student created: ${student.id} (${student.studentNumber})`);
      return student;
    } catch (error) {
      this.handleError('Failed to create student', error);
    }
  }

  /**
   * Find all students with pagination and filters
   */
  async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    try {
      const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;

      const where: any = {};

      // Apply filters
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { studentNumber: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (grade) {
        where.grade = grade;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (nurseId) {
        where.nurseId = nurseId;
      }

      if (gender) {
        where.gender = gender;
      }

      // Execute query with pagination using BaseService method
      const result = await this.createPaginatedQuery(this.studentModel, {
        page,
        limit,
        where,
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
        attributes: {
          exclude: ['schoolId', 'districtId'],
        },
        distinct: true,
      });

      return {
        data: result.data,
        meta: result.pagination,
      };
    } catch (error) {
      this.handleError('Failed to fetch students', error);
    }
  }

  /**
   * Find one student by ID
   */
  async findOne(id: string): Promise<Student> {
    try {
      this.validateUUID(id, 'Student ID');

      const students = await this.queryCacheService.findWithCache(
        this.studentModel,
        { where: { id } },
        {
          ttl: 600, // 10 minutes
          keyPrefix: 'student_detail',
          invalidateOn: ['update', 'destroy'],
        },
      );

      if (!students || students.length === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return students[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to fetch student', error);
    }
  }

  /**
   * Update student information
   */
  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      this.validateUUID(id, 'Student ID');

      // Find existing student
      const student = await this.findOne(id);

      // Normalize data
      const normalizedData = this.normalizeUpdateData(updateStudentDto);

      // Validate student number if being updated
      if (normalizedData.studentNumber && normalizedData.studentNumber !== student.studentNumber) {
        await this.validateStudentNumber(normalizedData.studentNumber, id);
      }

      // Validate medical record number if being updated
      if (
        normalizedData.medicalRecordNum &&
        normalizedData.medicalRecordNum !== student.medicalRecordNum
      ) {
        await this.validateMedicalRecordNumber(normalizedData.medicalRecordNum, id);
      }

      // Validate date of birth if being updated
      if (normalizedData.dateOfBirth) {
        this.validateDateOfBirth(normalizedData.dateOfBirth);
      }

      // Validate nurse assignment if being updated
      if (normalizedData.nurseId) {
        await this.validateNurseAssignment(normalizedData.nurseId);
      }

      // Update student
      Object.assign(student, normalizedData);
      const updated = await student.save();

      // Emit event
      if (this.eventEmitter) {
        this.eventEmitter.emit('student.updated', {
          studentId: updated.id,
          data: updated,
          userId: this.requestContext?.userId,
        });
      }

      this.logInfo(`Student updated: ${updated.id} (${updated.studentNumber})`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to update student', error);
    }
  }

  /**
   * Delete student (soft delete)
   */
  async remove(id: string): Promise<void> {
    try {
      this.validateUUID(id, 'Student ID');

      const student = await this.findOne(id);

      student.isActive = false;
      await student.save();

      // Emit event
      if (this.eventEmitter) {
        this.eventEmitter.emit('student.deleted', {
          studentId: id,
          userId: this.requestContext?.userId,
        });
      }

      this.logInfo(`Student deleted (soft): ${id} (${student.studentNumber})`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to delete student', error);
    }
  }

  // ==================== Student Management Operations ====================

  /**
   * Deactivate a student
   */
  async deactivate(id: string, reason?: string): Promise<Student> {
    try {
      this.validateUUID(id, 'Student ID');

      const student = await this.findOne(id);

      student.isActive = false;
      const updated = await student.save();

      this.logInfo(
        `Student deactivated: ${id} (${student.studentNumber})${reason ? `, reason: ${reason}` : ''}`,
      );
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to deactivate student', error);
    }
  }

  /**
   * Reactivate a student
   */
  async reactivate(id: string): Promise<Student> {
    try {
      this.validateUUID(id, 'Student ID');

      const student = await this.findOne(id);

      student.isActive = true;
      const updated = await student.save();

      this.logInfo(`Student reactivated: ${id} (${student.studentNumber})`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to reactivate student', error);
    }
  }

  /**
   * Transfer student to different nurse or grade
   */
  async transfer(id: string, transferDto: TransferStudentDto): Promise<Student> {
    try {
      this.validateUUID(id, 'Student ID');

      const student = await this.findOne(id);

      // Validate nurse if being updated
      if (transferDto.nurseId) {
        await this.validateNurseAssignment(transferDto.nurseId);
        student.nurseId = transferDto.nurseId;
      }

      // Update grade if provided
      if (transferDto.grade) {
        student.grade = transferDto.grade;
      }

      const updated = await student.save();

      this.logInfo(
        `Student transferred: ${id} (${student.studentNumber})${transferDto.reason ? `, reason: ${transferDto.reason}` : ''}`,
      );
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to transfer student', error);
    }
  }

  /**
   * Bulk update students
   */
  async bulkUpdate(bulkUpdateDto: StudentBulkUpdateDto): Promise<{ updated: number }> {
    try {
      const { studentIds, nurseId, grade, isActive } = bulkUpdateDto;

      return await this.sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        },
        async (transaction) => {
          // Validate nurse if being updated
          if (nurseId) {
            const nurse = await this.userModel.findOne({
              where: {
                id: nurseId,
                role: UserRole.NURSE,
                isActive: true,
              } as any,
              transaction,
            });

            if (!nurse) {
              throw new NotFoundException(
                'Assigned nurse not found. Please select a valid, active nurse.',
              );
            }

            this.logInfo(`Nurse validation successful: ${nurse.fullName} (${nurseId})`);
          }

          // Build update object
          const updateData: Partial<Student> = {};
          if (nurseId !== undefined) updateData.nurseId = nurseId;
          if (grade !== undefined) updateData.grade = grade;
          if (isActive !== undefined) updateData.isActive = isActive;

          // Perform bulk update
          const [affectedCount] = await this.studentModel.update(updateData, {
            where: { id: { [Op.in]: studentIds } },
            transaction,
          });

          this.logInfo(`Bulk update: ${affectedCount} students updated`);
          return { updated: affectedCount };
        },
      );
    } catch (error) {
      this.handleError('Failed to bulk update students', error);
    }
  }

  // ==================== Search Operations ====================

  /**
   * Search students
   */
  async search(query: string, limit: number = 20): Promise<Student[]> {
    try {
      const students = await this.studentModel.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            { studentNumber: { [Op.iLike]: `%${query}%` } },
          ],
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        limit,
      });

      return students;
    } catch (error) {
      this.handleError('Failed to search students', error);
    }
  }

  /**
   * Get students by grade
   */
  async findByGrade(grade: string): Promise<Student[]> {
    try {
      const students = await this.queryCacheService.findWithCache(
        this.studentModel,
        {
          where: { grade, isActive: true },
          order: [
            ['lastName', 'ASC'],
            ['firstName', 'ASC'],
          ],
        },
        {
          ttl: 300, // 5 minutes
          keyPrefix: 'students_by_grade',
          invalidateOn: ['create', 'update', 'destroy'],
        },
      );

      return students;
    } catch (error) {
      this.handleError('Failed to fetch students by grade', error);
    }
  }

  /**
   * Get students by nurse
   */
  async findByNurse(nurseId: string): Promise<Student[]> {
    try {
      this.validateUUID(nurseId, 'Nurse ID');

      const students = await this.queryCacheService.findWithCache(
        this.studentModel,
        {
          where: { nurseId, isActive: true },
          order: [
            ['lastName', 'ASC'],
            ['firstName', 'ASC'],
          ],
        },
        {
          ttl: 300, // 5 minutes
          keyPrefix: 'students_by_nurse',
          invalidateOn: ['create', 'update', 'destroy'],
        },
      );

      return students;
    } catch (error) {
      this.handleError('Failed to fetch students by nurse', error);
    }
  }

  // ==================== Validation Methods ====================

  private async validateStudentNumber(studentNumber: string, excludeId?: string): Promise<void> {
    const where: any = { studentNumber };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await this.studentModel.findOne({ where });
    if (existing) {
      throw new ConflictException('Student number already exists');
    }
  }

  private async validateMedicalRecordNumber(
    medicalRecordNum: string,
    excludeId?: string,
  ): Promise<void> {
    const where: any = { medicalRecordNum };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await this.studentModel.findOne({ where });
    if (existing) {
      throw new ConflictException('Medical record number already exists');
    }
  }

  private validateDateOfBirth(dateOfBirth: Date | string): void {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    this.validateNotFuture(dob, 'Date of birth');
  }

  private async validateNurseAssignment(nurseId: string): Promise<void> {
    this.validateUUID(nurseId, 'Nurse ID');

    const nurse = await this.userModel.findOne({
      where: {
        id: nurseId,
        role: UserRole.NURSE,
        isActive: true,
      } as any,
    });

    if (!nurse) {
      throw new NotFoundException('Assigned nurse not found. Please select a valid, active nurse.');
    }
  }

  // ==================== Data Normalization ====================

  private normalizeCreateData(data: CreateStudentDto): CreateStudentDto {
    return {
      ...data,
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      studentNumber: data.studentNumber?.trim()?.toUpperCase(),
    };
  }

  private normalizeUpdateData(data: UpdateStudentDto): UpdateStudentDto {
    const normalized: any = { ...data };

    if (normalized.firstName) normalized.firstName = normalized.firstName.trim();
    if (normalized.lastName) normalized.lastName = normalized.lastName.trim();
    if (normalized.studentNumber)
      normalized.studentNumber = normalized.studentNumber.trim().toUpperCase();
    if (normalized.email) normalized.email = normalized.email.trim().toLowerCase();

    return normalized;
  }
}
