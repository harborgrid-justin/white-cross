/**
 * @fileoverview Identity Access - Stores Barrel Export
 * @module identity-access/stores
 * 
 * Note: For specific actions and types, import directly from the slice files
 * to avoid naming conflicts and maintain explicit imports.
 */

// Export reducers for Redux store configuration
export { default as authReducer } from './authSlice';
export { default as accessControlReducer } from './accessControlSlice';

// Re-export slice modules for direct access to actions/types
export * as authSlice from './authSlice';
export * as accessControlSlice from './accessControlSlice';
