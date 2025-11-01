/**
 * Students Slice - Re-export from canonical location
 * 
 * This file re-exports all members from the canonical studentsSlice
 * located in pages/students/store/studentsSlice.ts
 */

// Re-export everything from the canonical location
export {
  // Types
  type StudentUIState,
  type StudentFilters,
  
  // Slice
  studentsSlice,
  studentsReducer,
  
  // Actions
  studentsActions,
  
  // Selectors
  studentsSelectors,
  studentsThunks,
  selectStudentUIState,
  selectSelectedStudentIds,
  selectStudentViewMode,
  selectStudentFilters,
  selectStudentSort,
  selectStudentPagination,
  selectStudentSearchQuery,
  selectShowInactiveStudents,
  selectIsBulkSelectMode,
  selectExpandedStudentCards,
  selectFilteredAndSortedStudents,
  selectPaginatedStudents,
  selectStudentPaginationInfo,
  selectSelectedStudents,
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsByNurse,
  selectStudentsWithAllergies,
  selectStudentsWithMedications,
  selectStudentByNumber,
} from '../../pages/students/store/studentsSlice';

// Default export
export { studentsReducer as default } from '../../pages/students/store/studentsSlice';
