/**
 * @module stores/slices/students/selection-reducers
 *
 * Students Selection Reducers
 *
 * Redux reducers for managing student selection state including single select,
 * multi-select, bulk select mode, and card expansion state.
 *
 * @remarks
 * **Selection Patterns:** Supports various selection patterns:
 * - Single selection (click)
 * - Multi-selection (Ctrl/Cmd + click)
 * - Range selection (Shift + click)
 * - Bulk select mode (checkbox-based mass selection)
 *
 * @since 1.0.0
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { StudentUIState } from './types';

/**
 * Selection reducer collection for student UI state.
 *
 * Contains all reducers related to selecting, deselecting, and managing
 * selection state for students.
 */
export const selectionReducers = {
  /**
   * Selects a single student (adds to selection if not already selected).
   *
   * @param state - Current UI state
   * @param action - Action with student ID payload
   *
   * @remarks
   * **Multi-Select:** Adds to existing selection without clearing previous selections.
   * Use clearSelection first for single-select behavior.
   *
   * **Deduplication:** Checks if ID already exists before adding to prevent duplicates.
   */
  selectStudent: (state: StudentUIState, action: PayloadAction<string>) => {
    if (!state.selectedIds.includes(action.payload)) {
      state.selectedIds.push(action.payload);
    }
  },

  /**
   * Deselects a single student (removes from selection).
   *
   * @param state - Current UI state
   * @param action - Action with student ID payload
   *
   * @remarks
   * **Safe Removal:** If ID doesn't exist in selection, operation is a no-op.
   */
  deselectStudent: (state: StudentUIState, action: PayloadAction<string>) => {
    state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
  },

  /**
   * Selects multiple students (adds to existing selection).
   *
   * @param state - Current UI state
   * @param action - Action with array of student IDs
   *
   * @remarks
   * **Deduplication:** Only adds IDs not already in selection to prevent duplicates.
   *
   * **Use Cases:**
   * - Shift-click range selection
   * - Select all filtered results
   * - Restore previous selection state
   */
  selectMultipleStudents: (state: StudentUIState, action: PayloadAction<string[]>) => {
    const newIds = action.payload.filter(id => !state.selectedIds.includes(id));
    state.selectedIds.push(...newIds);
  },

  /**
   * Selects all students (replaces current selection).
   *
   * @param state - Current UI state
   * @param action - Action with array of all student IDs to select
   *
   * @remarks
   * **Replace:** Clears existing selection and selects all provided IDs.
   *
   * **Typical Usage:** "Select All" button in UI that selects all visible/filtered students.
   */
  selectAllStudents: (state: StudentUIState, action: PayloadAction<string[]>) => {
    state.selectedIds = action.payload;
  },

  /**
   * Clears all student selections.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Use Cases:**
   * - User clicks "Clear Selection" button
   * - Exiting bulk select mode
   * - After completing bulk operations (print, export, etc.)
   * - Navigation away from student list
   */
  clearSelection: (state: StudentUIState) => {
    state.selectedIds = [];
  },

  /**
   * Toggles bulk select mode on/off.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Auto-Clear:** When disabling bulk select mode, automatically clears selection
   * to provide clean exit from bulk operations workflow.
   *
   * **UI Behavior:** When enabled, shows checkboxes and bulk operation toolbar.
   * When disabled, hides checkboxes and returns to normal view.
   */
  toggleBulkSelectMode: (state: StudentUIState) => {
    state.bulkSelectMode = !state.bulkSelectMode;
    if (!state.bulkSelectMode) {
      state.selectedIds = [];
    }
  },

  /**
   * Toggles card expansion for a student in card view.
   *
   * @param state - Current UI state
   * @param action - Action with student ID payload
   *
   * @remarks
   * **Performance:** Collapsing cards improves performance by reducing rendered content.
   * Consider auto-collapsing cards when scrolling or when too many are expanded.
   *
   * **Toggle Behavior:** If card is expanded, collapse it. If collapsed, expand it.
   */
  toggleCardExpansion: (state: StudentUIState, action: PayloadAction<string>) => {
    const studentId = action.payload;
    if (state.expandedCards.includes(studentId)) {
      state.expandedCards = state.expandedCards.filter(id => id !== studentId);
    } else {
      state.expandedCards.push(studentId);
    }
  },

  /**
   * Collapses all student cards.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Performance:** Used when switching views or scrolling to improve performance
   * by reducing the amount of rendered DOM content.
   *
   * **Use Cases:**
   * - Switching from grid view to another view
   * - User clicks "Collapse All" button
   * - Performance optimization when many cards are expanded
   */
  collapseAllCards: (state: StudentUIState) => {
    state.expandedCards = [];
  },
};
