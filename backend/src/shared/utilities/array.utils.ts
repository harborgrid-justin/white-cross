/**
 * LOC: 6A0A563B29
 * File: /backend/src/shared/utils/array.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - lodashUtils.ts (utils/lodashUtils.ts)
 */

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

import * as _ from 'lodash';

/**
 * Shared array utility functions using lodash
 * Provides type-safe lodash wrappers for frequently used array operations
 */

/**
 * Groups array of objects by a specified key property.
 *
 * @template T - The type of objects in the array
 * @param {T[]} array - Array of objects to group
 * @param {keyof T} key - The property key to group by
 * @returns {Record<string, T[]>} Object with keys as group identifiers and values as arrays of grouped items
 *
 * @example
 * ```typescript
 * interface Student { id: string; grade: string; name: string }
 * const students: Student[] = [
 *   { id: '1', grade: '10', name: 'Alice' },
 *   { id: '2', grade: '10', name: 'Bob' },
 *   { id: '3', grade: '11', name: 'Charlie' }
 * ];
 * const grouped = groupBy(students, 'grade');
 * // Result: { '10': [Alice, Bob], '11': [Charlie] }
 * ```
 */
export const groupBy = <T>(array: T[], key: keyof T) => _.groupBy(array, key);

/**
 * Removes duplicate objects from array based on a specified key property.
 *
 * @template T - The type of objects in the array
 * @param {T[]} array - Array of objects to deduplicate
 * @param {keyof T} key - The property key to use for uniqueness comparison
 * @returns {T[]} Array with duplicates removed (first occurrence kept)
 *
 * @example
 * ```typescript
 * interface Medication { id: string; name: string }
 * const meds = [
 *   { id: '1', name: 'Aspirin' },
 *   { id: '1', name: 'Aspirin' },
 *   { id: '2', name: 'Ibuprofen' }
 * ];
 * const unique = uniqBy(meds, 'id');
 * // Result: [{ id: '1', name: 'Aspirin' }, { id: '2', name: 'Ibuprofen' }]
 * ```
 */
export const uniqBy = <T>(array: T[], key: keyof T) => _.uniqBy(array, key);

/**
 * Splits array into smaller arrays (chunks) of specified size.
 * Useful for batch processing or pagination.
 *
 * @template T - The type of items in the array
 * @param {T[]} array - Array to split into chunks
 * @param {number} size - The size of each chunk (must be positive integer)
 * @returns {T[][]} Array of arrays, each containing up to 'size' elements
 *
 * @example
 * ```typescript
 * const records = [1, 2, 3, 4, 5, 6, 7, 8];
 * const batches = chunk(records, 3);
 * // Result: [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export const chunk = <T>(array: T[], size: number) => _.chunk(array, size);

/**
 * Finds the intersection of multiple arrays (common elements present in all arrays).
 * Uses strict equality comparison.
 *
 * @template T - The type of items in the arrays
 * @param {T[][]} arrays - Arrays to intersect
 * @returns {T[]} Array containing only elements present in all input arrays
 *
 * @example
 * ```typescript
 * const allergies1 = ['peanuts', 'shellfish', 'dairy'];
 * const allergies2 = ['peanuts', 'soy', 'dairy'];
 * const allergies3 = ['peanuts', 'dairy', 'eggs'];
 * const common = intersection([allergies1, allergies2, allergies3]);
 * // Result: ['peanuts', 'dairy']
 * ```
 */
export const intersection = <T>(arrays: T[][]) => _.intersection(...arrays);

/**
 * Removes all falsy values from array (false, null, undefined, 0, NaN, empty string).
 *
 * @template T - The type of non-falsy items in the array
 * @param {(T | null | undefined | false | 0 | '')[]} array - Array to compact
 * @returns {T[]} Array with all falsy values removed
 *
 * @example
 * ```typescript
 * const data = [1, null, 'text', undefined, 0, false, 'valid'];
 * const cleaned = compact(data);
 * // Result: [1, 'text', 'valid']
 * ```
 */
export const compact = <T>(array: (T | null | undefined | false | 0 | '')[]) => _.compact(array);

/**
 * Flattens nested arrays by one level.
 *
 * @template T - The type of items in the deepest arrays
 * @param {(T | T[])[]} array - Array that may contain nested arrays
 * @returns {T[]} Flattened array (one level deep)
 *
 * @example
 * ```typescript
 * const nested = [[1, 2], [3, 4], 5];
 * const flat = flatten(nested);
 * // Result: [1, 2, 3, 4, 5]
 * ```
 */
export const flatten = <T>(array: (T | T[])[]) => _.flatten(array);

/**
 * Recursively flattens nested arrays to any depth.
 *
 * @param {any[]} array - Array that may contain deeply nested arrays
 * @returns {any[]} Completely flattened array
 *
 * @example
 * ```typescript
 * const deeplyNested = [1, [2, [3, [4, 5]]]];
 * const flat = flattenDeep(deeplyNested);
 * // Result: [1, 2, 3, 4, 5]
 * ```
 */
export const flattenDeep = (array: any[]) => _.flattenDeep(array);

// Healthcare-specific array utilities
/**
 * Groups medications by student ID for efficient student-medication lookup.
 *
 * @template T - Medication type that extends object with studentId property
 * @param {T[]} medications - Array of medication records
 * @returns {Record<string, T[]>} Object mapping student IDs to their medications
 *
 * @example
 * ```typescript
 * interface Medication { studentId: string; name: string; dosage: string }
 * const meds: Medication[] = [
 *   { studentId: 'S1', name: 'Aspirin', dosage: '500mg' },
 *   { studentId: 'S1', name: 'Ibuprofen', dosage: '200mg' },
 *   { studentId: 'S2', name: 'Antibiotic', dosage: '250mg' }
 * ];
 * const grouped = groupMedicationsByStudent(meds);
 * // Result: { 'S1': [Aspirin, Ibuprofen], 'S2': [Antibiotic] }
 * ```
 */
export const groupMedicationsByStudent = <T extends { studentId: string }>(medications: T[]) => {
  return _.groupBy(medications, 'studentId');
};

/**
 * Groups health records by type for categorized health data analysis.
 *
 * @template T - Health record type that extends object with type property
 * @param {T[]} records - Array of health records
 * @returns {Record<string, T[]>} Object mapping record types to arrays of records
 *
 * @example
 * ```typescript
 * interface HealthRecord { type: string; description: string; date: Date }
 * const records: HealthRecord[] = [
 *   { type: 'allergy', description: 'Peanut allergy', date: new Date() },
 *   { type: 'immunization', description: 'Flu shot', date: new Date() },
 *   { type: 'allergy', description: 'Shellfish allergy', date: new Date() }
 * ];
 * const grouped = groupHealthRecordsByType(records);
 * // Result: { 'allergy': [...], 'immunization': [...] }
 * ```
 */
export const groupHealthRecordsByType = <T extends { type: string }>(records: T[]) => {
  return _.groupBy(records, 'type');
};

/**
 * Filters array to include only records marked as active.
 *
 * @template T - Record type that extends object with isActive boolean property
 * @param {T[]} records - Array of records with active status
 * @returns {T[]} Array containing only records where isActive is true
 *
 * @example
 * ```typescript
 * interface Record { id: string; isActive: boolean; data: string }
 * const records = [
 *   { id: '1', isActive: true, data: 'Active record' },
 *   { id: '2', isActive: false, data: 'Inactive record' },
 *   { id: '3', isActive: true, data: 'Another active' }
 * ];
 * const active = filterActiveRecords(records);
 * // Result: [{ id: '1', ... }, { id: '3', ... }]
 * ```
 */
export const filterActiveRecords = <T extends { isActive: boolean }>(records: T[]) => {
  return _.filter(records, 'isActive');
};

/**
 * Sorts records by creation date in descending order (newest first).
 *
 * @template T - Record type with createdAt property (Date or ISO string)
 * @param {T[]} records - Array of records to sort
 * @returns {T[]} Sorted array with newest records first
 *
 * @example
 * ```typescript
 * interface Visit { id: string; createdAt: Date; notes: string }
 * const visits: Visit[] = [
 *   { id: '1', createdAt: new Date('2024-01-01'), notes: 'First visit' },
 *   { id: '2', createdAt: new Date('2024-03-01'), notes: 'Latest visit' },
 *   { id: '3', createdAt: new Date('2024-02-01'), notes: 'Second visit' }
 * ];
 * const sorted = sortByDateDesc(visits);
 * // Result: [id: '2' (March), id: '3' (February), id: '1' (January)]
 * ```
 */
export const sortByDateDesc = <T extends { createdAt: string | Date }>(records: T[]) => {
  return _.orderBy(records, ['createdAt'], ['desc']);
};

/**
 * Sorts records by creation date in ascending order (oldest first).
 *
 * @template T - Record type with createdAt property (Date or ISO string)
 * @param {T[]} records - Array of records to sort
 * @returns {T[]} Sorted array with oldest records first
 *
 * @example
 * ```typescript
 * interface Appointment { id: string; createdAt: Date; type: string }
 * const appointments = [
 *   { id: '1', createdAt: new Date('2024-03-01'), type: 'Checkup' },
 *   { id: '2', createdAt: new Date('2024-01-01'), type: 'Follow-up' }
 * ];
 * const sorted = sortByDateAsc(appointments);
 * // Result: [id: '2' (January), id: '1' (March)]
 * ```
 */
export const sortByDateAsc = <T extends { createdAt: string | Date }>(records: T[]) => {
  return _.orderBy(records, ['createdAt'], ['asc']);
};

/**
 * Groups appointments by nurse ID for nurse workload analysis and scheduling.
 *
 * @template T - Appointment type with nurseId property
 * @param {T[]} appointments - Array of appointment records
 * @returns {Record<string, T[]>} Object mapping nurse IDs to their appointments
 *
 * @example
 * ```typescript
 * interface Appointment { nurseId: string; time: Date; studentId: string }
 * const appointments = [
 *   { nurseId: 'N1', time: new Date(), studentId: 'S1' },
 *   { nurseId: 'N1', time: new Date(), studentId: 'S2' },
 *   { nurseId: 'N2', time: new Date(), studentId: 'S3' }
 * ];
 * const grouped = groupAppointmentsByNurse(appointments);
 * // Result: { 'N1': [2 appointments], 'N2': [1 appointment] }
 * ```
 */
export const groupAppointmentsByNurse = <T extends { nurseId: string }>(appointments: T[]) => {
  return _.groupBy(appointments, 'nurseId');
};

/**
 * Groups students by grade level for class-based organization and reporting.
 *
 * @template T - Student type with grade property
 * @param {T[]} students - Array of student records
 * @returns {Record<string, T[]>} Object mapping grade levels to arrays of students
 *
 * @example
 * ```typescript
 * interface Student { id: string; grade: string; name: string }
 * const students = [
 *   { id: '1', grade: '9', name: 'Alice' },
 *   { id: '2', grade: '10', name: 'Bob' },
 *   { id: '3', grade: '9', name: 'Charlie' }
 * ];
 * const grouped = groupStudentsByGrade(students);
 * // Result: { '9': [Alice, Charlie], '10': [Bob] }
 * ```
 */
export const groupStudentsByGrade = <T extends { grade: string }>(students: T[]) => {
  return _.groupBy(students, 'grade');
};

/**
 * Filters emergency contacts by priority level (e.g., 'primary', 'secondary', 'emergency').
 *
 * @template T - Contact type with priority property
 * @param {T[]} contacts - Array of emergency contact records
 * @param {string} priority - Priority level to filter by
 * @returns {T[]} Array of contacts matching the specified priority
 *
 * @example
 * ```typescript
 * interface Contact { priority: string; name: string; phone: string }
 * const contacts = [
 *   { priority: 'primary', name: 'Parent', phone: '555-0001' },
 *   { priority: 'secondary', name: 'Guardian', phone: '555-0002' },
 *   { priority: 'primary', name: 'Mother', phone: '555-0003' }
 * ];
 * const primaryContacts = filterEmergencyContactsByPriority(contacts, 'primary');
 * // Result: [Parent, Mother]
 * ```
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
