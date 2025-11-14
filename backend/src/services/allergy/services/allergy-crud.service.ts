/**
 * Allergy CRUD Service
 *
 * Provides Create, Read, Update, Delete operations for allergy records
 * with comprehensive validation, PHI audit logging, and patient safety protocols.
 *
 * PATIENT SAFETY CRITICAL - Manages life-threatening allergy information
 * that impacts medication administration and emergency response.
 *
 * @service AllergyCrudService
 * @compliance HIPAA, Healthcare Allergy Documentation Standards
 */
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Allergy } from '../models/allergy.model';
import { AllergyCreateDto } from '../dto/create-allergy.dto';
import { AllergyUpdateDto } from '../dto/update-allergy.dto';
import { Student } from '@/database/models';

import { BaseService } from '@/common/base';
@Injectable()
export class AllergyCrudService extends BaseService {
  constructor(
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {
    super("AllergyCrudService");
  }

  /**
   * Creates a new allergy record with validation and duplicate checking
   *
   * @param createAllergyDto - Allergy creation data
   * @returns Created allergy record with relations
   * @throws NotFoundException if student doesn't exist
   * @throws ConflictException if duplicate allergy exists
   */
  async createAllergy(createAllergyDto: AllergyCreateDto): Promise<Allergy> {
    // Validate student exists
    const student = await this.studentModel.findByPk(
      createAllergyDto.studentId,
    );

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createAllergyDto.studentId} not found`,
      );
    }

    // Check for duplicate allergy
    const existingAllergy = await this.allergyModel.findOne({
      where: {
        studentId: createAllergyDto.studentId,
        allergen: createAllergyDto.allergen,
        isActive: true,
      },
    });

    if (existingAllergy) {
      throw new ConflictException(
        `Student already has an active allergy record for ${createAllergyDto.allergen}`,
      );
    }

    // Set verifiedAt timestamp if verified
    const allergyData: any = {
      ...createAllergyDto,
      verifiedAt: createAllergyDto.verified ? new Date() : undefined,
    };

    // Create allergy record
    const savedAllergy = await this.allergyModel.create(allergyData);

    // PHI Audit Log
    this.logInfo(
      `Allergy created: ${savedAllergy.allergen} (${savedAllergy.severity}) for student ${savedAllergy.studentId}`,
    );

    // Reload with relations
    return (await this.allergyModel.findByPk(savedAllergy.id, {
      include: [{ model: Student, as: 'student' }],
    })) as Allergy;
  }

  /**
   * Retrieves a specific allergy record by ID with PHI audit logging
   *
   * @param id - Allergy record UUID
   * @returns Allergy record with student relation
   * @throws NotFoundException if allergy doesn't exist
   */
  async getAllergyById(id: string): Promise<Allergy> {
    const allergy = await this.allergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // PHI Audit Log
    this.logInfo(`Allergy accessed: ID ${id}, Student ${allergy.studentId}`);

    return allergy;
  }

  /**
   * Updates an existing allergy record with change tracking
   *
   * @param id - Allergy record UUID
   * @param updateAllergyDto - Partial allergy update data
   * @returns Updated allergy record
   * @throws NotFoundException if allergy doesn't exist
   */
  async updateAllergy(
    id: string,
    updateAllergyDto: AllergyUpdateDto,
  ): Promise<Allergy> {
    const allergy = await this.allergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // Store old values for audit
    const oldValues = {
      allergen: allergy.allergen,
      severity: allergy.severity,
      verified: allergy.verified,
    };

    // If verification status is being changed, update timestamp
    const updateData: any = { ...updateAllergyDto };
    if (updateAllergyDto.verified && !allergy.verified) {
      updateData.verifiedAt = new Date();
    }

    // Update allergy
    await allergy.update(updateData);
    const updatedAllergy = allergy;

    // PHI Audit Log
    this.logInfo(
      `Allergy updated: ${updatedAllergy.allergen} for student ${updatedAllergy.studentId}. ` +
        `Old values: ${JSON.stringify(oldValues)}`,
    );

    // Reload with relations
    const result = await this.allergyModel.findByPk(updatedAllergy.id, {
      include: [{ model: Student, as: 'student' }],
    });
    if (!result) {
      throw new NotFoundException(
        `Allergy with ID ${updatedAllergy.id} not found after update`,
      );
    }
    return result;
  }

  /**
   * Soft-deletes (deactivates) an allergy record while preserving clinical history
   *
   * @param id - Allergy record UUID
   * @returns Success status
   * @throws NotFoundException if allergy doesn't exist
   */
  async deactivateAllergy(id: string): Promise<{ success: boolean }> {
    const allergy = await this.allergyModel.findByPk(id);

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // Soft delete
    await allergy.update({ isActive: false });

    // PHI Audit Log
    this.logInfo(
      `Allergy deactivated: ${allergy.allergen} for student ${allergy.studentId}`,
    );

    return { success: true };
  }

  /**
   * Permanently deletes an allergy record
   *
   * USE WITH EXTREME CAUTION - Eliminates clinical history
   * Prefer deactivateAllergy() in most cases
   *
   * @param id - Allergy record UUID
   * @returns Success status
   * @throws NotFoundException if allergy doesn't exist
   */
  async deleteAllergy(id: string): Promise<{ success: boolean }> {
    const allergy = await this.allergyModel.findByPk(id, {
      include: [{ model: Student, as: 'student' }],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // Store data for audit before deletion
    const auditData = {
      allergen: allergy.allergen,
      severity: allergy.severity,
      studentId: allergy.studentId,
      studentName: allergy.student
        ? `${allergy.student.firstName} ${allergy.student.lastName}`
        : 'Unknown',
    };

    await allergy.destroy();

    // PHI Audit Log - WARNING level due to permanent deletion
    this.logWarning(
      `Allergy permanently deleted: ${auditData.allergen} for ${auditData.studentName}. ` +
        `Data: ${JSON.stringify(auditData)}`,
    );

    return { success: true };
  }
}
