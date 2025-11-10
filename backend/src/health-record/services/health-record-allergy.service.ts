/**
 * @fileoverview Health Record Allergy Service - Allergy Management
 * @module health-record/services
 * @description Service providing comprehensive allergy management operations.
 * Handles creation, retrieval, updating, and deletion of student allergies with
 * severity tracking and HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Allergy } from '../../database/models/allergy.model';
import { Student } from '../../database/models/student.model';

/**
 * HealthRecordAllergyService
 *
 * Provides comprehensive allergy management operations with severity tracking,
 * verification timestamps, and HIPAA-compliant audit logging.
 *
 * Responsibilities:
 * - Create and manage student allergies
 * - Track allergy severity levels
 * - Manage verification status and timestamps
 * - Provide ordered allergy lists by severity
 * - Critical allergy alerting
 */
@Injectable()
export class HealthRecordAllergyService {
  private readonly logger = new Logger(HealthRecordAllergyService.name);

  constructor(
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Add allergy to student with validation
   * @param data - Allergy creation data
   * @returns Created allergy record
   */
  async addAllergy(data: any): Promise<Allergy> {
    // Verify student exists
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check for duplicate
    const existingAllergy = await this.allergyModel.findOne({
      where: {
        studentId: data.studentId,
        allergen: data.allergen,
      },
    });

    if (existingAllergy) {
      throw new Error(
        `Allergy to ${data.allergen} already exists for this student`,
      );
    }

    // Create allergy with verification timestamp
    const allergyData = {
      ...data,
      verificationDate: data.verified ? new Date() : null,
    };
    const savedAllergy = await this.allergyModel.create(allergyData);

    // Reload with associations
    const allergyWithRelations = await this.allergyModel.findByPk(
      savedAllergy.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!allergyWithRelations) {
      throw new Error('Failed to reload allergy after creation');
    }

    // PHI Creation Audit Log - WARNING for critical allergies
    if (data.severity === 'LIFE_THREATENING' || data.severity === 'SEVERE') {
      this.logger.warn(
        `CRITICAL ALLERGY ADDED: ${data.allergen} (${data.severity}) for student ${student.firstName} ${student.lastName}`,
      );
    } else {
      this.logger.log(
        `Allergy added: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`,
      );
    }

    return allergyWithRelations;
  }

  /**
   * Update allergy information
   * @param id - Allergy UUID
   * @param data - Updated allergy data
   * @returns Updated allergy record
   */
  async updateAllergy(id: string, data: Partial<any>): Promise<Allergy> {
    const existingAllergy = await this.allergyModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Update verification timestamp if being verified
    const updateData: any = { ...data };
    if (data.verified && !existingAllergy.verified) {
      updateData.verificationDate = new Date();
    }

    // Update allergy
    await existingAllergy.update(updateData);

    // Reload with associations
    const allergyWithRelations = await this.allergyModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!allergyWithRelations) {
      throw new Error('Failed to reload allergy after update');
    }

    // PHI Modification Audit Log
    this.logger.log(
      `Allergy updated: ${allergyWithRelations.allergen} for ${allergyWithRelations.student!.firstName} ${allergyWithRelations.student!.lastName}`,
    );

    return allergyWithRelations;
  }

  /**
   * Get student allergies
   * @param studentId - Student UUID
   * @returns Array of allergies ordered by severity
   */
  async getStudentAllergies(studentId: string): Promise<Allergy[]> {
    const allergies = await this.allergyModel.findAll({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [
        ['severity', 'DESC'], // Most severe first
        ['allergen', 'ASC'],
      ],
    });

    // PHI Access Audit Log
    this.logger.log(
      `PHI Access: Allergies retrieved for student ${studentId}, count: ${allergies.length}`,
    );

    return allergies;
  }

  /**
   * Delete allergy (soft delete for HIPAA compliance)
   * @param id - Allergy UUID
   * @returns Success status
   */
  async deleteAllergy(id: string): Promise<{ success: boolean }> {
    const allergy = await this.allergyModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.allergyModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logger.warn(
      `Allergy deleted: ${allergy.allergen} for ${allergy.student?.firstName} ${allergy.student?.lastName}`,
    );

    return { success: true };
  }
}
