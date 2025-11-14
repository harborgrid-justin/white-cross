/**
 * Student Selection Hooks
 * 
 * Specialized Redux hooks for managing student selection state.
 * Provides fine-grained control over student selection for bulk operations,
 * multi-select interfaces, and cross-component state management.
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectSelectedStudentIds,
  selectSelectedStudents,
  selectIsBulkSelectMode,
  studentsSelectors,
} from '@/stores/slices/students';
import type { Student } from '@/types/student.types';

/**
 * Hook for managing student selection state
 * 
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   selectedStudents,
 *   selectStudent,
 *   deselectStudent,
 *   selectAll,
 *   clearSelection,
 *   isBulkMode,
 *   toggleBulkMode
 * } = useStudentSelection();
 * 
 * // Select a student
 * selectStudent('student-123');
 * 
 * // Select multiple students
 * selectMultiple(['student-1', 'student-2']);
 * 
 * // Select all visible students
 * selectAll(allStudentIds);
 * ```
 */
export const useStudentSelection = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const selectedIds = useAppSelector(selectSelectedStudentIds);
  const selectedStudents = useAppSelector(selectSelectedStudents);
  const isBulkMode = useAppSelector(selectIsBulkSelectMode);
  
  // Actions
  const selectStudent = useCallback((id: string) => {
    dispatch(studentsActions.selectStudent(id));
  }, [dispatch]);

  const deselectStudent = useCallback((id: string) => {
    dispatch(studentsActions.deselectStudent(id));
  }, [dispatch]);

  const toggleStudent = useCallback((id: string) => {
    if (selectedIds.includes(id)) {
      dispatch(studentsActions.deselectStudent(id));
    } else {
      dispatch(studentsActions.selectStudent(id));
    }
  }, [dispatch, selectedIds]);

  const selectMultiple = useCallback((ids: string[]) => {
    dispatch(studentsActions.selectMultipleStudents(ids));
  }, [dispatch]);

  const selectAll = useCallback((allIds: string[]) => {
    dispatch(studentsActions.selectAllStudents(allIds));
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(studentsActions.clearSelection());
  }, [dispatch]);

  const toggleBulkMode = useCallback(() => {
    dispatch(studentsActions.toggleBulkSelectMode());
  }, [dispatch]);

  // Computed values
  const selectedCount = selectedIds.length;
  const hasSelection = selectedCount > 0;
  const isAllSelected = useCallback((availableIds: string[]) => {
    return availableIds.length > 0 && availableIds.every(id => selectedIds.includes(id));
  }, [selectedIds]);

  const isPartiallySelected = useCallback((availableIds: string[]) => {
    return availableIds.some(id => selectedIds.includes(id)) && !isAllSelected(availableIds);
  }, [selectedIds, isAllSelected]);

  return {
    // State
    selectedIds,
    selectedStudents,
    selectedCount,
    hasSelection,
    isBulkMode,
    
    // Actions
    selectStudent,
    deselectStudent,
    toggleStudent,
    selectMultiple,
    selectAll,
    clearSelection,
    toggleBulkMode,
    
    // Computed helpers
    isSelected: (id: string) => selectedIds.includes(id),
    isAllSelected,
    isPartiallySelected,
  };
};

/**
 * Hook for managing student selection with automatic cleanup
 * Automatically clears selection when component unmounts or when specified
 * 
 * @param clearOnUnmount - Whether to clear selection when component unmounts
 * 
 * @example
 * ```tsx
 * const selection = useStudentSelectionWithCleanup(true);
 * 
 * // Selection will be automatically cleared when component unmounts
 * ```
 */
export const useStudentSelectionWithCleanup = (clearOnUnmount: boolean = false) => {
  const selection = useStudentSelection();

  // Auto-cleanup on unmount
  useEffect(() => {
    if (clearOnUnmount) {
      return () => {
        selection.clearSelection();
      };
    }
  }, [clearOnUnmount, selection.clearSelection]);

  return selection;
};

/**
 * Hook for selection with validation rules
 * Provides selection with built-in validation and constraints
 * 
 * @param options - Selection validation options
 * 
 * @example
 * ```tsx
 * const selection = useValidatedStudentSelection({
 *   maxSelection: 10,
 *   allowInactive: false,
 *   requiredGrades: ['K', '1', '2']
 * });
 * 
 * // Will validate before selecting
 * selection.selectStudentWithValidation('student-123');
 * ```
 */
export const useValidatedStudentSelection = (options: {
  maxSelection?: number;
  allowInactive?: boolean;
  requiredGrades?: string[];
  requiredNurse?: string;
} = {}) => {
  const baseSelection = useStudentSelection();
  const allStudents = useAppSelector((state) => studentsSelectors.selectAll(state));

  const validateStudent = useCallback((studentId: string): { valid: boolean; reason?: string } => {
    const student = allStudents.find(s => s.id === studentId);
    
    if (!student) {
      return { valid: false, reason: 'Student not found' };
    }

    if (!options.allowInactive && !student.isActive) {
      return { valid: false, reason: 'Inactive students cannot be selected' };
    }

    if (options.requiredGrades && !options.requiredGrades.includes(student.grade)) {
      return { valid: false, reason: `Only students in grades ${options.requiredGrades.join(', ')} can be selected` };
    }

    if (options.requiredNurse && student.nurseId !== options.requiredNurse) {
      return { valid: false, reason: 'Only students assigned to the specified nurse can be selected' };
    }

    if (options.maxSelection && baseSelection.selectedCount >= options.maxSelection) {
      return { valid: false, reason: `Maximum ${options.maxSelection} students can be selected` };
    }

    return { valid: true };
  }, [allStudents, options, baseSelection.selectedCount]);

  const selectStudentWithValidation = useCallback((studentId: string) => {
    const validation = validateStudent(studentId);
    if (validation.valid) {
      baseSelection.selectStudent(studentId);
      return { success: true };
    } else {
      return { success: false, reason: validation.reason };
    }
  }, [validateStudent, baseSelection.selectStudent]);

  const selectMultipleWithValidation = useCallback((studentIds: string[]) => {
    const results = studentIds.map(id => ({
      id,
      ...validateStudent(id)
    }));

    const validIds = results.filter(r => r.valid).map(r => r.id);
    const invalidResults = results.filter(r => !r.valid);

    if (validIds.length > 0) {
      baseSelection.selectMultiple(validIds);
    }

    return {
      selected: validIds.length,
      failed: invalidResults.length,
      errors: invalidResults.map(r => ({ id: r.id, reason: r.reason }))
    };
  }, [validateStudent, baseSelection.selectMultiple]);

  return {
    ...baseSelection,
    selectStudentWithValidation,
    selectMultipleWithValidation,
    validateStudent,
  };
};

/**
 * Hook for advanced selection operations
 * Provides complex selection operations like range selection, conditional selection, etc.
 */
export const useAdvancedStudentSelection = () => {
  const baseSelection = useStudentSelection();
  const allStudents = useAppSelector((state) => studentsSelectors.selectAll(state));

  const selectRange = useCallback((startId: string, endId: string, studentList: Student[]) => {
    const startIndex = studentList.findIndex(s => s.id === startId);
    const endIndex = studentList.findIndex(s => s.id === endId);
    
    if (startIndex === -1 || endIndex === -1) return;

    const [start, end] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
    const rangeIds = studentList.slice(start, end + 1).map(s => s.id);
    
    baseSelection.selectMultiple(rangeIds);
  }, [baseSelection.selectMultiple]);

  const selectByCondition = useCallback((predicate: (student: Student) => boolean) => {
    const matchingIds = allStudents.filter(predicate).map(s => s.id);
    baseSelection.selectMultiple(matchingIds);
  }, [allStudents, baseSelection.selectMultiple]);

  const selectByGrade = useCallback((grade: string) => {
    selectByCondition(student => student.grade === grade);
  }, [selectByCondition]);

  const selectByNurse = useCallback((nurseId: string) => {
    selectByCondition(student => student.nurseId === nurseId);
  }, [selectByCondition]);

  const selectWithAllergies = useCallback(() => {
    selectByCondition(student => student.allergies && student.allergies.length > 0);
  }, [selectByCondition]);

  const selectWithMedications = useCallback(() => {
    selectByCondition(student => student.medications && student.medications.length > 0);
  }, [selectByCondition]);

  const selectInactive = useCallback(() => {
    selectByCondition(student => !student.isActive);
  }, [selectByCondition]);

  const invertSelection = useCallback((availableIds: string[]) => {
    const currentlySelected = baseSelection.selectedIds;
    const newSelection = availableIds.filter(id => !currentlySelected.includes(id));
    baseSelection.clearSelection();
    baseSelection.selectMultiple(newSelection);
  }, [baseSelection]);

  return {
    ...baseSelection,
    selectRange,
    selectByCondition,
    selectByGrade,
    selectByNurse,
    selectWithAllergies,
    selectWithMedications,
    selectInactive,
    invertSelection,
  };
};
