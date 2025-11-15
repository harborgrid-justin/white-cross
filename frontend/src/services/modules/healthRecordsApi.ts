/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * This service module has been replaced by Next.js Server Actions for improved
 * performance, security, and Next.js App Router compatibility.
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 * - Migration Period: 6 months
 *
 * REPLACEMENT LOCATIONS:
 * - Server Components: @/lib/actions/health-records.actions
 * - Client Components: @/lib/actions/health-records.actions (with useActionState)
 * - API Client (if needed): @/lib/api/client
 * - Server API (SSR): @/lib/api/server
 *
 * MIGRATION GUIDE - COMMON OPERATIONS:
 *
 * 1. CREATE HEALTH RECORD
 * OLD (Deprecated):
 * ```typescript
 * import { healthRecordsApi } from '@/services/modules/healthRecordsApi';
 * const record = await healthRecordsApi.records.createRecord({
 *   studentId: 'uuid',
 *   type: 'ILLNESS',
 *   date: '2024-01-15',
 *   description: 'Student complained of headache'
 * });
 * ```
 *
 * NEW (Server Action):
 * ```typescript
 * import { createHealthRecordAction } from '@/lib/actions/health-records.crud';
 * // In Server Component
 * const result = await createHealthRecordAction({
 *   studentId: 'uuid',
 *   type: 'ILLNESS',
 *   date: '2024-01-15',
 *   description: 'Student complained of headache'
 * });
 * // In Client Component with form
 * 'use client';
 * import { useActionState } from 'react';
 * const [state, formAction] = useActionState(createHealthRecordAction, {});
 * <form action={formAction}>...</form>
 * ```
 *
 * 2. GET HEALTH RECORDS
 * OLD (Deprecated):
 * ```typescript
 * const records = await healthRecordsApi.records.getRecords('student-id', {
 *   type: 'ILLNESS',
 *   dateFrom: '2024-01-01'
 * });
 * ```
 *
 * NEW (Server Action):
 * ```typescript
 * import { getHealthRecordsAction } from '@/lib/actions/health-records.crud';
 * const result = await getHealthRecordsAction({
 *   studentId: 'student-id',
 *   type: 'ILLNESS',
 *   dateFrom: '2024-01-01'
 * });
 * ```
 *
 * 3. ALLERGIES MANAGEMENT
 * OLD (Deprecated):
 * ```typescript
 * const allergies = await healthRecordsApi.allergies.getAllergies('student-id');
 * const newAllergy = await healthRecordsApi.allergies.create({
 *   studentId: 'student-id',
 *   allergen: 'Peanuts',
 *   severity: 'SEVERE',
 *   reaction: 'Anaphylaxis'
 * });
 * ```
 *
 * NEW (Server Action):
 * ```typescript
 * import {
 *   getStudentAllergiesAction,
 *   createAllergyAction
 * } from '@/lib/actions/health-records.allergies';
 * const allergiesResult = await getStudentAllergiesAction({ studentId: 'student-id' });
 * const allergyResult = await createAllergyAction({
 *   studentId: 'student-id',
 *   allergen: 'Peanuts',
 *   severity: 'SEVERE',
 *   reaction: 'Anaphylaxis'
 * });
 * ```
 *
 * 4. IMMUNIZATIONS/VACCINATIONS
 * OLD (Deprecated):
 * ```typescript
 * const vaccinations = await healthRecordsApi.vaccinations.getVaccinations('student-id');
 * const newVaccination = await healthRecordsApi.vaccinations.create({
 *   studentId: 'student-id',
 *   vaccineName: 'MMR',
 *   dateAdministered: '2024-01-15'
 * });
 * ```
 *
 * NEW (Server Action):
 * ```typescript
 * import { createImmunizationAction } from '@/lib/actions/health-records.immunizations';
 * const result = await createImmunizationAction({
 *   studentId: 'student-id',
 *   vaccineName: 'MMR',
 *   dateAdministered: '2024-01-15'
 * });
 * ```
 *
 * 5. HEALTH STATISTICS & DASHBOARD
 * OLD (Deprecated):
 * ```typescript
 * const stats = await healthRecordsApi.records.getStatistics();
 * ```
 *
 * NEW (Server Action):
 * ```typescript
 * import {
 *   getHealthRecordsStats,
 *   getHealthRecordsDashboardData
 * } from '@/lib/actions/health-records.stats';
 * const stats = await getHealthRecordsStats();
 * const dashboard = await getHealthRecordsDashboardData();
 * ```
 *
 * BREAKING CHANGES:
 * 1. Response Format: Server Actions return { success, data, error } instead of direct data
 * 2. Error Handling: Errors in 'error' field, not thrown exceptions (in form contexts)
 * 3. Validation: Built-in Zod validation with detailed error messages in response
 * 4. Client Components: Must use useActionState or useFormStatus hooks for form submission
 * 5. No Direct API Client: All requests go through Server Actions for security
 *
 * MIGRATION BENEFITS:
 * - Type-safe Server Actions with automatic request/response typing
 * - Built-in form validation with Zod schemas
 * - Improved security (no client-side API keys)
 * - Better Next.js App Router integration
 * - Simplified error handling in forms
 * - Progressive enhancement support
 * - Optimistic updates easier to implement
 *
 * AVAILABLE SERVER ACTIONS:
 *
 * CRUD Operations (@/lib/actions/health-records.crud):
 * - createHealthRecordAction(data)
 * - getHealthRecordsAction(filters)
 * - getHealthRecordByIdAction(id)
 * - updateHealthRecordAction(id, data)
 * - deleteHealthRecordAction(id)
 *
 * Allergies (@/lib/actions/health-records.allergies):
 * - createAllergyAction(data)
 * - getStudentAllergiesAction(studentId)
 * - updateAllergyAction(id, data)
 * - deleteAllergyAction(id)
 *
 * Immunizations (@/lib/actions/health-records.immunizations):
 * - createImmunizationAction(data)
 * - getStudentImmunizationsAction(studentId)
 * - updateImmunizationAction(id, data)
 * - deleteImmunizationAction(id)
 *
 * Statistics (@/lib/actions/health-records.stats):
 * - getHealthRecordsStats()
 * - getHealthRecordsDashboardData()
 *
 * ADDITIONAL RESOURCES:
 * @see {@link /lib/actions/health-records.actions.ts} - Main actions barrel export
 * @see {@link /lib/actions/health-records.crud.ts} - CRUD operations
 * @see {@link /lib/actions/health-records.allergies.ts} - Allergy management
 * @see {@link /lib/actions/health-records.immunizations.ts} - Immunization tracking
 * @see {@link /lib/actions/health-records.stats.ts} - Statistics and analytics
 * @see {@link /lib/actions/health-records.types.ts} - TypeScript type definitions
 * @see {@link /lib/api/client} - Client-side API utilities (if direct API needed)
 * @see {@link /lib/api/server} - Server-side API utilities (SSR contexts)
 *
 * NEED HELP?
 * - Review migration examples above
 * - Check Server Action files for complete API documentation
 * - Search codebase for Server Action usage examples
 * - Contact dev team if migration issues arise
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.* instead. Will be removed in v2.0.0
 * @module services/modules/healthRecordsApi
 */

// Re-export everything from the modular structure
export * from './healthRecords';

// Default export for convenience
export { healthRecordsApi as default } from './healthRecords';
