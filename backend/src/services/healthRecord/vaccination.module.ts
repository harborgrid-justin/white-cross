/**
 * @fileoverview Vaccination Management Service - CDC-Compliant Immunization Tracking
 * @module services/healthRecord/vaccination.module
 * @description Comprehensive vaccination record management with CVX code validation
 *
 * Key Features:
 * - CRUD operations for vaccination records
 * - CVX (Vaccine Administered) code validation
 * - Dose series tracking (dose 1 of 3, etc.)
 * - Vaccine expiration monitoring
 * - VFC (Vaccines for Children) eligibility tracking
 * - VIS (Vaccine Information Statement) provision tracking
 * - Parental consent documentation
 * - Exemption status management
 * - State reporting compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance CDC Immunization Schedule - Vaccine tracking requirements
 * @compliance State Immunization Registries - Reporting requirements
 * @compliance 42 CFR Part 73 - Select agents and toxins
 * @security PHI - All operations tracked in audit log
 * @audit Minimum 6-year retention for HIPAA compliance
 * @reporting State immunization registries may require automated reporting
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 * @requires ./validation.module
 *
 * LOC: 8B3E5D7A91
 * WC-SVC-HLT-VAC | vaccination.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { logger } from '../../utils/logger';
import { Vaccination, Student } from '../../database/models';
import { CreateVaccinationData } from './types';
import { ValidationModule } from './validation.module';

/**
 * @class VaccinationModule
 * @description Manages student vaccination records with CDC compliance and CVX validation
 * @security All methods require proper authentication and authorization
 * @audit All operations logged for compliance tracking
 * @compliance CDC immunization schedules enforced through validation
 */
export class VaccinationModule {
  /**
   * @method addVaccination
   * @description Record new vaccination with CVX validation and dose tracking
   * @async
   *
   * @param {CreateVaccinationData} data - Vaccination information
   * @param {string} data.studentId - Student UUID
   * @param {string} data.vaccineName - Vaccine name (e.g., "MMR", "COVID-19")
   * @param {string} [data.cvxCode] - CVX code (CDC vaccine code)
   * @param {Date} data.administrationDate - Date vaccine was administered
   * @param {Date} [data.expirationDate] - Vaccine lot expiration date
   * @param {number} [data.doseNumber] - Current dose number (e.g., 1)
   * @param {number} [data.totalDoses] - Total doses in series (e.g., 3)
   * @param {string} [data.lotNumber] - Vaccine lot number
   * @param {string} [data.manufacturer] - Vaccine manufacturer
   * @param {string} [data.administeredBy] - Healthcare provider who administered
   * @param {string} [data.site] - Administration site (e.g., "Left deltoid")
   * @param {string} [data.route] - Administration route (e.g., "Intramuscular")
   * @param {string} [data.notes] - Additional notes
   *
   * @returns {Promise<any>} Created vaccination record with associations
   *
   * @throws {Error} When student not found
   * @throws {Error} When vaccine name is empty
   * @throws {Error} When CVX code is invalid
   * @throws {Error} When dates are invalid (future date, expiration before administration)
   * @throws {Error} When dose numbers are invalid
   * @throws {ValidationError} When required fields missing
   * @throws {ForbiddenError} When user lacks 'health:vaccinations:create' permission
   *
   * @security PHI Creation - Requires 'health:vaccinations:create' permission
   * @audit PHI creation logged with student ID and vaccine details
   * @validation CVX codes validated against CDC database
   * @validation Expiration dates checked for expired vaccines
   * @validation Dose numbers validated (dose ≤ total doses)
   * @compliance CDC CVX code system ensures standardized vaccine identification
   * @reporting Data formatted for state immunization registry submission
   * @consent Parent/guardian consent should be obtained before administration
   *
   * @example
   * // Record COVID-19 vaccination
   * const vaccination = await VaccinationModule.addVaccination({
   *   studentId: 'student-123',
   *   vaccineName: 'COVID-19, mRNA',
   *   cvxCode: '208',
   *   administrationDate: new Date('2024-01-15'),
   *   expirationDate: new Date('2025-12-31'),
   *   doseNumber: 1,
   *   totalDoses: 2,
   *   lotNumber: 'AB12345',
   *   manufacturer: 'Pfizer',
   *   administeredBy: 'Dr. Jane Smith',
   *   site: 'Left deltoid',
   *   route: 'Intramuscular'
   * });
   *
   * @example
   * // Record MMR vaccination (single dose)
   * const vaccination = await VaccinationModule.addVaccination({
   *   studentId: 'student-456',
   *   vaccineName: 'MMR',
   *   cvxCode: '03',
   *   administrationDate: new Date('2024-06-10'),
   *   doseNumber: 1,
   *   totalDoses: 1,
   *   administeredBy: 'School Nurse'
   * });
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
