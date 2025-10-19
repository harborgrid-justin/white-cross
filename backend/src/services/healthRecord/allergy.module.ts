/**
 * LOC: 5C8D3A7F42
 * WC-SVC-HLT-ALG | allergy.module.ts - Allergy Management Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (./types.ts)
 *   - validation.module.ts (./validation.module.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (./index.ts)
 *
 * Purpose: Allergy record management with severity tracking and HIPAA compliance
 * Exports: AllergyModule class with CRUD operations for student allergies
 * HIPAA: Contains PHI - allergy information with critical severity alerts
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Allergy validation → Severity check → Database → Alert logging
 */

import { logger } from '../../utils/logger';
import { Allergy, Student } from '../../database/models';
import { AllergySeverity } from '../../database/types/enums';
import { CreateAllergyData } from './types';
import { ValidationModule } from './validation.module';

/**
 * Allergy Module
 * Manages student allergy records with validation and severity tracking
 */
export class AllergyModule {
  /**
   * Add allergy to student with validation
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
   * Update allergy information
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
   * Get student allergies
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
   * Delete allergy
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
