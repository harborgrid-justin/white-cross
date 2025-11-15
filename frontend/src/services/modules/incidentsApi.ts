/**
 * WF-COMP-280 | incidentsApi.ts - Incidents API Service Module
 *
 * @deprecated This service is deprecated and will be removed on 2026-06-30.
 * Please migrate to Server Actions in @/lib/actions/incidents.* instead.
 *
 * **COMPREHENSIVE MIGRATION GUIDE**:
 * ```typescript
 * // ❌ OLD: Service Module Pattern
 * import { incidentsApi } from '@/services/modules/incidentsApi';
 *
 * // CRUD operations
 * const incidents = await incidentsApi.getAll({ page: 1, limit: 20 });
 * const incident = await incidentsApi.getById(id);
 * await incidentsApi.create(data);
 * await incidentsApi.update(id, data);
 *
 * // Follow-ups
 * const followUps = await incidentsApi.followUps.getFollowUpActions(incidentId);
 * await incidentsApi.followUps.addFollowUpAction(incidentId, data);
 *
 * // Witnesses
 * const witnesses = await incidentsApi.witnesses.getWitnessStatements(incidentId);
 * await incidentsApi.witnesses.addWitnessStatement(incidentId, data);
 *
 * // ✅ NEW: Server Actions Pattern
 * import { getIncidents, getIncident, createIncident, updateIncident } from '@/lib/actions/incidents.crud';
 * import { getFollowUpActions, addFollowUpAction } from '@/lib/actions/incidents.followup';
 * import { getWitnessStatements, addWitnessStatement } from '@/lib/actions/incidents.witnesses';
 *
 * // CRUD operations (Server Components)
 * const response = await getIncidents({ page: 1, limit: 20 });
 * const incident = await getIncident(id);
 *
 * // Mutations (Client or Server Components)
 * const result = await createIncident(data);
 * if (result.success) {
 *   // Handle success with result.id
 * }
 *
 * // Follow-up actions
 * const followUps = await getFollowUpActions(incidentId);
 * const followUpResult = await addFollowUpAction(incidentId, data);
 *
 * // Witness statements
 * const witnesses = await getWitnessStatements(incidentId);
 * const witnessResult = await addWitnessStatement(incidentId, data);
 * ```
 *
 * **REPLACEMENT ACTIONS**:
 * - CRUD Operations → `@/lib/actions/incidents.crud`
 *   - `getAll()` → `getIncidents()`
 *   - `getById()` → `getIncident()`
 *   - `create()` → `createIncident()`
 *   - `update()` → `updateIncident()`
 *   - `delete()` → `deleteIncident()`
 *
 * - Follow-up Actions → `@/lib/actions/incidents.followup`
 *   - `getFollowUpActions()` → `getFollowUpActions()`
 *   - `addFollowUpAction()` → `addFollowUpAction()`
 *   - `updateFollowUpAction()` → `updateFollowUpAction()`
 *
 * - Witness Statements → `@/lib/actions/incidents.witnesses`
 *   - `getWitnessStatements()` → `getWitnessStatements()`
 *   - `addWitnessStatement()` → `addWitnessStatement()`
 *   - `verifyWitnessStatement()` → `verifyWitnessStatement()`
 *
 * - Operations → `@/lib/actions/incidents.operations`
 * - Analytics → `@/lib/actions/incidents.analytics`
 *
 * **BENEFITS OF MIGRATION**:
 * - Server Actions with 'use server' directive
 * - Automatic cache invalidation with revalidatePath
 * - Type-safe error handling with { success, error } pattern
 * - Better performance with Next.js App Router
 *
 * Purpose: Complete API service for incident management system
 * Related: Witness statements, follow-up actions, evidence management
 * Exports: createIncidentsApi, IIncidentsApi | Key Features: Enterprise incident reporting
 * Last Updated: 2025-11-15 | File Type: .ts
 *
 * REFACTORED: Modular architecture with focused modules for maintainability
 * API PATH CORRECTED: /incident-reports/* → /incidents/*
 * Backend Alignment: /incidents/*
 *
 * @module services/modules/incidentsApi
 */

import { apiClient } from '../core/ApiClient.instance';
import { createIncidentsApi } from './incidentsApi/index';
import type { IIncidentsApi } from './incidentsApi/types';

// Re-export the singleton instance for backward compatibility
export const incidentsApi = createIncidentsApi(apiClient);

// Re-export factory function and types
export { createIncidentsApi } from './incidentsApi/index';
export type { IIncidentsApi } from './incidentsApi/types';

// Re-export all types for convenience
export type * from './incidentsApi/types';
