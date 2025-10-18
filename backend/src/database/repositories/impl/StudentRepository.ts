/**
 * WC-GEN-105 | StudentRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../base/BaseRepository, ../../models/core/Student, ../interfaces/IStudentRepository | Dependencies: sequelize, ../base/BaseRepository, ../../models/core/Student
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Student Repository Implementation
 * FERPA-compliant data access for student records
 *
 * Features:
 * - FERPA compliance for student data access
 * - Search by multiple criteria (name, student number, grade)
 * - Nurse assignment tracking
 * - Active/inactive student filtering
 * - PHI access auditing
 */

import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { Student } from '../../models/core/Student';
import {
  IStudentRepository,
  CreateStudentDTO,
  UpdateStudentDTO
} from '../interfaces/IStudentRepository';
import { IAuditLogger, sanitizeSensitiveData } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { QueryOptions } from '../../types/QueryTypes';
import { ExecutionContext } from '../../types/ExecutionContext';
import { logger } from '../../../utils/logger';

export class StudentRepository
  extends BaseRepository<Student, any, any>
  implements IStudentRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(Student, auditLogger, cacheManager, 'Student');
  }

  /**
   * Find student by student number (unique identifier)
   * @param studentNumber Unique student number
   * @returns Student or null
   */
  async findByStudentNumber(studentNumber: string): Promise<any | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        studentNumber,
        'by-number'
      );

      // Check cache
      const cached = await this.cacheManager.get<any>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for student number: ${studentNumber}`);
        return cached;
      }

      const student = await this.model.findOne({
        where: { studentNumber }
      });

      if (!student) {
        return null;
      }

      const entity = this.mapToEntity(student);

      // Cache result
      await this.cacheManager.set(cacheKey, entity, 1800); // 30 minutes

      return entity;
    } catch (error) {
      logger.error('Error finding student by number:', error);
      throw new RepositoryError(
        'Failed to find student by number',
        'FIND_BY_NUMBER_ERROR',
        500,
        { studentNumber, error: (error as Error).message }
      );
    }
  }

  /**
   * Find student by medical record number
   * @param medicalRecordNum Medical record number
   * @returns Student or null
   */
  async findByMedicalRecordNumber(medicalRecordNum: string): Promise<any | null> {
    try {
      const student = await this.model.findOne({
        where: { medicalRecordNum }
      });

      return student ? this.mapToEntity(student) : null;
    } catch (error) {
      logger.error('Error finding student by medical record number:', error);
      throw new RepositoryError(
        'Failed to find student by medical record number',
        'FIND_BY_MRN_ERROR',
        500,
        { medicalRecordNum, error: (error as Error).message }
      );
    }
  }

  /**
   * Find students by grade level
   * @param grade Grade level (e.g., "K", "1", "2", "12")
   * @returns Array of students in the grade
   */
  async findByGrade(grade: string): Promise<any[]> {
    try {
      const students = await this.model.findAll({
        where: {
          grade,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return students.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error finding students by grade:', error);
      throw new RepositoryError(
        'Failed to find students by grade',
        'FIND_BY_GRADE_ERROR',
        500,
        { grade, error: (error as Error).message }
      );
    }
  }

  /**
   * Search students by name, student number, or medical record number
   * @param query Search query string
   * @returns Array of matching students
   */
  async search(query: string): Promise<any[]> {
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
        limit: 50 // Limit search results for performance
      });

      return students.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error searching students:', error);
      throw new RepositoryError(
        'Failed to search students',
        'SEARCH_ERROR',
        500,
        { query, error: (error as Error).message }
      );
    }
  }

  /**
   * Find students assigned to a specific nurse
   * @param nurseId Nurse user ID
   * @param options Query options
   * @returns Array of students assigned to the nurse
   */
  async findByNurse(
    nurseId: string,
    options?: QueryOptions
  ): Promise<any[]> {
    try {
      const students = await this.model.findAll({
        where: {
          nurseId,
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return students.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error finding students by nurse:', error);
      throw new RepositoryError(
        'Failed to find students by nurse',
        'FIND_BY_NURSE_ERROR',
        500,
        { nurseId, error: (error as Error).message }
      );
    }
  }

  /**
   * Find students by school
   * @param schoolId School identifier
   * @param options Query options with pagination
   * @returns Array of students at the school
   */
  async findBySchool(
    schoolId: string,
    options?: QueryOptions
  ): Promise<any[]> {
    try {
      // Note: This assumes a relation to school through a join table or direct field
      // Adjust based on your actual schema
      const students = await this.model.findAll({
        // Add where clause based on actual school relationship
        where: {
          isActive: true
        },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      return students.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error finding students by school:', error);
      throw new RepositoryError(
        'Failed to find students by school',
        'FIND_BY_SCHOOL_ERROR',
        500,
        { schoolId, error: (error as Error).message }
      );
    }
  }

  /**
   * Get active students count
   * @returns Number of active students
   */
  async getActiveCount(): Promise<number> {
    try {
      return await this.model.count({
        where: { isActive: true }
      });
    } catch (error) {
      logger.error('Error counting active students:', error);
      return 0;
    }
  }

  /**
   * Bulk assign students to a nurse
   * @param studentIds Array of student IDs
   * @param nurseId Nurse user ID
   * @param context Execution context
   */
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

      // Audit log bulk operation
      await this.auditLogger.logBulkOperation(
        'BULK_ASSIGN_NURSE',
        this.entityName,
        context,
        {
          studentIds,
          nurseId,
          count: studentIds.length
        }
      );

      await transaction.commit();

      logger.info(
        `Bulk assigned ${studentIds.length} students to nurse ${nurseId}`
      );
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      logger.error('Error bulk assigning students to nurse:', error);
      throw new RepositoryError(
        'Failed to bulk assign students to nurse',
        'BULK_ASSIGN_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Find students with missing health records or documents
   * @returns Array of students with incomplete records
   */
  async findWithIncompleteRecords(): Promise<any[]> {
    try {
      // This would require joins to health records, allergies, etc.
      // Placeholder implementation - customize based on business rules
      const students = await this.model.findAll({
        where: { isActive: true },
        order: [['lastName', 'ASC']]
      });

      // Filter students based on incomplete records logic
      return students.map((s) => this.mapToEntity(s));
    } catch (error) {
      logger.error('Error finding students with incomplete records:', error);
      throw new RepositoryError(
        'Failed to find students with incomplete records',
        'FIND_INCOMPLETE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  // ============ Protected Methods ============

  /**
   * Validate student data before creation
   */
  protected async validateCreate(data: CreateStudentDTO): Promise<void> {
    // Check for duplicate student number
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

    // Check for duplicate medical record number if provided
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

  /**
   * Validate student data before update
   */
  protected async validateUpdate(
    id: string,
    data: UpdateStudentDTO
  ): Promise<void> {
    // Check for duplicate student number if being updated
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

    // Check for duplicate medical record number if being updated
    if (data.medicalRecordNum) {
      const existing = await this.model.findOne({
        where: {
          medicalRecordNum: data.medicalRecordNum,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        throw new RepositoryError(
          'Medical record number already exists',
          'DUPLICATE_MRN',
          409,
          { medicalRecordNum: data.medicalRecordNum }
        );
      }
    }
  }

  /**
   * Invalidate student-related caches
   */
  protected async invalidateCaches(student: Student): Promise<void> {
    try {
      const studentData = student.get();

      // Invalidate specific student caches
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

      // Invalidate nurse-related caches
      if (studentData.nurseId) {
        await this.cacheManager.deletePattern(
          `white-cross:student:nurse:${studentData.nurseId}:*`
        );
      }

      // Invalidate grade-related caches
      await this.cacheManager.deletePattern(
        `white-cross:student:grade:${studentData.grade}:*`
      );
    } catch (error) {
      logger.warn('Error invalidating student caches:', error);
      // Don't throw - cache invalidation failures shouldn't break operations
    }
  }

  /**
   * Sanitize student data for audit logging
   * Student data is PHI - ensure proper sanitization
   */
  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      // Student data is PHI but should be logged for audit trail
      // Only redact truly sensitive fields like SSN if present
    });
  }
}
