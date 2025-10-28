/**
 * LOC: F4FAF22C25
 * Automated Grade Transition Workflow Service
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - logger.ts (utils/logger.ts)
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - enhancedFeatures.ts (routes/enhancedFeatures.ts)
 *   - enhancedFeatures.test.ts (__tests__/enhancedFeatures.test.ts)
 */

import { Student } from '../database/models';
import { logger } from '../utils/logger';
import { sequelize } from '../database/config/sequelize';
import { Op } from 'sequelize';

/**
 * Automated Grade Transition Workflow Service
 * Handles automatic grade transitions at year-end
 */

export interface GradeTransitionRule {
  fromGrade: string;
  toGrade: string;
  effectiveDate: Date;
  requiresApproval: boolean;
}

export interface TransitionResult {
  studentId: string;
  studentName: string;
  oldGrade: string;
  newGrade: string;
  success: boolean;
  error?: string;
}

const GRADE_PROGRESSION: { [key: string]: string } = {
  'Pre-K': 'K',
  'K': '1',
  '1': '2', '2': '3', '3': '4', '4': '5', '5': '6',
  '6': '7', '7': '8', '8': '9', '9': '10', '10': '11', '11': '12',
  '12': 'Graduate'
};

export class GradeTransitionService {
  /**
   * Perform bulk grade transition for end of school year
   */
  static async performBulkTransition(
    effectiveDate: Date = new Date(),
    dryRun: boolean = false
  ): Promise<{ total: number; successful: number; failed: number; results: TransitionResult[] }> {
    const transaction = await sequelize.transaction();
    
    try {
      // Get all active students
      const students = await Student.findAll({
        where: { isActive: true },
        transaction,
      });

      const results: TransitionResult[] = [];
      let successful = 0;
      let failed = 0;

      for (const student of students) {
        try {
          const oldGrade = student.grade;
          const newGrade = GRADE_PROGRESSION[oldGrade];

          if (!newGrade) {
            results.push({
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              oldGrade,
              newGrade: oldGrade,
              success: false,
              error: 'No transition rule found for grade',
            });
            failed++;
            continue;
          }

          if (!dryRun) {
            await student.update({ 
              grade: newGrade,
              updatedBy: 'system' 
            }, { transaction });
          }

          results.push({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            oldGrade,
            newGrade,
            success: true,
          });
          successful++;
        } catch (error) {
          results.push({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            oldGrade: student.grade,
            newGrade: student.grade,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          failed++;
        }
      }

      if (dryRun) {
        await transaction.rollback();
      } else {
        await transaction.commit();
      }

      logger.info('Grade transition completed', { 
        total: students.length, 
        successful, 
        failed, 
        dryRun 
      });

      return {
        total: students.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error performing grade transition', { error });
      throw error;
    }
  }

  /**
   * Transition individual student
   */
  static async transitionStudent(
    studentId: string,
    newGrade: string,
    transitionedBy: string
  ): Promise<boolean> {
    try {
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const oldGrade = student.grade;

      await student.update({ 
        grade: newGrade,
        updatedBy: transitionedBy 
      });

      logger.info('Student grade transitioned', { 
        studentId, 
        oldGrade, 
        newGrade, 
        transitionedBy 
      });

      return true;
    } catch (error) {
      logger.error('Error transitioning student', { error, studentId });
      throw error;
    }
  }

  /**
   * Get students eligible for graduation
   */
  static async getGraduatingStudents(): Promise<Student[]> {
    try {
      const students = await Student.findAll({
        where: {
          grade: '12',
          isActive: true,
        },
      });

      logger.info('Graduating students retrieved', { count: students.length });

      return students;
    } catch (error) {
      logger.error('Error getting graduating students', { error });
      throw error;
    }
  }
}
