/**
 * @fileoverview Student Service - Sequelize Implementation
 * @module student/student-sequelize.service
 * @description Business logic for student management with HIPAA compliance using Sequelize
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Student, Gender } from '../database/models/student.model';

/**
 * Simplified DTOs for basic CRUD operations
 */
export interface CreateStudentDto {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive?: boolean;
  enrollmentDate?: Date;
  nurseId?: string;
  schoolId?: string;
  districtId?: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

export interface StudentFilterDto {
  search?: string;
  grade?: string;
  nurseId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  gender?: Gender;
}

/**
 * Transfer Student DTO
 */
export interface TransferStudentDto {
  nurseId?: string;
  grade?: string;
  reason?: string;
}

/**
 * Bulk Update DTO
 */
export interface BulkUpdateDto {
  studentIds: string[];
  nurseId?: string;
  grade?: string;
  isActive?: boolean;
}

/**
 * Paginated Response Interface
 */
export interface PaginatedResponse<T> {
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
export interface StudentStatistics {
  healthRecords: number;
  allergies: number;
  medications: number;
  appointments: number;
  incidents: number;
}

/**
 * Student Data Export Interface
 */
export interface StudentDataExport {
  exportDate: string;
  student: Student;
  statistics: StudentStatistics;
}

/**
 * Student Service - Sequelize Implementation
 * Provides basic CRUD operations for students using Sequelize ORM
 */
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create a new student
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      // Check for duplicate student number
      const existingByNumber = await this.studentModel.findOne({
        where: { studentNumber: createStudentDto.studentNumber },
      });

      if (existingByNumber) {
        throw new ConflictException(
          `Student with number ${createStudentDto.studentNumber} already exists`,
        );
      }

      // Check for duplicate medical record number if provided
      if (createStudentDto.medicalRecordNum) {
        const existingByMedical = await this.studentModel.findOne({
          where: { medicalRecordNum: createStudentDto.medicalRecordNum },
        });

        if (existingByMedical) {
          throw new ConflictException(
            `Student with medical record number ${createStudentDto.medicalRecordNum} already exists`,
          );
        }
      }

      const student = await this.studentModel.create({
        ...createStudentDto,
        isActive: createStudentDto.isActive ?? true,
        enrollmentDate: createStudentDto.enrollmentDate ?? new Date(),
      } as any);

      this.logger.log(`Student created: ${student.id}`);
      return student;
    } catch (error) {
      this.logger.error(`Failed to create student: ${error.message}`);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create student');
    }
  }

  /**
   * Find all students with filtering and pagination
   * OPTIMIZED: Added eager loading for nurse and school relations to prevent N+1 queries
   */
  async findAll(
    filterDto: StudentFilterDto = {},
  ): Promise<PaginatedResponse<Student>> {
    try {
      const {
        search,
        grade,
        nurseId,
        isActive,
        gender,
        page = 1,
        limit = 20,
      } = filterDto;

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

      if (nurseId) {
        where.nurseId = nurseId;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (gender) {
        where.gender = gender;
      }

      const offset = (page - 1) * limit;

      const { rows: data, count: total } =
        await this.studentModel.findAndCountAll({
          where,
          limit,
          offset,
          order: [
            ['lastName', 'ASC'],
            ['firstName', 'ASC'],
          ],
          // OPTIMIZATION: Eager load related entities to prevent N+1 queries
          // Before: 1 query + N queries for nurse + N queries for school = 1 + 2N queries
          // After: 1 query with JOINs = 1 query total
          include: [
            {
              association: 'nurse',
              attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
              required: false, // LEFT JOIN to include students without assigned nurse
            },
            {
              association: 'school',
              attributes: ['id', 'name', 'districtId'],
              required: false, // LEFT JOIN to include students without assigned school
            },
          ],
          // Prevent duplicate counts when using includes
          distinct: true,
        });

      const pages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch students: ${error.message}`);
      throw new BadRequestException('Failed to fetch students');
    }
  }

  /**
   * Find one student by ID
   */
  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentModel.findByPk(id);

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error) {
      this.logger.error(`Failed to fetch student ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch student');
    }
  }

  /**
   * Batch find students by IDs (for DataLoader)
   * Returns students in the same order as requested IDs
   */
  async findByIds(ids: string[]): Promise<(Student | null)[]> {
    try {
      const students = await this.studentModel.findAll({
        where: {
          id: { [Op.in]: ids },
        },
      });

      // Create a map for O(1) lookup
      const studentMap = new Map(students.map((s) => [s.id, s]));

      // Return in same order as requested IDs, null for missing
      return ids.map((id) => studentMap.get(id) || null);
    } catch (error) {
      this.logger.error(`Failed to batch fetch students: ${error.message}`);
      throw new BadRequestException('Failed to batch fetch students');
    }
  }

  /**
   * Find student by student number
   */
  async findByStudentNumber(studentNumber: string): Promise<Student> {
    try {
      const student = await this.studentModel.findOne({
        where: { studentNumber },
      });

      if (!student) {
        throw new NotFoundException(
          `Student with number ${studentNumber} not found`,
        );
      }

      return student;
    } catch (error) {
      this.logger.error(
        `Failed to fetch student by number ${studentNumber}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch student');
    }
  }

  /**
   * Update a student
   */
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const student = await this.findOne(id);

      // Check for duplicate student number if updating
      if (
        updateStudentDto.studentNumber &&
        updateStudentDto.studentNumber !== student.studentNumber
      ) {
        const existingByNumber = await this.studentModel.findOne({
          where: {
            studentNumber: updateStudentDto.studentNumber,
            id: { [Op.ne]: id },
          },
        });

        if (existingByNumber) {
          throw new ConflictException(
            `Student with number ${updateStudentDto.studentNumber} already exists`,
          );
        }
      }

      // Check for duplicate medical record number if updating
      if (
        updateStudentDto.medicalRecordNum &&
        updateStudentDto.medicalRecordNum !== student.medicalRecordNum
      ) {
        const existingByMedical = await this.studentModel.findOne({
          where: {
            medicalRecordNum: updateStudentDto.medicalRecordNum,
            id: { [Op.ne]: id },
          },
        });

        if (existingByMedical) {
          throw new ConflictException(
            `Student with medical record number ${updateStudentDto.medicalRecordNum} already exists`,
          );
        }
      }

      await student.update(updateStudentDto);

      this.logger.log(`Student updated: ${student.id}`);
      return student;
    } catch (error) {
      this.logger.error(`Failed to update student ${id}: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update student');
    }
  }

  /**
   * Soft delete a student (mark as inactive)
   */
  async remove(id: string): Promise<void> {
    try {
      const student = await this.findOne(id);

      await student.update({ isActive: false });

      this.logger.log(`Student soft deleted: ${student.id}`);
    } catch (error) {
      this.logger.error(`Failed to delete student ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete student');
    }
  }

  /**
   * Activate a student
   */
  async activate(id: string): Promise<Student> {
    try {
      const student = await this.findOne(id);

      await student.update({ isActive: true });

      this.logger.log(`Student activated: ${student.id}`);
      return student;
    } catch (error) {
      this.logger.error(`Failed to activate student ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to activate student');
    }
  }

  /**
   * Get students by grade
   */
  async findByGrade(grade: string): Promise<Student[]> {
    try {
      return await this.studentModel.findAll({
        where: {
          grade,
          isActive: true,
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch students by grade ${grade}: ${error.message}`,
      );
      throw new BadRequestException('Failed to fetch students by grade');
    }
  }

  /**
   * Get students by nurse
   */
  async findByNurse(nurseId: string): Promise<Student[]> {
    try {
      return await this.studentModel.findAll({
        where: {
          nurseId,
          isActive: true,
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch students by nurse ${nurseId}: ${error.message}`,
      );
      throw new BadRequestException('Failed to fetch students by nurse');
    }
  }

  /**
   * Search students by name
   */
  async search(query: string): Promise<Student[]> {
    try {
      return await this.studentModel.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            { studentNumber: { [Op.iLike]: `%${query}%` } },
          ],
          isActive: true,
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        limit: 50,
      });
    } catch (error) {
      this.logger.error(`Failed to search students: ${error.message}`);
      throw new BadRequestException('Failed to search students');
    }
  }

  /**
   * Get student count by status
   */
  async getCount(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const total = await this.studentModel.count();
      const active = await this.studentModel.count({
        where: { isActive: true },
      });
      const inactive = total - active;

      return {
        total,
        active,
        inactive,
      };
    } catch (error) {
      this.logger.error(`Failed to get student count: ${error.message}`);
      throw new BadRequestException('Failed to get student count');
    }
  }

  // ==================== Student Management Operations ====================

  /**
   * Deactivate a student (soft delete with reason)
   * Sets isActive to false and logs the reason for HIPAA audit trail
   *
   * @param id - Student UUID
   * @param reason - Optional reason for deactivation (for audit trail)
   * @returns Updated student record
   */
  async deactivate(id: string, reason?: string): Promise<Student> {
    try {
      const student = await this.findOne(id);

      await student.update({ isActive: false });

      this.logger.log(
        `Student deactivated: ${student.id} (${student.studentNumber})${reason ? ` - Reason: ${reason}` : ''}`,
      );

      return student;
    } catch (error) {
      this.logger.error(`Failed to deactivate student ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to deactivate student');
    }
  }

  /**
   * Reactivate a student (restore soft delete)
   * Sets isActive to true with HIPAA audit logging
   *
   * @param id - Student UUID
   * @returns Updated student record
   */
  async reactivate(id: string): Promise<Student> {
    try {
      const student = await this.findOne(id);

      await student.update({ isActive: true });

      this.logger.log(
        `Student reactivated: ${student.id} (${student.studentNumber})`,
      );

      return student;
    } catch (error) {
      this.logger.error(`Failed to reactivate student ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to reactivate student');
    }
  }

  /**
   * Transfer student to different nurse or grade
   * Updates nurse assignment and/or grade level with audit trail
   *
   * @param id - Student UUID
   * @param transferDto - Transfer details (nurseId, grade, reason)
   * @returns Updated student record
   */
  async transfer(
    id: string,
    transferDto: TransferStudentDto,
  ): Promise<Student> {
    try {
      const student = await this.findOne(id);

      const updates: Partial<Student> = {};

      // Update nurse if provided
      if (transferDto.nurseId !== undefined) {
        updates.nurseId = transferDto.nurseId;
      }

      // Update grade if provided
      if (transferDto.grade !== undefined) {
        updates.grade = transferDto.grade;
      }

      if (Object.keys(updates).length === 0) {
        throw new BadRequestException(
          'No transfer updates provided (nurseId or grade required)',
        );
      }

      await student.update(updates);

      this.logger.log(
        `Student transferred: ${student.id} (${student.studentNumber})${transferDto.reason ? ` - Reason: ${transferDto.reason}` : ''}`,
      );

      return student;
    } catch (error) {
      this.logger.error(`Failed to transfer student ${id}: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to transfer student');
    }
  }

  /**
   * Bulk update multiple students
   * Applies same updates to multiple students at once
   * OPTIMIZED: Wrapped in transaction for data integrity and atomic updates
   *
   * @param bulkUpdateDto - Student IDs and update fields
   * @returns Count of updated students
   */
  async bulkUpdate(bulkUpdateDto: BulkUpdateDto): Promise<{ updated: number }> {
    // OPTIMIZATION: Use transaction to ensure all-or-nothing update
    // Prevents partial updates if some records fail validation or constraints
    return await this.sequelize.transaction(async (transaction) => {
      try {
        const { studentIds, nurseId, grade, isActive } = bulkUpdateDto;

        if (!studentIds || studentIds.length === 0) {
          throw new BadRequestException('Student IDs array cannot be empty');
        }

        // Build update object
        const updates: any = {};
        if (nurseId !== undefined) updates.nurseId = nurseId;
        if (grade !== undefined) updates.grade = grade;
        if (isActive !== undefined) updates.isActive = isActive;

        if (Object.keys(updates).length === 0) {
          throw new BadRequestException(
            'No update fields provided (nurseId, grade, or isActive required)',
          );
        }

        // OPTIMIZATION: Single bulk update operation instead of N individual updates
        // Before: N separate UPDATE queries (one per student)
        // After: 1 UPDATE query with WHERE IN clause
        const [affectedCount] = await this.studentModel.update(updates, {
          where: { id: { [Op.in]: studentIds } },
          transaction, // Include in transaction for rollback capability
        });

        this.logger.log(
          `Bulk update completed: ${affectedCount} students updated (${Object.keys(updates).join(', ')})`,
        );

        return { updated: affectedCount };
      } catch (error) {
        this.logger.error(`Failed to bulk update students: ${error.message}`);
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('Failed to bulk update students');
      }
    });
  }

  // ==================== Query Operations ====================

  /**
   * Get all unique grades
   * Returns list of all grade levels currently in use by active students
   *
   * @returns Array of grade strings sorted alphabetically
   */
  async findAllGrades(): Promise<string[]> {
    try {
      const results = await this.studentModel.findAll({
        attributes: [
          [
            this.studentModel.sequelize!.fn(
              'DISTINCT',
              this.studentModel.sequelize!.col('grade'),
            ),
            'grade',
          ],
        ],
        where: { isActive: true },
        order: [['grade', 'ASC']],
        raw: true,
      });

      const grades = results
        .map((r: any) => r.grade)
        .filter((g: any) => g !== null);

      this.logger.log(`Retrieved ${grades.length} unique grades`);

      return grades;
    } catch (error) {
      this.logger.error(`Failed to fetch grades: ${error.message}`);
      throw new BadRequestException('Failed to fetch grades');
    }
  }

  /**
   * Get students assigned to a specific nurse
   * Returns all active students for a nurse with limited fields
   *
   * @param nurseId - Nurse UUID
   * @returns Array of students assigned to the nurse
   */
  async findAssignedStudents(nurseId: string): Promise<Student[]> {
    try {
      // Validate UUID format
      if (!this.isValidUUID(nurseId)) {
        throw new BadRequestException('Invalid nurse ID format (must be UUID)');
      }

      const students = await this.studentModel.findAll({
        where: {
          nurseId,
          isActive: true,
        },
        attributes: [
          'id',
          'studentNumber',
          'firstName',
          'lastName',
          'grade',
          'dateOfBirth',
          'gender',
          'photo',
        ],
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });

      this.logger.log(
        `Retrieved ${students.length} students assigned to nurse ${nurseId}`,
      );

      return students;
    } catch (error) {
      this.logger.error(
        `Failed to fetch assigned students for nurse ${nurseId}: ${error.message}`,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch assigned students');
    }
  }

  // ==================== Analytics & Export Operations ====================

  /**
   * Get student statistics
   * Aggregates counts for health records, allergies, medications, etc.
   *
   * NOTE: Currently returns placeholder data. Implement when related modules are available:
   * - HealthRecord module for healthRecords count
   * - Allergy module for allergies count
   * - Medication module for medications count
   * - Appointment module for appointments count
   * - Incident module for incidents count
   *
   * @param studentId - Student UUID
   * @returns Statistics object with counts
   */
  async getStatistics(studentId: string): Promise<StudentStatistics> {
    try {
      // Verify student exists
      await this.findOne(studentId);

      // TODO: Implement actual counts when related modules are integrated
      // For now, return placeholder data
      const statistics: StudentStatistics = {
        healthRecords: 0,
        allergies: 0,
        medications: 0,
        appointments: 0,
        incidents: 0,
      };

      this.logger.log(`Statistics retrieved for student: ${studentId}`);

      return statistics;
    } catch (error) {
      this.logger.error(
        `Failed to get statistics for student ${studentId}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get student statistics');
    }
  }

  /**
   * Export student data
   * Generates comprehensive data export for compliance and reporting
   * OPTIMIZED: Parallelized independent queries for faster execution
   *
   * @param studentId - Student UUID
   * @returns Export object with student data and statistics
   */
  async exportData(studentId: string): Promise<StudentDataExport> {
    try {
      // OPTIMIZATION: Execute independent queries in parallel using Promise.all
      // Before: Sequential execution - findOne waits, then getStatistics waits = Total time
      // After: Parallel execution - both queries run simultaneously = Max(query1, query2) time
      const [student, statistics] = await Promise.all([
        this.findOne(studentId),
        this.getStatistics(studentId),
      ]);

      const exportData: StudentDataExport = {
        exportDate: new Date().toISOString(),
        student,
        statistics,
      };

      this.logger.log(
        `Data export completed for student: ${studentId} (${student.studentNumber})`,
      );

      return exportData;
    } catch (error) {
      this.logger.error(
        `Failed to export data for student ${studentId}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to export student data');
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Validate UUID format
   *
   * @param id - String to validate
   * @returns true if valid UUID v4, false otherwise
   */
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
