/**
 * Types Module - Main Export
 *
 * Central export point for all TypeScript type definitions in the application.
 * This module provides a clean, organized interface to import types throughout the codebase.
 *
 * ## Directory Structure
 *
 * - `core/` - Foundational types (common, api, state, errors, etc.)
 * - `domain/` - Business domain types (students, medications, appointments, etc.)
 * - `augmentations/` - Third-party library type declarations
 *
 * ## Usage
 *
 * ```typescript
 * // Import from main index (recommended)
 * import { Student, User, ApiResponse } from '@/types';
 *
 * // Import from specific modules (when avoiding namespace pollution)
 * import { Student } from '@/types/domain';
 * import { ApiResponse } from '@/types/core';
 * ```
 *
 * @module types
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Core types include foundational types used across the entire application:
 * - Common types (BaseEntity, User, enums, etc.)
 * - API types (responses, mutations, requests)
 * - State management types
 * - Error handling types
 * - Utility types
 */
export * from './core';

// ============================================================================
// DOMAIN TYPES
// ============================================================================

/**
 * Domain types include business-specific entities and workflows:
 * - Students
 * - Medications
 * - Appointments
 * - Health Records
 * - Incidents
 * - And more...
 */
export * from './domain';

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

/**
 * Legacy exports for backward compatibility.
 * These re-export commonly used types from their new locations.
 * @deprecated Import from '@/types/core' or '@/types/domain' for better clarity
 */

// Re-export most commonly used core types at root level for convenience
export type {
  // Base types
  BaseEntity,
  BasePersonEntity,
  BaseAddressEntity,
  BaseAuditEntity,

  // User and authentication
  User,
  UserRole,

  // API types
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationResponse,
  PaginationParams,

  // Common enums
  Gender,
  Priority,
  Status,

  // Utility types
  CreateRequest,
  UpdateRequest,
} from './core/common';

// Re-export most commonly used domain types at root level
export type {
  Student,
  EmergencyContact,
} from './domain/student.types';

export type {
  Appointment,
  AppointmentType,
  AppointmentStatus,
} from './domain/appointments';

export type {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
} from './domain/incidents';

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Export type guards and utility functions from API module
 */
export {
  isApiResponse,
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,
  isMutationSuccess,
  isMutationError,
} from './core/api';

// ============================================================================
// GUI BUILDER TYPES
// ============================================================================

/**
 * GUI Builder types include comprehensive type definitions for the
 * Next.js drag-and-drop page builder system:
 * - Core types (brands, utilities, validation)
 * - Component definitions and registry
 * - Property schemas and bindings
 * - Layout and responsive design
 * - Editor state and history
 * - Workflows and routing
 * - Code generation and templates
 * - Versioning and collaboration
 *
 * @example
 * ```typescript
 * import type { ComponentDefinition, PropertySchema } from '@/types/gui-builder';
 * ```
 */
export * from './gui-builder';

// ============================================================================
// MODULE AUGMENTATIONS
// ============================================================================

/**
 * Module augmentations for third-party libraries are automatically loaded
 * by TypeScript compiler. No explicit exports needed.
 *
 * Location: ./augmentations/
 * Files:
 * - apollo-client.d.ts
 * - react-router-dom.d.ts
 * - tanstack-react-query.d.ts
 * - sentry.d.ts
 * - zod.d.ts
 * - notification-api.d.ts
 * - react-dom.d.ts
 */
