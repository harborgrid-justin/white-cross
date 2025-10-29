import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { Student } from '../database/models/student.model';
import { TransitionResultDto, BulkTransitionResultDto } from './dto';

/**
 * Automated Grade Transition Workflow Service
 * Handles automatic grade transitions at year-end
 */
@Injectable()
export class GradeTransitionService {
  private readonly logger = new Logger(GradeTransitionService.name);

  /**
   * Grade progression mapping
   * Maps current grade to next grade level
   */
  private readonly GRADE_PROGRESSION: Record<string, string> = {
    'Pre-K': 'K',
    'K': '1',
    '1': '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '10',
    '10': '11',
    '11': '12',
    '12': 'Graduate',
  };

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Perform bulk grade transition for end of school year
   * @param effectiveDate - Date when transitions take effect
   * @param dryRun - If true, performs simulation without committing changes
   * @returns Results of bulk transition operation
   */
  async performBulkTransition(
    effectiveDate: Date = new Date(),
    dryRun: boolean = false,
  ): Promise<BulkTransitionResultDto> {
    let transaction: Transaction | null = null;

    try {
      // Start transaction
      transaction = await this.sequelize.transaction();

      // Get all active students
      const students = await this.studentModel.findAll({
        where: { isActive: true } as any,
        transaction,
      });

      const results: TransitionResultDto[] = [];
      let successful = 0;
      let failed = 0;

      for (const student of students) {
        try {
          const oldGrade = student.grade;
          const newGrade = this.GRADE_PROGRESSION[oldGrade];

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
            await student.update(
              {
                grade: newGrade,
                updatedBy: 'system',
              } as any,
              { transaction }
            );
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

      this.logger.log('Grade transition completed', {
        total: students.length,
        successful,
        failed,
        dryRun,
      });

      return {
        total: students.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error('Error performing grade transition', error);
      throw error;
    }
  }

  /**
   * Transition individual student to a new grade
   * @param studentId - ID of the student to transition
   * @param newGrade - New grade level
   * @param transitionedBy - User ID who is performing the transition
   * @returns true if successful
   */
  async transitionStudent(
    studentId: string,
    newGrade: string,
    transitionedBy: string,
  ): Promise<boolean> {
    try {
      const student = await this.studentModel.findOne({
        where: { id: studentId } as any,
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const oldGrade = student.grade;

      await student.update({
        grade: newGrade,
        updatedBy: transitionedBy,
      } as any);

      this.logger.log('Student grade transitioned', {
        studentId,
        oldGrade,
        newGrade,
        transitionedBy,
      });

      return true;
    } catch (error) {
      this.logger.error('Error transitioning student', {
        error,
        studentId,
      });
      throw error;
    }
  }

  /**
   * Get students eligible for graduation
   * Returns all active 12th grade students
   * @returns Array of graduating students
   */
  async getGraduatingStudents(): Promise<Student[]> {
    try {
      const students = await this.studentModel.findAll({
        where: {
          grade: '12',
          isActive: true,
        } as any,
      });

      this.logger.log('Graduating students retrieved', {
        count: students.length,
      });

      return students;
    } catch (error) {
      this.logger.error('Error getting graduating students', { error });
      throw error;
    }
  }
}
