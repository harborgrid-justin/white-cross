/**
 * LOC: EAEAB433E0
 * WC-UTL-LDS-055 | Lodash Healthcare Utilities & Legacy Compatibility Layer
 *
 * UPSTREAM (imports from):
 *   - array.ts (shared/utils/array.ts)
 *   - object.ts (shared/utils/object.ts)
 *   - string.ts (shared/utils/string.ts)
 *   - date.ts (shared/utils/date.ts)
 *   - validation.ts (shared/utils/validation.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-UTL-LDS-055 | Lodash Healthcare Utilities & Legacy Compatibility Layer
 * Purpose: Healthcare-specific utility functions, mathematical operations, student data
 * Upstream: shared/utils/*, lodash library | Dependencies: lodash, shared/utils/*
 * Downstream: Services, routes, data processing | Called by: Business logic components
 * Related: shared/utils/*, services/*, healthcare data processing
 * Exports: healthcareUtils, mathUtils, functionUtils, legacy re-exports
 * Last Updated: 2025-10-18 | Dependencies: lodash, shared/utils modules
 * Critical Path: Data input → Utility processing → Business logic execution
 * LLM Context: Healthcare calculations, student grouping, medication tracking, age calculation
 */

/**
 * Backend utility functions using lodash for common operations
 * 
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../shared/utils' instead for new code.
 */

// Re-export from shared utilities for backward compatibility
import * as arrayUtils from '../shared/utils/array';
import * as objectUtils from '../shared/utils/object';
import * as stringUtils from '../shared/utils/string';
import * as dateUtils from '../shared/utils/date';
import * as validationUtils from '../shared/utils/validation';
import _ from 'lodash';

// Export array utilities
export { arrayUtils };

// Export object utilities
export { objectUtils };

// Export string utilities
export { stringUtils };

// Function utilities (not moved to shared yet)
export const functionUtils = {
  /**
   * Debounces function calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: _.DebounceSettings
  ) => _.debounce(func, wait, options),

  /**
   * Throttles function calls
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: _.ThrottleSettings
  ) => _.throttle(func, wait, options),

  /**
   * Memoizes function results
   */
  memoize: <T extends (...args: any[]) => any>(func: T) => _.memoize(func),

  /**
   * Creates a function that negates the result of the predicate
   */
  negate: <T>(predicate: (...args: T[]) => boolean) => _.negate(predicate),
};

// Export date utilities
export { dateUtils };

// Export validation utilities
export { validationUtils };

// Math utilities
export const mathUtils = {
  /**
   * Calculates sum of array of numbers
   */
  sum: (array: number[]) => _.sum(array),

  /**
   * Calculates average of array of numbers
   */
  mean: (array: number[]) => _.mean(array),

  /**
   * Finds minimum value in array
   */
  min: (array: number[]) => _.min(array),

  /**
   * Finds maximum value in array
   */
  max: (array: number[]) => _.max(array),

  /**
   * Rounds number to specified precision
   */
  round: (num: number, precision: number = 0) => _.round(num, precision),

  /**
   * Generates random number between min and max
   */
  random: (min: number = 0, max: number = 1) => _.random(min, max),
};

// Healthcare-specific utilities
export const healthcareUtils = {
  /**
   * Groups medications by student
   */
  groupMedicationsByStudent: <T extends { studentId: string }>(medications: T[]) => {
    return _.groupBy(medications, 'studentId');
  },

  /**
   * Groups health records by type
   */
  groupHealthRecordsByType: <T extends { type: string }>(records: T[]) => {
    return _.groupBy(records, 'type');
  },

  /**
   * Filters active records only
   */
  filterActiveRecords: <T extends { isActive: boolean }>(records: T[]) => {
    return _.filter(records, 'isActive');
  },

  /**
   * Sorts records by date (newest first)
   */
  sortByDateDesc: <T extends { createdAt: string | Date }>(records: T[]) => {
    return _.orderBy(records, ['createdAt'], ['desc']);
  },

  /**
   * Sorts records by date (oldest first)
   */
  sortByDateAsc: <T extends { createdAt: string | Date }>(records: T[]) => {
    return _.orderBy(records, ['createdAt'], ['asc']);
  },

  /**
   * Groups appointments by nurse
   */
  groupAppointmentsByNurse: <T extends { nurseId: string }>(appointments: T[]) => {
    return _.groupBy(appointments, 'nurseId');
  },

  /**
   * Calculates age from date of birth
   */
  calculateAge: (dateOfBirth: Date | string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  },

  /**
   * Groups students by grade
   */
  groupStudentsByGrade: <T extends { grade: string }>(students: T[]) => {
    return _.groupBy(students, 'grade');
  },

  /**
   * Filters emergency contacts by priority
   */
  filterEmergencyContactsByPriority: <T extends { priority: string }>(
    contacts: T[],
    priority: string
  ) => {
    return _.filter(contacts, { priority });
  },
};

export default {
  arrayUtils,
  objectUtils,
  stringUtils,
  functionUtils,
  dateUtils,
  validationUtils,
  mathUtils,
  healthcareUtils,
};
