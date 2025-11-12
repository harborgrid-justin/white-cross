/**
 * @module stores/slices/students/ui-slice
 *
 * Students UI Redux Slice
 *
 * Combines selection and view reducers into a single Redux slice for managing
 * all UI-related state for student management views.
 *
 * @remarks
 * **Modular Reducers:** Reducers are organized into logical groups (selection, view)
 * for better maintainability and code organization.
 *
 * **Immer Integration:** Redux Toolkit uses Immer internally for immutable updates.
 *
 * @since 1.0.0
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialUIState } from './ui-state-config';
import { selectionReducers } from './selection-reducers';
import { viewReducers } from './view-reducers';

/**
 * UI state slice for student management.
 *
 * Manages view preferences, selection state, filters, sorting, and pagination
 * separately from entity data to enable flexible UI state management.
 *
 * @const
 */
export const studentUISlice = createSlice({
  name: 'studentUI',
  initialState: initialUIState,
  reducers: {
    ...selectionReducers,
    ...viewReducers,
  },
});

/**
 * UI action creators.
 *
 * Exported action creators for dispatching UI state changes.
 *
 * @exports studentUIActions
 */
export const studentUIActions = studentUISlice.actions;

/**
 * UI reducer.
 *
 * Exported reducer for integration with Redux store.
 *
 * @exports studentUIReducer
 */
export const studentUIReducer = studentUISlice.reducer;
