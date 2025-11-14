/**
 * WF-COMP-117-HOOKS | FollowUpAction/hooks.ts - Context and custom hooks
 * Purpose: React context creation and custom hooks for Follow-Up Actions
 * Upstream: ./types
 * Downstream: Components using follow-up action context
 * Related: React Context API
 * Exports: useFollowUpActions hook, FollowUpActionContext
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Custom React hooks for accessing follow-up action context
 */

/**
 * Follow-Up Action Hooks
 * React context and custom hooks for accessing follow-up action state and methods
 *
 * @module FollowUpAction/hooks
 */

import { createContext, useContext } from 'react';
import type { FollowUpActionContextType } from './types';

// =====================
// CONTEXT CREATION
// =====================

/**
 * Follow-Up Action Context
 * React context for managing incident follow-up actions
 *
 * @internal - Used by FollowUpActionProvider, consumers should use useFollowUpActions hook
 */
export const FollowUpActionContext = createContext<FollowUpActionContextType | undefined>(undefined);

// =====================
// CUSTOM HOOKS
// =====================

/**
 * Custom hook to access Follow-Up Action context
 * Provides access to follow-up action state and operations
 *
 * @returns Follow-up action context value with state and methods
 * @throws {Error} If used outside of FollowUpActionProvider
 *
 * @example
 * ```typescript
 * function ActionsList() {
 *   const {
 *     actions,
 *     isLoading,
 *     createFollowUpAction,
 *     updateActionStatus,
 *     stats
 *   } = useFollowUpActions();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h2>Actions: {stats.total}</h2>
 *       {actions.map(action => (
 *         <div key={action.id}>{action.description}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With provider
 * ```typescript
 * function IncidentPage({ incidentId }: { incidentId: string }) {
 *   return (
 *     <FollowUpActionProvider initialIncidentId={incidentId}>
 *       <ActionsList />
 *     </FollowUpActionProvider>
 *   );
 * }
 * ```
 */
export function useFollowUpActions(): FollowUpActionContextType {
  const context = useContext(FollowUpActionContext);

  if (context === undefined) {
    throw new Error('useFollowUpActions must be used within a FollowUpActionProvider');
  }

  return context;
}
