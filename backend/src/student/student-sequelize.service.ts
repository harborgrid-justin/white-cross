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
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '../database/models/student.model';

/**
 * Simplified DTOs for basic CRUD operations
 */
export interface CreateStudentDto {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  gender: string;
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
      });

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
   */
  async findAll(filterDto: StudentFilterDto = {}): Promise<{
    data: Student[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const {
        search,
        grade,
        nurseId,
        isActive,
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

      const offset = (page - 1) * limit;

      const { rows: data, count: total } = await this.studentModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      });

      const pages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        pages,
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
  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    try {
      const student = await this.findOne(id);

      // Check for duplicate student number if updating
      if (updateStudentDto.studentNumber && updateStudentDto.studentNumber !== student.studentNumber) {
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
      if (updateStudentDto.medicalRecordNum && updateStudentDto.medicalRecordNum !== student.medicalRecordNum) {
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
      if (error instanceof NotFoundException || error instanceof ConflictException) {
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
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch students by grade ${grade}: ${error.message}`);
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
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch students by nurse ${nurseId}: ${error.message}`);
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
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
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
}