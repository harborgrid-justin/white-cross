/**
 * @fileoverview Student Query Service
 * @module stude@/services/student-query.service
 * @description Handles search, filtering, and batch query operations
 */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student, User } from '@/database';
import { QueryCacheService } from '@/database/services';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { PaginatedResponse } from '../types';

/**
 * Student Query Service
 *
 * Provides query and search operations:
 * - Paginated student lists with filters
 * - Full-text search across student fields
 * - Find students by grade
 * - Find students assigned to nurses
 * - Batch operations for DataLoader
 * - Get all unique grades
 */
@Injectable()
export class StudentQueryService extends BaseService {

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly queryCacheService: QueryCacheService,
    @Optional() protected readonly requestContext?: RequestContextService,
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

  /**
   * Find all students with pagination and filters
   * Supports search, grade filtering, nurse filtering, and active status
   *
   * OPTIMIZATION: Added eager loading to prevent N+1 queries
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

      // Pagination
      const offset = (page - 1) * limit;

      // Execute query with eager loading to prevent N+1
      const { rows: data, count: total } = await this.studentModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false, // LEFT JOIN - include students without assigned nurse
          },
        ],
        attributes: {
          exclude: ['schoolId', 'districtId'],
        },
        distinct: true, // Prevent duplicate counts with JOINs
      });

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
   * Search students across all fields
   * Full-text search on firstName, lastName, studentNumber
   */
  async search(query: string, limit: number = 20): Promise<Student[]> {
    try {
      return await this.studentModel.findAll({
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
    } catch (error) {
      this.handleError('Failed to search students', error);
    }
  }

  /**
   * Get students by grade
   * Returns all active students in a specific grade
   *
   * OPTIMIZATION: Uses QueryCacheService with 5-minute TTL
   */
  async findByGrade(grade: string): Promise<Student[]> {
    try {
      return await this.queryCacheService.findWithCache(
        this.studentModel,
        {
          where: { grade, isActive: true },
          order: [
            ['lastName', 'ASC'],
            ['firstName', 'ASC'],
          ],
        },
        {
          ttl: 300, // 5 minutes - grade lists may change more frequently
          keyPrefix: 'student_grade',
          invalidateOn: ['create', 'update', 'destroy'],
        },
      );
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
      const result = await this.studentModel.findAll({
        attributes: [
          [
            this.studentModel.sequelize.fn('DISTINCT', this.studentModel.sequelize.col('grade')),
            'grade',
          ],
        ],
        where: { isActive: true },
        order: [['grade', 'ASC']],
        raw: true,
      });

      return result.map((r: any) => r.grade);
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
      this.validateUUID(nurseId, 'Nurse ID');

      return await this.studentModel.findAll({
        where: { nurseId, isActive: true },
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
    } catch (error) {
      this.handleError('Failed to fetch assigned students', error);
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
   * Batch find students by school IDs (for DataLoader)
   * Returns array of student arrays for each school ID
   *
   * OPTIMIZATION: Eliminates N+1 queries when fetching students for multiple schools
   */
  async findBySchoolIds(schoolIds: string[]): Promise<Student[][]> {
    try {
      const students = await this.studentModel.findAll({
        where: {
          schoolId: { [Op.in]: schoolIds },
          isActive: true,
        },
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
      });

      // Group students by school ID
      const studentsBySchool = new Map<string, Student[]>();
      students.forEach((student) => {
        const schoolId = student.schoolId;
        if (schoolId) {
          if (!studentsBySchool.has(schoolId)) {
            studentsBySchool.set(schoolId, []);
          }
          studentsBySchool.get(schoolId).push(student);
        }
      });

      // Return in same order as input, empty array for missing
      return schoolIds.map((id) => studentsBySchool.get(id) || []);
    } catch (error) {
      this.logger.error(`Failed to batch fetch students by school IDs: ${error.message}`);
      throw new InternalServerErrorException('Failed to batch fetch students by school IDs');
    }
  }
}
