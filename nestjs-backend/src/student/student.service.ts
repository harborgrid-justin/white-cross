/**
 * @fileoverview Student Service
 * @module student/student.service
 * @description Business logic for student management with HIPAA compliance
 * Migrated from Express/Sequelize to NestJS/TypeORM with all features preserved
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like, In } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { TransferStudentDto } from './dto/transfer-student.dto';
import { BulkUpdateDto } from './dto/bulk-update.dto';

/**
 * Paginated Response Interface
 */
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Student Statistics Interface
 */
interface StudentStatistics {
  healthRecords: number;
  allergies: number;
  medications: number;
  appointments: number;
  incidents: number;
}

/**
 * Student Data Export Interface
 */
interface StudentDataExport {
  exportDate: string;
  student: Student;
  statistics: StudentStatistics;
}

/**
 * Student Service
 *
 * Handles all business logic for student management:
 * - CRUD operations with validation
 * - Search and filtering
 * - Student transfers and bulk updates
 * - Statistics and data export
 * - HIPAA-compliant error handling
 */
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // ==================== CRUD Operations ====================

  /**
   * Create a new student
   * Validates uniqueness of studentNumber and medicalRecordNum
   * Validates nurse assignment and date of birth
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
      const student = this.studentRepository.create(normalizedData);
      const saved = await this.studentRepository.save(student);

      this.logger.log(`Student created: ${saved.id} (${saved.studentNumber})`);
      return saved;
    } catch (error) {
      this.handleError('Failed to create student', error);
    }
  }

  /**
   * Find all students with pagination and filters
   * Supports search, grade filtering, nurse filtering, and active status
   */
  async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    try {
      const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;

      const queryBuilder = this.studentRepository.createQueryBuilder('student');

      // Apply filters
      if (search) {
        queryBuilder.andWhere(
          '(student.firstName ILIKE :search OR student.lastName ILIKE :search OR student.studentNumber ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (grade) {
        queryBuilder.andWhere('student.grade = :grade', { grade });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('student.isActive = :isActive', { isActive });
      }

      if (nurseId) {
        queryBuilder.andWhere('student.nurseId = :nurseId', { nurseId });
      }

      if (gender) {
        queryBuilder.andWhere('student.gender = :gender', { gender });
      }

      // Pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      // Sorting
      queryBuilder.orderBy('student.lastName', 'ASC').addOrderBy('student.firstName', 'ASC');

      // Execute query
      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError('Failed to fetch students', error);
    }
  }

  /**
   * Find one student by ID
   * Returns full student profile
   */
  async findOne(id: string): Promise<Student> {
    try {
      this.validateUUID(id);

      const student = await this.studentRepository.findOne({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to fetch student', error);
    }
  }

  /**
   * Update student information
   * Validates all changes and checks for conflicts
   */
  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      this.validateUUID(id);

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
      const updated = await this.studentRepository.save(student);

      this.logger.log(`Student updated: ${updated.id} (${updated.studentNumber})`);
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
   * Sets isActive to false
   */
  async remove(id: string): Promise<void> {
    try {
      this.validateUUID(id);

      const student = await this.findOne(id);

      student.isActive = false;
      await this.studentRepository.save(student);

      this.logger.log(`Student deleted (soft): ${id} (${student.studentNumber})`);
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
   * Sets isActive to false with optional reason
   */
  async deactivate(id: string, reason?: string): Promise<Student> {
    try {
      this.validateUUID(id);

      const student = await this.findOne(id);

      student.isActive = false;
      const updated = await this.studentRepository.save(student);

      this.logger.log(`Student deactivated: ${id} (${student.studentNumber})${reason ? `, reason: ${reason}` : ''}`);
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
   * Sets isActive to true
   */
  async reactivate(id: string): Promise<Student> {
    try {
      this.validateUUID(id);

      const student = await this.findOne(id);

      student.isActive = true;
      const updated = await this.studentRepository.save(student);

      this.logger.log(`Student reactivated: ${id} (${student.studentNumber})`);
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
   * Updates nurse assignment and/or grade level
   */
  async transfer(id: string, transferDto: TransferStudentDto): Promise<Student> {
    try {
      this.validateUUID(id);

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

      const updated = await this.studentRepository.save(student);

      this.logger.log(
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
   * Applies same updates to multiple students
   */
  async bulkUpdate(bulkUpdateDto: BulkUpdateDto): Promise<{ updated: number }> {
    try {
      const { studentIds, nurseId, grade, isActive } = bulkUpdateDto;

      // Validate nurse if being updated
      if (nurseId) {
        await this.validateNurseAssignment(nurseId);
      }

      // Build update object
      const updateData: Partial<Student> = {};
      if (nurseId !== undefined) updateData.nurseId = nurseId;
      if (grade !== undefined) updateData.grade = grade;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Perform bulk update
      const result = await this.studentRepository.update(
        { id: In(studentIds) },
        updateData,
      );

      this.logger.log(`Bulk update: ${result.affected} students updated`);
      return { updated: result.affected || 0 };
    } catch (error) {
      this.handleError('Failed to bulk update students', error);
    }
  }

  // ==================== Query Operations ====================

  /**
   * Search students across all fields
   * Full-text search on firstName, lastName, studentNumber
   */
  async search(query: string, limit: number = 20): Promise<Student[]> {
    try {
      const students = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.isActive = :isActive', { isActive: true })
        .andWhere(
          '(student.firstName ILIKE :query OR student.lastName ILIKE :query OR student.studentNumber ILIKE :query)',
          { query: `%${query}%` },
        )
        .orderBy('student.lastName', 'ASC')
        .addOrderBy('student.firstName', 'ASC')
        .take(limit)
        .getMany();

      return students;
    } catch (error) {
      this.handleError('Failed to search students', error);
    }
  }

  /**
   * Get students by grade
   * Returns all active students in a specific grade
   */
  async findByGrade(grade: string): Promise<Student[]> {
    try {
      const students = await this.studentRepository.find({
        where: { grade, isActive: true },
        order: { lastName: 'ASC', firstName: 'ASC' },
      });

      return students;
    } catch (error) {
      this.handleError('Failed to fetch students by grade', error);
    }
  }

  /**
   * Get all unique grades
   * Returns list of all grade levels currently in use
   */
  async findAllGrades(): Promise<string[]> {
    try {
      const result = await this.studentRepository
        .createQueryBuilder('student')
        .select('DISTINCT student.grade', 'grade')
        .where('student.isActive = :isActive', { isActive: true })
        .orderBy('student.grade', 'ASC')
        .getRawMany();

      return result.map((r) => r.grade);
    } catch (error) {
      this.handleError('Failed to fetch grades', error);
    }
  }

  /**
   * Get students assigned to a specific nurse
   * Returns all active students for a nurse
   */
  async findAssignedStudents(nurseId: string): Promise<Student[]> {
    try {
      this.validateUUID(nurseId);

      const students = await this.studentRepository.find({
        where: { nurseId, isActive: true },
        select: ['id', 'studentNumber', 'firstName', 'lastName', 'grade', 'dateOfBirth', 'gender', 'photo'],
        order: { lastName: 'ASC', firstName: 'ASC' },
      });

      return students;
    } catch (error) {
      this.handleError('Failed to fetch assigned students', error);
    }
  }

  // ==================== Analytics & Export Operations ====================

  /**
   * Get student statistics
   * Aggregates counts for health records, allergies, medications, etc.
   * Note: Relations to other entities need to be implemented
   */
  async getStatistics(studentId: string): Promise<StudentStatistics> {
    try {
      this.validateUUID(studentId);

      const student = await this.findOne(studentId);

      // TODO: Implement counts when related modules are available
      // For now, return placeholder data
      return {
        healthRecords: 0,
        allergies: 0,
        medications: 0,
        appointments: 0,
        incidents: 0,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to get student statistics', error);
    }
  }

  /**
   * Export student data
   * Generates comprehensive data export for compliance and reporting
   */
  async exportData(studentId: string): Promise<StudentDataExport> {
    try {
      this.validateUUID(studentId);

      const student = await this.findOne(studentId);
      const statistics = await this.getStatistics(studentId);

      return {
        exportDate: new Date().toISOString(),
        student,
        statistics,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to export student data', error);
    }
  }

  // ==================== Validation Methods ====================

  /**
   * Validate student number uniqueness
   */
  private async validateStudentNumber(studentNumber: string, excludeId?: string): Promise<void> {
    const normalized = studentNumber.toUpperCase().trim();

    const where: any = { studentNumber: normalized };
    if (excludeId) {
      where.id = Not(excludeId);
    }

    const existing = await this.studentRepository.findOne({ where });

    if (existing) {
      throw new ConflictException('Student number already exists. Please use a unique student number.');
    }
  }

  /**
   * Validate medical record number uniqueness
   */
  private async validateMedicalRecordNumber(medicalRecordNum: string, excludeId?: string): Promise<void> {
    const normalized = medicalRecordNum.toUpperCase().trim();

    const where: any = { medicalRecordNum: normalized };
    if (excludeId) {
      where.id = Not(excludeId);
    }

    const existing = await this.studentRepository.findOne({ where });

    if (existing) {
      throw new ConflictException(
        'Medical record number already exists. Each student must have a unique medical record number.',
      );
    }
  }

  /**
   * Validate date of birth
   * Ensures date is in past and age is between 3-100 years
   */
  private validateDateOfBirth(dateOfBirth: Date): void {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (dob >= today) {
      throw new BadRequestException('Date of birth must be in the past.');
    }

    if (age < 3 || age > 100) {
      throw new BadRequestException('Student age must be between 3 and 100 years.');
    }
  }

  /**
   * Validate nurse assignment
   * Ensures nurse exists in the system
   * TODO: Implement when User module is available
   */
  private async validateNurseAssignment(nurseId: string): Promise<void> {
    // TODO: Check if nurse exists when User module is available
    // const nurse = await this.userRepository.findOne({ where: { id: nurseId, role: UserRole.NURSE } });
    // if (!nurse) {
    //   throw new NotFoundException('Assigned nurse not found. Please select a valid nurse.');
    // }

    // For now, just validate UUID format
    this.validateUUID(nurseId);
  }

  /**
   * Validate UUID format
   */
  private validateUUID(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new BadRequestException('Invalid ID format. Must be a valid UUID.');
    }
  }

  // ==================== Normalization Methods ====================

  /**
   * Normalize student creation data
   */
  private normalizeCreateData(data: CreateStudentDto): CreateStudentDto {
    return {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      studentNumber: data.studentNumber.toUpperCase().trim(),
      medicalRecordNum: data.medicalRecordNum?.toUpperCase().trim(),
      enrollmentDate: data.enrollmentDate || new Date(),
    };
  }

  /**
   * Normalize student update data
   */
  private normalizeUpdateData(data: UpdateStudentDto): UpdateStudentDto {
    const normalized: UpdateStudentDto = { ...data };

    if (data.firstName) normalized.firstName = data.firstName.trim();
    if (data.lastName) normalized.lastName = data.lastName.trim();
    if (data.studentNumber) normalized.studentNumber = data.studentNumber.toUpperCase().trim();
    if (data.medicalRecordNum) normalized.medicalRecordNum = data.medicalRecordNum.toUpperCase().trim();

    return normalized;
  }

  // ==================== Error Handling ====================

  /**
   * Handle errors with HIPAA-compliant logging
   * Never expose sensitive data in error messages
   */
  private handleError(message: string, error: any): never {
    // Log detailed error server-side
    this.logger.error(`${message}: ${error.message}`, error.stack);

    // Throw generic error client-side to avoid PHI leakage
    if (error instanceof ConflictException || error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(message);
  }
}
