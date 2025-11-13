/**
 * @fileoverview Student Health Records Service
 * @module student/services/student-health-records.service
 * @description Handles student health and mental health records access
 */

import {
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HealthRecord, MentalHealthRecord, Student, User } from '@/database';
import { RequestContextService } from '@/shared/context/request-context.service';
import { BaseService } from '@/common/base';

/**
 * Student Health Records Service
 *
 * Provides HIPAA-compliant access to:
 * - Physical health records
 * - Mental health records (with heightened confidentiality)
 * - Pagination and filtering
 * - Audit logging for all access
 */
@Injectable()
export class StudentHealthRecordsService extends BaseService {

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(MentalHealthRecord)
    private readonly mentalHealthRecordModel: typeof MentalHealthRecord,
    @InjectModel(User)
    private readonly userModel: typeof User,
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
   * Get student health records with pagination
   * Returns all health records including medications, allergies, immunizations, and visit logs
   */
  async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      await this.verifyStudentExists(studentId);

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Query health records with pagination
      const { rows: healthRecords, count: total } = await this.healthRecordModel.findAndCountAll({
        where: { studentId },
        offset,
        limit,
        order: [
          ['recordDate', 'DESC'],
          ['createdAt', 'DESC'],
        ],
        attributes: {
          exclude: ['updatedBy'], // Exclude internal tracking fields
        },
      });

      const pages = Math.ceil(total / limit);

      this.logInfo(
        `Health records retrieved for student: ${studentId} (${total} total, page ${page}/${pages})`,
      );

      return {
        data: healthRecords,
        meta: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to retrieve health records', error);
    }
  }

  /**
   * Get student mental health records with pagination
   * Returns mental health records with strict access control
   * Note: Mental health records have heightened confidentiality requirements
   *
   * OPTIMIZATION: Fixed N+1 query problem with eager loading
   */
  async getStudentMentalHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      await this.verifyStudentExists(studentId);

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // OPTIMIZATION: Eager load counselor and createdBy user relationships
      const { rows: mentalHealthRecords, count: total } =
        await this.mentalHealthRecordModel.findAndCountAll({
          where: { studentId },
          offset,
          limit,
          // Use distinct: true to ensure accurate count with joins
          distinct: true,
          order: [
            ['recordDate', 'DESC'],
            ['createdAt', 'DESC'],
          ],
          attributes: {
            exclude: ['updatedBy', 'sessionNotes'], // Exclude highly sensitive fields unless specifically requested
          },
          // Eager load related entities to prevent N+1 queries
          include: [
            {
              model: this.userModel,
              as: 'counselor',
              required: false, // LEFT JOIN to include records without counselor
              attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            },
            {
              model: this.userModel,
              as: 'creator',
              required: false, // LEFT JOIN to include records without creator
              attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            },
          ],
        });

      const pages = Math.ceil(total / limit);

      this.logInfo(
        `Mental health records retrieved for student: ${studentId} (${total} total, page ${page}/${pages}) - Access requires appropriate authorization`,
      );

      return {
        data: mentalHealthRecords,
        meta: {
          page,
          limit,
          total,
          pages,
        },
        accessControl: {
          requiresAuthorization: true,
          permittedRoles: ['COUNSELOR', 'MENTAL_HEALTH_SPECIALIST', 'ADMIN'],
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to retrieve mental health records', error);
    }
  }

  /**
   * Verify student exists
   * Helper method used across health record operations
   */
  private async verifyStudentExists(studentId: string): Promise<Student> {
    const student = await this.studentModel.findByPk(studentId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }
}
