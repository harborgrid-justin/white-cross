/**
 * @fileoverview Student Repository
 * @module student/repositories/student.repository
 * @description Data access layer for Student entities
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '@/database/models';
import { User } from '@/database/models';
import { BaseRepository, BaseRepositoryConfig } from '../../shared/base/base.repository';
import { LoggerService } from '../../shared/logging/logger.service';
import { QueryCacheService } from '../../database/services/query-cache.service';

/**
 * Student Repository
 *
 * Handles all data access operations for Student entities with:
 * - Caching integration
 * - Standardized CRUD operations
 * - Transaction support
 * - Performance monitoring
 * - Audit logging
 */
@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly logger: LoggerService,
    private readonly cacheService?: QueryCacheService,
  ) {
    super({
      model: studentModel,
      logger,
      cacheService,
      enableCache: true,
      cacheTTL: 300, // 5 minutes
    });
  }

  /**
   * Find student with nurse information
   */
  async findWithNurse(id: string) {
    return this.findById(id, {
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
    });
  }

  /**
   * Find students by grade with pagination
   */
  async findByGradePaginated(grade: string, page: number = 1, limit: number = 20) {
    return this.findWithPagination({
      page,
      limit,
      where: { grade, isActive: true },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  /**
   * Find students by nurse with pagination
   */
  async findByNursePaginated(nurseId: string, page: number = 1, limit: number = 20) {
    return this.findWithPagination({
      page,
      limit,
      where: { nurseId, isActive: true },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  /**
   * Search students with pagination
   */
  async searchStudents(
    searchTerm: string,
    page: number = 1,
    limit: number = 20,
    additionalWhere: any = {},
  ) {
    return this.search(searchTerm, ['firstName', 'lastName', 'studentNumber'], {
      page,
      limit,
      where: { ...additionalWhere, isActive: true },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  /**
   * Get student statistics
   */
  async getStudentStats() {
    return this.getStats();
  }

  /**
   * Transfer student to different nurse
   */
  async transferToNurse(studentId: string, nurseId: string) {
    return this.updateById(studentId, { nurseId } as any);
  }

  /**
   * Deactivate student
   */
  async deactivateStudent(studentId: string) {
    return this.updateById(studentId, { isActive: false } as any);
  }

  /**
   * Reactivate student
   */
  async reactivateStudent(studentId: string) {
    return this.updateById(studentId, { isActive: true } as any);
  }

  /**
   * Bulk update students
   */
  async bulkUpdateStudents(updates: Array<{ id: string; data: Partial<Student> }>) {
    return this.bulkUpdate(updates);
  }

  /**
   * Get students for a specific school
   */
  async findBySchool(schoolId: string, page: number = 1, limit: number = 20) {
    return this.findWithPagination({
      page,
      limit,
      where: { schoolId, isActive: true },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  /**
   * Get students by gender
   */
  async findByGender(gender: string, page: number = 1, limit: number = 20) {
    return this.findWithPagination({
      page,
      limit,
      where: { gender, isActive: true },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC'],
      ],
    });
  }

  /**
   * Get recent students (created in last N days)
   */
  async findRecent(days: number = 30, page: number = 1, limit: number = 20) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.findWithPagination({
      page,
      limit,
      where: {
        createdAt: { $gte: since },
        isActive: true,
      },
      include: [
        {
          model: this.userModel,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
