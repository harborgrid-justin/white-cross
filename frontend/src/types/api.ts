/**
 * @fileoverview API Types Barrel Export
 * @module types/api
 * @category Types
 *
 * Backward compatibility barrel file that re-exports types from legacy/api.ts
 * This allows imports like `from '@/types/api'` to continue working.
 *
 * @example
 * ```typescript
 * import { Medication, MedicationReminder, Priority } from '@/types/api';
 * ```
 */

// Re-export all types from legacy API types for backward compatibility
export * from './legacy/api';
