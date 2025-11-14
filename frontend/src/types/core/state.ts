/**
 * WF-COMP-334 | state.ts - State management types main export
 * Purpose: Backward compatibility export for state management types
 * Upstream: All state modules | Dependencies: Modular state type files
 * Downstream: Components, stores, hooks | Called by: Application code
 * Related: Redux store, React Context, async thunks, helpers
 * Exports: All state types and utilities
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type imports → State management → Component usage
 * LLM Context: Main export file for state management types (re-exports from state/ subdirectory)
 */

/**
 * State Management Type Definitions
 *
 * Comprehensive TypeScript types for Redux store and React Context state management.
 * This file re-exports all state-related types from the modular state/ subdirectory.
 * White Cross healthcare platform.
 *
 * @module types/state
 *
 * @remarks
 * This file maintains backward compatibility by re-exporting all types from the
 * state/ subdirectory. All type definitions have been modularized for better
 * maintainability. Each subdirectory file is < 400 lines.
 *
 * Structure:
 * - state/utility-types.ts - Core utility types (RequestStatus, LoadingState, etc.)
 * - state/entity-types.ts - Entity and collection types (EntityState, FilterState, etc.)
 * - state/redux-state.ts - Redux store state slices (RootState, IncidentReportsState, etc.)
 * - state/context-state.ts - React Context state definitions
 * - state/action-payloads.ts - Action payload type definitions
 * - state/state-helpers.ts - Helper functions and utilities
 */

// Re-export all types and functions from state subdirectory
export * from './state';
