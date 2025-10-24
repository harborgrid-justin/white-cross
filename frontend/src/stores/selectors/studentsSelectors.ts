/**
 * Students Selectors
 *
 * Memoized selectors for student data with optimized filtering and searching.
 * Uses Reselect for performance optimization.
 *
 * @module stores/selectors/studentsSelectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';
import {
  createFilterSelector,
  createGroupBySelector,
  createSearchSelector,
  createSortSelector,
  createCountSelector
} from '../utils/selectors';

/**
 * Base selector - select students state
 */
export const selectStudentsState = (state: RootState) => state.students;

/**
 * Select all students array
 */
export const selectAllStudents = createSelector(
  [selectStudentsState],
  (studentsState) => Object.values(studentsState.entities || {}).filter(Boolean)
);

/**
 * Select students loading state
 */
export const selectStudentsLoading = createSelector(
  [selectStudentsState],
  (studentsState) => studentsState.isLoading || false
);

/**
 * Select students error
 */
export const selectStudentsError = createSelector(
  [selectStudentsState],
  (studentsState) => studentsState.error
);

/**
 * Select student by ID (parameterized selector)
 */
export const selectStudentById = createSelector(
  [selectStudentsState, (_state: RootState, studentId: string) => studentId],
  (studentsState, studentId) => studentsState.entities?.[studentId] || null
);

/**
 * Select active students only
 */
export const selectActiveStudents = createSelector(
  [selectAllStudents],
  (students) => students.filter(student => student.isActive !== false)
);

/**
 * Select students by grade (memoized)
 */
export const selectStudentsByGrade = createSelector(
  [selectAllStudents, (_state: RootState, grade: string | number) => grade],
  (students, grade) => students.filter(student => student.grade === grade)
);

/**
 * Select students with allergies
 */
export const selectStudentsWithAllergies = createSelector(
  [selectAllStudents],
  (students) => students.filter(student =>
    student.allergies && student.allergies.length > 0
  )
);

/**
 * Select students with active medications
 */
export const selectStudentsWithMedications = createSelector(
  [selectAllStudents],
  (students) => students.filter(student =>
    student.medications && student.medications.length > 0
  )
);

/**
 * Select students with specific medical conditions
 */
export const selectStudentsByMedicalCondition = createSelector(
  [selectAllStudents, (_state: RootState, condition: string) => condition],
  (students, condition) => students.filter(student =>
    student.medicalConditions?.includes(condition)
  )
);

/**
 * Select students by nurse assignment
 */
export const selectStudentsByNurse = createSelector(
  [selectAllStudents, (_state: RootState, nurseId: string) => nurseId],
  (students, nurseId) => students.filter(student => student.assignedNurseId === nurseId)
);

/**
 * Select students by school
 */
export const selectStudentsBySchool = createSelector(
  [selectAllStudents, (_state: RootState, schoolId: string) => schoolId],
  (students, schoolId) => students.filter(student => student.schoolId === schoolId)
);

/**
 * Group students by grade
 */
export const selectStudentsGroupedByGrade = createGroupBySelector(
  selectAllStudents,
  (student) => student.grade?.toString() || 'Unknown'
);

/**
 * Group students by school
 */
export const selectStudentsGroupedBySchool = createGroupBySelector(
  selectAllStudents,
  (student) => student.schoolId || 'Unknown'
);

/**
 * Search students by name or student number
 */
export const selectStudentsSearch = createSelector(
  [selectAllStudents, (_state: RootState, query: string) => query],
  (students, query) => {
    if (!query || query.trim() === '') return students;

    const lowerQuery = query.toLowerCase();
    return students.filter(student =>
      student.firstName?.toLowerCase().includes(lowerQuery) ||
      student.lastName?.toLowerCase().includes(lowerQuery) ||
      student.studentNumber?.toLowerCase().includes(lowerQuery) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerQuery)
    );
  }
);

/**
 * Sort students alphabetically by name
 */
export const selectStudentsSortedByName = createSortSelector(
  selectAllStudents,
  (a, b) => {
    const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
    const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }
);

/**
 * Sort students by grade
 */
export const selectStudentsSortedByGrade = createSortSelector(
  selectAllStudents,
  (a, b) => {
    const gradeA = parseInt(a.grade?.toString() || '0', 10);
    const gradeB = parseInt(b.grade?.toString() || '0', 10);
    return gradeA - gradeB;
  }
);

/**
 * Count students by status
 */
export const selectStudentCounts = createSelector(
  [selectAllStudents],
  (students) => ({
    total: students.length,
    active: students.filter(s => s.isActive !== false).length,
    withAllergies: students.filter(s => s.allergies && s.allergies.length > 0).length,
    withMedications: students.filter(s => s.medications && s.medications.length > 0).length,
    withIEP: students.filter(s => s.hasIEP).length,
    with504: students.filter(s => s.has504Plan).length,
  })
);

/**
 * Select students requiring immediate attention
 * (e.g., missing medications, urgent health alerts)
 */
export const selectStudentsRequiringAttention = createSelector(
  [selectAllStudents],
  (students) => students.filter(student =>
    student.urgentAlerts || student.missingMedication || student.requiresFollowUp
  )
);

/**
 * Select students with upcoming medication times
 */
export const selectStudentsWithUpcomingMedications = createSelector(
  [selectAllStudents],
  (students) => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return students.filter(student =>
      student.nextMedicationTime &&
      new Date(student.nextMedicationTime) <= oneHourFromNow
    );
  }
);

/**
 * Select student statistics summary
 */
export const selectStudentStatistics = createSelector(
  [selectAllStudents],
  (students) => {
    const gradeDistribution = students.reduce((acc, student) => {
      const grade = student.grade?.toString() || 'Unknown';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.isActive !== false).length,
      gradeDistribution,
      studentsWithAllergies: students.filter(s => s.allergies?.length > 0).length,
      studentsWithMedications: students.filter(s => s.medications?.length > 0).length,
      studentsRequiringAttention: students.filter(s => s.urgentAlerts || s.requiresFollowUp).length,
    };
  }
);

/**
 * Select student by student number (unique identifier)
 */
export const selectStudentByNumber = createSelector(
  [selectAllStudents, (_state: RootState, studentNumber: string) => studentNumber],
  (students, studentNumber) => students.find(student => student.studentNumber === studentNumber) || null
);

/**
 * Complex filter: Students with multiple conditions
 */
export const selectStudentsFiltered = createSelector(
  [
    selectAllStudents,
    (_state: RootState, filters: {
      grade?: string | number;
      schoolId?: string;
      hasAllergies?: boolean;
      hasMedications?: boolean;
      nurseId?: string;
      searchQuery?: string;
    }) => filters
  ],
  (students, filters) => {
    let filtered = students;

    if (filters.grade !== undefined) {
      filtered = filtered.filter(s => s.grade === filters.grade);
    }

    if (filters.schoolId) {
      filtered = filtered.filter(s => s.schoolId === filters.schoolId);
    }

    if (filters.hasAllergies) {
      filtered = filtered.filter(s => s.allergies && s.allergies.length > 0);
    }

    if (filters.hasMedications) {
      filtered = filtered.filter(s => s.medications && s.medications.length > 0);
    }

    if (filters.nurseId) {
      filtered = filtered.filter(s => s.assignedNurseId === filters.nurseId);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName?.toLowerCase().includes(query) ||
        s.lastName?.toLowerCase().includes(query) ||
        s.studentNumber?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);
