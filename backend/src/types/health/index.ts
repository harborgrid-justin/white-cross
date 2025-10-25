/**
 * Health types barrel export.
 * Central export point for all health-related type definitions.
 *
 * @module types/health
 *
 * @remarks
 * Re-exports all healthcare data types including vital signs, health records,
 * allergies, vaccinations, and chronic conditions. All exported types represent
 * Protected Health Information (PHI) and must be handled according to HIPAA standards.
 *
 * @example
 * ```typescript
 * import { VitalSigns, HealthRecordInfo, AllergyInfo } from '@/types/health';
 * ```
 *
 * @see {@link VitalSigns} for vital sign measurements
 * @see {@link HealthRecordInfo} for health record data
 */

export * from './vital-signs.types';
export * from './health-record.types';
