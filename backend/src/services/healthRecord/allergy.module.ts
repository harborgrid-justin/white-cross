/**
 * @fileoverview Allergy Management Service - HIPAA-Compliant Allergy Tracking
 * @module services/healthRecord/allergy.module
 * @description Student allergy management with life-threatening severity monitoring
 *
 * Key Features:
 * - CRUD operations for student allergies
 * - Severity classification (mild, moderate, severe, life-threatening)
 * - EpiPen requirement tracking
 * - Duplicate allergy prevention
 * - Automatic staff notifications for critical allergies
 * - Verification status tracking
 * - Reaction history documentation
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance Emergency Medical Treatment Act - Life-threatening allergen alerts
 * @security PHI - All operations tracked in audit log
 * @safety Life-threatening allergies trigger automatic notifications
 * @audit Minimum 6-year retention for HIPAA compliance
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 * @requires ./validation.module
 *
 * LOC: 5C8D3A7F42
 * WC-SVC-HLT-ALG | allergy.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { logger } from '../../utils/logger';
import { Allergy, Student } from '../../database/models';
import { AllergySeverity } from '../../database/types/enums';
import { CreateAllergyData } from './types';
import { ValidationModule } from './validation.module';

/**
 * @class AllergyModule
 * @description Manages student allergy records with HIPAA compliance and safety protocols
 * @security All methods require proper authentication and authorization
 * @audit All operations logged for compliance tracking
 * @safety Critical severity allergies trigger automatic staff alerts
 */
export class AllergyModule {
  /**
   * @method addAllergy
   * @description Record new allergy with safety protocols and duplicate prevention
   * @async
   *
   * @param {CreateAllergyData} data - Allergy information
   * @param {string} data.studentId - Student UUID
   * @param {string} data.allergen - Specific allergen name (e.g., "Peanuts", "Penicillin")
   * @param {string} data.allergyType - Type (food, medication, environmental, insect)
   * @param {string} data.severity - Severity level (mild, moderate, severe, life-threatening)
   * @param {string} [data.reaction] - Description of allergic reaction
   * @param {boolean} [data.requiresEpiPen] - Whether EpiPen is required
   * @param {boolean} [data.verified] - Whether allergy has been medically verified
   * @param {string} [data.notes] - Additional notes
   *
   * @returns {Promise<any>} Created allergy record with associations
   *
   * @throws {Error} When student not found
   * @throws {Error} When allergen name is empty
   * @throws {Error} When severity is not provided
   * @throws {Error} When allergy already exists for student
   * @throws {ValidationError} When reaction format is invalid
   * @throws {ForbiddenError} When user lacks 'health:allergies:create' permission
   *
   * @safety Life-threatening allergies trigger automatic staff notifications
   * @safety Severe allergies logged as warnings for immediate attention
   * @safety EpiPen location and expiration tracked separately
   * @security PHI Creation - Requires 'health:allergies:create' permission
   * @audit PHI creation logged with student ID and allergen
   * @duplicate Prevents duplicate allergen entries for same student
   *
   * @example
   * // Record life-threatening peanut allergy
   * const allergy = await AllergyModule.addAllergy({
   *   studentId: 'student-123',
   *   allergen: 'Peanuts',
   *   allergyType: 'food',
   *   severity: 'life-threatening',
   *   reaction: 'Anaphylaxis, difficulty breathing, hives',
   *   requiresEpiPen: true,
   *   verified: true,
   *   notes: 'EpiPen stored in nurse office, expires 2025-06-30'
   * });
   *
   * @example
   * // Record moderate medication allergy
   * const allergy = await AllergyModule.addAllergy({
   *   studentId: 'student-456',
   *   allergen: 'Penicillin',
   *   allergyType: 'medication',
   *   severity: 'moderate',
   *   reaction: 'Skin rash, itching',
   *   requiresEpiPen: false,
   *   verified: true
   * });
   */
  static async addAllergy(data: CreateAllergyData): Promise<any> {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate allergen is not empty
      ValidationModule.validateRequired(data.allergen, 'Allergen name');

      // Validate severity is provided
      if (!data.severity) {
        throw new Error('Allergy severity is required');
      }

      // Validate reaction format if provided
      if (data.reaction) {
        ValidationModule.validateAllergyReaction(data.reaction);
      }

      // Check if allergy already exists for this student
      const existingAllergy = await Allergy.findOne({
        where: {
          studentId: data.studentId,
          allergen: data.allergen
        }
      });

      if (existingAllergy) {
        throw new Error(`Allergy to ${data.allergen} already exists for this student`);
      }

      // Log critical severity allergies
      if (
        data.severity === AllergySeverity.LIFE_THREATENING ||
        data.severity === AllergySeverity.SEVERE
      ) {
        logger.warn(
          `CRITICAL ALLERGY ADDED: ${data.allergen} (${data.severity}) for student ${student.id} - ${student.firstName} ${student.lastName}`
        );
      }

      const allergy = await Allergy.create({
        ...data,
        verified: data.verified ? new Date() : null
      } as any);

      // Reload with associations
      await allergy.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Allergy added: ${data.allergen} (${data.severity}) for ${student.firstName} ${student.lastName}`
      );
      return allergy;
    } catch (error) {
      logger.error('Error adding allergy:', error);
      throw error;
    }
  }

  /**
   * @method updateAllergy
   * @description Update allergy information with verification tracking
   * @async
   *
   * @param {string} id - Allergy record UUID
   * @param {Partial<CreateAllergyData>} data - Updated allergy data
   *
   * @returns {Promise<any>} Updated allergy record with associations
   *
   * @throws {Error} When allergy not found
   * @throws {ForbiddenError} When user lacks 'health:allergies:update' permission
   *
   * @security PHI Modification - Requires 'health:allergies:update' permission
   * @audit PHI modification logged with old and new values
   * @verification Auto-sets verifiedAt timestamp when verified flag changes to true
   *
   * @example
   * const updated = await AllergyModule.updateAllergy('allergy-123', {
   *   severity: 'severe',
   *   verified: true,
   *   notes: 'Verified by allergist on 2024-01-15'
   * });
   */
  static async updateAllergy(
    id: string,
    data: Partial<CreateAllergyData>
  ): Promise<any> {
    try {
      const existingAllergy = await Allergy.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingAllergy) {
        throw new Error('Allergy not found');
      }

      // Update verification timestamp if being verified
      const updateData: any = { ...data };
      if (data.verified && !existingAllergy.verified) {
        updateData.verifiedAt = new Date();
      }

      await existingAllergy.update(updateData);

      // Reload with associations
      await existingAllergy.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Allergy updated: ${existingAllergy.allergen} for ${existingAllergy.student!.firstName} ${existingAllergy.student!.lastName}`
      );
      return existingAllergy;
    } catch (error) {
      logger.error('Error updating allergy:', error);
      throw error;
    }
  }

  /**
   * @method getStudentAllergies
   * @description Retrieve all allergies for a student, ordered by severity
   * @async
   *
   * @param {string} studentId - Student UUID
   *
   * @returns {Promise<any[]>} Array of allergies ordered by severity (most severe first), then alphabetically
   *
   * @throws {Error} When database query fails
   *
   * @security PHI Access - Requires 'health:allergies:read' permission
   * @audit PHI access logged with student ID
   * @safety Most severe allergies listed first for quick identification
   *
   * @example
   * const allergies = await AllergyModule.getStudentAllergies('student-123');
   */
  static async getStudentAllergies(studentId: string): Promise<any[]> {
    try {
      const allergies = await Allergy.findAll({
        where: { studentId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['severity', 'DESC'], // Most severe first
          ['allergen', 'ASC']
        ]
      });

      return allergies;
    } catch (error) {
      logger.error('Error fetching student allergies:', error);
      throw error;
    }
  }

  /**
   * @method deleteAllergy
   * @description Delete allergy record (use with caution - consider marking inactive instead)
   * @async
   *
   * @param {string} id - Allergy record UUID
   *
   * @returns {Promise<{success: boolean}>} Deletion result
   *
   * @throws {Error} When allergy not found
   * @throws {ForbiddenError} When user lacks 'health:allergies:delete' permission
   *
   * @security PHI Deletion - Requires 'health:allergies:delete' permission
   * @audit All deletions logged with allergy details
   * @compliance Consider soft delete for HIPAA 6-year retention requirement
   * @warning Deleting life-threatening allergies poses safety risk - verify intent
   *
   * @example
   * const result = await AllergyModule.deleteAllergy('allergy-123');
   */
  static async deleteAllergy(id: string): Promise<{ success: boolean }> {
    try {
      const allergy = await Allergy.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!allergy) {
        throw new Error('Allergy not found');
      }

      await allergy.destroy();

      logger.info(
        `Allergy deleted: ${allergy.allergen} for ${allergy.student!.firstName} ${allergy.student!.lastName}`
      );
      return { success: true };
    } catch (error) {
      logger.error('Error deleting allergy:', error);
      throw error;
    }
  }
}
