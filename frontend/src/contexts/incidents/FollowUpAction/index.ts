/**
 * @fileoverview Follow-Up Action Context Module
 * @module contexts/incidents/FollowUpAction
 * @category State Management - Domain Contexts
 *
 * Barrel export file for follow-up action context.
 * This module manages state and operations for incident follow-up actions.
 *
 * Features:
 * - Comprehensive follow-up action state management
 * - TanStack Query integration for real-time updates
 * - Priority-based filtering and sorting
 * - Overdue action detection and alerts
 * - Optimistic UI updates
 * - Permission-based action assignments
 * - Status tracking and lifecycle management
 *
 * @example Using follow-up action context
 * ```typescript
 * import { useFollowUpActions, FollowUpActionProvider } from '@/contexts/incidents/FollowUpAction';
 *
 * function IncidentPage({ incidentId }: { incidentId: string }) {
 *   return (
 *     <FollowUpActionProvider initialIncidentId={incidentId}>
 *       <ActionsList />
 *     </FollowUpActionProvider>
 *   );
 * }
 *
 * function ActionsList() {
 *   const {
 *     actions,
 *     isLoading,
 *     createFollowUpAction,
 *     stats
 *   } = useFollowUpActions();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h2>Actions: {stats.total}</h2>
 *       <p>Overdue: {stats.overdue}</p>
 *       {actions.map(action => (
 *         <div key={action.id}>{action.description}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export { FollowUpActionProvider } from './FollowUpActionProvider';

// ==========================================
// CUSTOM HOOKS
// ==========================================

export { useFollowUpActions } from './hooks';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  FollowUpActionContextType,
  FollowUpActionContextState,
  FollowUpActionContextMethods,
  FollowUpActionProviderProps,
  ActionFilters,
  OverdueAlert,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from './types';

// ==========================================
// CONSTANT EXPORTS (for advanced usage)
// ==========================================

export {
  QUERY_KEYS,
  DEFAULT_FILTERS,
  OVERDUE_WARNING_DAYS,
  OVERDUE_CRITICAL_DAYS,
} from './constants';

// ==========================================
// HELPER EXPORTS (for advanced usage)
// ==========================================

export {
  isOverdue,
  getDaysOverdue,
  getOverdueSeverity,
  sortByPriority,
  sortByDate,
} from './helpers';
