/**
 * Integration types barrel export.
 * Central export point for third-party integration type definitions.
 *
 * @module types/integration
 *
 * @remarks
 * Re-exports all integration configuration types for SIS, LMS, EHR, SMS,
 * email, and custom webhook integrations. Uses discriminated unions for
 * type-safe configuration handling.
 *
 * @example
 * ```typescript
 * import { IntegrationSettings, EHRIntegrationSettings } from '@/types/integration';
 *
 * const ehrConfig: EHRIntegrationSettings = {
 *   type: 'EHR',
 *   ehrSystem: 'Epic',
 *   syncVitals: true
 * };
 * ```
 */

export * from './integration-settings.types';
