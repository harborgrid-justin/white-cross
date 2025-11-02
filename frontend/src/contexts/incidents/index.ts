/**
 * @fileoverview Incidents Domain Contexts
 * @module contexts/incidents
 * @category State Management - Domain Contexts
 *
 * Barrel export file for incident-related contexts.
 * These contexts manage state specific to the incidents domain.
 *
 * Contexts:
 * - FollowUpActionContext: Manages incident follow-up actions and assignments
 *
 * @example Using incident contexts
 * ```typescript
 * import { useFollowUpActions, FollowUpActionProvider } from '@/contexts/incidents';
 *
 * function IncidentPage() {
 *   return (
 *     <FollowUpActionProvider incidentId="123">
 *       <IncidentDetails />
 *     </FollowUpActionProvider>
 *   );
 * }
 *
 * function IncidentDetails() {
 *   const { actions, createFollowUpAction, stats } = useFollowUpActions();
 *   // ...
 * }
 * ```
 */

// ==========================================
// FOLLOW-UP ACTIONS CONTEXT
// ==========================================

export {
  FollowUpActionProvider,
  useFollowUpActions,
} from './FollowUpActionContext';

export type {
  FollowUpActionContextType,
  ActionFilters,
  OverdueAlert,
} from './FollowUpActionContext';

// ==========================================
// WITNESS STATEMENTS CONTEXT
// ==========================================

export {
  WitnessStatementProvider,
  useWitnessStatements,
} from './WitnessStatementContext';

export type {
  WitnessStatementState,
  WitnessStatementContextValue,
  WitnessStatementProviderProps,
} from './WitnessStatementContext';

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default {
  FollowUpActionProvider,
  useFollowUpActions,
  WitnessStatementProvider,
  useWitnessStatements,
};
