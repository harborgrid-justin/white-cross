/**
 * Student Repository Implementation
 * Injectable NestJS repository for student data access
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import { IStudentRepository, StudentAttributes, CreateStudentDTO, UpdateStudentDTO } from '../interfaces/student.repository.interface';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { Student } from '../../models/student.model';

// Note: This assumes a Student model exists
// You'll need to create the actual Sequelize model
@Injectable()
export class StudentRepository
  extends BaseRepository<any, StudentAttributes, CreateStudentDTO>
  implements IStudentRepository
{
  constructor(
    @InjectModel(Student) model: typeof Student,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'Student');
  }

  async findByStudentNumber(studentNumber: string): Promise<StudentAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentNumber,
        'by-number'
      );

      const cached = await this.cacheManager.get<StudentAttributes>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for student number: ${studentNumber}`);
        return cached;
      }

      const student = await this.model.findOne({
        where: { studentNumber }
      });

      if (!student) {
        return null;
      }

      const entity = this.mapToEntity(student);
      await this.cacheManager.set(cacheKey, entity, 1800);

      return entity;
    } catch (error) {
      this.logger.error('Error finding student by number:', error);
      throw new RepositoryError(
        'Failed to find student by number',
        'FIND_BY_NUMBER_ERROR',
        500,
        { studentNumber, error: (error as Error).message }
      );
    }
  }

  async findByMedicalRecordNumber(medicalRecordNum: string): Promise<StudentAttributes | null> {
    try {
      const student = await this.model.findOne({
        where: { medicalRecordNum }
      });

      return student ? this.mapToEntity(student) : null;
    } catch (error) {
      this.logger.error('Error finding student by MRN:', error);
      throw new RepositoryError(
        'Failed to find student by medical record number',
        'FIND_BY_MRN_ERROR',
        500,
        { medicalRecordNum, error: (error as Error).message }
      );
    }
  }

  async findByGrade(grade: string): Promise<StudentAttributes[]> {
    try {
      const students = await this.model.findAll({
        where: {
          grade,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return students.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding students by grade:', error);
      throw new RepositoryError(
        'Failed to find students by grade',
        'FIND_BY_GRADE_ERROR',
        500,
        { grade, error: (error as Error).message }
      );
    }
  }

  async findByNurse(nurseId: string, options?: QueryOptions): Promise<StudentAttributes[]> {
    try {
      const students = await this.model.findAll({
        where: {
          nurseId,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return students.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding students by nurse:', error);
      throw new RepositoryError(
        'Failed to find students by nurse',
        'FIND_BY_NURSE_ERROR',
        500,
        { nurseId, error: (error as Error).message }
      );
    }
  }

  async search(query: string): Promise<StudentAttributes[]> {
    try {
      const searchTerm = `%${query}%`;

      const students = await this.model.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: searchTerm } },
            { lastName: { [Op.iLike]: searchTerm } },
            { studentNumber: { [Op.iLike]: searchTerm } },
            { medicalRecordNum: { [Op.iLike]: searchTerm } }
          ],
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']],
        limit: 50
      });

      return students.map((s: any) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error searching students:', error);
      throw new RepositoryError(
        'Failed to search students',
        'SEARCH_ERROR',
        500,
        { query, error: (error as Error).message }
      );
    }
  }

  async getActiveCount(): Promise<number> {
    try {
      return await this.model.count({
        where: { isActive: true }
      });
    } catch (error) {
      this.logger.error('Error counting active students:', error);
      return 0;
    }
  }

  async bulkAssignToNurse(
    studentIds: string[],
    nurseId: string,
    context: ExecutionContext
  ): Promise<void> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      await this.model.update(
        { nurseId },
        {
          where: { id: { [Op.in]: studentIds } },
          transaction
        }
      );

      await this.auditLogger.logBulkOperation(
        'BULK_ASSIGN_NURSE',
        this.entityName,
        context,
        { studentIds, nurseId, count: studentIds.length }
      );

      await transaction.commit();

      this.logger.log(`Bulk assigned ${studentIds.length} students to nurse ${nurseId}`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error('Error bulk assigning students:', error);
      throw new RepositoryError(
        'Failed to bulk assign students to nurse',
        'BULK_ASSIGN_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateStudentDTO): Promise<void> {
    const existing = await this.model.findOne({
      where: { studentNumber: data.studentNumber }
    });

    if (existing) {
      throw new RepositoryError(
        'Student number already exists',
        'DUPLICATE_STUDENT_NUMBER',
        409,
        { studentNumber: data.studentNumber }
      );
    }

    if (data.medicalRecordNum) {
      const existingMRN = await this.model.findOne({
        where: { medicalRecordNum: data.medicalRecordNum }
      });

      if (existingMRN) {
        throw new RepositoryError(
          'Medical record number already exists',
          'DUPLICATE_MRN',
          409,
          { medicalRecordNum: data.medicalRecordNum }
        );
      }
    }
  }

  protected async validateUpdate(id: string, data: UpdateStudentDTO): Promise<void> {
    if (data.studentNumber) {
      const existing = await this.model.findOne({
        where: {
          studentNumber: data.studentNumber,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        throw new RepositoryError(
          'Student number already exists',
          'DUPLICATE_STUDENT_NUMBER',
          409,
          { studentNumber: data.studentNumber }
        );
      }
    }
  }

  protected async invalidateCaches(student: any): Promise<void> {
    try {
      const studentData = student.get();

      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, studentData.id)
      );

      if (studentData.studentNumber) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            studentData.studentNumber,
            'by-number'
          )
        );
      }

      if (studentData.nurseId) {
        await this.cacheManager.deletePattern(
          `white-cross:student:nurse:${studentData.nurseId}:*`
        );
      }

      await this.cacheManager.deletePattern(
        `white-cross:student:grade:${studentData.grade}:*`
      );
    } catch (error) {
      this.logger.warn('Error invalidating student caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data
      // Student data is PHI but should be logged for audit trail
    });
  }
}


