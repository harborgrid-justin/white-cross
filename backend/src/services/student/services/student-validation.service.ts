/**
 * @fileoverview Student Validation Service
 * @module services/student/student-validation.service
 * @description Handles all validation logic for student operations
 */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student, User, UserRole } from '@/database';

import { BaseService } from '@/common/base';
/**
 * Student Validation Service
 *
 * Provides centralized validation logic for:
 * - Student number uniqueness
 * - Medical record number uniqueness
 * - Date of birth validation
 * - Nurse assignment validation
 * - UUID format validation
 * - Data normalization
 */
@Injectable()
export class StudentValidationService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Validate student number uniqueness
   * Ensures no duplicate student numbers in the system
   */
  async validateStudentNumber(studentNumber: string, excludeId?: string): Promise<void> {
    const normalized = studentNumber.toUpperCase().trim();

    const where: any = { studentNumber: normalized };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await this.studentModel.findOne({ where });

    if (existing) {
      throw new ConflictException(
        'Student number already exists. Please use a unique student number.',
      );
    }
  }

  /**
   * Validate medical record number uniqueness
   * Ensures each student has a unique medical record number
   */
  async validateMedicalRecordNumber(
    medicalRecordNum: string,
    excludeId?: string,
  ): Promise<void> {
    const normalized = medicalRecordNum.toUpperCase().trim();

    const where: any = { medicalRecordNum: normalized };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await this.studentModel.findOne({ where });

    if (existing) {
      throw new ConflictException(
        'Medical record number already exists. Each student must have a unique medical record number.',
      );
    }
  }

  /**
   * Validate date of birth
   * Ensures date is in past and age is between 3-100 years
   */
  validateDateOfBirth(dateOfBirth: Date): void {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (dob >= today) {
      throw new BadRequestException('Date of birth must be in the past.');
    }

    if (age < 3 || age > 100) {
      throw new BadRequestException('Student age must be between 3 and 100 years.');
    }
  }

  /**
   * Validate nurse assignment
   * Ensures nurse exists in the system with NURSE role
   */
  async validateNurseAssignment(nurseId: string): Promise<void> {
    this.validateUUID(nurseId);

    const nurse = await this.userModel.findOne({
      where: {
        id: nurseId,
        role: UserRole.NURSE,
        isActive: true,
      } as any,
    });

    if (!nurse) {
      throw new NotFoundException('Assigned nurse not found. Please select a valid, active nurse.');
    }

    this.logInfo(`Nurse validation successful: ${nurse.fullName} (${nurseId})`);
  }

  /**
   * Validate UUID format
   * Ensures ID is a valid UUID v4
   */
  validateUUID(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new BadRequestException('Invalid ID format. Must be a valid UUID.');
    }
  }

  /**
   * Normalize student creation data
   * Trims whitespace and standardizes formats
   */
  normalizeCreateData(data: any): any {
    return {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      studentNumber: data.studentNumber.toUpperCase().trim(),
      medicalRecordNum: data.medicalRecordNum?.toUpperCase().trim(),
      enrollmentDate: data.enrollmentDate || new Date(),
    };
  }

  /**
   * Normalize student update data
   * Trims whitespace and standardizes formats for updates
   */
  normalizeUpdateData(data: any): any {
    const normalized: any = { ...data };

    if (data.firstName) normalized.firstName = data.firstName.trim();
    if (data.lastName) normalized.lastName = data.lastName.trim();
    if (data.studentNumber) normalized.studentNumber = data.studentNumber.toUpperCase().trim();
    if (data.medicalRecordNum)
      normalized.medicalRecordNum = data.medicalRecordNum.toUpperCase().trim();

    return normalized;
  }

  /**
   * Calculate age from date of birth
   * Helper method for age-based validations and calculations
   */
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
