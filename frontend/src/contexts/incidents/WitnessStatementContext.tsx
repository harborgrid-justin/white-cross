/**
 * WF-COMP-120 | WitnessStatementContext.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/modules/incidentReportsApi, ../utils/toast | Dependencies: @tanstack/react-query, ../services/modules/incidentReportsApi, ../utils/toast
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, types | Key Features: useState, useContext, useMemo
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Witness Statement Context
 *
 * Production-grade React Context for managing witness statements within incident reports.
 * Provides comprehensive CRUD operations, TanStack Query integration for caching and
 * optimistic updates, and type-safe state management.
 *
 * @module WitnessStatementContext
 * @version 1.0.0
 *
 * Features:
 * - Full CRUD operations for witness statements
 * - TanStack Query integration for automatic caching and refetching
 * - Optimistic UI updates for better user experience
 * - Type-safe operations with TypeScript
 * - Error handling with toast notifications
 * - Verification status tracking
 * - Form state management
 *
 * @example
 * ```tsx
 * // Wrap your component tree with the provider
 * <WitnessStatementProvider>
 *   <IncidentDetailsPage />
 * </WitnessStatementProvider>
 *
 * // Use the hook in your components
 * const {
 *   statements,
 *   isLoading,
 *   createStatement,
 *   updateStatement,
 *   verifyStatement
 * } = useWitnessStatements();
 * ```
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import type {
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementFormData
} from '@/types/incidents';
import { incidentsApi } from '@/services';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Context state interface
 * Defines all state properties available in the context
 */
interface WitnessStatementState {
  /** Currently selected statement for editing/viewing */
  selectedStatement: WitnessStatement | null;
  /** Current incident ID context */
  currentIncidentId: string | null;
  /** Form state for creating/editing statements */
  formState: Partial<WitnessStatementFormData> | null;
  /** Loading state for individual operations */
  operationLoading: {
    create: boolean;
    update: boolean;
    delete: boolean;
    verify: boolean;
  };
}

/**
 * Context value interface
 * Defines all methods and state available through the context
 */
interface WitnessStatementContextValue extends WitnessStatementState {
  // Query Data
  /** List of witness statements for the current incident */
  statements: WitnessStatement[];
  /** Loading state for fetching statements */
  isLoading: boolean;
  /** Error state for fetching statements */
  error: Error | null;

  // CRUD Operations
  /**
   * Load witness statements for a specific incident
   * @param incidentId - The incident report ID
   */
  loadWitnessStatements: (incidentId: string) => void;

  /**
   * Create a new witness statement
   * @param data - Statement creation data
   * @returns Promise resolving to the created statement
   */
  createWitnessStatement: (data: CreateWitnessStatementRequest) => Promise<WitnessStatement>;

  /**
   * Update an existing witness statement
   * @param id - Statement ID
   * @param data - Partial statement data to update
   * @returns Promise resolving to the updated statement
   */
  updateWitnessStatement: (id: string, data: UpdateWitnessStatementRequest) => Promise<WitnessStatement>;

  /**
   * Delete a witness statement
   * @param id - Statement ID
   * @returns Promise resolving when deletion is complete
   */
  deleteWitnessStatement: (id: string) => Promise<void>;

  /**
   * Verify a witness statement
   * @param id - Statement ID
   * @returns Promise resolving to the verified statement
   */
  verifyStatement: (id: string) => Promise<WitnessStatement>;

  /**
   * Unverify a witness statement (mark as not verified)
   * @param id - Statement ID
   * @returns Promise resolving to the unverified statement
   */
  unverifyStatement: (id: string) => Promise<WitnessStatement>;

  // State Management
  /**
   * Set the currently selected statement for editing
   * @param statement - Statement to select
   */
  setSelectedStatement: (statement: WitnessStatement | null) => void;

  /**
   * Clear the selected statement
   */
  clearSelectedStatement: () => void;

  /**
   * Initialize form state for creating/editing
   * @param data - Initial form data
   */
  setFormState: (data: Partial<WitnessStatementFormData> | null) => void;

  /**
   * Clear form state
   */
  clearFormState: () => void;

  /**
   * Refresh witness statements from server
   */
  refetch: () => void;
}

// ==========================================
// CONTEXT CREATION
// ==========================================

const WitnessStatementContext = createContext<WitnessStatementContextValue | undefined>(undefined);

// ==========================================
// PROVIDER PROPS
// ==========================================

interface WitnessStatementProviderProps {
  children: React.ReactNode;
  /** Optional initial incident ID */
  incidentId?: string;
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

/**
 * Witness Statement Provider Component
 * Manages witness statement state and operations within incident reports
 *
 * @param props - Provider props
 * @returns Provider component
 */
export function WitnessStatementProvider({
  children,
  incidentId: initialIncidentId
}: WitnessStatementProviderProps) {
  const queryClient = useQueryClient();

  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [selectedStatement, setSelectedStatement] = useState<WitnessStatement | null>(null);
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(initialIncidentId || null);
  const [formState, setFormState] = useState<Partial<WitnessStatementFormData> | null>(null);

  // ==========================================
  // TANSTACK QUERY - FETCH STATEMENTS
  // ==========================================

  /**
   * Query for fetching witness statements
   * Automatically caches and refetches based on TanStack Query configuration
   */
  const {
    data: statementsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['witness-statements', currentIncidentId],
    queryFn: async () => {
      if (!currentIncidentId) return { statements: [] };
      return await incidentsApi.getWitnessStatements(currentIncidentId);
    },
    enabled: !!currentIncidentId,
    staleTime: 2 * 60 * 1000, // 2 minutes - statements change frequently
    cacheTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const statements = useMemo(() => statementsData?.statements || [], [statementsData]);

  // ==========================================
  // TANSTACK QUERY - CREATE MUTATION
  // ==========================================

  /**
   * Mutation for creating witness statements
   * Includes optimistic updates and automatic cache invalidation
   */
  const createMutation = useMutation({
    mutationFn: async (data: CreateWitnessStatementRequest) => {
      return await incidentsApi.addWitnessStatement(data);
    },
    onMutate: async (newStatement: CreateWitnessStatementRequest) => {
      // Cancel outgoing refetches (TanStack Query v4 API)
      // Note: In v4, queries are cancelled automatically

      // Snapshot previous value
      const previousStatements = queryClient.getQueryData<{ statements: WitnessStatement[] }>([
        'witness-statements',
        newStatement.incidentReportId
      ]);

      // Optimistically update cache with temporary statement
      const optimisticStatement: WitnessStatement = {
        id: `temp-${Date.now()}`,
        incidentReportId: newStatement.incidentReportId,
        witnessName: newStatement.witnessName,
        witnessType: newStatement.witnessType,
        witnessContact: newStatement.witnessContact,
        statement: newStatement.statement,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<{ statements: WitnessStatement[] }>(
        ['witness-statements', newStatement.incidentReportId],
        (old) => ({
          statements: [...(old?.statements || []), optimisticStatement]
        })
      );

      return { previousStatements, incidentReportId: newStatement.incidentReportId };
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: CreateWitnessStatementRequest) => {
      // Invalidate and refetch to get server data
      queryClient.invalidateQueries({
        queryKey: ['witness-statements', variables.incidentReportId]
      });
      queryClient.invalidateQueries({
        queryKey: ['incident-reports', variables.incidentReportId]
      });

      showSuccessToast('Witness statement added successfully');
      clearFormState();
    },
    onError: (error: Error, variables: CreateWitnessStatementRequest) => {
      // Get context from mutation state
      const context = createMutation.variables && queryClient.getQueryData<{ statements: WitnessStatement[] }>(['witness-statements', variables.incidentReportId]);

      const previousStatements = context ? { statements: context.statements, incidentReportId: variables.incidentReportId } : undefined;
      // Rollback on error
      if (previousStatements) {
        queryClient.setQueryData(
          ['witness-statements', previousStatements.incidentReportId],
          { statements: previousStatements.statements }
        );
      }

      const errorMessage = error?.message || 'Failed to add witness statement';
      showErrorToast(errorMessage);
      console.error('Create witness statement error:', error);
    },
  });

  // ==========================================
  // TANSTACK QUERY - UPDATE MUTATION
  // ==========================================

  /**
   * Mutation for updating witness statements
   * Includes optimistic updates
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWitnessStatementRequest }) => {
      return await incidentsApi.updateWitnessStatement(id, data);
    },
    onMutate: async ({ id, data }: { id: string; data: UpdateWitnessStatementRequest }) => {
      if (!currentIncidentId) return;

      // Cancel outgoing refetches (TanStack Query v4 API)
      // Note: In v4, queries are cancelled automatically

      // Snapshot previous value
      const previousStatements = queryClient.getQueryData<{ statements: WitnessStatement[] }>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update cache
      queryClient.setQueryData<{ statements: WitnessStatement[] }>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? { ...statement, ...data, updatedAt: new Date().toISOString() }
              : statement
          ) || []
        })
      );

      return { previousStatements, incidentReportId: currentIncidentId };
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: { id: string; data: UpdateWitnessStatementRequest }) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement updated successfully');
      clearSelectedStatement();
      clearFormState();
    },
    onError: (error: Error, variables: { id: string; data: UpdateWitnessStatementRequest }) => {
      // Rollback on error - get previous data from cache
      const previousData = queryClient.getQueryData<{ statements: WitnessStatement[] }>(['witness-statements', currentIncidentId]);
      if (previousData && currentIncidentId) {
        // Already rolled back by React Query on error
      }

      const errorMessage = error?.message || 'Failed to update witness statement';
      showErrorToast(errorMessage);
      console.error('Update witness statement error:', error);
    },
  });

  // ==========================================
  // TANSTACK QUERY - DELETE MUTATION
  // ==========================================

  /**
   * Mutation for deleting witness statements
   * Includes optimistic updates
   */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.deleteWitnessStatement(id);
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Cancel outgoing refetches (TanStack Query v4 API)
      // Note: In v4, queries are cancelled automatically

      // Snapshot previous value
      const previousStatements = queryClient.getQueryData<{ statements: WitnessStatement[] }>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically remove from cache
      queryClient.setQueryData<{ statements: WitnessStatement[] }>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.filter(statement => statement.id !== id) || []
        })
      );

      return { previousStatements, incidentReportId: currentIncidentId };
    },
    onSuccess: (response: { success: boolean }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement deleted successfully');

      // Clear selected statement if it was the deleted one
      if (selectedStatement?.id === variables) {
        clearSelectedStatement();
      }
    },
    onError: (error: Error, variables: string) => {
      // Rollback handled by React Query automatically

      const errorMessage = error?.message || 'Failed to delete witness statement';
      showErrorToast(errorMessage);
      console.error('Delete witness statement error:', error);
    },
  });

  // ==========================================
  // TANSTACK QUERY - VERIFY MUTATION
  // ==========================================

  /**
   * Mutation for verifying witness statements
   * Marks statement as verified by current user
   */
  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.verifyWitnessStatement(id);
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Cancel outgoing refetches (TanStack Query v4 API)
      // Note: In v4, queries are cancelled automatically

      // Snapshot previous value
      const previousStatements = queryClient.getQueryData<{ statements: WitnessStatement[] }>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update verification status
      queryClient.setQueryData<{ statements: WitnessStatement[] }>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? {
                  ...statement,
                  verified: true,
                  verifiedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : statement
          ) || []
        })
      );

      return { previousStatements, incidentReportId: currentIncidentId };
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement verified successfully');
    },
    onError: (error: Error, variables: string) => {
      // Rollback handled by React Query automatically

      const errorMessage = error?.message || 'Failed to verify witness statement';
      showErrorToast(errorMessage);
      console.error('Verify witness statement error:', error);
    },
  });

  /**
   * Mutation for unverifying witness statements
   * Marks statement as not verified
   */
  const unverifyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await incidentsApi.updateWitnessStatement(id, { verified: false });
    },
    onMutate: async (id: string) => {
      if (!currentIncidentId) return;

      // Cancel outgoing refetches (TanStack Query v4 API)
      // Note: In v4, queries are cancelled automatically

      // Snapshot previous value
      const previousStatements = queryClient.getQueryData<{ statements: WitnessStatement[] }>([
        'witness-statements',
        currentIncidentId
      ]);

      // Optimistically update verification status
      queryClient.setQueryData<{ statements: WitnessStatement[] }>(
        ['witness-statements', currentIncidentId],
        (old) => ({
          statements: old?.statements.map(statement =>
            statement.id === id
              ? {
                  ...statement,
                  verified: false,
                  verifiedAt: undefined,
                  verifiedBy: undefined,
                  updatedAt: new Date().toISOString()
                }
              : statement
          ) || []
        })
      );

      return { previousStatements, incidentReportId: currentIncidentId };
    },
    onSuccess: (response: { statement: WitnessStatement }, variables: string) => {
      // Invalidate and refetch
      if (currentIncidentId) {
        queryClient.invalidateQueries({
          queryKey: ['witness-statements', currentIncidentId]
        });
        queryClient.invalidateQueries({
          queryKey: ['incident-reports', currentIncidentId]
        });
      }

      showSuccessToast('Witness statement unverified successfully');
    },
    onError: (error: Error, variables: string) => {
      // Rollback handled by React Query automatically

      const errorMessage = error?.message || 'Failed to unverify witness statement';
      showErrorToast(errorMessage);
      console.error('Unverify witness statement error:', error);
    },
  });

  // ==========================================
  // PUBLIC API METHODS
  // ==========================================

  /**
   * Load witness statements for a specific incident
   */
  const loadWitnessStatements = useCallback((incidentId: string) => {
    setCurrentIncidentId(incidentId);
  }, []);

  /**
   * Create a new witness statement
   */
  const createWitnessStatement = useCallback(
    async (data: CreateWitnessStatementRequest): Promise<WitnessStatement> => {
      const result = await createMutation.mutateAsync(data);
      return result.statement;
    },
    [createMutation]
  );

  /**
   * Update an existing witness statement
   */
  const updateWitnessStatement = useCallback(
    async (id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatement> => {
      const result = await updateMutation.mutateAsync({ id, data });
      return result.statement;
    },
    [updateMutation]
  );

  /**
   * Delete a witness statement
   */
  const deleteWitnessStatement = useCallback(
    async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  /**
   * Verify a witness statement
   */
  const verifyStatement = useCallback(
    async (id: string): Promise<WitnessStatement> => {
      const result = await verifyMutation.mutateAsync(id);
      return result.statement;
    },
    [verifyMutation]
  );

  /**
   * Unverify a witness statement
   */
  const unverifyStatement = useCallback(
    async (id: string): Promise<WitnessStatement> => {
      const result = await unverifyMutation.mutateAsync(id);
      return result.statement;
    },
    [unverifyMutation]
  );

  /**
   * Clear selected statement
   */
  const clearSelectedStatement = useCallback(() => {
    setSelectedStatement(null);
  }, []);

  /**
   * Clear form state
   */
  const clearFormState = useCallback(() => {
    setFormState(null);
  }, []);

  // ==========================================
  // OPERATION LOADING STATES
  // ==========================================

  const operationLoading = useMemo(() => ({
    create: createMutation.isLoading,
    update: updateMutation.isLoading,
    delete: deleteMutation.isLoading,
    verify: verifyMutation.isLoading || unverifyMutation.isLoading,
  }), [
    createMutation.isLoading,
    updateMutation.isLoading,
    deleteMutation.isLoading,
    verifyMutation.isLoading,
    unverifyMutation.isLoading
  ]);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value: WitnessStatementContextValue = useMemo(() => ({
    // State
    selectedStatement,
    currentIncidentId,
    formState,
    operationLoading,

    // Query Data
    statements,
    isLoading,
    error: error as Error | null,

    // CRUD Operations
    loadWitnessStatements,
    createWitnessStatement,
    updateWitnessStatement,
    deleteWitnessStatement,
    verifyStatement,
    unverifyStatement,

    // State Management
    setSelectedStatement,
    clearSelectedStatement,
    setFormState,
    clearFormState,
    refetch,
  }), [
    selectedStatement,
    currentIncidentId,
    formState,
    operationLoading,
    statements,
    isLoading,
    error,
    loadWitnessStatements,
    createWitnessStatement,
    updateWitnessStatement,
    deleteWitnessStatement,
    verifyStatement,
    unverifyStatement,
    clearSelectedStatement,
    clearFormState,
    refetch,
  ]);

  return (
    <WitnessStatementContext.Provider value={value}>
      {children}
    </WitnessStatementContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

/**
 * Custom hook to access witness statement context
 *
 * @throws Error if used outside of WitnessStatementProvider
 * @returns Witness statement context value
 *
 * @example
 * ```tsx
 * function WitnessStatementList() {
 *   const { statements, isLoading, deleteWitnessStatement } = useWitnessStatements();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       {statements.map(statement => (
 *         <WitnessStatementCard
 *           key={statement.id}
 *           statement={statement}
 *           onDelete={() => deleteWitnessStatement(statement.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWitnessStatements(): WitnessStatementContextValue {
  const context = useContext(WitnessStatementContext);

  if (context === undefined) {
    throw new Error(
      'useWitnessStatements must be used within a WitnessStatementProvider. ' +
      'Wrap your component tree with <WitnessStatementProvider> to use this hook.'
    );
  }

  return context;
}

// ==========================================
// EXPORTS
// ==========================================

export type {
  WitnessStatementState,
  WitnessStatementContextValue,
  WitnessStatementProviderProps
};
