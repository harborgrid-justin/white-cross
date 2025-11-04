/**
 * Best Practice Selector Examples
 *
 * Example implementations of selectors using the utilities.
 *
 * @module hooks/utilities/selectors/examples
 * @category State Management - Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/stores/store';
import { createFilteredSelector } from './filtering';
import { createGroupBySelector, createCountSelector } from './aggregation';
import { createParametricSelector } from './parametric';

// ============================================================
// BEST PRACTICE EXAMPLES
// ============================================================

/**
 * Example: Student-related selectors
 */
export const studentSelectors = {
  /**
   * Select all students as array
   */
  selectAllStudents: createSelector(
    [(state: RootState) => state.students],
    ({ ids, entities }) => ids.map(id => entities[id]).filter(Boolean)
  ),

  /**
   * Select active students
   */
  selectActiveStudents: createFilteredSelector(
    (state: RootState) => state.students,
    (student: any) => student.isActive === true
  ),

  /**
   * Select students by grade
   */
  selectStudentsByGrade: createGroupBySelector(
    (state: RootState) => state.students,
    (student: any) => student.grade
  ),

  /**
   * Select student count
   */
  selectStudentCount: createCountSelector(
    (state: RootState) => state.students
  ),

  /**
   * Select student by ID (parametric)
   */
  selectStudentById: createParametricSelector(
    (id: string) => (state: RootState) => state.students.entities[id]
  ),
};
