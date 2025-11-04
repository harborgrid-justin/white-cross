/**
 * Composite Selector Utilities
 *
 * Utilities for combining multiple selectors into one.
 *
 * @module hooks/utilities/selectors/composite
 * @category State Management - Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { SelectorFn } from './types';

// ============================================================
// COMPOSITE SELECTORS
// ============================================================

/**
 * Combine multiple selectors into one
 *
 * @example
 * ```ts
 * const selectStudentData = createCompositeSelector({
 *   student: (state) => state.students.entities[id],
 *   healthRecords: (state) => state.healthRecords.byStudent[id],
 *   medications: (state) => state.medications.byStudent[id],
 * });
 * ```
 */
export function createCompositeSelector<
  T extends Record<string, any>
>(
  selectors: { [K in keyof T]: SelectorFn<T[K]> }
): SelectorFn<T> {
  return createSelector(
    Object.values(selectors) as SelectorFn<any>[],
    (...results) => {
      const keys = Object.keys(selectors);
      return keys.reduce((acc, key, index) => {
        acc[key as keyof T] = results[index];
        return acc;
      }, {} as T);
    }
  );
}
