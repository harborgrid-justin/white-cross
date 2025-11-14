/**
 * WF-TYPE-140 | types.ts - TypeScript type definitions
 * Purpose: Type definitions for Witness Statement Context
 * Upstream: @/types/domain/incidents | Dependencies: Domain types
 * Downstream: WitnessStatementContext, mutations | Used by: Context implementation
 * Related: Domain types, API request/response types
 * Exports: interfaces, types | Key Features: Type safety for context operations
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type checking → Runtime validation → Type-safe operations
 * LLM Context: Type definitions for witness statement context, ensures type safety
 */

/**
 * Witness Statement Context Types
 *
 * Type definitions for the witness statement context system.
 * Provides comprehensive type safety for CRUD operations, state management,
 * and React Context integration.
 *
 * @module WitnessStatementContext/types
 * @version 1.0.0
 *
 * Features:
 * - Strict type definitions for all context operations
 * - Type-safe state management interfaces
 * - Provider props with optional configuration
 * - Operation loading state tracking
 *
 * @example
 * ```tsx
 * import type { WitnessStatementContextValue } from './types';
 *
 * const value: WitnessStatementContextValue = {
 *   statements: [],
 *   isLoading: false,
 *   error: null,
 *   // ... other properties
 * };
 * ```
 */

import type React from 'react';
import type {
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementFormData
} from '@/types/domain/incidents';

// ==========================================
// STATE INTERFACES
// ==========================================

/**
 * Context state interface
 *
 * Defines all state properties available in the context.
 * This represents the internal state managed by the provider.
 *
 * @interface WitnessStatementState
 *
 * @property selectedStatement - Currently selected statement for editing/viewing
 * @property currentIncidentId - Current incident ID context for operations
 * @property formState - Form state for creating/editing statements
 * @property operationLoading - Loading states for individual operations
 *
 * @example
 * ```tsx
 * const state: WitnessStatementState = {
 *   selectedStatement: null,
 *   currentIncidentId: 'incident-123',
 *   formState: { witnessName: 'John Doe' },
 *   operationLoading: {
 *     create: false,
 *     update: false,
 *     delete: false,
 *     verify: false
 *   }
 * };
 * ```
 */
export interface WitnessStatementState {
  /** Currently selected statement for editing/viewing */
  readonly selectedStatement: WitnessStatement | null;

  /** Current incident ID context */
  readonly currentIncidentId: string | null;

  /** Form state for creating/editing statements */
  readonly formState: Partial<WitnessStatementFormData> | null;

  /** Loading state for individual operations */
  readonly operationLoading: {
    readonly create: boolean;
    readonly update: boolean;
    readonly delete: boolean;
    readonly verify: boolean;
  };
}

// ==========================================
// CONTEXT VALUE INTERFACE
// ==========================================

/**
 * Context value interface
 *
 * Defines all methods and state available through the context.
 * This is the complete public API surface of the witness statement context.
 *
 * @interface WitnessStatementContextValue
 * @extends WitnessStatementState
 *
 * Features:
 * - Full CRUD operations for witness statements
 * - Query data with loading and error states
 * - State management helpers
 * - Type-safe operation signatures
 *
 * @example
 * ```tsx
 * const {
 *   statements,
 *   isLoading,
 *   createWitnessStatement,
 *   updateWitnessStatement
 * } = useWitnessStatements();
 *
 * // Create a new statement
 * await createWitnessStatement({
 *   incidentReportId: 'incident-123',
 *   witnessName: 'John Doe',
 *   statement: 'I saw the incident happen...'
 * });
 * ```
 */
export interface WitnessStatementContextValue extends WitnessStatementState {
  // ==========================================
  // QUERY DATA
  // ==========================================

  /** List of witness statements for the current incident */
  readonly statements: ReadonlyArray<WitnessStatement>;

  /** Loading state for fetching statements */
  readonly isLoading: boolean;

  /** Error state for fetching statements */
  readonly error: Error | null;

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  /**
   * Load witness statements for a specific incident
   *
   * Sets the current incident ID context and triggers a fetch of statements.
   * This method should be called when navigating to an incident details page.
   *
   * @param incidentId - The incident report ID
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   loadWitnessStatements('incident-123');
   * }, [incidentId]);
   * ```
   */
  loadWitnessStatements: (incidentId: string) => void;

  /**
   * Create a new witness statement
   *
   * Creates a witness statement with optimistic UI updates.
   * Shows success/error toast notifications.
   *
   * @param data - Statement creation data
   * @returns Promise resolving to the created statement
   * @throws Error if creation fails
   *
   * @example
   * ```tsx
   * try {
   *   const statement = await createWitnessStatement({
   *     incidentReportId: 'incident-123',
   *     witnessName: 'John Doe',
   *     witnessType: 'witness',
   *     statement: 'I saw the incident...'
   *   });
   *   console.log('Created:', statement.id);
   * } catch (error) {
   *   console.error('Failed to create statement');
   * }
   * ```
   */
  createWitnessStatement: (data: CreateWitnessStatementRequest) => Promise<WitnessStatement>;

  /**
   * Update an existing witness statement
   *
   * Updates a witness statement with optimistic UI updates.
   * Shows success/error toast notifications.
   *
   * @param id - Statement ID
   * @param data - Partial statement data to update
   * @returns Promise resolving to the updated statement
   * @throws Error if update fails
   *
   * @example
   * ```tsx
   * await updateWitnessStatement('statement-123', {
   *   statement: 'Updated statement text...'
   * });
   * ```
   */
  updateWitnessStatement: (id: string, data: UpdateWitnessStatementRequest) => Promise<WitnessStatement>;

  /**
   * Delete a witness statement
   *
   * Deletes a witness statement with optimistic UI updates.
   * Shows success/error toast notifications.
   * Clears selected statement if it was the deleted one.
   *
   * @param id - Statement ID
   * @returns Promise resolving when deletion is complete
   * @throws Error if deletion fails
   *
   * @example
   * ```tsx
   * await deleteWitnessStatement('statement-123');
   * ```
   */
  deleteWitnessStatement: (id: string) => Promise<void>;

  /**
   * Verify a witness statement
   *
   * Marks a statement as verified by the current user.
   * Updates verification status with optimistic UI updates.
   *
   * @param id - Statement ID
   * @returns Promise resolving to the verified statement
   * @throws Error if verification fails
   *
   * @example
   * ```tsx
   * const verified = await verifyStatement('statement-123');
   * console.log('Verified at:', verified.verifiedAt);
   * ```
   */
  verifyStatement: (id: string) => Promise<WitnessStatement>;

  /**
   * Unverify a witness statement
   *
   * Marks a statement as not verified (removes verification).
   * Updates verification status with optimistic UI updates.
   *
   * @param id - Statement ID
   * @returns Promise resolving to the unverified statement
   * @throws Error if unverification fails
   *
   * @example
   * ```tsx
   * await unverifyStatement('statement-123');
   * ```
   */
  unverifyStatement: (id: string) => Promise<WitnessStatement>;

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  /**
   * Set the currently selected statement for editing
   *
   * @param statement - Statement to select, or null to clear
   *
   * @example
   * ```tsx
   * setSelectedStatement(statements[0]);
   * ```
   */
  setSelectedStatement: (statement: WitnessStatement | null) => void;

  /**
   * Clear the selected statement
   *
   * @example
   * ```tsx
   * clearSelectedStatement();
   * ```
   */
  clearSelectedStatement: () => void;

  /**
   * Initialize form state for creating/editing
   *
   * @param data - Initial form data, or null to clear
   *
   * @example
   * ```tsx
   * setFormState({
   *   witnessName: 'John Doe',
   *   witnessType: 'witness'
   * });
   * ```
   */
  setFormState: (data: Partial<WitnessStatementFormData> | null) => void;

  /**
   * Clear form state
   *
   * @example
   * ```tsx
   * clearFormState();
   * ```
   */
  clearFormState: () => void;

  /**
   * Refresh witness statements from server
   *
   * Manually triggers a refetch of the current statements.
   * Useful after external changes or to ensure data freshness.
   *
   * @example
   * ```tsx
   * refetch();
   * ```
   */
  refetch: () => void;
}

// ==========================================
// PROVIDER PROPS
// ==========================================

/**
 * Provider component props
 *
 * Configuration props for the WitnessStatementProvider component.
 *
 * @interface WitnessStatementProviderProps
 *
 * @property children - React children to render within the provider
 * @property incidentId - Optional initial incident ID to load statements for
 *
 * @example
 * ```tsx
 * <WitnessStatementProvider incidentId="incident-123">
 *   <IncidentDetailsPage />
 * </WitnessStatementProvider>
 * ```
 */
export interface WitnessStatementProviderProps {
  /** React children to render within the provider */
  readonly children: React.ReactNode;

  /** Optional initial incident ID */
  readonly incidentId?: string;
}

// ==========================================
// TYPE EXPORTS
// ==========================================

/**
 * Re-export domain types for convenience
 * Consumers of this module can import all necessary types from one place
 */
export type {
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementFormData
} from '@/types/domain/incidents';
