/**
 * WF-COMP-334 | context-state.ts - React Context state definitions
 * Purpose: React Context state shapes and provider interfaces
 * Upstream: React Context API | Dependencies: Domain types, utility types
 * Downstream: Context providers, custom hooks | Called by: React components
 * Related: Witness statements, follow-up actions, filters, modals
 * Exports: Context state interfaces for React providers
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Context creation → Provider setup → Consumer hooks
 * LLM Context: React Context state definitions for component-level state management
 */

import React from 'react';
import type {
  WitnessStatement,
  FollowUpAction
} from '../../domain/incidents';
import type { ErrorState } from './utility-types';

/**
 * Witness Statement Context state
 * Provides context for witness statement operations
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

/**
 * Follow-Up Action Context state
 * Provides context for follow-up action management
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

/**
 * Filter Context state
 * Provides context for filter management across the application
 *
 * @template T - Type of filter values
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

/**
 * Modal Context state
 * Provides context for modal management
 */
export interface ModalContextState {
  /** Open modals stack */
  modals: Array<{
    id: string;
    component: React.ComponentType<unknown>;
    props?: Record<string, unknown>;
    options?: {
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closeOnEscape?: boolean;
      closeOnBackdrop?: boolean;
      showCloseButton?: boolean;
    };
  }>;
  /** Open a modal */
  openModal: (
    id: string,
    component: React.ComponentType<unknown>,
    props?: Record<string, unknown>,
    options?: ModalContextState['modals'][0]['options']
  ) => void;
  /** Close a modal */
  closeModal: (id: string) => void;
  /** Close all modals */
  closeAllModals: () => void;
  /** Check if modal is open */
  isModalOpen: (id: string) => boolean;
}
