/**
 * Redux Store Type Definitions
 *
 * Purpose: Centralized type exports to break circular dependencies
 * This file contains only type definitions and has NO imports from store files
 *
 * NOTE: RootState and AppDispatch are defined in reduxStore.ts and re-exported here
 * This file serves as a forward reference point to break circular dependencies
 */

// These types will be defined in reduxStore.ts and imported by files that need them
// This file exists to provide a central import point without circular dependencies

/**
 * Placeholder types - actual types exported from reduxStore.ts
 * Other files should import from './types' instead of './reduxStore'
 */
export type { RootState, AppDispatch } from './reduxStore';
