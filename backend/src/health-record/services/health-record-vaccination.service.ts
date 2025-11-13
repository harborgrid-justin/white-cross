/**
 * @fileoverview Health Record Vaccination Service
 * @module health-record/services
 * @description Service providing comprehensive vaccination management operations.
 * Handles creation, retrieval, updating, and deletion of vaccinations with
 * series tracking and HIPAA-compliant audit logging.
 *
 * HIPAA CRITICAL - This service manages Protected Health Information (PHI)
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vaccination   } from '@/database/models';
import { Student   } from '@/database/models';

import { BaseService } from '@/common/base';
/**
 * HealthRecordVaccinationService
 *
 * Provides comprehensive vaccination management operations with series tracking,
 * dose counting, and HIPAA-compliant audit logging.
 *
 * Responsibilities:
 * - Create and manage student vaccinations
 * - Track vaccination series completion
 * - Manage dose numbers and schedules
 * - Provide ordered vaccination lists
 */
@Injectable()
export class HealthRecordVaccinationService extends BaseService {
  constructor(
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  /**
   * Add vaccination to student with validation and audit logging
   * @param data - Vaccination creation data
   * @returns Created vaccination record
   */
  async addVaccination(data: any): Promise<Vaccination> {
    // Verify student exists
    const student = await this.studentModel.findByPk(data.studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Calculate series completion
    const seriesComplete =
      data.doseNumber && data.totalDoses
        ? data.doseNumber >= data.totalDoses
        : false;

    // Create vaccination
    const vaccinationData = {
      ...data,
      seriesComplete,
    };
    const savedVaccination =
      await this.vaccinationModel.create(vaccinationData);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(
      savedVaccination.id,
      {
        include: [{ model: this.studentModel, as: 'student' }],
      },
    );

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after creation');
    }

    // PHI Creation Audit Log
    this.logInfo(
      `PHI Created: Vaccination ${data.vaccineName} for student ${student.firstName} ${student.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Get student vaccinations
   * @param studentId - Student UUID
   * @returns Array of vaccinations ordered by administration date
   */
  async getStudentVaccinations(studentId: string): Promise<Vaccination[]> {
    const vaccinations = await this.vaccinationModel.findAll({
      where: { studentId },
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['administrationDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(
      `PHI Access: Vaccinations retrieved for student ${studentId}, count: ${vaccinations.length}`,
    );

    return vaccinations;
  }

  /**
   * Update vaccination information
   * @param id - Vaccination UUID
   * @param data - Updated vaccination data
   * @returns Updated vaccination record
   */
  async updateVaccination(
    id: string,
    data: Partial<any>,
  ): Promise<Vaccination> {
    const existingVaccination = await this.vaccinationModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!existingVaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Recalculate series completion if dose information updated
    const updateData = { ...data };
    if (data.doseNumber || data.totalDoses) {
      const doseNumber = data.doseNumber || existingVaccination.doseNumber;
      const totalDoses = data.totalDoses || existingVaccination.totalDoses;
      if (doseNumber && totalDoses) {
        updateData.seriesComplete = doseNumber >= totalDoses;
      }
    }

    // Update vaccination
    await existingVaccination.update(updateData);

    // Reload with associations
    const vaccinationWithRelations = await this.vaccinationModel.findByPk(id, {
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!vaccinationWithRelations) {
      throw new Error('Failed to reload vaccination after update');
    }

    // PHI Modification Audit Log
    this.logInfo(
      `PHI Modified: Vaccination ${vaccinationWithRelations.vaccineName} updated for student ${vaccinationWithRelations.student!.firstName} ${vaccinationWithRelations.student!.lastName}`,
    );

    return vaccinationWithRelations;
  }

  /**
   * Delete vaccination (soft delete for HIPAA compliance)
   * @param id - Vaccination UUID
   * @returns Success status
   */
  async deleteVaccination(id: string): Promise<{ success: boolean }> {
    const vaccination = await this.vaccinationModel.findOne({
      where: { id },
      include: [{ model: this.studentModel, as: 'student' }],
    });

    if (!vaccination) {
      throw new NotFoundException('Vaccination not found');
    }

    // Soft delete (Sequelize uses destroy with paranoid)
    await this.vaccinationModel.destroy({ where: { id } });

    // PHI Deletion Audit Log
    this.logWarning(
      `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student!.firstName} ${vaccination.student!.lastName}`,
    );

    return { success: true };
  }
}
