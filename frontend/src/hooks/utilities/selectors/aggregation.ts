/**
 * Aggregation Selector Utilities
 *
 * Utilities for creating aggregation selectors (count, groupBy, etc.).
 *
 * @module hooks/utilities/selectors/aggregation
 * @category State Management - Selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { SelectorFn } from './types';

// ============================================================
// AGGREGATION SELECTORS
// ============================================================

/**
 * Create a count selector
 *
 * @example
 * ```ts
 * const selectActiveStudentCount = createCountSelector(
 *   (state) => state.students,
 *   (student) => student.isActive
 * );
 * ```
 */
export function createCountSelector<Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate?: (entity: Entity) => boolean
): SelectorFn<number> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      if (!predicate) return ids.length;

      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate)
        .length;
    }
  );
}

/**
 * Create a groupBy selector
 *
 * @example
 * ```ts
 * const selectStudentsByGrade = createGroupBySelector(
 *   (state) => state.students,
 *   (student) => student.grade
 * );
 * // Returns: { '1': [...], '2': [...], ... }
 * ```
 */
export function createGroupBySelector<Entity, K extends string | number>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  keyFn: (entity: Entity) => K
): SelectorFn<Record<K, Entity[]>> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      const groups = {} as Record<K, Entity[]>;

      ids.forEach(id => {
        const entity = entities[id];
        if (entity) {
          const key = keyFn(entity);
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(entity);
        }
      });

      return groups;
    }
  );
}
