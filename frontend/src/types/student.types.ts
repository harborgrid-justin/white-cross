/**
 * Student Types - Re-export Module
 *
 * This module provides a convenient re-export of all student-related types
 * from their canonical location in the domain types directory.
 *
 * ## Purpose
 *
 * Many parts of the codebase import student types using the path
 * `@/types/student.types` for convenience. This file ensures backward
 * compatibility and provides a single, predictable import path.
 *
 * ## Usage
 *
 * ```typescript
 * // Import from this convenient path
 * import { Student, EmergencyContact, HealthRecord } from '@/types/student.types';
 *
 * // Or import from the canonical domain location
 * import { Student, EmergencyContact, HealthRecord } from '@/types/domain/student.types';
 *
 * // Or import from the main types index
 * import { Student, EmergencyContact, HealthRecord } from '@/types';
 * ```
 *
 * @module types/student.types
 */

// Re-export all student-related types from their canonical location
export * from './domain/student.types';
