/**
 * Redux Integration Hooks for Student Management
 *
 * Hooks that bridge TanStack Query server state with Redux UI state,
 * providing seamless integration between server data and global UI state.
 *
 * This file has been refactored into smaller modules for better maintainability.
 * All exports are re-exported from their respective modules.
 *
 * @module hooks/students/redux
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Re-export all types
export type { StudentUIState, StudentUIActions } from './studentRedux.types';

// Re-export mock selectors and actions
export { mockSelectors, mockActions } from './studentRedux.mocks';

// Re-export all hooks
export { useStudentsWithRedux } from './studentRedux.hooks';
export { useStudentSelection } from './studentRedux.selection';
export { useReduxSync } from './studentRedux.sync';
export { useViewPreferences } from './studentRedux.preferences';
export { useBulkOperations } from './studentRedux.bulk';

/**
 * Default export: all Redux integration hooks
 */
export default {
  useStudentsWithRedux: require('./studentRedux.hooks').useStudentsWithRedux,
  useStudentSelection: require('./studentRedux.selection').useStudentSelection,
  useReduxSync: require('./studentRedux.sync').useReduxSync,
  useViewPreferences: require('./studentRedux.preferences').useViewPreferences,
  useBulkOperations: require('./studentRedux.bulk').useBulkOperations,
};
