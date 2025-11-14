/**
 * WF-COMP-334 | context-state.ts - React Context state definitions
 * Purpose: React Context API type definitions
 * Upstream: utility-state.ts, incidents.ts | Dependencies: State utilities, domain types
 * Downstream: Context providers, hooks | Called by: React components
 * Related: utility-state.ts, redux-state.ts
 * Exports: Context state interfaces | Key Features: Type-safe contexts
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Context creation → Provider setup → Hook usage → Component rendering
 * LLM Context: React Context state definitions for component tree state sharing
 */

/**
 * React Context State Definitions
 *
 * Type definitions for React Context API state and operations.
 * Provides type-safe context interfaces for state management outside Redux.
 *
 * @module types/state/context-state
 */

import type React from 'react';
import type {
  WitnessStatement,
  FollowUpAction,
} from '../incidents';
import type { ErrorState } from './utility-state';

// =====================
// WITNESS STATEMENT CONTEXT
// =====================

/**
 * Witness Statement Context state
 * Provides context for witness statement operations
 *
 * @example
 * ```typescript
 * const WitnessStatementContext = createContext<WitnessStatementContextState | null>(null);
 *
 * export function useWitnessStatements() {
 *   const context = useContext(WitnessStatementContext);
 *   if (!context) throw new Error('useWitnessStatements must be used within provider');
 *   return context;
 * }
 * ```
 */
export interface WitnessStatementContextState {
  /** Current incident ID */
  incidentId: string;
  /** Witness statements for current incident */
  statements: WitnessStatement[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ErrorState | null;
  /** Add new statement */
  addStatement: (statement: Omit<WitnessStatement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update statement */
  updateStatement: (id: string, updates: Partial<WitnessStatement>) => Promise<void>;
  /** Delete statement */
  deleteStatement: (id: string) => Promise<void>;
  /** Verify statement */
  verifyStatement: (id: string) => Promise<void>;
  /** Refresh statements */
  refresh: () => Promise<void>;
}

// =====================
// FOLLOW-UP ACTION CONTEXT
// =====================

/**
 * Follow-Up Action Context state
 * Provides context for follow-up action management
 *
 * @example
 * ```typescript
 * const FollowUpActionContext = createContext<FollowUpActionContextState | null>(null);
 *
 * export function useFollowUpActions() {
 *   const context = useContext(FollowUpActionContext);
 *   if (!context) throw new Error('useFollowUpActions must be used within provider');
 *   return context;
 * }
 * ```
 */
export interface FollowUpActionContextState {
  /** Current incident ID */
  incidentId: string;
  /** Follow-up actions for current incident */
  actions: FollowUpAction[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ErrorState | null;
  /** Add new action */
  addAction: (action: Omit<FollowUpAction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update action */
  updateAction: (id: string, updates: Partial<FollowUpAction>) => Promise<void>;
  /** Delete action */
  deleteAction: (id: string) => Promise<void>;
  /** Complete action */
  completeAction: (id: string, notes?: string) => Promise<void>;
  /** Assign action */
  assignAction: (id: string, userId: string) => Promise<void>;
  /** Refresh actions */
  refresh: () => Promise<void>;
}

// =====================
// FILTER CONTEXT
// =====================

/**
 * Filter Context state
 * Provides context for filter management across the application
 *
 * @template T - Type of filter values
 *
 * @example
 * ```typescript
 * interface IncidentFilters {
 *   type?: IncidentType;
 *   severity?: IncidentSeverity;
 *   status?: IncidentStatus;
 * }
 *
 * const FilterContext = createContext<FilterContextState<IncidentFilters> | null>(null);
 * ```
 */
export interface FilterContextState<T extends Record<string, unknown>> {
  /** Current filters */
  filters: Partial<T>;
  /** Set filters */
  setFilters: (filters: Partial<T>) => void;
  /** Clear filters */
  clearFilters: () => void;
  /** Reset to default filters */
  resetFilters: () => void;
  /** Update single filter */
  updateFilter: <K extends keyof T>(key: K, value: T[K] | undefined) => void;
  /** Apply filters */
  applyFilters: () => void;
  /** Active filter count */
  activeFilterCount: number;
  /** Whether filters are applied */
  isFiltered: boolean;
}

// =====================
// MODAL CONTEXT
// =====================

/**
 * Base props that all modal components receive
 * Ensures all modals have access to onClose handler
 */
export interface ModalComponentProps {
  /** Close handler for the modal */
  onClose: () => void;
  /** Additional props passed to modal */
  [key: string]: unknown;
}

/**
 * Modal component type with proper props constraint
 */
export type ModalComponent = React.ComponentType<ModalComponentProps>;

/**
 * Modal options configuration
 */
export interface ModalOptions {
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether modal can be closed with Escape key */
  closeOnEscape?: boolean;
  /** Whether modal can be closed by clicking backdrop */
  closeOnBackdrop?: boolean;
  /** Whether to show close button */
  showCloseButton?: boolean;
}

/**
 * Modal Context state
 * Provides context for modal management
 *
 * @example
 * ```typescript
 * const ModalContext = createContext<ModalContextState | null>(null);
 *
 * export function useModal() {
 *   const context = useContext(ModalContext);
 *   if (!context) throw new Error('useModal must be used within ModalProvider');
 *   return context;
 * }
 * ```
 */
export interface ModalContextState {
  /** Open modals stack */
  modals: Array<{
    id: string;
    component: ModalComponent;
    props?: Record<string, unknown>;
    options?: ModalOptions;
  }>;
  /** Open a modal */
  openModal: (
    id: string,
    component: ModalComponent,
    props?: Record<string, unknown>,
    options?: ModalOptions
  ) => void;
  /** Close a modal */
  closeModal: (id: string) => void;
  /** Close all modals */
  closeAllModals: () => void;
  /** Check if modal is open */
  isModalOpen: (id: string) => boolean;
}
