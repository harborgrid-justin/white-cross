/**
 * Barrel file for modules module
 * Provides clean public API
 */

// Force compilation
export const _barrel = true;

// Module files
export * from './dynamic-resource-pool.module';
export * from './memory-optimized-cache.module';
export * from './smart-garbage-collection.module';

// Submodules
export * from './decorators';
export * from './guards';
export * from './interceptors';
export * from './services';

