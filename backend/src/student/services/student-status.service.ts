/**
 * @fileoverview Student Status Service
 * @module student/services/student-status.service
 * @description Business logic for student status management operations
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '@/database';
import { TransferStudentDto } from '../dto';

/**
 * Student Status Service
 *
 * Handles student status management operations:
 * - Deactivate/reactivate students
 * - Transfer students between schools
 */
@Injectable()
export class StudentStatusService {
  private readonly logger = new Logger(StudentStatusService.name);

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Deactivate a student
   */
  async deactivate(id: string, reason?: string): Promise<Student> {
    try {
      const student = await this.studentModel.findByPk(id);

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      await student.update({
        isActive: false,
        deactivationReason: reason,
        deactivatedAt: new Date(),
      });

      this.logger.log(`Student deactivated: ${id}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deactivating student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reactivate a student
   */
  async reactivate(id: string): Promise<Student> {
    try {
      const student = await this.studentModel.findByPk(id);

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      await student.update({
        isActive: true,
        deactivationReason: null,
        deactivatedAt: null,
      });

      this.logger.log(`Student reactivated: ${id}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error reactivating student ${id}:`, error);
      throw error;
    }
  }

  /**
   * Transfer a student to another school
   */
  async transfer(id: string, transferDto: TransferStudentDto): Promise<Student> {
    try {
      const student = await this.studentModel.findByPk(id);

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      await student.update({
        grade: transferDto.grade,
        assignedNurseId: transferDto.nurseId,
        transferDate: new Date(),
        transferReason: transferDto.reason,
      });

      this.logger.log(`Student transferred: ${id} to school ${transferDto.newSchoolId}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error transferring student ${id}:`, error);
      throw error;
    }
  }
}
