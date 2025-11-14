/**
 * @fileoverview Witness Statement Context - Barrel Export
 * @module contexts/incidents/WitnessStatementContext
 * @category State Management
 *
 * Barrel export file for witness statement context functionality.
 * Re-exports all public API surface from the module.
 *
 * @example Using witness statement context
 * ```typescript
 * import {
 *   WitnessStatementProvider,
 *   useWitnessStatements,
 *   type WitnessStatementContextValue
 * } from '@/contexts/incidents/WitnessStatementContext';
 *
 * function IncidentPage() {
 *   return (
 *     <WitnessStatementProvider incidentId="123">
 *       <WitnessStatementList />
 *     </WitnessStatementProvider>
 *   );
 * }
 * ```
 */

// ==========================================
// MAIN CONTEXT EXPORTS
// ==========================================

export {
  WitnessStatementProvider,
  useWitnessStatements,
} from './WitnessStatementContext';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  WitnessStatementState,
  WitnessStatementContextValue,
  WitnessStatementProviderProps,
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementFormData,
} from './types';

// ==========================================
// MUTATION EXPORTS (for advanced usage)
// ==========================================

export {
  useCreateStatementMutation,
  useUpdateStatementMutation,
  useDeleteStatementMutation,
  useVerifyStatementMutation,
  useUnverifyStatementMutation,
} from './mutations';
