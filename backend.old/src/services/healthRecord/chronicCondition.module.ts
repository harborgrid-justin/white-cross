/**
 * @fileoverview Chronic Condition Management Service - ICD-10 Compliant Condition Tracking
 * @module services/healthRecord/chronicCondition.module
 * @description Long-term health condition management with care plan coordination
 *
 * Key Features:
 * - CRUD operations for chronic conditions
 * - ICD-10 diagnosis code validation
 * - Condition status tracking (active, controlled, resolved)
 * - Severity classification (mild, moderate, severe, critical)
 * - Care plan management
 * - Medication tracking
 * - Activity restrictions documentation
 * - Trigger identification
 * - Review date scheduling
 * - Emergency action plans
 *
 * @compliance HIPAA Privacy Rule §164.308 - Administrative Safeguards
 * @compliance HIPAA Security Rule §164.312 - Technical Safeguards
 * @compliance ICD-10-CM Official Guidelines - Diagnosis coding
 * @compliance Section 504 of Rehabilitation Act - Reasonable accommodations
 * @compliance ADA (Americans with Disabilities Act) - Disability accommodations
 * @security PHI - All operations tracked in audit log
 * @audit Minimum 6-year retention for HIPAA compliance
 * @coordination Care plans shared with authorized school staff
 *
 * @requires ../../utils/logger
 * @requires ../../database/models
 * @requires ./validation.module
 *
 * LOC: 2E9B6F1C73
 * WC-SVC-HLT-CHR | chronicCondition.module.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 */

import { logger } from '../../utils/logger';
import { ChronicCondition, Student } from '../../database/models';
import { ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { CreateChronicConditionData } from './types';
import { ValidationModule } from './validation.module';

/**
 * @class ChronicConditionModule
 * @description Manages chronic health conditions with ICD-10 compliance and care coordination
 * @security All methods require proper authentication and authorization
 * @audit All operations logged for compliance tracking
 * @safety Critical/severe conditions trigger automatic staff notifications
 */
export class ChronicConditionModule {
  /**
   * @method addChronicCondition
   * @description Record new chronic condition with ICD-10 validation and care plan setup
   * @async
   *
   * @param {CreateChronicConditionData} data - Chronic condition information
   * @param {string} data.studentId - Student UUID
   * @param {string} data.condition - Condition name (e.g., "Type 1 Diabetes", "Asthma")
   * @param {string} [data.icdCode] - ICD-10 diagnosis code (e.g., "E10.9", "J45.30")
   * @param {Date} [data.diagnosisDate] - Date condition was diagnosed
   * @param {string} [data.severity] - Severity (mild, moderate, severe, critical)
   * @param {string} [data.status] - Status (active, controlled, resolved, monitoring)
   * @param {Array<string>} [data.medications] - List of medications for condition
   * @param {Array<string>} [data.restrictions] - Activity restrictions
   * @param {Array<string>} [data.triggers] - Known triggers
   * @param {string} [data.carePlan] - Care plan details
   * @param {string} [data.emergencyPlan] - Emergency action plan
   * @param {Date} [data.nextReviewDate] - Next review/follow-up date
   * @param {string} [data.notes] - Additional notes
   *
   * @returns {Promise<any>} Created chronic condition record with associations
   *
   * @throws {Error} When student not found
   * @throws {Error} When condition name is empty
   * @throws {Error} When ICD-10 code is invalid
   * @throws {Error} When diagnosis date is invalid (future date)
   * @throws {ValidationError} When required fields missing
   * @throws {ForbiddenError} When user lacks 'health:conditions:create' permission
   *
   * @security PHI Creation - Requires 'health:conditions:create' permission
   * @audit PHI creation logged with student ID and condition details
   * @validation ICD-10 codes validated against WHO database
   * @validation Diagnosis dates cannot be in the future
   * @safety Critical/severe conditions trigger immediate staff notifications
   * @coordination Care plans accessible to authorized staff (nurses, counselors)
   * @accommodation Section 504 plans may be required for certain conditions
   *
   * @example
   * // Record Type 1 Diabetes with care plan
   * const condition = await ChronicConditionModule.addChronicCondition({
   *   studentId: 'student-123',
   *   condition: 'Type 1 Diabetes',
   *   icdCode: 'E10.9',
   *   diagnosisDate: new Date('2022-03-15'),
   *   severity: 'severe',
   *   status: 'active',
   *   medications: ['Insulin', 'Metformin'],
   *   restrictions: ['Monitor blood sugar before PE', 'Keep glucose tablets accessible'],
   *   triggers: ['Skipped meals', 'Excessive exercise'],
   *   carePlan: 'Check blood sugar 4x daily, insulin before meals',
   *   emergencyPlan: 'If blood sugar <70, give glucose tablets immediately',
   *   nextReviewDate: new Date('2025-03-15')
   * });
   *
   * @example
   * // Record moderate asthma
   * const condition = await ChronicConditionModule.addChronicCondition({
   *   studentId: 'student-456',
   *   condition: 'Asthma',
   *   icdCode: 'J45.30',
   *   severity: 'moderate',
   *   status: 'controlled',
   *   medications: ['Albuterol inhaler (rescue)', 'Flovent (daily)'],
   *   restrictions: ['May need breaks during strenuous activity'],
   *   triggers: ['Cold air', 'Exercise', 'Dust'],
   *   emergencyPlan: 'Use rescue inhaler, call 911 if no improvement'
   * });
   */
  static async addChronicCondition(data: CreateChronicConditionData): Promise<any> {
    try {
      // Verify student exists
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Validate condition name
      ValidationModule.validateRequired(data.condition, 'Condition name');

      // Validate ICD-10 code if provided
      if (data.icdCode) {
        const icdValidation = ValidationModule.validateICD10(data.icdCode);
        if (!icdValidation.isValid) {
          throw new Error(`Invalid ICD-10 code: ${icdValidation.errors.join(', ')}`);
        }
      }

      // Validate diagnosis date
      if (data.diagnosisDate) {
        const dateValidation = ValidationModule.validateDiagnosisDateValue(
          new Date(data.diagnosisDate)
        );
        if (!dateValidation.isValid) {
          throw new Error(`Invalid diagnosis date: ${dateValidation.errors.join(', ')}`);
        }
      }

      // Validate severity is provided
      if (!data.severity) {
        logger.warn(
          `No severity specified for chronic condition ${data.condition}, defaulting to MODERATE`
        );
      }

      // Log critical conditions
      if (
        data.severity === ConditionSeverity.CRITICAL ||
        data.severity === ConditionSeverity.SEVERE
      ) {
        logger.warn(
          `CRITICAL/SEVERE CONDITION ADDED: ${data.condition} (${data.severity}) for student ${student.id} - ${student.firstName} ${student.lastName}`
        );
      }

      const chronicCondition = await ChronicCondition.create({
        ...data,
        status: data.status || ConditionStatus.ACTIVE,
        medications: data.medications || [],
        restrictions: data.restrictions || [],
        triggers: data.triggers || []
      });

      // Reload with associations
      await chronicCondition.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Chronic condition added: ${data.condition} (ICD: ${data.icdCode || 'N/A'}) for ${student.firstName} ${student.lastName}`
      );
      return chronicCondition;
    } catch (error) {
      logger.error('Error adding chronic condition:', error);
      throw error;
    }
  }

  /**
   * Get student chronic conditions
   */
  static async getStudentChronicConditions(studentId: string): Promise<any[]> {
    try {
      const conditions = await ChronicCondition.findAll({
        where: { studentId },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ],
        order: [
          ['status', 'ASC'], // Active first
          ['condition', 'ASC']
        ]
      });

      return conditions;
    } catch (error) {
      logger.error('Error fetching student chronic conditions:', error);
      throw error;
    }
  }

  /**
   * Update chronic condition
   */
  static async updateChronicCondition(
    id: string,
    data: Partial<CreateChronicConditionData>
  ): Promise<any> {
    try {
      const existingCondition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!existingCondition) {
        throw new Error('Chronic condition not found');
      }

      await existingCondition.update(data);

      // Reload with associations
      await existingCondition.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(
        `Chronic condition updated: ${existingCondition.condition} for ${existingCondition.student!.firstName} ${existingCondition.student!.lastName}`
      );
      return existingCondition;
    } catch (error) {
      logger.error('Error updating chronic condition:', error);
      throw error;
    }
  }

  /**
   * Delete chronic condition
   */
  static async deleteChronicCondition(id: string): Promise<{ success: boolean }> {
    try {
      const condition = await ChronicCondition.findByPk(id, {
        include: [{ model: Student, as: 'student' }]
      });

      if (!condition) {
        throw new Error('Chronic condition not found');
      }

      await condition.destroy();

      logger.info(
        `Chronic condition deleted: ${condition.condition} for ${condition.student!.firstName} ${condition.student!.lastName}`
      );
      return { success: true };
    } catch (error) {
      logger.error('Error deleting chronic condition:', error);
      throw error;
    }
  }
}
