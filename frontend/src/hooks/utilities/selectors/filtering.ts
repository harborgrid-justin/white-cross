/**
 * Filtering and Sorting Selector Utilities
 *
 * Utilities for creating filtered and sorted selectors with memoization.
 *
 * @module hooks/utilities/selectors/filtering
 * @category State Management - Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { SelectorFn } from './types';

// ============================================================
// FILTERED & SORTED SELECTORS
// ============================================================

/**
 * Create a filtered selector with memoization
 *
 * @example
 * ```ts
 * const selectActiveStudents = createFilteredSelector(
 *   (state) => state.students,
 *   (student) => student.isActive === true
 * );
 * ```
 */
export function createFilteredSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate: (entity: Entity) => boolean
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate);
    }
  );
}

/**
 * Create a sorted selector with memoization
 *
 * @example
 * ```ts
 * const selectStudentsSortedByName = createSortedSelector(
 *   (state) => state.students,
 *   (a, b) => a.lastName.localeCompare(b.lastName)
 * );
 * ```
 */
export function createSortedSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  compareFn: (a: Entity, b: Entity) => number
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .sort(compareFn);
    }
  );
}

/**
 * Create a filtered and sorted selector
 *
 * @example
 * ```ts
 * const selectActiveStudentsByGrade = createFilteredAndSortedSelector(
 *   (state) => state.students,
 *   (student) => student.isActive,
 *   (a, b) => a.grade.localeCompare(b.grade)
 * );
 * ```
 */
export function createFilteredAndSortedSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate: (entity: Entity) => boolean,
  compareFn: (a: Entity, b: Entity) => number
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate)
        .sort(compareFn);
    }
  );
}
