/**
 * @module stores/slices/students/computed-selectors
 *
 * Computed Students State Selectors
 *
 * Provides complex selector functions that perform filtering, sorting, pagination,
 * and other computations on student data. These selectors should be memoized with
 * reselect's createSelector in production for optimal performance.
 *
 * @remarks
 * **Performance:** These selectors perform computations and should be memoized
 * to prevent unnecessary recalculations on unrelated state changes.
 *
 * **Type Safety:** All selectors use proper RootState typing instead of 'any'
 * for compile-time type checking and better IDE support.
 *
 * @since 1.0.0
 */

import { Student } from '@/types/student.types';
import { studentsSelectors as entitySelectors } from './entity-slice';
import { RootState, PaginationInfo } from './types';

/**
 * Selector for filtered and sorted students.
 *
 * Applies filters, search query, and sorting to all students. This is a complex
 * selector that performs client-side filtering and sorting.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Filtered and sorted student array
 *
 * @remarks
 * **Performance:** Should be memoized with reselect's createSelector for production
 * use with large datasets to prevent unnecessary recalculations on unrelated state changes.
 *
 * **Filtering Logic:**
 * - Activity filter (show/hide inactive students)
 * - Text search (firstName, lastName, studentNumber, grade)
 * - Grade filter (exact match)
 * - Nurse assignment filter (exact match)
 * - Allergy presence filter (has/doesn't have allergies)
 * - Medication presence filter (has/doesn't have medications)
 *
 * **Sorting Logic:**
 * - name: Sorts by "lastName, firstName" alphabetically
 * - grade: Sorts by grade level
 * - enrollmentDate: Sorts by enrollment date chronologically
 * - lastVisit: Sorts by most recent appointment date
 *
 * **Type Safety:** Removed 'any' type assertions from comparisons, using proper
 * type narrowing with union types instead.
 *
 * @example
 * ```typescript
 * const filteredStudents = useSelector(selectFilteredAndSortedStudents);
 * console.log(`Showing ${filteredStudents.length} students`);
 * ```
 */
export const selectFilteredAndSortedStudents = (state: RootState): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  const { filters, searchQuery, showInactive, sortBy, sortOrder } = state.students.ui;

  let filteredStudents = allStudents;

  // Apply activity filter
  if (!showInactive) {
    filteredStudents = filteredStudents.filter(student => student.isActive);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredStudents = filteredStudents.filter(student =>
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.studentNumber.toLowerCase().includes(query) ||
      student.grade.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.grade) {
    filteredStudents = filteredStudents.filter(student => student.grade === filters.grade);
  }
  if (filters.nurseId) {
    filteredStudents = filteredStudents.filter(student => student.nurseId === filters.nurseId);
  }
  if (filters.hasAllergies !== undefined) {
    filteredStudents = filteredStudents.filter(student =>
      filters.hasAllergies ? (student.allergies && student.allergies.length > 0) :
                            !(student.allergies && student.allergies.length > 0)
    );
  }
  if (filters.hasMedications !== undefined) {
    filteredStudents = filteredStudents.filter(student =>
      filters.hasMedications ? (student.medications && student.medications.length > 0) :
                              !(student.medications && student.medications.length > 0)
    );
  }

  // Apply sorting with proper type handling
  filteredStudents.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case 'name':
        aValue = `${a.lastName}, ${a.firstName}`;
        bValue = `${b.lastName}, ${b.firstName}`;
        break;
      case 'grade':
        aValue = a.grade;
        bValue = b.grade;
        break;
      case 'enrollmentDate':
        aValue = new Date(a.enrollmentDate);
        bValue = new Date(b.enrollmentDate);
        break;
      case 'lastVisit':
        // Get most recent appointment date as last visit
        aValue = a.appointments && a.appointments.length > 0
          ? new Date(Math.max(...a.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        bValue = b.appointments && b.appointments.length > 0
          ? new Date(Math.max(...b.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        break;
      default:
        aValue = a.lastName;
        bValue = b.lastName;
    }

    // Type-safe comparison without 'any' assertions
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filteredStudents;
};

/**
 * Selector for paginated students.
 *
 * Returns the current page of students based on filtered/sorted results and
 * pagination settings.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Students for current page
 *
 * @remarks
 * **Performance:** Pagination reduces DOM rendering load for large student lists.
 * **Dependencies:** Relies on selectFilteredAndSortedStudents for input data.
 *
 * @example
 * ```typescript
 * const currentPageStudents = useSelector(selectPaginatedStudents);
 * // Returns students for current page (e.g., 20 students for page 2)
 * ```
 */
export const selectPaginatedStudents = (state: RootState): Student[] => {
  const filteredStudents = selectFilteredAndSortedStudents(state);
  const { currentPage, pageSize } = state.students.ui;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return filteredStudents.slice(startIndex, endIndex);
};

/**
 * Selector for pagination metadata.
 *
 * Provides comprehensive pagination information including total count, page numbers,
 * and navigation availability.
 *
 * @param {RootState} state - Redux root state
 * @returns {PaginationInfo} Pagination metadata
 *
 * @example
 * ```typescript
 * const paginationInfo = useSelector(selectStudentPaginationInfo);
 * console.log(`Showing ${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${paginationInfo.totalStudents}`);
 * ```
 */
export const selectStudentPaginationInfo = (state: RootState): PaginationInfo => {
  const totalStudents = selectFilteredAndSortedStudents(state).length;
  const { currentPage, pageSize } = state.students.ui;

  return {
    totalStudents,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalStudents / pageSize),
    hasNextPage: currentPage * pageSize < totalStudents,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalStudents),
  };
};

/**
 * Selector for selected student entities.
 *
 * Returns full student objects for all selected IDs.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Array of selected student entities
 *
 * @example
 * ```typescript
 * const selectedStudents = useSelector(selectSelectedStudents);
 * const selectedNames = selectedStudents.map(s => `${s.firstName} ${s.lastName}`);
 * ```
 */
export const selectSelectedStudents = (state: RootState): Student[] => {
  const selectedIds = state.students.ui.selectedIds;
  return selectedIds
    .map((id: string) => entitySelectors.selectById(state, id))
    .filter((student): student is Student => student !== undefined);
};

/**
 * Selector for active students only.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Array of active students
 *
 * @remarks
 * **HIPAA Data Minimization:** By default, only active students are shown to limit
 * exposure of potentially outdated PHI.
 *
 * @example
 * ```typescript
 * const activeStudents = useSelector(selectActiveStudents);
 * ```
 */
export const selectActiveStudents = (state: RootState): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.isActive);
};

/**
 * Selector for students by grade.
 *
 * @param {RootState} state - Redux root state
 * @param {string} grade - Grade to filter by (e.g., 'K', '1', '2', ..., '12')
 * @returns {Student[]} Students in specified grade
 *
 * @example
 * ```typescript
 * const fifthGraders = useSelector(state => selectStudentsByGrade(state, '5'));
 * ```
 */
export const selectStudentsByGrade = (state: RootState, grade: string): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.grade === grade);
};

/**
 * Selector for students assigned to a specific nurse.
 *
 * @param {RootState} state - Redux root state
 * @param {string} nurseId - Nurse ID to filter by
 * @returns {Student[]} Students assigned to specified nurse
 *
 * @example
 * ```typescript
 * const myStudents = useSelector(state => selectStudentsByNurse(state, currentNurseId));
 * ```
 */
export const selectStudentsByNurse = (state: RootState, nurseId: string): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.nurseId === nurseId);
};

/**
 * Selector for students with allergies.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Students with one or more documented allergies
 *
 * @remarks
 * **Healthcare Alert:** These students require special attention for medication
 * administration and should have allergy information prominently displayed.
 *
 * @example
 * ```typescript
 * const studentsWithAllergies = useSelector(selectStudentsWithAllergies);
 * const allergyCount = studentsWithAllergies.length;
 * ```
 */
export const selectStudentsWithAllergies = (state: RootState): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.allergies && student.allergies.length > 0);
};

/**
 * Selector for students with active medications.
 *
 * @param {RootState} state - Redux root state
 * @returns {Student[]} Students with one or more active medications
 *
 * @remarks
 * **Healthcare Alert:** These students require medication administration tracking
 * and should be monitored for side effects and compliance.
 *
 * @example
 * ```typescript
 * const studentsWithMeds = useSelector(selectStudentsWithMedications);
 * ```
 */
export const selectStudentsWithMedications = (state: RootState): Student[] => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.medications && student.medications.length > 0);
};

/**
 * Selector for student by student number.
 *
 * @param {RootState} state - Redux root state
 * @param {string} studentNumber - Student number to search for (e.g., 'STU-2024-001')
 * @returns {Student | undefined} Student with matching student number, or undefined if not found
 *
 * @remarks
 * **Unique Identifier:** Student number is a unique identifier enforced by backend validation.
 *
 * @example
 * ```typescript
 * const student = useSelector(state => selectStudentByNumber(state, 'STU-2024-001'));
 * if (student) {
 *   console.log(`Found: ${student.firstName} ${student.lastName}`);
 * }
 * ```
 */
export const selectStudentByNumber = (state: RootState, studentNumber: string): Student | undefined => {
  const allStudents = entitySelectors.selectAll(state) as Student[];
  return allStudents.find(student => student.studentNumber === studentNumber);
};
