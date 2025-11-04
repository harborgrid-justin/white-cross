/**
 * Student Redux Integration - Barrel Export
 *
 * Central export point for all Redux integration hooks and types.
 *
 * @module hooks/students/redux
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Types
export type { StudentUIState, StudentUIActions } from './studentRedux.types';

// Mock selectors and actions
export { mockSelectors, mockActions } from './studentRedux.mocks';

// Hooks
export { useStudentsWithRedux } from './studentRedux.hooks';
export { useStudentSelection } from './studentRedux.selection';
export { useReduxSync } from './studentRedux.sync';
export { useViewPreferences } from './studentRedux.preferences';
export { useBulkOperations } from './studentRedux.bulk';

// Default export
export { default } from './studentRedux';
