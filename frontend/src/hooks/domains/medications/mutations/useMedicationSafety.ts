/**
 * @fileoverview Medication Safety Hook - Backward Compatibility Export
 *
 * This file maintains backward compatibility by re-exporting from the refactored
 * medication safety module. The original 934-line file has been broken down into
 * smaller, focused modules for better maintainability.
 *
 * ## Refactored Structure
 *
 * The medication safety functionality has been reorganized into the following modules:
 *
 * - **medicationSafetyTypes.ts** - Type definitions and interfaces
 * - **useMedicationSafetyCore.ts** - Core comprehensive safety checking
 * - **useMedicationAllergyChecks.ts** - Allergy verification
 * - **useMedicationDosageValidation.ts** - Dosage validation
 * - **index.ts** - Main export combining all modules
 *
 * ## Migration Guide
 *
 * No code changes required! This file maintains the same API as before.
 *
 * Old import (still works):
 * ```tsx
 * import { useMedicationSafety } from '@/hooks/domains/medications/mutations/useMedicationSafety';
 * ```
 *
 * New import (recommended):
 * ```tsx
 * import { useMedicationSafety } from '@/hooks/domains/medications/mutations/useMedicationSafety';
 * ```
 *
 * All exports remain identical, ensuring seamless backward compatibility.
 *
 * @module useMedicationSafety
 *
 * @see {@link useMedicationSafety/index} for main implementation
 */

// Re-export everything from the refactored module directory
export { useMedicationSafety } from './useMedicationSafety/index';
export type { MedicationSafetyCheck } from './useMedicationSafety/index';
export { SafetySeverity, AllergySeverity, InteractionSeverity } from './useMedicationSafety/index';
