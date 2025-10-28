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
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergy } from '../entities/allergy.entity';
import { CreateAllergyDto } from '../dto/create-allergy.dto';
import { UpdateAllergyDto } from '../dto/update-allergy.dto';
import { Student } from '../../student/entities/student.entity';

@Injectable()
export class AllergyCrudService {
  private readonly logger = new Logger(AllergyCrudService.name);

  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  /**
   * Creates a new allergy record with validation and duplicate checking
   *
   * @param createAllergyDto - Allergy creation data
   * @returns Created allergy record with relations
   * @throws NotFoundException if student doesn't exist
   * @throws ConflictException if duplicate allergy exists
   */
  async createAllergy(createAllergyDto: CreateAllergyDto): Promise<Allergy> {
    // Validate student exists
    const student = await this.studentRepository.findOne({
      where: { id: createAllergyDto.studentId },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createAllergyDto.studentId} not found`,
      );
    }

    // Check for duplicate allergy
    const existingAllergy = await this.allergyRepository.findOne({
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
    const allergy = this.allergyRepository.create(allergyData);
    const savedAllergy = await this.allergyRepository.save(allergy);

    // PHI Audit Log
    this.logger.log(
      `Allergy created: ${savedAllergy.allergen} (${savedAllergy.severity}) for student ${savedAllergy.studentId}`,
    );

    // Reload with relations
    return this.allergyRepository.findOne({
      where: { id: savedAllergy.id },
      relations: ['student'],
    });
  }

  /**
   * Retrieves a specific allergy record by ID with PHI audit logging
   *
   * @param id - Allergy record UUID
   * @returns Allergy record with student relation
   * @throws NotFoundException if allergy doesn't exist
   */
  async getAllergyById(id: string): Promise<Allergy> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // PHI Audit Log
    this.logger.log(`Allergy accessed: ID ${id}, Student ${allergy.studentId}`);

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
    updateAllergyDto: UpdateAllergyDto,
  ): Promise<Allergy> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['student'],
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
    Object.assign(allergy, updateData);
    const updatedAllergy = await this.allergyRepository.save(allergy);

    // PHI Audit Log
    this.logger.log(
      `Allergy updated: ${updatedAllergy.allergen} for student ${updatedAllergy.studentId}. ` +
        `Old values: ${JSON.stringify(oldValues)}`,
    );

    // Reload with relations
    return this.allergyRepository.findOne({
      where: { id: updatedAllergy.id },
      relations: ['student'],
    });
  }

  /**
   * Soft-deletes (deactivates) an allergy record while preserving clinical history
   *
   * @param id - Allergy record UUID
   * @returns Success status
   * @throws NotFoundException if allergy doesn't exist
   */
  async deactivateAllergy(id: string): Promise<{ success: boolean }> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // Soft delete
    allergy.isActive = false;
    await this.allergyRepository.save(allergy);

    // PHI Audit Log
    this.logger.log(
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
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['student'],
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

    await this.allergyRepository.remove(allergy);

    // PHI Audit Log - WARNING level due to permanent deletion
    this.logger.warn(
      `Allergy permanently deleted: ${auditData.allergen} for ${auditData.studentName}. ` +
        `Data: ${JSON.stringify(auditData)}`,
    );

    return { success: true };
  }
}
