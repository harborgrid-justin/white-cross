/**
 * @fileoverview Shared Route Module Exports
 *
 * Central aggregation point for shared route utilities, validators, and type definitions
 * used across all API v1 routes. Provides common functionality for response formatting,
 * validation schemas, and TypeScript type definitions.
 *
 * @module routes/shared
 * @see {@link module:routes/shared/utils} for response helper functions
 * @see {@link module:routes/shared/validators} for common Joi validation schemas
 * @see {@link module:routes/shared/types/route.types} for TypeScript type definitions
 * @since 1.0.0
 */

export * from './utils';
export * from './validators';
export * from './types/route.types';
