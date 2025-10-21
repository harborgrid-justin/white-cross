/**
 * LOC: 2E9B6F1C73
 * WC-SVC-HLT-CHR | chronicCondition.module.ts - Chronic Condition Management Module
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
 * Purpose: Chronic condition tracking with ICD-10 validation and care plan management
 * Exports: ChronicConditionModule class with CRUD operations for chronic conditions
 * HIPAA: Contains PHI - chronic medical conditions with critical severity alerts
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Condition validation → ICD-10 check → Severity assessment → Database
 */

import { logger } from '../../utils/logger';
import { ChronicCondition, Student } from '../../database/models';
import { ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { CreateChronicConditionData } from './types';
import { ValidationModule } from './validation.module';

/**
 * Chronic Condition Module
 * Manages student chronic condition records with ICD-10 validation and care plans
 */
export class ChronicConditionModule {
  /**
   * Add chronic condition to student with validation
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
