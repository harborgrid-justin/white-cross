/**
 * WF-COMP-120 | WitnessStatementContext.tsx - React Context Provider
 * Purpose: Main context provider for witness statement management
 * Features: CRUD operations, TanStack Query integration, optimistic updates
 * Last Updated: 2025-11-12 | File Type: .tsx
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
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type {
  WitnessStatement,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementFormData,
  WitnessStatementContextValue,
  WitnessStatementProviderProps,
} from './types';
import {
  useCreateStatementMutation,
  useUpdateStatementMutation,
  useDeleteStatementMutation,
  useVerifyStatementMutation,
  useUnverifyStatementMutation,
} from './mutations';
import { incidentsApi } from '@/services';

// ==========================================
// CONTEXT CREATION
// ==========================================

const WitnessStatementContext = createContext<WitnessStatementContextValue | undefined>(undefined);

// ==========================================
// PROVIDER COMPONENT
// ==========================================

/**
 * Witness Statement Provider Component
 * Manages witness statement state and operations within incident reports
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const statements = useMemo(() => statementsData?.statements || [], [statementsData]);

  // ==========================================
  // STATE MANAGEMENT CALLBACKS
  // ==========================================

  const clearSelectedStatement = useCallback(() => {
    setSelectedStatement(null);
  }, []);

  const clearFormState = useCallback(() => {
    setFormState(null);
  }, []);

  // ==========================================
  // MUTATIONS
  // ==========================================

  const createMutation = useCreateStatementMutation(queryClient, clearFormState);
  const updateMutation = useUpdateStatementMutation(
    queryClient,
    currentIncidentId,
    () => {
      clearSelectedStatement();
      clearFormState();
    }
  );
  const deleteMutation = useDeleteStatementMutation(
    queryClient,
    currentIncidentId,
    selectedStatement?.id,
    clearSelectedStatement
  );
  const verifyMutation = useVerifyStatementMutation(queryClient, currentIncidentId);
  const unverifyMutation = useUnverifyStatementMutation(queryClient, currentIncidentId);

  // ==========================================
  // PUBLIC API METHODS
  // ==========================================

  const loadWitnessStatements = useCallback((incidentId: string) => {
    setCurrentIncidentId(incidentId);
  }, []);

  const createWitnessStatement = useCallback(
    async (data: CreateWitnessStatementRequest): Promise<WitnessStatement> => {
      const result = await createMutation.mutateAsync(data);
      return result.statement;
    },
    [createMutation]
  );

  const updateWitnessStatement = useCallback(
    async (id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatement> => {
      const result = await updateMutation.mutateAsync({ id, data });
      return result.statement;
    },
    [updateMutation]
  );

  const deleteWitnessStatement = useCallback(
    async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const verifyStatement = useCallback(
    async (id: string): Promise<WitnessStatement> => {
      const result = await verifyMutation.mutateAsync(id);
      return result.statement;
    },
    [verifyMutation]
  );

  const unverifyStatement = useCallback(
    async (id: string): Promise<WitnessStatement> => {
      const result = await unverifyMutation.mutateAsync(id);
      return result.statement;
    },
    [unverifyMutation]
  );

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
