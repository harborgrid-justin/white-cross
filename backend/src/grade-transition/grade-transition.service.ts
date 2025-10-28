import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Student } from '../student/entities/student.entity';
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
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get all active students
      const students = await queryRunner.manager.find(Student, {
        where: { isActive: true },
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
            await queryRunner.manager.update(
              Student,
              { id: student.id },
              {
                grade: newGrade,
                updatedBy: 'system',
              },
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
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
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
      await queryRunner.rollbackTransaction();
      this.logger.error('Error performing grade transition', error);
      throw error;
    } finally {
      await queryRunner.release();
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
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const oldGrade = student.grade;

      await this.studentRepository.update(
        { id: studentId },
        {
          grade: newGrade,
          updatedBy: transitionedBy,
        },
      );

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
      const students = await this.studentRepository.find({
        where: {
          grade: '12',
          isActive: true,
        },
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
