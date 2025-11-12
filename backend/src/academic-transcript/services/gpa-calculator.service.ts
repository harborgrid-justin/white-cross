/**
 * @fileoverview GPA Calculator Service
 * @module academic-transcript/services/gpa-calculator.service
 * @description Service for calculating Grade Point Average
 */

import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '../../shared/base/base.service';
import { SubjectGrade } from '../interfaces/academic-record.interface';

/**
 * GPA Calculator Service
 *
 * Handles Grade Point Average calculations using standard 4.0 scale.
 * Supports credit-weighted GPA calculation with plus/minus grade variations.
 */
@Injectable()
export class GpaCalculatorService extends BaseService {
  constructor(protected readonly requestContext: RequestContextService) {
    super(requestContext);
  }

  /**
   * Grade point mapping for 4.0 scale
   */
  private readonly gradePoints: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    'D+': 1.3,
    D: 1.0,
    'D-': 0.7,
    F: 0.0,
  };

  /**
   * Calculate GPA from subject grades
   *
   * Calculates Grade Point Average using the standard 4.0 scale with credit weighting.
   * Handles grade variations (A+, A, A-) and returns rounded result.
   *
   * @param {SubjectGrade[]} subjects - Array of subject grades with credits
   *
   * @returns {number} Calculated GPA rounded to 2 decimal places (0.00 - 4.00)
   *
   * @example
   * ```typescript
   * const gpa = this.calculateGPA([
   *   { subjectName: 'Math', grade: 'A', credits: 3 },
   *   { subjectName: 'English', grade: 'B+', credits: 3 }
   * ]);
   * // Returns: 3.65
   * ```
   *
   * @remarks
   * - Uses 4.0 scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0
   * - Supports plus/minus grades (A+, A-, B+, etc.)
   * - Credit-weighted: Higher credit courses have more impact
   * - Returns 0.00 if no subjects provided
   * - Grade points rounded to 2 decimal places
   * - Unknown grades default to 0.0 points
   */
  calculateGPA(subjects: SubjectGrade[]): number {
    if (subjects.length === 0) {
      this.logger.debug('No subjects provided, returning GPA of 0');
      return 0;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
      const points = this.gradePoints[subject.grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;

      if (!this.gradePoints[subject.grade]) {
        this.logger.warn(
          `Unknown grade '${subject.grade}' for subject '${subject.subjectName}', defaulting to 0 points`,
        );
      }
    });

    const gpa =
      totalCredits > 0
        ? Math.round((totalPoints / totalCredits) * 100) / 100
        : 0;

    this.logger.debug(
      `Calculated GPA: ${gpa} from ${subjects.length} subjects with ${totalCredits} total credits`,
    );

    return gpa;
  }

  /**
   * Calculate cumulative GPA from multiple academic periods
   *
   * Calculates average GPA across multiple academic records.
   *
   * @param {number[]} gpas - Array of GPA values from different periods
   * @returns {number} Average GPA rounded to 2 decimal places
   *
   * @example
   * ```typescript
   * const cumulativeGPA = this.calculateCumulativeGPA([3.5, 3.7, 3.4]);
   * // Returns: 3.53
   * ```
   */
  calculateCumulativeGPA(gpas: number[]): number {
    if (gpas.length === 0) return 0;

    const sum = gpas.reduce((acc, gpa) => acc + gpa, 0);
    const average = sum / gpas.length;

    return Math.round(average * 100) / 100;
  }

  /**
   * Get grade point value for a specific grade
   *
   * @param {string} grade - Letter grade (e.g., 'A', 'B+', 'C-')
   * @returns {number} Grade point value (0.0 - 4.0)
   */
  getGradePoint(grade: string): number {
    return this.gradePoints[grade] || 0;
  }

  /**
   * Validate if a grade is recognized in the grading system
   *
   * @param {string} grade - Letter grade to validate
   * @returns {boolean} True if grade is valid, false otherwise
   */
  isValidGrade(grade: string): boolean {
    return grade in this.gradePoints;
  }
}
