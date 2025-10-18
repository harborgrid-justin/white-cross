/**
 * File: /backend/src/shared/utils/array.ts
 * Locator: WC-UTL-ARR-072
 * Purpose: Healthcare-Focused Array Utilities - Medical data manipulation and grouping
 * 
 * Upstream: lodash library, independent utility module
 * Downstream: ../services/*, healthcare data processing, student/medication grouping
 * Dependencies: lodash, TypeScript generics, healthcare data types
 * Exports: groupBy, uniqBy, chunk, healthcare-specific grouping functions
 * 
 * LLM Context: Type-safe array utilities for White Cross healthcare system.
 * Provides lodash wrappers plus healthcare-specific functions for medication grouping,
 * student sorting, appointment management. Critical for data processing performance.
 */

import _ from 'lodash';

/**
 * Shared array utility functions using lodash
 * Provides type-safe lodash wrappers for frequently used array operations
 */

/**
 * Groups array of objects by a key
 */
export const groupBy = <T>(array: T[], key: keyof T) => _.groupBy(array, key);

/**
 * Removes duplicates from array of objects by a key
 */
export const uniqBy = <T>(array: T[], key: keyof T) => _.uniqBy(array, key);

/**
 * Chunks array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number) => _.chunk(array, size);

/**
 * Finds intersection of multiple arrays
 */
export const intersection = <T>(arrays: T[][]) => _.intersection(...arrays);

/**
 * Removes falsy values from array
 */
export const compact = <T>(array: (T | null | undefined | false | 0 | '')[]) => _.compact(array);

/**
 * Flattens nested arrays
 */
export const flatten = <T>(array: (T | T[])[]) => _.flatten(array);

/**
 * Deep flattens nested arrays
 */
export const flattenDeep = (array: any[]) => _.flattenDeep(array);

// Healthcare-specific array utilities
/**
 * Groups medications by student
 */
export const groupMedicationsByStudent = <T extends { studentId: string }>(medications: T[]) => {
  return _.groupBy(medications, 'studentId');
};

/**
 * Groups health records by type
 */
export const groupHealthRecordsByType = <T extends { type: string }>(records: T[]) => {
  return _.groupBy(records, 'type');
};

/**
 * Filters active records only
 */
export const filterActiveRecords = <T extends { isActive: boolean }>(records: T[]) => {
  return _.filter(records, 'isActive');
};

/**
 * Sorts records by date (newest first)
 */
export const sortByDateDesc = <T extends { createdAt: string | Date }>(records: T[]) => {
  return _.orderBy(records, ['createdAt'], ['desc']);
};

/**
 * Sorts records by date (oldest first)
 */
export const sortByDateAsc = <T extends { createdAt: string | Date }>(records: T[]) => {
  return _.orderBy(records, ['createdAt'], ['asc']);
};

/**
 * Groups appointments by nurse
 */
export const groupAppointmentsByNurse = <T extends { nurseId: string }>(appointments: T[]) => {
  return _.groupBy(appointments, 'nurseId');
};

/**
 * Groups students by grade
 */
export const groupStudentsByGrade = <T extends { grade: string }>(students: T[]) => {
  return _.groupBy(students, 'grade');
};

/**
 * Filters emergency contacts by priority
 */
export const filterEmergencyContactsByPriority = <T extends { priority: string }>(
  contacts: T[],
  priority: string
) => {
  return _.filter(contacts, { priority });
};

export default {
  groupBy,
  uniqBy,
  chunk,
  intersection,
  compact,
  flatten,
  flattenDeep,
  groupMedicationsByStudent,
  groupHealthRecordsByType,
  filterActiveRecords,
  sortByDateDesc,
  sortByDateAsc,
  groupAppointmentsByNurse,
  groupStudentsByGrade,
  filterEmergencyContactsByPriority
};
