/**
 * @fileoverview Health Record Chronic Condition Service
 * @module health-record/services
 * @description Service providing comprehensive chronic condition management operations.
 * Handles creation, retrieval, updating, and deletion of chronic conditions with
 * status tracking and HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChronicCondition   } from "../../database/models";
import { Student   } from "../../database/models";

import { BaseService } from '../../common/base';
/**
 * HealthRecordChronicConditionService
 *
 * Provides comprehensive chronic condition management operations with status tracking,
 * diagnosis dates, and HIPAA-compliant audit logging.
 *
 * Responsibilities:
 * - Create and manage student chronic conditions
 * - Track condition status and diagnosis dates
 * - Filter active/inactive conditions
 * - Provide ordered condition lists
 */
@Injectable()
export class HealthRecordChronicConditionService extends BaseService {
  constructor(
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Add chronic condition to student with validation and audit logging
   * @param data - Chronic condition creation data
   * @returns Created chronic condition record
   */
  async addChronicCondition(data: any): Promise<ChronicCondition> {
    // Verify student exists
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Create chronic condition
    const conditionData = {
      ...data,
      isActive: true,
    };
    const savedCondition =
      await this.chronicConditionModel.create(conditionData);

    // Reload with associations
    const conditionWithRelations = await this.chronicConditionModel.findByPk(
      savedCondition.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!conditionWithRelations) {
      throw new Error('Failed to reload chronic condition after creation');
    }

    // PHI Creation Audit Log
    this.logInfo(
      `PHI Created: Chronic condition ${data.condition} for student ${student.firstName} ${student.lastName}`,
    );

    return conditionWithRelations;
  }

  /**
   * Get student chronic conditions with filtering
   * @param studentId - Student UUID
   * @returns Array of chronic conditions ordered by severity
   */
  async getStudentChronicConditions(studentId: string): Promise<any[]> {
    const conditions = await this.chronicConditionModel.findAll({
      where: { studentId, isActive: true },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [
        ['status', 'ASC'],
        ['diagnosedDate', 'DESC'],
      ],
    });

    // PHI Access Audit Log
    this.logInfo(
      `PHI Access: Chronic conditions retrieved for student ${studentId}, count: ${conditions.length}`,
    );

    return conditions;
  }

  /**
   * Update chronic condition information
   * @param id - Chronic condition UUID
   * @param data - Updated chronic condition data
   * @returns Updated chronic condition record
   */
  async updateChronicCondition(
    id: string,
    data: Partial<any>,
  ): Promise<ChronicCondition> {
    const existingCondition = await this.chronicConditionModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingCondition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Update chronic condition
    await existingCondition.update(data);

    // Reload with associations
    const conditionWithRelations = await this.chronicConditionModel.findByPk(
      id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!conditionWithRelations) {
      throw new Error('Failed to reload chronic condition after update');
    }

    // PHI Modification Audit Log
    this.logInfo(
      `PHI Modified: Chronic condition ${conditionWithRelations.condition} updated for student ${conditionWithRelations.studentId}`,
    );

    return conditionWithRelations;
  }

  /**
   * Delete chronic condition (soft delete for HIPAA compliance)
   * @param id - Chronic condition UUID
   * @returns Success status
   */
  async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    const condition = await this.chronicConditionModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.chronicConditionModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logWarning(
      `Chronic condition deleted: ${condition.condition} for student ${condition.studentId}`,
    );

    return { success: true };
  }
}
