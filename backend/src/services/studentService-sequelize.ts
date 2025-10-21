/**
 * LOC: 860393B048
 * WC-GEN-293 | studentService-sequelize.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - Student.ts (database/models/core/Student.ts)
 *   - User.ts (database/models/core/User.ts)
 *   - BaseService.ts (database/services/BaseService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-293 | studentService-sequelize.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../database/models/core/Student, ../database/models/core/User, ../database/services/BaseService | Dependencies: ../database/models/core/Student, ../database/models/core/User, ../database/services/BaseService
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Student } from '../database/models/core/Student';
import { User } from '../database/models/core/User';
import { BaseService } from '../database/services/BaseService';
import { Op } from 'sequelize';

class StudentService extends BaseService<Student> {
  constructor() {
    super(Student);
  }

  async getStudents(filters: any = {}, pagination: { page?: number; limit?: number } = {}) {
    const where = this.buildWhereClause(filters);
    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const offset = (page - 1) * limit;

    return await Student.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit,
      offset,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
  }

  async getStudentById(id: string) {
    return await this.findById(id, {
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async createStudent(data: any) {
    return await this.create(data);
  }

  async updateStudent(id: string, data: any) {
    return await this.update(id, data);
  }

  async deleteStudent(id: string) {
    return await this.delete(id);
  }

  async searchStudents(searchTerm: string) {
    return await Student.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } },
          { studentNumber: { [Op.iLike]: `%${searchTerm}%` } },
        ],
        isActive: true,
      },
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      limit: 50,
    });
  }

  async getStudentsByNurse(nurseId: string) {
    return await Student.findAll({
      where: { nurseId, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
  }

  async getStudentsByGrade(grade: string) {
    return await Student.findAll({
      where: { grade, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    });
  }
}

export const studentService = new StudentService();
