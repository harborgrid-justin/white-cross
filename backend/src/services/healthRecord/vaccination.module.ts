/**
 * LOC: 8B3E5D7A91
 * WC-SVC-HLT-VAC | vaccination.module.ts - Vaccination Management Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *   - validation.module.ts (./validation.module.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Vaccination record management with CVX validation and dose tracking
 * Exports: VaccinationModule class with CRUD operations for vaccinations
 * HIPAA: Contains PHI - vaccination records with expiration tracking
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Vaccine validation → CVX check → Date validation → Database → Expiry alert
 */

import { logger } from '../../utils/logger';
import { Vaccination, Student } from '../../database/models';
import { CreateVaccinationData } from './types';
import { ValidationModule } from './validation.module';

/**
 * Vaccination Module
 * Manages student vaccination records with CVX validation and dose tracking
 */
export class VaccinationModule {
  /**
   * Add vaccination record with comprehensive validation
   */
  static async addVaccination(data: CreateVaccinationData): Promise<any> {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate vaccine name
      ValidationModule.validateRequired(data.vaccineName, 'Vaccine name');

      // Validate CVX code if provided
      if (data.cvxCode) {
        const cvxValidation = ValidationModule.validateCVX(data.cvxCode, data.vaccineName);
        if (!cvxValidation.isValid) {
          throw new Error(`Invalid CVX code: ${cvxValidation.errors.join(', ')}`);
        }
      }

      // Validate vaccination dates
      const dateValidation = ValidationModule.validateVaccinationDateRange(
        new Date(data.administrationDate),
        data.expirationDate ? new Date(data.expirationDate) : undefined,
        data.vaccineName
      );

      if (!dateValidation.isValid) {
        throw new Error(`Invalid vaccination dates: ${dateValidation.errors.join(', ')}`);
      }

      // Validate dose numbers if provided
      if (data.doseNumber && data.totalDoses) {
        ValidationModule.validateDoseNumbers(data.doseNumber, data.totalDoses);
      }

      // Check if expiration date has passed
      if (data.expirationDate) {
        ValidationModule.checkVaccineExpiration(
          new Date(data.expirationDate),
          data.vaccineName,
          data.cvxCode
        );
      }

      const vaccination = await Vaccination.create({
        ...data,
        seriesComplete: data.doseNumber === data.totalDoses,
        exemptionStatus: false,
        vfcEligibility: false,
        visProvided: false,
        consentObtained: false
      });

      // Reload with associations
      await vaccination.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Vaccination added: ${data.vaccineName} (CVX: ${data.cvxCode || 'N/A'}) for ${student.firstName} ${student.lastName}`
      );
      return vaccination;
    } catch (error) {
      logger.error('Error adding vaccination:', error);
      throw error;
    }
  }

  /**
   * Get student vaccinations
   */
  static async getStudentVaccinations(studentId: string): Promise<any[]> {
    try {
      const vaccinations = await Vaccination.findAll({
        where: { studentId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['administrationDate', 'DESC'],
          ['vaccineName', 'ASC']
        ]
      });

      return vaccinations;
    } catch (error) {
      logger.error('Error fetching student vaccinations:', error);
      throw error;
    }
  }

  /**
   * Update vaccination record
   */
  static async updateVaccination(
    id: string,
    data: Partial<CreateVaccinationData>
  ): Promise<any> {
    try {
      const existingVaccination = await Vaccination.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingVaccination) {
        throw new Error('Vaccination not found');
      }

      // Validate CVX code if being updated
      if (data.cvxCode) {
        const cvxValidation = ValidationModule.validateCVX(data.cvxCode);
        if (!cvxValidation.isValid) {
          throw new Error(`Invalid CVX code: ${cvxValidation.errors.join(', ')}`);
        }
      }

      // Validate dates if being updated
      const adminDate = data.administrationDate
        ? new Date(data.administrationDate)
        : new Date(existingVaccination.administrationDate);
      const expDate = data.expirationDate
        ? new Date(data.expirationDate)
        : existingVaccination.expirationDate
        ? new Date(existingVaccination.expirationDate)
        : undefined;

      if (data.administrationDate || data.expirationDate) {
        const dateValidation = ValidationModule.validateVaccinationDateRange(
          adminDate,
          expDate
        );
        if (!dateValidation.isValid) {
          throw new Error(`Invalid vaccination dates: ${dateValidation.errors.join(', ')}`);
        }
      }

      // Update series complete status if dose numbers change
      const updateData: any = { ...data };
      if (data.doseNumber && data.totalDoses) {
        updateData.seriesComplete = data.doseNumber === data.totalDoses;
      } else if (data.doseNumber && existingVaccination.totalDoses) {
        updateData.seriesComplete = data.doseNumber === existingVaccination.totalDoses;
      } else if (data.totalDoses && existingVaccination.doseNumber) {
        updateData.seriesComplete = existingVaccination.doseNumber === data.totalDoses;
      }

      await existingVaccination.update(updateData);

      // Reload with associations
      await existingVaccination.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Vaccination updated: ${existingVaccination.vaccineName} for ${existingVaccination.student!.firstName} ${existingVaccination.student!.lastName}`
      );
      return existingVaccination;
    } catch (error) {
      logger.error('Error updating vaccination:', error);
      throw error;
    }
  }

  /**
   * Delete vaccination record
   */
  static async deleteVaccination(id: string): Promise<{ success: boolean }> {
    try {
      const vaccination = await Vaccination.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!vaccination) {
        throw new Error('Vaccination not found');
      }

      await vaccination.destroy();

      logger.info(
        `Vaccination deleted: ${vaccination.vaccineName} for ${vaccination.student!.firstName} ${vaccination.student!.lastName}`
      );
      return { success: true };
    } catch (error) {
      logger.error('Error deleting vaccination:', error);
      throw error;
    }
  }
}
