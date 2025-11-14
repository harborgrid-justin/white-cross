/**
 * @fileoverview Student Status Service
 * @module services/student/student-status.service
 * @description Business logic for student status management operations
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '@/database';
import { TransferStudentDto } from '../dto/transfer-student.dto';

import { BaseService } from '@/common/base';
/**
 * Student Status Service
 *
 * Handles student status management operations:
 * - Deactivate/reactivate students
 * - Transfer students between schools
 */
@Injectable()
export class StudentStatusService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {
    super('StudentStatusService');
  }

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

      this.logInfo(`Student deactivated: ${id}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(`Error deactivating student ${id}:`, error);
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

      this.logInfo(`Student reactivated: ${id}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(`Error reactivating student ${id}:`, error);
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

      this.logInfo(`Student transferred: ${id} to school ${transferDto.newSchoolId}`);
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logError(`Error transferring student ${id}:`, error);
      throw error;
    }
  }
}
