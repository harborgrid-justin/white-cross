/**
 * Selector Type Definitions
 *
 * Core types and basic selector utilities for memoized Redux selectors.
 *
 * @module hooks/utilities/selectors/types
 * @category State Management - Selectors
 */

import { createSelector, createDraftSafeSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/stores/store';

/**
 * Selector function type
 */
export type SelectorFn<T> = (state: RootState) => T;

/**
 * Parametric selector function type
 */
export type ParametricSelectorFn<T, P> = (state: RootState, params: P) => T;

// ============================================================
// BASIC MEMOIZED SELECTORS
// ============================================================

/**
 * Create a simple memoized selector
 *
 * @example
 * ```ts
 * const selectActiveStudents = createMemoizedSelector(
 *   (state: RootState) => state.students.entities,
 *   (entities) => Object.values(entities).filter(s => s.isActive)
 * );
 * ```
 */
export const createMemoizedSelector = createSelector;

/**
 * Create a draft-safe memoized selector (for use with Immer)
 *
 * @example
 * ```ts
 * const selectStudentCount = createDraftSafeMemoizedSelector(
 *   (state: RootState) => state.students.ids,
 *   (ids) => ids.length
 * );
 * ```
 */
export const createDraftSafeMemoizedSelector = createDraftSafeSelector;
